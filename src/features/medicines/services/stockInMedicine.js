import { apiPostEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES } from '../../../app/config/dataMode';
import { mockStockInMedicine } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const stockInMedicine = async (medicineId, payload, options = {}) => {
  const moduleKey = options.moduleKey || DATA_MODULES.ADMIN_MEDICINES;

  if (shouldUseMockInventoryApi(moduleKey)) {
    await waitForInventoryMock();
    return mockStockInMedicine(medicineId, payload);
  }

  return apiPostEnvelope(MEDICINES_ENDPOINTS.stockIn(medicineId), payload);
};
