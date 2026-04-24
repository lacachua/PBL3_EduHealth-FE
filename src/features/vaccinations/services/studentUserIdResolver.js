import { getNurseStudentsLookupApi } from '../../health-profiles/services/healthProfilesApi';

const userIdCache = new Map();

const toPositiveInt = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const parseCodeToUserId = (value, prefix) => {
  const normalized = String(value || '').trim().toUpperCase();
  const matcher = new RegExp(`^${prefix}(\\d+)$`);
  const match = normalized.match(matcher);
  if (!match) {
    return null;
  }

  return toPositiveInt(match[1]);
};

const resolveUserIdFromStudentCode = (student = {}) => {
  // Backend currently exposes StudentId in format STDxxx where xxx maps to student userId.
  return parseCodeToUserId(student?.studentId, 'STD');
};

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

const resolveLookupStudentCode = (item) => {
  return normalizeText(item?.studentCode || item?.username);
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
    ? rows.filter((item) => resolveLookupStudentCode(item) === studentCode)
    : [];

  if (byCode.length === 1) {
    return byCode[0];
  }

  if (byCode.length > 1) {
    return null;
  }

  const byNameAndClass = rows.filter((item) => (
    normalizeText(item?.fullName) === fullName
    && normalizeText(item?.className) === className
  ));

  if (byNameAndClass.length === 1) {
    return byNameAndClass[0];
  }

  if (byNameAndClass.length > 1) {
    return null;
  }

  return null;
};

export const resolveVaccinationStudentUserId = async (student = {}) => {
  if (student?.studentId) {
    const numericStudentId = toPositiveInt(student.studentId);
    if (numericStudentId) {
      return numericStudentId;
    }

    const parsedStudentId = resolveUserIdFromStudentCode(student);
    if (parsedStudentId) {
      return parsedStudentId;
    }
  }

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
        pageSize: 100,
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
