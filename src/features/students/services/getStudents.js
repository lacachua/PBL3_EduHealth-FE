import { apiGetEnvelope } from '../../../shared/api/apiClient';

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const getStudents = async (query = {}) => {
  const params = {
    page: toPositiveNumber(query.page, 1),
    pageSize: toPositiveNumber(query.pageSize, 10),
    ...(query.search ? { search: String(query.search).trim() } : {}),
    ...(Number.isFinite(Number(query.classId)) && Number(query.classId) > 0
      ? { classId: Number(query.classId) }
      : {}),
    ...(typeof query.isActive === 'boolean' ? { isActive: query.isActive } : {}),
  };

  return apiGetEnvelope('/api/v1/students', { params });
};
