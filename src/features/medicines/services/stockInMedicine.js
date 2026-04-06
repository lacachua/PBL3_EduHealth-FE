import { apiPostEnvelope } from '../../../shared/api/apiClient';
import { mockStockInMedicine } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const stockInMedicine = async (medicineId, payload) => {
  if (shouldUseMockInventoryApi()) {
    await waitForInventoryMock();
    return mockStockInMedicine(medicineId, payload);
  }

  return apiPostEnvelope(MEDICINES_ENDPOINTS.stockIn(medicineId), payload);
};
