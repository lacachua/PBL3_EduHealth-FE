import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { EXAMINATION_ENDPOINTS } from '../schemas/examinationsSchema';

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const getExaminations = async (query = {}) => {
  const params = {
    page: toPositiveNumber(query.page, 1),
    pageSize: toPositiveNumber(query.pageSize, 10),
    ...(query.studentId ? { studentId: String(query.studentId).trim() } : {}),
    ...(query.classId ? { classId: String(query.classId).trim() } : {}),
    ...(query.fromDate ? { fromDate: query.fromDate } : {}),
    ...(query.toDate ? { toDate: query.toDate } : {}),
    ...(query.diseaseTypeId ? { diseaseTypeId: String(query.diseaseTypeId).trim() } : {}),
  };

  return apiGetEnvelope(EXAMINATION_ENDPOINTS.list, { params });
};
