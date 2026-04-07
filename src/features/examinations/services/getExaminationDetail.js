import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { EXAMINATION_ENDPOINTS } from '../schemas/examinationsSchema';

export const getExaminationDetail = async (examinationId) => {
  return apiGetEnvelope(EXAMINATION_ENDPOINTS.detail(examinationId));
};
