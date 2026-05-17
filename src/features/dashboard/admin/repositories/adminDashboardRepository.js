import { apiGetEnvelope } from '../../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../../app/config/dataMode';
import { waitForMock } from '../../../../shared/config/runtimeConfig';
import { ADMIN_DASHBOARD_ENDPOINTS } from '../constants/adminDashboardConfig';
import { getAdminDashboardMockEnvelope } from '../mocks/adminDashboardMock';
import { SYSTEM_LOGS_ENDPOINTS } from '../../../system-logs/constants/systemLogsApiContract';

const shouldUseMock = () => resolveModuleDataSource(DATA_MODULES.ADMIN_DASHBOARD) === 'mock';

const getOverviewFromApi = async (params) => {
  return apiGetEnvelope(ADMIN_DASHBOARD_ENDPOINTS.overview, { params });
};

const getOverviewFromMock = async () => {
  await waitForMock('adminDashboard');
  return getAdminDashboardMockEnvelope();
};

const getRecentActivitiesFromApi = async (limit = 4) => {
  const params = { page: 1, pageSize: limit };
  return apiGetEnvelope(SYSTEM_LOGS_ENDPOINTS.list, { params });
};

const getRecentActivitiesFromMock = async (limit = 4) => {
  await waitForMock('systemLogs');
  return getAdminDashboardMockEnvelope(limit);
};

export const adminDashboardRepository = {
  fetchOverview: async (query = {}) => {
    return shouldUseMock()
      ? getOverviewFromMock(query)
      : getOverviewFromApi(query);
  },

  fetchRecentActivities: async (limit = 4) => {
    return shouldUseMock()
      ? getRecentActivitiesFromMock(limit)
      : getRecentActivitiesFromApi(limit);
  },
};
