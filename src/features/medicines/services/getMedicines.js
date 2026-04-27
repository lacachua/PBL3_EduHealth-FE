import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES } from '../../../app/config/dataMode';
import { buildMedicinesListQueryParams } from '../adapters/medicineQueryParams';
import { mockGetMedicines } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../constants/medicinesApiContract';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const getMedicines = async (query = {}, options = {}) => {
  const params = buildMedicinesListQueryParams(query);
  const moduleKey = options.moduleKey || DATA_MODULES.ADMIN_MEDICINES;

  if (shouldUseMockInventoryApi(moduleKey)) {
    await waitForInventoryMock();
    return mockGetMedicines(params);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.list, { params });
};
