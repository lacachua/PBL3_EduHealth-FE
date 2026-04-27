import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import { getSystemLogsMockEnvelope } from '../mocks/systemLogsMock';
import { SYSTEM_LOGS_ENDPOINTS } from '../constants/systemLogsApiContract';

const shouldUseMock = () => resolveModuleDataSource(DATA_MODULES.ADMIN_SYSTEM_LOGS) === 'mock';

/**
 * Build clean query params for the BE SystemLogListQueryDto.
 * Strips out 'all' select values and empty strings so that
 * the BE receives only meaningful filter params.
 */
const buildListQueryParams = (query = {}) => {
  const params = {};

  if (query.page) params.page = Number(query.page);
  if (query.pageSize) params.pageSize = Number(query.pageSize);
  if (query.keyword?.trim()) params.keyword = query.keyword.trim();
  if (query.fromDate) params.fromDate = query.fromDate;
  if (query.toDate) params.toDate = query.toDate;
  if (query.role && query.role !== 'all') params.role = query.role;
  if (query.module && query.module !== 'all') params.module = query.module;
  if (query.action && query.action !== 'all') params.action = query.action;

  return params;
};

export const systemLogsRepository = {
  getList: async (query = {}) => {
    if (shouldUseMock()) {
      await waitForMock();
      return getSystemLogsMockEnvelope(query);
    }

    const params = buildListQueryParams(query);
    return apiGetEnvelope(SYSTEM_LOGS_ENDPOINTS.list, { params });
  },

  getDetail: async (logId) => {
    if (shouldUseMock()) {
      await waitForMock();
      // Mock: return a mock envelope that wraps the matching row
      return getSystemLogsMockEnvelope({ logId });
    }

    return apiGetEnvelope(`${SYSTEM_LOGS_ENDPOINTS.detail}/${logId}`);
  },
};
