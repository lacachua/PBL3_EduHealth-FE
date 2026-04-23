import { env } from "../../app/config/env";
import { getDataModeValue } from '../../app/config/dataMode';

const RUNTIME_CONFIG_SINGLETON = Object.freeze({
  dataMode: getDataModeValue(),
  moduleMockFlags: env.moduleMockFlags,
  mockDelayMs: Object.freeze({
    default: 200,
    auth: 500,
    users: 300,
    adminDashboard: 450,
    studentPortal: 320,
  }),
});

export const runtimeConfig = RUNTIME_CONFIG_SINGLETON;

export const waitForMock = (feature = "default") => {
  const duration = runtimeConfig.mockDelayMs[feature] ?? runtimeConfig.mockDelayMs.default;
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};
