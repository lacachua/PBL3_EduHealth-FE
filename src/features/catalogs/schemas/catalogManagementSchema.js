const CATALOG_ENDPOINTS_SINGLETON = Object.freeze({
  list: '/api/v1/catalogs/items',
  detail: '/api/v1/catalogs/items',
});

export const CATALOG_ENDPOINTS = CATALOG_ENDPOINTS_SINGLETON;

export const CATALOG_GROUPS = [
  { value: 'vaccines', label: 'Vắc xin' },
  { value: 'diseases', label: 'Bệnh lý' },
  { value: 'allergies', label: 'Dị ứng' },
];

export const CATALOG_PAGE_SIZE = 10;

export const CATALOG_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'unstandardized', label: 'Chưa chuẩn hóa' },
  { value: 'inactive', label: 'Ngưng dùng' },
];
