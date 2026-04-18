const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return String(value).trim().toLowerCase() === 'true';
};

const normalizeDataMode = (value) => {
  const normalized = String(value || 'live').trim().toLowerCase();
  if (normalized === 'mock' || normalized === 'hybrid' || normalized === 'live') {
    return normalized;
  }

  return 'live';
};

const legacyEnableMockAuth = parseBoolean(import.meta.env.VITE_ENABLE_MOCK_AUTH, false);
const legacyEnableMockAdminDashboard = parseBoolean(import.meta.env.VITE_ENABLE_MOCK_ADMIN_DASHBOARD, false);
const legacyEnableMockHealthProfiles = parseBoolean(import.meta.env.VITE_ENABLE_MOCK_HEALTH_PROFILES, false);
const legacyEnableMockMedicines = parseBoolean(import.meta.env.VITE_ENABLE_MOCK_MEDICINES, false);
const legacyEnableMockExaminations = parseBoolean(import.meta.env.VITE_ENABLE_MOCK_EXAMINATIONS, false);

const ENV_SINGLETON = Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME,
  dataMode: normalizeDataMode(import.meta.env.VITE_DATA_MODE),

  // Legacy flags kept for backward compatibility.
  enableMockAuth: legacyEnableMockAuth,
  enableMockAdminDashboard: legacyEnableMockAdminDashboard,
  enableMockHealthProfiles: legacyEnableMockHealthProfiles,
  enableMockMedicines: legacyEnableMockMedicines,
  enableMockExaminations: legacyEnableMockExaminations,

  moduleMockFlags: Object.freeze({
    adminUsers: parseBoolean(import.meta.env.VITE_ENABLE_ADMIN_USERS_MOCK, legacyEnableMockAdminDashboard),
    adminStudents: parseBoolean(import.meta.env.VITE_ENABLE_ADMIN_STUDENTS_MOCK, legacyEnableMockAdminDashboard),
    adminCatalogs: parseBoolean(import.meta.env.VITE_ENABLE_ADMIN_CATALOGS_MOCK, legacyEnableMockAdminDashboard),
    adminMedicines: parseBoolean(import.meta.env.VITE_ENABLE_ADMIN_MEDICINES_MOCK, legacyEnableMockMedicines),
    adminReports: parseBoolean(import.meta.env.VITE_ENABLE_ADMIN_REPORTS_MOCK, legacyEnableMockAdminDashboard),
    adminSystemLogs: parseBoolean(import.meta.env.VITE_ENABLE_ADMIN_SYSTEM_LOGS_MOCK, legacyEnableMockAdminDashboard),
    adminSettings: parseBoolean(import.meta.env.VITE_ENABLE_ADMIN_SETTINGS_MOCK, legacyEnableMockAdminDashboard),
    adminDashboard: parseBoolean(import.meta.env.VITE_ENABLE_ADMIN_DASHBOARD_MOCK, legacyEnableMockAdminDashboard),

    nurseStudents: parseBoolean(import.meta.env.VITE_ENABLE_NURSE_STUDENTS_MOCK, legacyEnableMockHealthProfiles),
    nurseHealthProfile: parseBoolean(import.meta.env.VITE_ENABLE_NURSE_HEALTH_PROFILE_MOCK, legacyEnableMockHealthProfiles),
    nurseMedicines: parseBoolean(import.meta.env.VITE_ENABLE_NURSE_MEDICINES_MOCK, legacyEnableMockMedicines),
    nurseExaminations: parseBoolean(import.meta.env.VITE_ENABLE_NURSE_EXAMINATIONS_MOCK, legacyEnableMockExaminations),
    nurseVaccinations: parseBoolean(import.meta.env.VITE_ENABLE_NURSE_VACCINATIONS_MOCK, false),
    nurseNotifications: parseBoolean(import.meta.env.VITE_ENABLE_NURSE_NOTIFICATIONS_MOCK, false),
    nurseReports: parseBoolean(import.meta.env.VITE_ENABLE_NURSE_REPORTS_MOCK, true),
    nurseDashboard: parseBoolean(import.meta.env.VITE_ENABLE_NURSE_DASHBOARD_MOCK, legacyEnableMockHealthProfiles),

    auth: parseBoolean(import.meta.env.VITE_ENABLE_AUTH_MOCK, legacyEnableMockAuth),
    currentUserAccount: parseBoolean(import.meta.env.VITE_ENABLE_CURRENT_USER_ACCOUNT_MOCK, false),
    studentPortal: parseBoolean(import.meta.env.VITE_ENABLE_STUDENT_PORTAL_MOCK, false),
  }),
});

export const env = ENV_SINGLETON;