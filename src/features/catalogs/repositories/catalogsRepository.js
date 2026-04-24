import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import { buildCatalogDetailQueryParams, buildCatalogListQueryParams } from '../adapters/catalogQueryParams';
import { getCatalogDetailMockEnvelope, getCatalogListMockEnvelope } from '../mocks/catalogsMock';
import { CATALOG_ENDPOINTS, CATALOG_GROUPS } from '../schemas/catalogManagementSchema';

const shouldUseMock = () => resolveModuleDataSource(DATA_MODULES.ADMIN_CATALOGS) === 'mock';

export const catalogsRepository = {
  getGroups: async () => {
    if (shouldUseMock()) {
      await waitForMock('adminDashboard');
      return {
        success: true,
        message: 'Mock: tải danh sách nhóm thành công.',
        data: CATALOG_GROUPS.map((g) => ({ key: g.value, label: g.label })),
        errors: null,
        meta: null,
      };
    }

    return apiGetEnvelope(CATALOG_ENDPOINTS.groups);
  },
  getList: async (query = {}) => {
    const params = buildCatalogListQueryParams(query);

    if (shouldUseMock()) {
      await waitForMock('adminDashboard');
      return getCatalogListMockEnvelope(params);
    }

    return apiGetEnvelope(CATALOG_ENDPOINTS.list, { params });
  },
  getDetail: async (catalogId, query = {}) => {
    const params = buildCatalogDetailQueryParams(query);

    if (shouldUseMock()) {
      await waitForMock('adminDashboard');
      return getCatalogDetailMockEnvelope(catalogId, params);
    }

    return apiGetEnvelope(`${CATALOG_ENDPOINTS.detail}/${catalogId}`, { params });
  },
};
