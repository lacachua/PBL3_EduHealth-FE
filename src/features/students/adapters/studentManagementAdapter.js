import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';

const statusToneMap = {
  ACTIVE: 'success',
  PENDING_APPROVAL: 'warning',
  TEMP_SUSPENDED: 'neutral',
  TRANSFERRED: 'danger',
  LOCKED: 'danger',
};

const statusLabelMap = {
  ACTIVE: 'Hoạt động',
  PENDING_APPROVAL: 'Chờ duyệt hồ sơ',
  TEMP_SUSPENDED: 'Tạm nghỉ',
  TRANSFERRED: 'Đã chuyển trường',
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
      id: item.id,
      studentId: item.studentId || item.id,
      userId: item.userId || null,
      studentCode: item.studentCode || '--',
      fullName: item.fullName,
      dateOfBirth: item.dateOfBirth || '--',
      gender: item.gender || '--',
      genderLabel: item.gender === 'MALE' ? 'Nam' : item.gender === 'FEMALE' ? 'Nữ' : item.gender === 'OTHER' ? 'Khác' : '--',
      classId: item.classId || '--',
      className: item.className,
      username: item.username || '--',
      email: item.email || '--',
      phoneNumber: item.phoneNumber || '--',
      heightCm: item.heightCm ?? null,
      weightKg: item.weightKg ?? null,
      eyeStatus: item.eyeStatus || '',
      allergies: item.allergies || '',
      chronicNote: item.chronicNote || '',
      status: item.status,
      statusLabel: item.statusLabel || statusLabelMap[item.status] || 'Không rõ',
      statusTone: statusToneMap[item.status] || 'neutral',
      createdAt: item.createdAt || null,
      updatedAt: item.updatedAt,
      apiId: item.studentId || item.id || item.studentCode,
    }))
    : [];

  const normalizedRows = rows.map((item) => ({
    ...item,
    hasHealthWarning: Boolean(item.allergies || item.chronicNote),
    hasMissingHealthData: item.heightCm === null || item.weightKg === null,
    id: item.id || item.studentCode || item.studentId,
  }));

  return {
    rows: normalizedRows,
    page: Number(envelope.meta?.page || 1),
    pageSize: Number(envelope.meta?.pageSize || 10),
    totalItems: Number(envelope.meta?.totalItems || normalizedRows.length),
    totalPages: Number(envelope.meta?.totalPages || 1),
  };
};

export const adaptStudentDetailResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (envelope?.success === false || !envelope?.data) {
    return null;
  }

  const item = envelope.data;
  return {
    id: item.id || item.studentId,
    studentId: item.studentId || item.id,
    userId: item.userId || null,
    studentCode: item.studentCode || '--',
    fullName: item.fullName || '--',
    dateOfBirth: item.dateOfBirth || '--',
    gender: item.gender || '--',
    genderLabel: item.gender === 'MALE' ? 'Nam' : item.gender === 'FEMALE' ? 'Nữ' : item.gender === 'OTHER' ? 'Khác' : '--',
    classId: item.classId || '--',
    className: item.className || '--',
    username: item.username || '--',
    email: item.email || '--',
    phoneNumber: item.phoneNumber || '--',
    identifier: item.identifier || '--',
    address: item.address || '--',
    parentName: item.parentName || '--',
    parentPhoneNumber: item.parentPhoneNumber || '--',
    emergencyContactNote: item.emergencyContactNote || '--',
    status: item.status || '--',
    statusLabel: statusLabelMap[item.status] || item.status || '--',
    statusTone: statusToneMap[item.status] || 'neutral',
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
    apiId: item.studentId || item.id,
  };
};

export const adaptStudentHealthProfileResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);
  const item = envelope?.data;

  if (!item || envelope?.success === false) {
    return null;
  }

  return {
    heightCm: item.heightCm ?? '',
    weightKg: item.weightKg ?? '',
    bloodType: item.bloodType || '',
    eyeStatus: item.eyeStatus || '',
    chronicNote: item.chronicNote || '',
    generalHealthNote: item.generalHealthNote || '',
    allergies: item.allergies || '',
    medicalHistory: item.medicalHistory || '',
    lastExaminationDate: item.lastExaminationDate || '',
    updatedBy: item.updatedBy || '',
    healthProfileUpdatedAt: item.healthProfileUpdatedAt || item.updatedAt || null,
    updatedAt: item.updatedAt || null,
  };
};
