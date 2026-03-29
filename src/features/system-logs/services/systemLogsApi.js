import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';
import { getSystemLogsMockEnvelope } from '../mocks/systemLogsMock';
import { SYSTEM_LOGS_ENDPOINTS } from '../schemas/systemLogsSchema';

const isMockEnabled = runtimeConfig.enableMockAdminDashboard;

export const getSystemLogsApi = async (query = {}) => {
  if (isMockEnabled) {
    await waitForMock();
    return getSystemLogsMockEnvelope(query);
  }

  return apiGetEnvelope(SYSTEM_LOGS_ENDPOINTS.list, { params: query });
};
