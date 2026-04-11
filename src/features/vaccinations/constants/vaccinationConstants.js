export const VACCINATION_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ tiêm' },
  { value: 'DONE', label: 'Đã tiêm' },
  { value: 'POSTPONED', label: 'Tạm hoãn' },
  { value: 'CONTRAINDICATED', label: 'Chống chỉ định' },
  { value: 'ABSENT', label: 'Vắng mặt' },
];

export const VACCINATION_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ tiêm' },
  { value: 'DONE', label: 'Đã tiêm' },
  { value: 'POSTPONED', label: 'Tạm hoãn' },
  { value: 'CONTRAINDICATED', label: 'Chống chỉ định' },
  { value: 'ABSENT', label: 'Vắng mặt' },
];

export const PENDING_TAB_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả chưa hoàn thành' },
  { value: 'PENDING', label: 'Chờ tiêm' },
  { value: 'POSTPONED', label: 'Tạm hoãn' },
  { value: 'CONTRAINDICATED', label: 'Chống chỉ định' },
  { value: 'ABSENT', label: 'Vắng mặt' },
];

export const VACCINATION_CAMPAIGN_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả đợt tiêm' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export const VACCINATION_TARGET_TYPE_OPTIONS = [
  { value: 'CLASS', label: 'Theo lớp' },
  { value: 'STUDENT', label: 'Theo học sinh' },
];

export const VACCINATION_CAMPAIGN_PAGE_SIZE = 10;
export const VACCINATION_STUDENT_PAGE_SIZE = 10;
export const VACCINATION_PENDING_PAGE_SIZE = 10;

export const VACCINATION_STATUS_META = {
  PENDING: {
    label: 'Chờ tiêm',
    badgeClassName: 'bg-[#FEF3C7] text-[#B45309]',
  },
  DONE: {
    label: 'Đã tiêm',
    badgeClassName: 'bg-[#DCFCE7] text-[#166534]',
  },
  POSTPONED: {
    label: 'Tạm hoãn',
    badgeClassName: 'bg-[#FFEDD5] text-[#C2410C]',
  },
  CONTRAINDICATED: {
    label: 'Chống chỉ định',
    badgeClassName: 'bg-[#FEE2E2] text-[#B91C1C]',
  },
  ABSENT: {
    label: 'Vắng mặt',
    badgeClassName: 'bg-[#E2E8F0] text-[#334155]',
  },
  UNKNOWN: {
    label: 'Không xác định',
    badgeClassName: 'bg-[#E2E8F0] text-[#475569]',
  },
};

export const CAMPAIGN_STATUS_META = {
  ACTIVE: {
    label: 'Đang hoạt động',
    badgeClassName: 'bg-[#DCFCE7] text-[#166534]',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    badgeClassName: 'bg-[#DBEAFE] text-[#1D4ED8]',
  },
  CANCELLED: {
    label: 'Đã hủy',
    badgeClassName: 'bg-[#FEE2E2] text-[#B91C1C]',
  },
  UNKNOWN: {
    label: 'Không xác định',
    badgeClassName: 'bg-[#E2E8F0] text-[#475569]',
  },
};

export const TARGET_TYPE_META = {
  CLASS: 'Theo lớp',
  STUDENT: 'Theo học sinh',
};
