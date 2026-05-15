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

const normalizeOptionalString = (value, fallback = '') => {
  if (value === undefined || value === null) {
    return fallback;
  }

  const normalized = String(value).trim();
  return normalized || fallback;
};

const normalizeApiBaseUrl = (value) => {
  const normalized = normalizeOptionalString(value, '');
  if (!normalized) {
    return '';
  }

  return normalized.replace(/\/+$/, '');
};

const normalizeSignalRBaseUrl = (value) => {
  const normalized = normalizeOptionalString(value, '');
  if (!normalized) {
    return '';
  }

  return normalized.replace(/\/+$/, '');
};

const legacyEnableMockAuth = parseBoolean(import.meta.env.VITE_ENABLE_MOCK_AUTH, false);
const legacyEnableMockAdminDashboard = parseBoolean(import.meta.env.VITE_ENABLE_MOCK_ADMIN_DASHBOARD, false);
const legacyEnableMockHealthProfiles = parseBoolean(import.meta.env.VITE_ENABLE_MOCK_HEALTH_PROFILES, false);
const legacyEnableMockMedicines = parseBoolean(import.meta.env.VITE_ENABLE_MOCK_MEDICINES, false);
const legacyEnableMockExaminations = parseBoolean(import.meta.env.VITE_ENABLE_MOCK_EXAMINATIONS, false);
const legacyEnableNotificationMock = parseBoolean(import.meta.env.VITE_ENABLE_NOTIFICATION_MOCK, false);

const ENV_SINGLETON = Object.freeze({
  apiBaseUrl: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  signalRBaseUrl: normalizeSignalRBaseUrl(import.meta.env.VITE_SIGNALR_BASE_URL),
  appName: normalizeOptionalString(import.meta.env.VITE_APP_NAME, 'EduHealth'),
  dataMode: normalizeDataMode(import.meta.env.VITE_DATA_MODE),

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
    nurseNotifications: legacyEnableNotificationMock,
    notificationsInbox: legacyEnableNotificationMock,
    nurseReports: parseBoolean(import.meta.env.VITE_ENABLE_NURSE_REPORTS_MOCK, false),
    nurseDashboard: parseBoolean(import.meta.env.VITE_ENABLE_NURSE_DASHBOARD_MOCK, legacyEnableMockHealthProfiles),

    messaging: parseBoolean(import.meta.env.VITE_ENABLE_MESSAGING_MOCK, false),

    auth: parseBoolean(import.meta.env.VITE_ENABLE_AUTH_MOCK, legacyEnableMockAuth),
    currentUserAccount: parseBoolean(import.meta.env.VITE_ENABLE_CURRENT_USER_ACCOUNT_MOCK, false),
    studentPortal: parseBoolean(import.meta.env.VITE_ENABLE_STUDENT_PORTAL_MOCK, false),
  }),
});

export const env = ENV_SINGLETON;
