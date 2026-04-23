const STATUS_LABEL_MAP = {
  active: 'Hoạt động',
  inactive: 'Ngưng dùng',
  unstandardized: 'Chưa chuẩn hóa',
  review: 'Chưa chuẩn hóa',
  pending_sync: 'Cần đồng bộ',
};

const STATUS_TONE_MAP = {
  active: 'success',
  inactive: 'neutral',
  unstandardized: 'warning',
  review: 'warning',
  pending_sync: 'info',
};

export const mapCatalogStatusLabel = (status) => {
  if (!status) return 'Không xác định';
  return STATUS_LABEL_MAP[status.toLowerCase()] || status;
};

export const mapCatalogStatusTone = (status) => {
  if (!status) return 'neutral';
  return STATUS_TONE_MAP[status.toLowerCase()] || 'neutral';
};
