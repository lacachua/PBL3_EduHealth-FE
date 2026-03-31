import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';
import { buildCatalogDetailQueryParams, buildCatalogListQueryParams } from '../adapters/catalogQueryParams';
import { getCatalogDetailMockEnvelope, getCatalogListMockEnvelope } from '../mocks/catalogsMock';
import { CATALOG_ENDPOINTS } from '../schemas/catalogManagementSchema';

const isMockEnabled = runtimeConfig.enableMockAdminDashboard;

export const getCatalogListApi = async (query = {}) => {
  const params = buildCatalogListQueryParams(query);

  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return getCatalogListMockEnvelope(params);
  }

  return apiGetEnvelope(CATALOG_ENDPOINTS.list, { params });
};

export const getCatalogDetailApi = async (catalogId, query = {}) => {
  const params = buildCatalogDetailQueryParams(query);

  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return getCatalogDetailMockEnvelope(catalogId, params);
  }

  return apiGetEnvelope(`${CATALOG_ENDPOINTS.detail}/${catalogId}`, { params });
};
