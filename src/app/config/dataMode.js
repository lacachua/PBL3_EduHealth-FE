import { env } from './env';

export const DATA_MODES = Object.freeze({
  LIVE: 'live',
  MOCK: 'mock',
  HYBRID: 'hybrid',
});

export const DATA_MODULES = Object.freeze({
  AUTH: 'auth',
  CURRENT_USER_ACCOUNT: 'currentUserAccount',
  STUDENT_PORTAL: 'studentPortal',

  ADMIN_USERS: 'adminUsers',
  ADMIN_STUDENTS: 'adminStudents',
  ADMIN_CATALOGS: 'adminCatalogs',
  ADMIN_MEDICINES: 'adminMedicines',
  ADMIN_REPORTS: 'adminReports',
  ADMIN_SYSTEM_LOGS: 'adminSystemLogs',
  ADMIN_SETTINGS: 'adminSettings',
  ADMIN_DASHBOARD: 'adminDashboard',

  NURSE_STUDENTS: 'nurseStudents',
  NURSE_HEALTH_PROFILE: 'nurseHealthProfile',
  NURSE_MEDICINES: 'nurseMedicines',
  NURSE_EXAMINATIONS: 'nurseExaminations',
  NURSE_VACCINATIONS: 'nurseVaccinations',
  NURSE_NOTIFICATIONS: 'nurseNotifications',
  NURSE_DASHBOARD: 'nurseDashboard',
});

const MODULE_CAPABILITIES = Object.freeze({
  [DATA_MODULES.AUTH]: { supportsLive: true },
  [DATA_MODULES.CURRENT_USER_ACCOUNT]: { supportsLive: true },
  // Student portal read APIs are still pending on backend; keep mock source by default.
  [DATA_MODULES.STUDENT_PORTAL]: { supportsLive: false },

  [DATA_MODULES.ADMIN_USERS]: { supportsLive: true },
  [DATA_MODULES.ADMIN_STUDENTS]: { supportsLive: true },
  [DATA_MODULES.ADMIN_CATALOGS]: { supportsLive: false },
  [DATA_MODULES.ADMIN_MEDICINES]: { supportsLive: true },
  [DATA_MODULES.ADMIN_REPORTS]: { supportsLive: false },
  [DATA_MODULES.ADMIN_SYSTEM_LOGS]: { supportsLive: false },
  [DATA_MODULES.ADMIN_SETTINGS]: { supportsLive: false },
  [DATA_MODULES.ADMIN_DASHBOARD]: { supportsLive: false },

  [DATA_MODULES.NURSE_STUDENTS]: { supportsLive: true },
  [DATA_MODULES.NURSE_HEALTH_PROFILE]: { supportsLive: true },
  [DATA_MODULES.NURSE_MEDICINES]: { supportsLive: true },
  [DATA_MODULES.NURSE_EXAMINATIONS]: { supportsLive: true },
  [DATA_MODULES.NURSE_VACCINATIONS]: { supportsLive: true },
  [DATA_MODULES.NURSE_NOTIFICATIONS]: { supportsLive: false },
  [DATA_MODULES.NURSE_DASHBOARD]: { supportsLive: true },
});

const getDataMode = () => {
  const mode = env.dataMode;
  if (mode === DATA_MODES.MOCK || mode === DATA_MODES.HYBRID || mode === DATA_MODES.LIVE) {
    return mode;
  }

  return DATA_MODES.LIVE;
};

export const getDataModeValue = () => getDataMode();

export const isModuleMockFlagEnabled = (moduleKey) => {
  return Boolean(env.moduleMockFlags?.[moduleKey]);
};

const resolveModuleCapabilities = (moduleKey) => {
  return MODULE_CAPABILITIES[moduleKey] || { supportsLive: true };
};

export const resolveModuleDataSource = (moduleKey) => {
  const mode = getDataMode();
  const { supportsLive } = resolveModuleCapabilities(moduleKey);

  if (mode === DATA_MODES.MOCK) {
    return 'mock';
  }

  if (mode === DATA_MODES.LIVE) {
    return supportsLive ? 'live' : 'mock';
  }

  if (isModuleMockFlagEnabled(moduleKey)) {
    return 'mock';
  }

  return supportsLive ? 'live' : 'mock';
};

export const shouldUseMockData = (moduleKey) => {
  return resolveModuleDataSource(moduleKey) === 'mock';
};

export const getModuleDataState = (moduleKey) => {
  const mode = getDataMode();
  const source = resolveModuleDataSource(moduleKey);
  const { supportsLive } = resolveModuleCapabilities(moduleKey);

  return {
    mode,
    source,
    supportsLive,
    mockFlagEnabled: isModuleMockFlagEnabled(moduleKey),
  };
};
