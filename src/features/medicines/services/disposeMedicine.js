import { apiPostEnvelope } from '../../../shared/api/apiClient';
import { mockDisposeMedicine } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const disposeMedicine = async (medicineId, payload) => {
  if (shouldUseMockInventoryApi()) {
    await waitForInventoryMock();
    return mockDisposeMedicine(medicineId, payload);
  }

  return apiPostEnvelope(MEDICINES_ENDPOINTS.dispose(medicineId), payload);
};
