const ENV_SINGLETON = Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME,
  enableMockAuth: import.meta.env.VITE_ENABLE_MOCK_AUTH !== "false",
  enableMockAdminDashboard: import.meta.env.VITE_ENABLE_MOCK_ADMIN_DASHBOARD !== "false",
  enableMockMedicines: import.meta.env.VITE_ENABLE_MOCK_MEDICINES === "true",
  enableMockExaminations: import.meta.env.VITE_ENABLE_MOCK_EXAMINATIONS === "true",
});

export const env = ENV_SINGLETON;