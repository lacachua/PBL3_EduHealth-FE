const REPORT_ENDPOINTS_SINGLETON = Object.freeze({
  examinations: '/api/v1/reports/examinations',
  medicineUsage: '/api/v1/reports/medicine-usage',
  healthOverview: '/api/v1/reports/health-overview',
  vaccinations: '/api/v1/reports/vaccinations',
  studentsExport: '/api/v1/reports/students/export',
});

export const REPORT_ENDPOINTS = REPORT_ENDPOINTS_SINGLETON;
