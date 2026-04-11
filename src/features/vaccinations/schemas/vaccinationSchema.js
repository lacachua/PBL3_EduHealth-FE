import {
  VACCINATION_CAMPAIGN_PAGE_SIZE,
  VACCINATION_PENDING_PAGE_SIZE,
  VACCINATION_STUDENT_PAGE_SIZE,
} from '../constants/vaccinationConstants';

export const VACCINATION_ENDPOINTS = Object.freeze({
  campaigns: '/api/v1/vaccination-campaigns',
  campaignDetail: (campaignId) => `/api/v1/vaccination-campaigns/${campaignId}`,
  campaignStudents: (campaignId) => `/api/v1/vaccination-campaigns/${campaignId}/students`,
  studentVaccinationDetail: (studentVaccinationId) => `/api/v1/student-vaccinations/${studentVaccinationId}`,
  pending: '/api/v1/student-vaccinations/pending',
  studentHistory: (studentId) => `/api/v1/students/${studentId}/vaccinations`,
});

export const CAMPAIGN_FILTER_DEFAULTS = {
  keyword: '',
  status: 'all',
  incompleteOnly: false,
};

export const CAMPAIGN_STUDENT_FILTER_DEFAULTS = {
  keyword: '',
  status: 'all',
};

export const PENDING_FILTER_DEFAULTS = {
  keyword: '',
  classId: '',
  campaignId: '',
  status: 'all',
};

export const CREATE_CAMPAIGN_INITIAL_VALUES = {
  name: '',
  vaccineName: '',
  doseNumber: '',
  scheduledDate: '',
  targetType: 'CLASS',
  targetClassIds: [],
  targetStudentIds: [],
  note: '',
};

export const UPDATE_STUDENT_VACCINATION_INITIAL_VALUES = {
  status: 'PENDING',
  vaccinatedAt: '',
  lotNumber: '',
  note: '',
};

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const normalizeText = (value) => String(value || '').trim();

export const buildCampaignListQuery = (query = {}) => {
  const normalizedKeyword = normalizeText(query.keyword);

  return {
    page: toPositiveInt(query.page, 1),
    pageSize: toPositiveInt(query.pageSize, VACCINATION_CAMPAIGN_PAGE_SIZE),
    ...(normalizedKeyword ? { keyword: normalizedKeyword } : {}),
    ...(query.status && query.status !== 'all' ? { status: String(query.status).trim().toUpperCase() } : {}),
  };
};

export const buildCampaignStudentsQuery = (query = {}) => {
  const normalizedKeyword = normalizeText(query.keyword);

  return {
    page: toPositiveInt(query.page, 1),
    pageSize: toPositiveInt(query.pageSize, VACCINATION_STUDENT_PAGE_SIZE),
    ...(normalizedKeyword ? { keyword: normalizedKeyword } : {}),
    ...(query.status && query.status !== 'all' ? { status: String(query.status).trim().toUpperCase() } : {}),
  };
};

export const buildPendingQuery = (query = {}) => {
  const normalizedCampaignId = normalizeText(query.campaignId);
  const normalizedClassId = normalizeText(query.classId);

  return {
    page: toPositiveInt(query.page, 1),
    pageSize: toPositiveInt(query.pageSize, VACCINATION_PENDING_PAGE_SIZE),
    ...(normalizedCampaignId ? { campaignId: normalizedCampaignId } : {}),
    ...(normalizedClassId ? { classId: normalizedClassId } : {}),
  };
};

export const buildCreateCampaignPayload = (values = {}) => {
  const targetType = String(values.targetType || 'CLASS').toUpperCase();
  const targetClassIds = Array.isArray(values.targetClassIds)
    ? values.targetClassIds.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
  const targetStudentIds = Array.isArray(values.targetStudentIds)
    ? values.targetStudentIds
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item) && item > 0)
    : [];

  const payload = {
    name: normalizeText(values.name),
    vaccineName: normalizeText(values.vaccineName),
    doseNumber: toPositiveInt(values.doseNumber, 0),
    scheduledDate: values.scheduledDate || null,
    targetType,
    ...(normalizeText(values.note) ? { note: normalizeText(values.note) } : {}),
  };

  if (targetType === 'CLASS') {
    payload.targetClassIds = targetClassIds;
  }

  if (targetType === 'STUDENT') {
    payload.targetStudentIds = targetStudentIds;
  }

  return payload;
};

export const validateCreateCampaignValues = (values = {}) => {
  const errors = {};
  const targetType = String(values.targetType || 'CLASS').toUpperCase();

  if (!normalizeText(values.name)) {
    errors.name = 'Vui lòng nhập tên đợt tiêm.';
  }

  if (!normalizeText(values.vaccineName)) {
    errors.vaccineName = 'Vui lòng nhập tên vaccine.';
  }

  const doseNumber = Number(values.doseNumber);
  if (!Number.isFinite(doseNumber) || doseNumber <= 0) {
    errors.doseNumber = 'Số mũi phải lớn hơn 0.';
  }

  if (!values.scheduledDate) {
    errors.scheduledDate = 'Vui lòng chọn ngày thực hiện dự kiến.';
  }

  if (targetType !== 'CLASS' && targetType !== 'STUDENT') {
    errors.targetType = 'Hình thức áp dụng không hợp lệ.';
  }

  if (targetType === 'CLASS' && (!Array.isArray(values.targetClassIds) || !values.targetClassIds.length)) {
    errors.targetClassIds = 'Vui lòng chọn ít nhất một lớp.';
  }

  if (targetType === 'STUDENT' && (!Array.isArray(values.targetStudentIds) || !values.targetStudentIds.length)) {
    errors.targetStudentIds = 'Vui lòng chọn ít nhất một học sinh.';
  }

  return errors;
};

export const buildUpdateStudentVaccinationPayload = (values = {}) => {
  const payload = {
    status: String(values.status || '').toUpperCase(),
    vaccinatedAt: values.vaccinatedAt || null,
    lotNumber: normalizeText(values.lotNumber) || null,
    note: normalizeText(values.note) || null,
  };

  if (payload.status !== 'DONE') {
    payload.vaccinatedAt = null;
    payload.lotNumber = null;
  }

  return payload;
};

export const validateUpdateStudentVaccinationValues = (values = {}) => {
  const errors = {};
  const status = String(values.status || '').toUpperCase();

  if (!status) {
    errors.status = 'Vui lòng chọn trạng thái.';
    return errors;
  }

  if (status === 'DONE' && !values.vaccinatedAt) {
    errors.vaccinatedAt = 'Vui lòng chọn ngày tiêm thực tế.';
  }

  if ((status === 'POSTPONED' || status === 'CONTRAINDICATED' || status === 'ABSENT') && !normalizeText(values.note)) {
    errors.note = 'Vui lòng nhập ghi chú cho trạng thái này.';
  }

  return errors;
};
