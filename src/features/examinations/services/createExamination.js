import { apiPostEnvelope } from '../../../shared/api/apiClient';
import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';
import { createExaminationMockEnvelope } from '../mocks/examinationsMock';
import { EXAMINATION_ENDPOINTS } from '../schemas/examinationsSchema';

const isMockEnabled = runtimeConfig.enableMockExaminations;

export const createExamination = async (payload) => {
  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return createExaminationMockEnvelope(payload);
  }

  return apiPostEnvelope(EXAMINATION_ENDPOINTS.create, payload);
};
