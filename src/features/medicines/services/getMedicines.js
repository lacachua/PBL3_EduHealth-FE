import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { buildMedicinesListQueryParams } from '../adapters/medicineQueryParams';
import { mockGetMedicines } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const getMedicines = async (query = {}) => {
  const params = buildMedicinesListQueryParams(query);

  if (shouldUseMockInventoryApi()) {
    await waitForInventoryMock();
    return mockGetMedicines(params);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.list, { params });
};
