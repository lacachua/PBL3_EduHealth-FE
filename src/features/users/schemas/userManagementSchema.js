const USER_ENDPOINTS_SINGLETON = Object.freeze({
  list: '/api/v1/users',
  detail: (userId) => `/api/v1/users/${userId}`,
  status: (userId) => `/api/v1/users/${userId}/status`,
  resetPassword: (userId) => `/api/v1/users/${userId}/reset-password`,
});

export const USER_ENDPOINTS = USER_ENDPOINTS_SINGLETON;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  NURSE: 'NURSE',
};

export const ACCOUNT_ROLES = [USER_ROLES.ADMIN, USER_ROLES.NURSE];

export const USER_STATUSES = {
  ACTIVE: 'ACTIVE',
  LOCKED: 'LOCKED',
};

export const USER_ROLE_OPTIONS = [
  { label: 'Tất cả vai trò', value: 'all' },
  { label: 'Quản trị viên', value: 'ADMIN' },
  { label: 'Nhân viên y tế', value: 'NURSE' },
];

export const USER_ROLE_FORM_OPTIONS = [
  { label: 'Nhân viên y tế', value: 'NURSE' },
];

export const USER_STATUS_OPTIONS = [
  { label: 'Tất cả trạng thái', value: 'all' },
  { label: 'Hoạt động', value: 'ACTIVE' },
  { label: 'Đã khóa', value: 'LOCKED' },
];

export const GENDER_OPTIONS = [
  { label: 'Không xác định', value: '' },
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' },
];

export const USER_PAGE_SIZE = 10;

export const ROLE_LABEL_MAP = {
  ADMIN: 'Quản trị viên',
  NURSE: 'Nhân viên y tế',
};

export const STATUS_LABEL_MAP = {
  ACTIVE: 'Hoạt động',
  LOCKED: 'Đã khóa',
};

export const ROLE_TONE_MAP = {
  ADMIN: 'danger',
  NURSE: 'info',
};

export const STATUS_TONE_MAP = {
  ACTIVE: 'success',
  LOCKED: 'danger',
};

export const USER_FILTER_DEFAULTS = {
  keyword: '',
  role: 'all',
  status: 'all',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{8,15}$/;

export const validateUserForm = ({ values, isEdit }) => {
  const errors = {};
  const hasUsername = Boolean(values.username?.trim());
  const hasEmail = Boolean(values.email?.trim());

  if (!values.fullName?.trim()) {
    errors.fullName = 'Vui lòng nhập họ tên';
  }

  if (!isEdit && !hasUsername) {
    errors.username = 'Vui lòng nhập tên đăng nhập';
  }

  if (!isEdit && values.username?.trim() && (values.username.trim().length < 3 || values.username.trim().length > 50)) {
    errors.username = 'Tên đăng nhập cần từ 3 đến 50 ký tự';
  }

  if (!isEdit && values.role !== USER_ROLES.NURSE) {
    errors.role = 'Chỉ có thể tạo tài khoản Nhân viên y tế';
  }

  if (!hasEmail) {
    errors.email = 'Vui lòng nhập email';
  }

  if (!isEdit && !values.password?.trim()) {
    errors.password = 'Vui lòng nhập mật khẩu';
  }

  if (values.email?.trim() && !emailRegex.test(values.email.trim())) {
    errors.email = 'Định dạng email chưa hợp lệ';
  }

  if (values.phoneNumber?.trim() && !phoneRegex.test(values.phoneNumber.trim())) {
    errors.phoneNumber = 'Số điện thoại chưa hợp lệ';
  }

  return errors;
};

export const toStatusValue = (isActive) => (isActive ? USER_STATUSES.ACTIVE : USER_STATUSES.LOCKED);

export const toIsActive = (status) => status === USER_STATUSES.ACTIVE;

export const buildCreateUserPayload = (values) => ({
  username: values.username?.trim(),
  password: values.password?.trim(),
  fullName: values.fullName?.trim(),
  email: values.email?.trim(),
  ...(values.phoneNumber?.trim() ? { phoneNumber: values.phoneNumber.trim() } : {}),
  role: USER_ROLES.NURSE,
});

export const buildUpdateUserPayload = (values) => ({
  fullName: values.fullName?.trim(),
  email: values.email?.trim(),
  ...(values.phoneNumber?.trim() ? { phoneNumber: values.phoneNumber.trim() } : { phoneNumber: null }),
});

export const buildStatusPayload = ({ status, reason }) => {
  const payload = { status };
  if (reason?.trim()) {
    payload.reason = reason.trim();
  }
  return payload;
};
