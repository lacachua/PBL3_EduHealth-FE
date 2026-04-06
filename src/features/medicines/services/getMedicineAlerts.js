import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { buildMedicineAlertsQueryParams } from '../adapters/medicineQueryParams';
import { mockGetMedicineAlerts } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const getMedicineAlerts = async (query = {}) => {
  const params = buildMedicineAlertsQueryParams(query);

  if (shouldUseMockInventoryApi()) {
    await waitForInventoryMock();
    return mockGetMedicineAlerts(params);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.alerts, { params });
};
