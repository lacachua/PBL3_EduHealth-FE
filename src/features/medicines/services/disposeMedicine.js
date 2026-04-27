import { apiPostEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES } from '../../../app/config/dataMode';
import { mockDisposeMedicine } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../constants/medicinesApiContract';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const disposeMedicine = async (medicineId, payload, options = {}) => {
  const moduleKey = options.moduleKey || DATA_MODULES.ADMIN_MEDICINES;

  if (shouldUseMockInventoryApi(moduleKey)) {
    await waitForInventoryMock();
    return mockDisposeMedicine(medicineId, payload);
  }

  return apiPostEnvelope(MEDICINES_ENDPOINTS.dispose(medicineId), payload);
};
