import { apiPostEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import { createExaminationMockEnvelope } from '../mocks/examinationsMock';
import { EXAMINATION_ENDPOINTS } from '../constants/examinationApiContract';

export const createExamination = async (payload) => {
  if (resolveModuleDataSource(DATA_MODULES.NURSE_EXAMINATIONS) === 'mock') {
    await waitForMock('adminDashboard');
    return createExaminationMockEnvelope(payload);
  }

  return apiPostEnvelope(EXAMINATION_ENDPOINTS.create, payload);
};
