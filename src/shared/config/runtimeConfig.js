import { env } from "../../app/config/env";
import { DATA_MODULES, getDataModeValue, shouldUseMockData } from '../../app/config/dataMode';

const RUNTIME_CONFIG_SINGLETON = Object.freeze({
  dataMode: getDataModeValue(),
  enableMockAuth: shouldUseMockData(DATA_MODULES.AUTH),
  enableMockAdminDashboard: shouldUseMockData(DATA_MODULES.ADMIN_DASHBOARD),
  enableMockHealthProfiles: shouldUseMockData(DATA_MODULES.NURSE_HEALTH_PROFILE),
  enableMockMedicines: shouldUseMockData(DATA_MODULES.ADMIN_MEDICINES) || shouldUseMockData(DATA_MODULES.NURSE_MEDICINES),
  enableMockExaminations: shouldUseMockData(DATA_MODULES.NURSE_EXAMINATIONS),
  moduleMockFlags: env.moduleMockFlags,
  mockDelayMs: Object.freeze({
    default: 200,
    auth: 500,
    users: 300,
    adminDashboard: 450,
  }),
});

export const runtimeConfig = RUNTIME_CONFIG_SINGLETON;

export const waitForMock = (feature = "default") => {
  const duration = runtimeConfig.mockDelayMs[feature] ?? runtimeConfig.mockDelayMs.default;
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};
