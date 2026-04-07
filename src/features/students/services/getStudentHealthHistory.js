import { apiGetEnvelope } from '../../../shared/api/apiClient';

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const getStudentHealthHistory = async (studentId, query = {}) => {
  const params = {
    page: toPositiveNumber(query.page, 1),
    pageSize: toPositiveNumber(query.pageSize, 10),
    ...(query.fromDate ? { fromDate: query.fromDate } : {}),
    ...(query.toDate ? { toDate: query.toDate } : {}),
  };

  return apiGetEnvelope(`/api/v1/students/${studentId}/health-history`, { params });
};
