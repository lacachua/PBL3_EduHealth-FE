import { env } from "../../app/config/env";

const RUNTIME_CONFIG_SINGLETON = Object.freeze({
  enableMockAuth: Boolean(env.enableMockAuth),
  enableMockAdminDashboard: Boolean(env.enableMockAdminDashboard),
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
