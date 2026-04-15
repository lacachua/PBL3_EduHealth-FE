import { getNurseStudentsLookupApi } from '../../health-profiles/services/healthProfilesApi';

const userIdCache = new Map();

const toPositiveInt = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const extractLookupRows = (envelope) => {
  if (Array.isArray(envelope?.data)) {
    return envelope.data;
  }

  if (Array.isArray(envelope?.data?.students)) {
    return envelope.data.students;
  }

  if (Array.isArray(envelope?.data?.items)) {
    return envelope.data.items;
  }

  return [];
};

const resolveLookupUserId = (item) => {
  return toPositiveInt(item?.userId)
    || toPositiveInt(item?.id)
    || toPositiveInt(item?.studentId)
    || null;
};

const buildStudentCacheKey = (student = {}) => {
  return [
    normalizeText(student.studentCode),
    normalizeText(student.fullName),
    normalizeText(student.className),
  ].join('|');
};

const pickBestLookupRow = (rows, student) => {
  if (!rows.length) {
    return null;
  }

  const studentCode = normalizeText(student?.studentCode);
  const fullName = normalizeText(student?.fullName);
  const className = normalizeText(student?.className);

  const byCode = studentCode
    ? rows.filter((item) => normalizeText(item?.studentCode) === studentCode)
    : [];

  if (byCode.length === 1) {
    return byCode[0];
  }

  const byNameAndClass = rows.filter((item) => (
    normalizeText(item?.fullName) === fullName
    && normalizeText(item?.className) === className
  ));

  if (byNameAndClass.length === 1) {
    return byNameAndClass[0];
  }

  if (byCode.length > 1) {
    return byCode[0];
  }

  if (byNameAndClass.length > 1) {
    return byNameAndClass[0];
  }

  if (rows.length === 1) {
    return rows[0];
  }

  return null;
};

export const resolveVaccinationStudentUserId = async (student = {}) => {
  const directId = resolveLookupUserId(student);
  if (directId) {
    return directId;
  }

  const cacheKey = buildStudentCacheKey(student);
  if (userIdCache.has(cacheKey)) {
    return userIdCache.get(cacheKey);
  }

  const searchTerms = [
    String(student?.studentCode || '').trim(),
    String(student?.fullName || '').trim(),
  ].filter(Boolean);

  for (const term of searchTerms) {
    try {
      const response = await getNurseStudentsLookupApi({
        page: 1,
        pageSize: 50,
        search: term,
      });

      const rows = extractLookupRows(response);
      const matchedRow = pickBestLookupRow(rows, student);
      const resolvedId = resolveLookupUserId(matchedRow);
      if (!resolvedId) {
        continue;
      }

      userIdCache.set(cacheKey, resolvedId);
      return resolvedId;
    } catch {
      // Keep trying the next lookup strategy.
    }
  }

  return null;
};
