import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';
import { getExaminationDetailMockEnvelope } from '../mocks/examinationsMock';
import { EXAMINATION_ENDPOINTS } from '../schemas/examinationsSchema';

const isMockEnabled = runtimeConfig.enableMockExaminations;

export const getExaminationDetail = async (examinationId) => {
  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return getExaminationDetailMockEnvelope(examinationId);
  }

  return apiGetEnvelope(EXAMINATION_ENDPOINTS.detail(examinationId));
};
