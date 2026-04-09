import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import { getExaminationDetailMockEnvelope } from '../mocks/examinationsMock';
import { EXAMINATION_ENDPOINTS } from '../schemas/examinationsSchema';

export const getExaminationDetail = async (examinationId) => {
  if (resolveModuleDataSource(DATA_MODULES.NURSE_EXAMINATIONS) === 'mock') {
    await waitForMock('adminDashboard');
    return getExaminationDetailMockEnvelope(examinationId);
  }

  return apiGetEnvelope(EXAMINATION_ENDPOINTS.detail(examinationId));
};
