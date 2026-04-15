export const NURSE_DASHBOARD_SOURCE_KEYS = Object.freeze({
  examinationsWindow: 'examinationsWindow',
  recentExaminations: 'recentExaminations',
  medicineAlerts: 'medicineAlerts',
  pendingVaccinations: 'pendingVaccinations',
  activeCampaigns: 'activeCampaigns',
});

export const NURSE_DASHBOARD_EXAM_WINDOW_DAYS = 7;
export const NURSE_DASHBOARD_EXAM_WINDOW_PAGE_SIZE = 1000;
export const NURSE_DASHBOARD_RECENT_EXAM_LIMIT = 6;
export const NURSE_DASHBOARD_MEDICINE_ALERT_LIMIT = 5;
export const NURSE_DASHBOARD_PENDING_LIMIT = 5;
export const NURSE_DASHBOARD_ACTIVE_CAMPAIGN_LIMIT = 5;

export const NURSE_DASHBOARD_QUICK_ACTIONS = Object.freeze([
  {
    id: 'student-health-profiles',
    label: 'Hồ sơ học sinh',
    icon: 'folder_shared',
    to: '/nurse/health-profiles',
  },
  {
    id: 'examinations',
    label: 'Khám bệnh',
    icon: 'medical_information',
    to: '/nurse/examinations',
  },
  {
    id: 'medicines',
    label: 'Kho thuốc',
    icon: 'inventory_2',
    to: '/nurse/medicines',
  },
  {
    id: 'vaccinations',
    label: 'Tiêm chủng',
    icon: 'vaccines',
    to: '/nurse/vaccinations',
  },
]);
