import { apiGetEnvelope } from '../../../shared/api/apiClient';

export const getStudentClassesApi = async (query = {}) => {
  return apiGetEnvelope('/api/v1/classes', { params: query });
};
