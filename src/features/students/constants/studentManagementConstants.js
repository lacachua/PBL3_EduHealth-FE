export const STUDENT_STATUS_OPTIONS = [
    { label: 'Tất cả trạng thái', value: 'all' },
    { label: 'Hoạt động', value: 'ACTIVE' },
    { label: 'Ngưng hoạt động', value: 'INACTIVE' },
];

export const STUDENT_FILTER_DEFAULTS = {
    keyword: '',
    classId: 'all',
    status: 'all',
};

export const STUDENT_PAGE_SIZE = 10;

export const STUDENT_BASIC_EDITABLE_FIELDS = [
    'fullName',
    'dateOfBirth',
    'gender',
    'classId',
    'email',
    'phoneNumber',
];

export const STUDENT_HEALTH_EDITABLE_FIELDS = [
    'heightCm',
    'weightKg',
    'eyeStatus',
    'chronicNote',
    'allergies',
];
