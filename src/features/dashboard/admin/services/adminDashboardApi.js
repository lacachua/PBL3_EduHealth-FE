import { apiGetEnvelope } from '../../../../shared/api/apiClient';
import { runtimeConfig, waitForMock } from '../../../../shared/config/runtimeConfig';
import { ADMIN_DASHBOARD_ENDPOINTS } from '../constants/adminDashboardConfig';
import { getAdminDashboardMockEnvelope } from '../mocks/adminDashboardMock';

const isMockAdminDashboardEnabled = runtimeConfig.enableMockAdminDashboard;

const getOverviewFromApi = async (params) => {
  return apiGetEnvelope(ADMIN_DASHBOARD_ENDPOINTS.overview, { params });
};

const getOverviewFromMock = async (params) => {
  await waitForMock('adminDashboard');
  return getAdminDashboardMockEnvelope(params);
};

export const fetchAdminDashboardOverview = async (query = {}) => {
  const envelope = isMockAdminDashboardEnabled
    ? await getOverviewFromMock(query)
    : await getOverviewFromApi(query);

  return envelope;
};
