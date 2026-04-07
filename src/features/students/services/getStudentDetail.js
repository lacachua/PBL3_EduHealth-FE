import { apiGetEnvelope } from '../../../shared/api/apiClient';

export const getStudentDetail = async (studentId) => {
  return apiGetEnvelope(`/api/v1/students/${studentId}`);
};
