import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { extractRows, extractMeta } from '../../../shared/adapters/envelopeAdapter';
import { formatDate, formatDateTime } from '../../../shared/utils/dateFormat';

const statusToneMap = {
  ACTIVE: 'success',
  INACTIVE: 'danger',
};

const statusLabelMap = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngưng hoạt động',
};

const toStudentStatus = (item = {}) => {
  if (typeof item.isActive === 'boolean') {
    return item.isActive ? 'ACTIVE' : 'INACTIVE';
  }

  const rawStatus = String(item.status || '').toUpperCase();
  return rawStatus === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
};

const defaultModel = {
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

const resolveStudentIdentity = (item = {}) => {
  const candidate = item.userId ?? item.studentId ?? item.id ?? null;
  const parsed = Number(candidate);
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }

  const normalized = String(candidate || '').trim();
  if (!normalized) {
    return null;
  }

  const digits = normalized.replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  const fromDigits = Number(digits);
  if (Number.isInteger(fromDigits) && fromDigits > 0) {
    return fromDigits;
  }

  return null;
};

export const adaptStudentManagementResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (!envelope || envelope.success === false) {
    return defaultModel;
  }

  const sourceRows = extractRows(envelope, { itemKeys: ['students'] });

  const rows = sourceRows.length
    ? sourceRows.map((item) => ({
      id: resolveStudentIdentity(item),
      studentId: resolveStudentIdentity(item),
      userId: resolveStudentIdentity(item),
      studentCode: item.studentCode || null,
      fullName: item.fullName || '--',
      dateOfBirth: item.dateOfBirth || '--',
      dateOfBirthLabel: formatDate(item.dateOfBirth),
      gender: item.gender || '--',
      genderLabel: item.gender === 'MALE' ? 'Nam' : item.gender === 'FEMALE' ? 'Nữ' : item.gender === 'OTHER' ? 'Khác' : '--',
      classId: item.classId || '--',
      className: item.className || '--',
      username: item.username || null,
      email: item.email || '--',
      phoneNumber: item.phoneNumber || item.phone || '--',
      phone: item.phone || item.phoneNumber || '--',
      guardian: item.guardian || '--',
      heightCm: item.currentHeight ?? item.heightCm ?? null,
      weightKg: item.currentWeight ?? item.weightKg ?? null,
      currentHeight: item.currentHeight ?? item.heightCm ?? null,
      currentWeight: item.currentWeight ?? item.weightKg ?? null,
      eyeStatus: '',
      allergies: '',
      chronicNote: '',
      medicalHistoryNotes: item.medicalHistoryNotes || item.medicalHistory || '',
      status: toStudentStatus(item),
      statusLabel: item.statusLabel || statusLabelMap[toStudentStatus(item)] || '--',
      statusTone: statusToneMap[toStudentStatus(item)] || 'neutral',
      createdAt: item.createdAt || null,
      createdAtLabel: formatDateTime(item.createdAt),
      updatedAt: item.updatedAt || null,
      updatedAtLabel: formatDateTime(item.updatedAt),
      apiId: resolveStudentIdentity(item),
    }))
    : [];

  const normalizedRows = rows.map((item) => ({
    ...item,
    hasHealthWarning: Boolean(item.medicalHistoryNotes),
    hasMissingHealthData: item.currentHeight === null || item.currentWeight === null,
    id: item.id || item.studentId,
  }));

  const meta = extractMeta(envelope, defaultModel);

  return {
    rows: normalizedRows,
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
  const status = toStudentStatus(item);
  return {
    id: resolvedStudentId,
    studentId: resolvedStudentId,
    userId: resolvedStudentId,
    studentCode: item.studentCode || '--',
    fullName: item.fullName || '--',
    dateOfBirth: item.dateOfBirth || '--',
    dateOfBirthLabel: formatDate(item.dateOfBirth),
    gender: item.gender || '--',
    genderLabel: item.gender === 'MALE' ? 'Nam' : item.gender === 'FEMALE' ? 'Nữ' : item.gender === 'OTHER' ? 'Khác' : '--',
    classId: item.classId || '--',
    className: item.className || '--',
    username: item.username || '--',
    email: item.email || '--',
    phoneNumber: item.phoneNumber || item.phone || '--',
    phone: item.phone || item.phoneNumber || '--',
    heightCm: item.currentHeight ?? item.heightCm ?? '',
    weightKg: item.currentWeight ?? item.weightKg ?? '',
    currentHeight: item.currentHeight ?? item.heightCm ?? '',
    currentWeight: item.currentWeight ?? item.weightKg ?? '',
    eyeStatus: '',
    allergies: '',
    chronicNote: '',
    medicalHistoryNotes: item.medicalHistoryNotes || item.medicalHistory || '',
    identifier: item.identifier || '--',
    address: item.address || '--',
    guardian: item.guardian || item.parentName || '--',
    guardianPhone: item.guardianPhone || item.parentPhoneNumber || item.phone || '--',
    emergencyContactNote: item.emergencyContactNote || '--',
    status,
    statusLabel: item.statusLabel || statusLabelMap[status] || '--',
    statusTone: statusToneMap[status] || 'neutral',
    createdAt: item.createdAt || null,
    createdAtLabel: formatDateTime(item.createdAt),
    updatedAt: item.updatedAt || null,
    updatedAtLabel: formatDateTime(item.updatedAt),
    apiId: resolvedStudentId,
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
    ? profileSource.allergies.map((allergy, index) => ({
      id: allergy?.id || `allergy-${index + 1}`,
      allergyId: parseAllergyId(allergy?.allergyId ?? allergy?.allergyTypeId),
      allergyTypeId: allergy?.allergyTypeId || '',
      allergyTypeName: allergy?.allergyTypeName || allergy?.name || allergy?.label || '',
      note: allergy?.note || '',
    }))
    : [];

  const allergies = Array.isArray(profileSource.allergies)
    ? profileSource.allergies
      .map((allergy) => allergy?.allergyTypeName || allergy?.name || allergy?.label || '')
      .filter(Boolean)
      .join(', ')
    : (profileSource.allergies || '');

  const updatedBy = typeof profileSource.updatedBy === 'object'
    ? profileSource.updatedBy?.fullName || ''
    : (profileSource.updatedBy || item.updatedBy || '');

  return {
    studentId: item.studentId || '',
    studentCode: item.studentCode || '',
    fullName: item.fullName || '',
    classId: item.classId || '',
    className: item.className || '',
    currentHeight: profileSource.heightCm ?? profileSource.currentHeight ?? '',
    currentWeight: profileSource.weightKg ?? profileSource.currentWeight ?? '',
    heightCm: profileSource.heightCm ?? profileSource.currentHeight ?? '',
    weightKg: profileSource.weightKg ?? profileSource.currentWeight ?? '',
    medicalHistoryNotes: item.medicalHistoryNotes || '',
    bloodType: profileSource.bloodType || '',
    eyeStatus: profileSource.eyeStatus || '',
    chronicNote: profileSource.chronicNote || '',
    generalHealthNote: profileSource.generalHealthNote || '',
    allergies,
    allergyItems,
    medicalHistory: item.medicalHistoryNotes || '',
    lastExaminationDate: item.lastExaminationDate || '',
    lastExaminationDateLabel: formatDate(item.lastExaminationDate),
    updatedBy,
    healthProfileUpdatedAt: profileSource.updatedAt || item.healthProfileUpdatedAt || item.updatedAt || null,
    healthProfileUpdatedAtLabel: formatDateTime(profileSource.updatedAt || item.healthProfileUpdatedAt || item.updatedAt),
    updatedAt: item.updatedAt || null,
    updatedAtLabel: formatDateTime(item.updatedAt),
  };
};
