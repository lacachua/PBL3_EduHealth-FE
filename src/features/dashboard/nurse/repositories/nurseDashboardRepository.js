import { apiGetEnvelope } from '../../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../../app/config/dataMode';
import { waitForMock } from '../../../../shared/config/runtimeConfig';
import { NURSE_DASHBOARD_ENDPOINTS } from '../constants/nurseDashboardConfig';
import { getNurseDashboardMockSnapshot } from '../mocks/nurseDashboardMock';

const shouldUseMock = () => resolveModuleDataSource(DATA_MODULES.NURSE_DASHBOARD) === 'mock';

const getOverviewFromApi = async () => {
  return apiGetEnvelope(NURSE_DASHBOARD_ENDPOINTS.overview);
};

const getOverviewFromMock = async () => {
  await waitForMock('nurseDashboard');
  return getNurseDashboardMockSnapshot();
};

export const nurseDashboardRepository = {
  fetchOverview: async () => {
    return shouldUseMock()
      ? getOverviewFromMock()
      : getOverviewFromApi();
  },
};
