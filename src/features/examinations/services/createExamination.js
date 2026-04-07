import { apiPostEnvelope } from '../../../shared/api/apiClient';
import { EXAMINATION_ENDPOINTS } from '../schemas/examinationsSchema';

export const createExamination = async (payload) => {
  return apiPostEnvelope(EXAMINATION_ENDPOINTS.create, payload);
};
