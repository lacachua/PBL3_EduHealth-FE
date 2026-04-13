import { apiGetEnvelope } from '../../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../../app/config/dataMode';
import { waitForMock } from '../../../../shared/config/runtimeConfig';
import { ADMIN_DASHBOARD_ENDPOINTS } from '../constants/adminDashboardConfig';
import { getAdminDashboardMockEnvelope } from '../mocks/adminDashboardMock';

const shouldUseMock = () => resolveModuleDataSource(DATA_MODULES.ADMIN_DASHBOARD) === 'mock';

const getOverviewFromApi = async (params) => {
  return apiGetEnvelope(ADMIN_DASHBOARD_ENDPOINTS.overview, { params });
};

const getOverviewFromMock = async () => {
  await waitForMock('adminDashboard');
  return getAdminDashboardMockEnvelope();
};

export const adminDashboardRepository = {
  fetchOverview: async (query = {}) => {
    return shouldUseMock()
      ? getOverviewFromMock(query)
      : getOverviewFromApi(query);
  },
};
