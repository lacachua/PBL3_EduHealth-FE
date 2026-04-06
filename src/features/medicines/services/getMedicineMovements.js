import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { buildMedicineMovementsQueryParams } from '../adapters/medicineQueryParams';
import { mockGetMedicineMovements } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const getMedicineMovements = async (medicineId, query = {}) => {
  const params = buildMedicineMovementsQueryParams(query);

  if (shouldUseMockInventoryApi()) {
    await waitForInventoryMock();
    return mockGetMedicineMovements(medicineId, params);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.movements(medicineId), { params });
};
