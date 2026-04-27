import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES } from '../../../app/config/dataMode';
import { buildMedicineMovementsQueryParams } from '../adapters/medicineQueryParams';
import { mockGetMedicineMovements } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../constants/medicinesApiContract';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const getMedicineMovements = async (medicineId, query = {}, options = {}) => {
  const params = buildMedicineMovementsQueryParams(query);
  const moduleKey = options.moduleKey || DATA_MODULES.ADMIN_MEDICINES;

  if (shouldUseMockInventoryApi(moduleKey)) {
    await waitForInventoryMock();
    return mockGetMedicineMovements(medicineId, params);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.movements(medicineId), { params });
};
