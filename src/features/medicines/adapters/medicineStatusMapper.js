const STATUS_LABELS = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngưng dùng',
};

const STATUS_TONES = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
};

const ALERT_TONES = {
  none: 'neutral',
  low_stock: 'warning',
  expiring: 'info',
  mixed: 'danger',
};

const ALERT_LABELS = {
  none: 'Ổn định',
  low_stock: 'Sắp hết',
  expiring: 'Sắp hết hạn',
  mixed: 'Sắp hết và sắp hết hạn',
};

export const mapMedicineStatusLabel = (status) => STATUS_LABELS[status] || status || 'Không xác định';
export const mapMedicineStatusTone = (status) => STATUS_TONES[status] || 'neutral';

export const mapMedicineAlertKey = (isLowStock, isExpiringSoon) => {
  if (isLowStock && isExpiringSoon) return 'mixed';
  if (isLowStock) return 'low_stock';
  if (isExpiringSoon) return 'expiring';
  return 'none';
};

export const mapMedicineAlertLabel = (isLowStock, isExpiringSoon) => ALERT_LABELS[mapMedicineAlertKey(isLowStock, isExpiringSoon)];
export const mapMedicineAlertTone = (isLowStock, isExpiringSoon) => ALERT_TONES[mapMedicineAlertKey(isLowStock, isExpiringSoon)];
