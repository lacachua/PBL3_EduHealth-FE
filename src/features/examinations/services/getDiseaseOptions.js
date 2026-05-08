import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import { getDiseaseOptionsMockEnvelope } from '../mocks/examinationsMock';

const DISEASE_ENDPOINT = '/api/v1/diseases';

export const getDiseaseOptions = async () => {
  if (resolveModuleDataSource(DATA_MODULES.NURSE_EXAMINATIONS) === 'mock') {
    await waitForMock('adminDashboard');
    return getDiseaseOptionsMockEnvelope();
  }

  return apiGetEnvelope(DISEASE_ENDPOINT);
};
