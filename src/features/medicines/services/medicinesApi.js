import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';
import {
  buildMedicineAlertsQueryParams,
  buildMedicineMovementsQueryParams,
  buildMedicinesListQueryParams,
} from '../adapters/medicineQueryParams';
import {
  getMedicineAlertsMockEnvelope,
  getMedicineDetailMockEnvelope,
  getMedicinesMockEnvelope,
  getMedicineMovementsMockEnvelope,
} from '../mocks/medicinesMock';
import { MEDICINES_ENDPOINTS } from '../schemas/medicinesSchema';

const isMockEnabled = runtimeConfig.enableMockAdminDashboard;

export const getMedicinesApi = async (query = {}) => {
  const params = buildMedicinesListQueryParams(query);

  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return getMedicinesMockEnvelope(params);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.list, { params });
};

export const getMedicineDetailApi = async (medicineId) => {
  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return getMedicineDetailMockEnvelope(medicineId);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.detail(medicineId));
};

export const getMedicineAlertsApi = async (query = {}) => {
  const params = buildMedicineAlertsQueryParams(query);

  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return getMedicineAlertsMockEnvelope(params);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.alerts, { params });
};

export const getMedicineMovementsApi = async (medicineId, query = {}) => {
  const params = buildMedicineMovementsQueryParams(query);

  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return getMedicineMovementsMockEnvelope(medicineId, params);
  }

  return apiGetEnvelope(MEDICINES_ENDPOINTS.movements(medicineId), { params });
};
