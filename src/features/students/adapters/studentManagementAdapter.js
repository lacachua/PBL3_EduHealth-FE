import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';

const statusToneMap = {
  ACTIVE: 'success',
  LOCKED: 'danger',
};

const statusLabelMap = {
  ACTIVE: 'Hoạt động',
  LOCKED: 'Đã khóa',
};

const defaultModel = {
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

export const adaptStudentManagementResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (!envelope || envelope.success === false) {
    return defaultModel;
  }

  const sourceRows = Array.isArray(envelope.data)
    ? envelope.data
    : Array.isArray(envelope.data?.students)
      ? envelope.data.students
      : Array.isArray(envelope.data?.items)
        ? envelope.data.items
        : [];

  const rows = sourceRows.length
    ? sourceRows.map((item) => ({
      id: item.userId,
      studentId: item.userId,
      userId: item.userId || null,
      studentCode: item.studentCode || `HS-${item.userId || '--'}`,
      fullName: item.fullName,
      dateOfBirth: item.dateOfBirth || '--',
      gender: item.gender || '--',
      genderLabel: item.gender === 'MALE' ? 'Nam' : item.gender === 'FEMALE' ? 'Nữ' : item.gender === 'OTHER' ? 'Khác' : '--',
      classId: item.classId || '--',
      className: item.className,
      username: item.username || '--',
      email: item.email || '--',
      phoneNumber: item.phone || '--',
      phone: item.phone || '--',
      heightCm: item.currentHeight ?? null,
      weightKg: item.currentWeight ?? null,
      currentHeight: item.currentHeight ?? null,
      currentWeight: item.currentWeight ?? null,
      eyeStatus: '',
      allergies: '',
      chronicNote: '',
      medicalHistoryNotes: item.medicalHistoryNotes || '',
      status: item.isActive ? 'ACTIVE' : 'LOCKED',
      statusLabel: item.isActive ? statusLabelMap.ACTIVE : statusLabelMap.LOCKED,
      statusTone: item.isActive ? statusToneMap.ACTIVE : statusToneMap.LOCKED,
      createdAt: item.createdAt || null,
      updatedAt: item.updatedAt,
      apiId: item.userId,
    }))
    : [];

  const normalizedRows = rows.map((item) => ({
    ...item,
    hasHealthWarning: Boolean(item.medicalHistoryNotes),
    hasMissingHealthData: item.currentHeight === null || item.currentWeight === null,
    id: item.id || item.studentId,
  }));

  return {
    rows: normalizedRows,
    page: Number(envelope.meta?.page || 1),
    pageSize: Number(envelope.meta?.pageSize || 10),
    totalItems: Number(envelope.meta?.totalItems || envelope.meta?.total || normalizedRows.length),
    totalPages: Number(envelope.meta?.totalPages || 1),
  };
};

export const adaptStudentDetailResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (envelope?.success === false || !envelope?.data) {
    return null;
  }

  const item = envelope.data;
  const status = item.isActive ? 'ACTIVE' : 'LOCKED';
  return {
    id: item.userId,
    studentId: item.userId,
    userId: item.userId || null,
    studentCode: item.studentCode || `HS-${item.userId || '--'}`,
    fullName: item.fullName || '--',
    dateOfBirth: item.dateOfBirth || '--',
    gender: item.gender || '--',
    genderLabel: item.gender === 'MALE' ? 'Nam' : item.gender === 'FEMALE' ? 'Nữ' : item.gender === 'OTHER' ? 'Khác' : '--',
    classId: item.classId || '--',
    className: item.className || '--',
    username: item.username || '--',
    email: item.email || '--',
    phoneNumber: item.phone || '--',
    phone: item.phone || '--',
    heightCm: item.currentHeight ?? '',
    weightKg: item.currentWeight ?? '',
    currentHeight: item.currentHeight ?? '',
    currentWeight: item.currentWeight ?? '',
    eyeStatus: '',
    allergies: '',
    chronicNote: '',
    medicalHistoryNotes: item.medicalHistoryNotes || '',
    identifier: item.identifier || '--',
    address: item.address || '--',
    parentName: item.parentName || '--',
    parentPhoneNumber: item.parentPhoneNumber || '--',
    emergencyContactNote: item.emergencyContactNote || '--',
    status,
    statusLabel: statusLabelMap[status] || '--',
    statusTone: statusToneMap[status] || 'neutral',
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
    apiId: item.userId,
  };
};

export const adaptStudentHealthProfileResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);
  const item = envelope?.data;

  if (!item || envelope?.success === false) {
    return null;
  }

  return {
    currentHeight: item.currentHeight ?? '',
    currentWeight: item.currentWeight ?? '',
    heightCm: item.currentHeight ?? '',
    weightKg: item.currentWeight ?? '',
    medicalHistoryNotes: item.medicalHistoryNotes || '',
    bloodType: '',
    eyeStatus: '',
    chronicNote: '',
    generalHealthNote: '',
    allergies: '',
    medicalHistory: item.medicalHistoryNotes || '',
    lastExaminationDate: item.lastExaminationDate || '',
    updatedBy: item.updatedBy || '',
    healthProfileUpdatedAt: item.healthProfileUpdatedAt || item.updatedAt || null,
    updatedAt: item.updatedAt || null,
  };
};
