import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';

export const shouldUseMockInventoryApi = () => runtimeConfig.enableMockMedicines;

export const waitForInventoryMock = () => waitForMock('adminDashboard');
