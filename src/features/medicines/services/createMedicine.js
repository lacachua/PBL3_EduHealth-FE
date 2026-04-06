import { apiPostEnvelope } from '../../../shared/api/apiClient';
import { mockCreateMedicine } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const createMedicine = async (payload) => {
  if (shouldUseMockInventoryApi()) {
    await waitForInventoryMock();
    return mockCreateMedicine(payload);
  }

  return apiPostEnvelope(MEDICINES_ENDPOINTS.create, payload);
};
