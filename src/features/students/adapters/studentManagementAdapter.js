import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { extractRows, extractMeta } from '../../../shared/adapters/envelopeAdapter';
import { formatDate, formatDateTime } from '../../../shared/utils/dateFormat';

const statusToneMap = {
  ACTIVE: 'success',
  LOCKED: 'danger',
  INACTIVE: 'danger',
};

const statusLabelMap = {
  ACTIVE: 'Hoạt động',
  LOCKED: 'Đã khóa',
  INACTIVE: 'Ngưng hoạt động',
};

const defaultModel = {
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

const hasOwn = (item, key) => Object.prototype.hasOwnProperty.call(item || {}, key);

const toNullableText = (value) => {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text || null;
};

const toNullableNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatStudentNumber = (value) => {
  const parsed = toNullableNumber(value);
  if (parsed === null) return null;

  return parsed.toLocaleString('vi-VN', { maximumFractionDigits: 1 });
};

const toStudentStatus = (item = {}) => {
  const rawStatus = typeof item.status === 'string' ? item.status.trim().toUpperCase() : null;

  if (rawStatus === 'ACTIVE' || rawStatus === 'LOCKED' || rawStatus === 'INACTIVE') {
    return rawStatus;
  }

  if (item.isActive === true) return 'ACTIVE';
  if (item.isActive === false) return 'INACTIVE';

  return null;
};

const resolveStudentIdentity = (item = {}) => {
  const parsed = Number(item.userId);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const buildStatusFields = (item) => {
  const status = toStudentStatus(item);

  return {
    status,
    statusLabel: status ? statusLabelMap[status] || status : null,
    statusTone: status ? statusToneMap[status] || 'neutral' : 'neutral',
  };
};

export const adaptStudentManagementResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (!envelope || envelope.success === false) {
    return defaultModel;
  }

  const sourceRows = extractRows(envelope, { itemKeys: ['students'] });

  const rows = sourceRows.map((item) => {
    const resolvedId = resolveStudentIdentity(item);

    return {
      id: resolvedId,
      userId: resolvedId,
      accountUserId: resolvedId,
      apiId: resolvedId,
      imageUrl: hasOwn(item, 'imageUrl') ? toNullableText(item.imageUrl) : null,
      fullName: hasOwn(item, 'fullName') ? toNullableText(item.fullName) : null,
      dateOfBirth: hasOwn(item, 'dateOfBirth') ? item.dateOfBirth || null : null,
      dateOfBirthLabel: hasOwn(item, 'dateOfBirth') ? formatDate(item.dateOfBirth) : null,
      classId: hasOwn(item, 'classId') ? item.classId : null,
      className: hasOwn(item, 'className') ? toNullableText(item.className) : null,
      email: hasOwn(item, 'email') ? toNullableText(item.email) : null,
      phoneNumber: hasOwn(item, 'phone') ? toNullableText(item.phone) : null,
      phone: hasOwn(item, 'phone') ? toNullableText(item.phone) : null,
      guardian: hasOwn(item, 'guardian') ? toNullableText(item.guardian) : null,
      currentHeight: hasOwn(item, 'currentHeight') ? toNullableNumber(item.currentHeight) : null,
      currentWeight: hasOwn(item, 'currentWeight') ? toNullableNumber(item.currentWeight) : null,
      currentHeightLabel: hasOwn(item, 'currentHeight') ? formatStudentNumber(item.currentHeight) : null,
      currentWeightLabel: hasOwn(item, 'currentWeight') ? formatStudentNumber(item.currentWeight) : null,
      ...buildStatusFields(item),
      fields: {
        userId: hasOwn(item, 'userId'),
        imageUrl: hasOwn(item, 'imageUrl'),
        fullName: hasOwn(item, 'fullName'),
        dateOfBirth: hasOwn(item, 'dateOfBirth'),
        classId: hasOwn(item, 'classId'),
        className: hasOwn(item, 'className'),
        email: hasOwn(item, 'email'),
        phone: hasOwn(item, 'phone'),
        guardian: hasOwn(item, 'guardian'),
        currentHeight: hasOwn(item, 'currentHeight'),
        currentWeight: hasOwn(item, 'currentWeight'),
        status: hasOwn(item, 'status'),
        isActive: hasOwn(item, 'isActive'),
      },
    };
  });

  const meta = extractMeta(envelope, defaultModel);

  return {
    rows,
    ...meta,
  };
};

export const adaptStudentDetailResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (envelope?.success === false || !envelope?.data) {
    return null;
  }

  const item = envelope.data;
  const resolvedStudentId = resolveStudentIdentity(item);

  return {
    id: resolvedStudentId,
    userId: resolvedStudentId,
    accountUserId: resolvedStudentId,
    apiId: resolvedStudentId,
    imageUrl: hasOwn(item, 'imageUrl') ? toNullableText(item.imageUrl) : null,
    classId: hasOwn(item, 'classId') ? item.classId : null,
    className: hasOwn(item, 'className') ? toNullableText(item.className) : null,
    fullName: hasOwn(item, 'fullName') ? toNullableText(item.fullName) : null,
    dateOfBirth: hasOwn(item, 'dateOfBirth') ? item.dateOfBirth || null : null,
    dateOfBirthLabel: hasOwn(item, 'dateOfBirth') ? formatDate(item.dateOfBirth) : null,
    currentHeight: hasOwn(item, 'currentHeight') ? toNullableNumber(item.currentHeight) : null,
    currentWeight: hasOwn(item, 'currentWeight') ? toNullableNumber(item.currentWeight) : null,
    currentHeightLabel: hasOwn(item, 'currentHeight') ? formatStudentNumber(item.currentHeight) : null,
    currentWeightLabel: hasOwn(item, 'currentWeight') ? formatStudentNumber(item.currentWeight) : null,
    medicalHistoryNotes: hasOwn(item, 'medicalHistoryNotes') ? toNullableText(item.medicalHistoryNotes) : null,
    guardian: hasOwn(item, 'guardian') ? toNullableText(item.guardian) : null,
    phone: hasOwn(item, 'phone') ? toNullableText(item.phone) : null,
    phoneNumber: hasOwn(item, 'phone') ? toNullableText(item.phone) : null,
    email: hasOwn(item, 'email') ? toNullableText(item.email) : null,
    gender: hasOwn(item, 'gender') ? toNullableText(item.gender) : null,
    genderLabel: item.gender === 'MALE' ? 'Nam' : item.gender === 'FEMALE' ? 'Nữ' : item.gender === 'OTHER' ? 'Khác' : null,
    ...buildStatusFields(item),
    fields: {
      userId: hasOwn(item, 'userId'),
      imageUrl: hasOwn(item, 'imageUrl'),
      classId: hasOwn(item, 'classId'),
      className: hasOwn(item, 'className'),
      fullName: hasOwn(item, 'fullName'),
      dateOfBirth: hasOwn(item, 'dateOfBirth'),
      currentHeight: hasOwn(item, 'currentHeight'),
      currentWeight: hasOwn(item, 'currentWeight'),
      medicalHistoryNotes: hasOwn(item, 'medicalHistoryNotes'),
      guardian: hasOwn(item, 'guardian'),
      phone: hasOwn(item, 'phone'),
      email: hasOwn(item, 'email'),
      gender: hasOwn(item, 'gender'),
      status: hasOwn(item, 'status'),
      isActive: hasOwn(item, 'isActive'),
      createdAt: hasOwn(item, 'createdAt'),
      updatedAt: hasOwn(item, 'updatedAt'),
      username: hasOwn(item, 'username'),
      user: hasOwn(item, 'user'),
      allergies: hasOwn(item, 'allergies'),
      studentAllergies: hasOwn(item, 'studentAllergies'),
    },
  };
};

export const adaptStudentHealthProfileResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);
  const item = envelope?.data;

  if (!item || envelope?.success === false) {
    return null;
  }

  const profileSource = item.healthProfile || item;
  const parseAllergyId = (value) => {
    if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
      return value;
    }

    const normalized = String(value || '').trim();
    if (!normalized) {
      return null;
    }

    const digits = normalized.replace(/\D/g, '');
    if (!digits) {
      return null;
    }

    const parsed = Number(digits);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  };

  const allergyItems = Array.isArray(profileSource.allergies)
    ? profileSource.allergies.map((allergy) => ({
      id: allergy?.id || null,
      allergyId: parseAllergyId(allergy?.allergyId ?? allergy?.allergyTypeId),
      allergyTypeId: allergy?.allergyTypeId || null,
      allergyTypeName: allergy?.allergyTypeName || null,
      note: allergy?.note || null,
    }))
    : [];

  const allergies = allergyItems
    .map((allergy) => allergy.allergyTypeName)
    .filter(Boolean)
    .join(', ');

  const updatedBy = typeof profileSource.updatedBy === 'object'
    ? profileSource.updatedBy?.fullName || null
    : (profileSource.updatedBy || item.updatedBy || null);

  return {
    studentId: item.studentId || null,
    studentCode: item.studentCode || null,
    fullName: item.fullName || null,
    classId: item.classId || null,
    className: item.className || null,
    currentHeight: toNullableNumber(profileSource.heightCm ?? profileSource.currentHeight),
    currentWeight: toNullableNumber(profileSource.weightKg ?? profileSource.currentWeight),
    heightCm: toNullableNumber(profileSource.heightCm ?? profileSource.currentHeight),
    weightKg: toNullableNumber(profileSource.weightKg ?? profileSource.currentWeight),
    heightCmLabel: formatStudentNumber(profileSource.heightCm ?? profileSource.currentHeight),
    weightKgLabel: formatStudentNumber(profileSource.weightKg ?? profileSource.currentWeight),
    medicalHistoryNotes: item.medicalHistoryNotes || null,
    bloodType: profileSource.bloodType || null,
    eyeStatus: profileSource.eyeStatus || null,
    chronicNote: profileSource.chronicNote || null,
    generalHealthNote: profileSource.generalHealthNote || null,
    allergies: allergies || null,
    allergyItems,
    medicalHistory: item.medicalHistoryNotes || null,
    lastExaminationDate: item.lastExaminationDate || null,
    lastExaminationDateLabel: formatDate(item.lastExaminationDate),
    updatedBy,
    healthProfileUpdatedAt: profileSource.updatedAt || item.healthProfileUpdatedAt || item.updatedAt || null,
    healthProfileUpdatedAtLabel: formatDateTime(profileSource.updatedAt || item.healthProfileUpdatedAt || item.updatedAt),
    updatedAt: item.updatedAt || null,
    updatedAtLabel: formatDateTime(item.updatedAt),
    fields: {
      studentId: hasOwn(item, 'studentId'),
      studentCode: hasOwn(item, 'studentCode'),
      fullName: hasOwn(item, 'fullName'),
      classId: hasOwn(item, 'classId'),
      className: hasOwn(item, 'className'),
      healthProfile: hasOwn(item, 'healthProfile'),
      allergies: hasOwn(profileSource, 'allergies'),
      updatedAt: hasOwn(profileSource, 'updatedAt') || hasOwn(item, 'updatedAt'),
    },
  };
};
