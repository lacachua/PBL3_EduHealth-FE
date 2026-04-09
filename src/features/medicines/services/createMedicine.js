import { apiPostEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES } from '../../../app/config/dataMode';
import { mockCreateMedicine } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const createMedicine = async (payload, options = {}) => {
  const moduleKey = options.moduleKey || DATA_MODULES.ADMIN_MEDICINES;

  if (shouldUseMockInventoryApi(moduleKey)) {
    await waitForInventoryMock();
    return mockCreateMedicine(payload);
  }

  return apiPostEnvelope(MEDICINES_ENDPOINTS.create, payload);
};
