import { apiPatchEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES } from '../../../app/config/dataMode';
import { mockUpdateMedicine } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../constants/medicinesApiContract';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const updateMedicine = async (medicineId, payload, options = {}) => {
  const moduleKey = options.moduleKey || DATA_MODULES.ADMIN_MEDICINES;

  if (shouldUseMockInventoryApi(moduleKey)) {
    await waitForInventoryMock();
    return mockUpdateMedicine(medicineId, payload);
  }

  return apiPatchEnvelope(MEDICINES_ENDPOINTS.update(medicineId), payload);
};
