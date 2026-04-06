import { apiPatchEnvelope } from '../../../shared/api/apiClient';
import { mockUpdateMedicine } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const updateMedicine = async (medicineId, payload) => {
  if (shouldUseMockInventoryApi()) {
    await waitForInventoryMock();
    return mockUpdateMedicine(medicineId, payload);
  }

  return apiPatchEnvelope(MEDICINES_ENDPOINTS.update(medicineId), payload);
};
