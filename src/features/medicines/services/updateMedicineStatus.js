import { apiPatchEnvelope } from '../../../shared/api/apiClient';
import { mockUpdateMedicineStatus } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const updateMedicineStatus = async (medicineId, payload) => {
  if (shouldUseMockInventoryApi()) {
    await waitForInventoryMock();
    return mockUpdateMedicineStatus(medicineId, payload);
  }

  return apiPatchEnvelope(MEDICINES_ENDPOINTS.updateStatus(medicineId), payload);
};
