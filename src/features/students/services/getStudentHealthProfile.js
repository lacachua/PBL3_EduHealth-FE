import { apiGetEnvelope } from '../../../shared/api/apiClient';

export const getStudentHealthProfile = async (studentId) => {
  return apiGetEnvelope(`/api/v1/students/${studentId}/health-profile`);
};
