import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES } from '../../../app/config/dataMode';
import { mockGetMedicineById } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const getMedicineById = async (medicineId, options = {}) => {
  const moduleKey = options.moduleKey || DATA_MODULES.ADMIN_MEDICINES;

  if (shouldUseMockInventoryApi(moduleKey)) {
    await waitForInventoryMock();
    return mockGetMedicineById(medicineId);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.detail(medicineId));
};
