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
    badgeClassName: 'bg-warning-soft text-warning',
  },
  DONE: {
    label: 'Đã tiêm',
    badgeClassName: 'bg-success-soft text-success',
  },
  POSTPONED: {
    label: 'Tạm hoãn',
    badgeClassName: 'bg-warning-soft text-warning',
  },
  CONTRAINDICATED: {
    label: 'Chống chỉ định',
    badgeClassName: 'bg-danger-soft text-danger',
  },
  ABSENT: {
    label: 'Vắng mặt',
    badgeClassName: 'bg-surface-container-low text-on-surface-variant',
  },
  UNKNOWN: {
    label: 'Không xác định',
    badgeClassName: 'bg-surface-container-low text-on-surface-variant',
  },
};

export const CAMPAIGN_STATUS_META = {
  ACTIVE: {
    label: 'Đang hoạt động',
    badgeClassName: 'bg-success-soft text-success',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    badgeClassName: 'bg-info-soft text-info',
  },
  CANCELLED: {
    label: 'Đã hủy',
    badgeClassName: 'bg-danger-soft text-danger',
  },
  UNKNOWN: {
    label: 'Không xác định',
    badgeClassName: 'bg-surface-container-low text-on-surface-variant',
  },
};

export const TARGET_TYPE_META = {
  CLASS: 'Theo lớp',
  STUDENT: 'Theo học sinh',
};
export const CAMPAIGN_FILTER_DEFAULTS = {
  keyword: '',
  status: 'all',
  incompleteOnly: false,
};

export const CAMPAIGN_STUDENT_FILTER_DEFAULTS = {
  keyword: '',
  status: 'all',
};

export const PENDING_FILTER_DEFAULTS = {
  keyword: '',
  classId: '',
  campaignId: '',
  status: 'all',
};