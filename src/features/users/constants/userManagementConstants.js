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