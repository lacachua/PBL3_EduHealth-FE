export const MEDICINE_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Đang sử dụng' },
  { value: 'INACTIVE', label: 'Ngưng sử dụng' },
];

export const MEDICINE_STATUS_LABELS = {
  ACTIVE: 'Đang sử dụng',
  INACTIVE: 'Ngưng sử dụng',
};

export const MEDICINE_STATUS_BADGE_CLASS = {
  ACTIVE: 'bg-[#DCFCE7] text-[#166534]',
  INACTIVE: 'bg-slate-100 text-slate-600',
};

export const MEDICINE_ALERT_LABELS = {
  none: 'Ổn định',
  lowStock: 'Sắp hết',
  expiring: 'Sắp hết hạn',
  mixed: 'Sắp hết và sắp hết hạn',
};

export const MEDICINE_ALERT_BADGE_CLASS = {
  none: 'bg-slate-100 text-slate-600',
  lowStock: 'bg-[#FEF3C7] text-[#B45309]',
  expiring: 'bg-[#FEE2E2] text-[#B91C1C]',
  mixed: 'bg-[#FEE2E2] text-[#B91C1C]',
};

export const MEDICINE_UNIT_OPTIONS = [
  { value: 'VIEN', label: 'Viên' },
  { value: 'GOI', label: 'Gói' },
  { value: 'CHAI', label: 'Chai' },
  { value: 'HOP', label: 'Hộp' },
  { value: 'TUYP', label: 'Tuýp' },
  { value: 'ONG', label: 'Ống' },
  { value: 'LO', label: 'Lọ' },
];

export const MEDICINE_UNIT_LABELS = MEDICINE_UNIT_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const MOVEMENT_TYPE_OPTIONS = [
  { value: '', label: 'Tất cả biến động' },
  { value: 'IMPORT', label: 'Nhập kho' },
  { value: 'DISPENSE', label: 'Cấp phát' },
  { value: 'DISPOSE', label: 'Hủy thuốc' },
];

export const MOVEMENT_TYPE_LABELS = {
  IMPORT: 'Nhập kho',
  DISPENSE: 'Cấp phát',
  DISPOSE: 'Hủy thuốc',
};

export const MOVEMENT_TYPE_BADGE_CLASS = {
  IMPORT: 'border-[#BBF7D0] bg-[#ECFDF3] text-[#166534]',
  DISPENSE: 'border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412]',
  DISPOSE: 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]',
};

export const ALERT_TYPE_LABELS = {
  LOW_STOCK: 'Sắp hết',
  EXPIRING: 'Sắp hết hạn',
};

export const DISPOSE_REASON_OPTIONS = [
  { value: 'EXPIRED', label: 'Hết hạn' },
  { value: 'DAMAGED', label: 'Hư hỏng' },
  { value: 'BROKEN', label: 'Vỡ / rách bao bì' },
  { value: 'LOST', label: 'Thất lạc' },
  { value: 'OTHER', label: 'Khác' },
];

export const DISPOSE_REASON_LABELS = {
  EXPIRED: 'Hết hạn',
  DAMAGED: 'Hư hỏng',
  BROKEN: 'Vỡ / rách bao bì',
  LOST: 'Thất lạc',
  OTHER: 'Khác',
};

export const PAGE_SIZE = 10;
export const MOVEMENT_PAGE_SIZE = 5;
