import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES } from '../../../app/config/dataMode';
import { buildMedicineAlertsQueryParams } from '../adapters/medicineQueryParams';
import { mockGetMedicineAlerts } from '../mocks/medicineInventoryMockApi';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';
import { shouldUseMockInventoryApi, waitForInventoryMock } from './inventoryServiceShared';

export const getMedicineAlerts = async (query = {}, options = {}) => {
  const params = buildMedicineAlertsQueryParams(query);
  const moduleKey = options.moduleKey || DATA_MODULES.ADMIN_MEDICINES;

  if (shouldUseMockInventoryApi(moduleKey)) {
    await waitForInventoryMock();
    return mockGetMedicineAlerts(params);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.alerts, { params });
};
