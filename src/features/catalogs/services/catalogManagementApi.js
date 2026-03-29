import {
  apiDeleteEnvelope,
  apiGetEnvelope,
  apiPostEnvelope,
} from '../../../shared/api/apiClient';
import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';
import { getCatalogManagementMockEnvelope } from '../mocks/catalogManagementMock';
import { CATALOG_ENDPOINTS } from '../schemas/catalogManagementSchema';

const isMockEnabled = runtimeConfig.enableMockAdminDashboard;

export const getCatalogManagementListApi = async (query = {}) => {
  if (isMockEnabled) {
    await waitForMock();
    return getCatalogManagementMockEnvelope(query);
  }

  return apiGetEnvelope(CATALOG_ENDPOINTS.list, { params: query });
};

export const upsertCatalogItemApi = async (payload) => {
  if (isMockEnabled) {
    await waitForMock();
    return { success: true, message: 'Catalog item saved', data: { item: payload }, errors: null, meta: { source: 'mock' } };
  }

  return apiPostEnvelope(CATALOG_ENDPOINTS.list, payload);
};

export const deleteCatalogItemApi = async (itemId) => {
  if (isMockEnabled) {
    await waitForMock();
    return { success: true, message: 'Catalog item deleted', data: { itemId }, errors: null, meta: { source: 'mock' } };
  }

  return apiDeleteEnvelope(`${CATALOG_ENDPOINTS.list}/${itemId}`);
};
