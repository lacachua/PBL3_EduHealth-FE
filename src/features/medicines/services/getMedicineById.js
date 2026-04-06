import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { mockGetMedicineById } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const getMedicineById = async (medicineId) => {
  if (shouldUseMockInventoryApi()) {
    await waitForInventoryMock();
    return mockGetMedicineById(medicineId);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.detail(medicineId));
};
