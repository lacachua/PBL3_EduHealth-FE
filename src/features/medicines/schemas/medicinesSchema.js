export const MEDICINES_ENDPOINTS = Object.freeze({
  list: '/api/v1/medicines',
  create: '/api/v1/medicines',
  detail: (medicineId) => `/api/v1/medicines/${medicineId}`,
  update: (medicineId) => `/api/v1/medicines/${medicineId}`,
  updateStatus: (medicineId) => `/api/v1/medicines/${medicineId}/status`,
  stockIn: (medicineId) => `/api/v1/medicines/${medicineId}/stock-in`,
  dispose: (medicineId) => `/api/v1/medicines/${medicineId}/dispose`,
  movements: (medicineId) => `/api/v1/medicines/${medicineId}/movements`,
  alerts: '/api/v1/medicines/alerts',
});

export const MEDICINE_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngưng dùng' },
];
