import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import { getSystemLogsMockEnvelope } from '../mocks/systemLogsMock';
import { SYSTEM_LOGS_ENDPOINTS } from '../schemas/systemLogsSchema';

const shouldUseMock = () => resolveModuleDataSource(DATA_MODULES.ADMIN_SYSTEM_LOGS) === 'mock';

export const systemLogsRepository = {
  getList: async (query = {}) => {
    if (shouldUseMock()) {
      await waitForMock();
      return getSystemLogsMockEnvelope(query);
    }

    return apiGetEnvelope(SYSTEM_LOGS_ENDPOINTS.list, { params: query });
  },
};
