export const MEDICINES_ENDPOINTS = Object.freeze({
  list: '/api/v1/medicines',
  detail: (medicineId) => `/api/v1/medicines/${medicineId}`,
  movements: (medicineId) => `/api/v1/medicines/${medicineId}/movements`,
  alerts: '/api/v1/medicines/alerts',
});

export const MEDICINES_PAGE_SIZE = 10;

export const MEDICINE_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngưng dùng' },
];

export const MEDICINE_ALERT_TYPES = Object.freeze({
  LOW_STOCK: 'LOW_STOCK',
  EXPIRING: 'EXPIRING',
  ALL: 'ALL',
});
