import {
  STUDENT_CREATE_CLASS_OPTIONS,
} from '../constants/studentCreateOptions';
import { validatePhoneNumber } from '../../../shared/utils/phoneValidation';

export const STUDENT_STATUS_OPTIONS = [
  { label: 'Tất cả trạng thái', value: 'all' },
  { label: 'Hoạt động', value: 'ACTIVE' },
  { label: 'Ngưng hoạt động', value: 'INACTIVE' },
];

export const STUDENT_CLASS_FILTER_OPTIONS = [
  { label: 'Tất cả lớp', value: 'all' },
  ...STUDENT_CREATE_CLASS_OPTIONS,
];

export const STUDENT_FILTER_DEFAULTS = {
  keyword: '',
  classId: 'all',
  status: 'all',
};

export const STUDENT_PAGE_SIZE = 10;

const STUDENT_ENDPOINTS_SINGLETON = Object.freeze({
  list: '/api/v1/students',
  detail: (studentId) => `/api/v1/students/${studentId}`,
  healthProfile: (studentId) => `/api/v1/students/${studentId}/health-profile`,
});

export const STUDENT_ENDPOINTS = STUDENT_ENDPOINTS_SINGLETON;

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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// REMOVED: phoneRegex - now using centralized validation from shared utils

export const buildStudentBasicPatchPayload = (values = {}) => ({
  fullName: values.fullName?.trim() || '',
  dateOfBirth: values.dateOfBirth || null,
  gender: values.gender || null,
  classId: values.classId ? Number(values.classId) : null,
  email: values.email?.trim() || '',
  ...(values.phoneNumber?.trim() ? { phone: values.phoneNumber.trim() } : { phone: null }),
});

export const buildStudentHealthPatchPayload = (values = {}) => ({
  ...(values.heightCm === '' || values.heightCm === null || values.heightCm === undefined ? { currentHeight: null } : { currentHeight: Number(values.heightCm) }),
  ...(values.weightKg === '' || values.weightKg === null || values.weightKg === undefined ? { currentWeight: null } : { currentWeight: Number(values.weightKg) }),
  medicalHistoryNotes: [
    values.eyeStatus?.trim() ? `Tình trạng mắt: ${values.eyeStatus.trim()}` : null,
    values.chronicNote?.trim() ? `Ghi chú bệnh mãn tính: ${values.chronicNote.trim()}` : null,
    values.allergies?.trim() ? `Dị ứng: ${values.allergies.trim()}` : null,
  ].filter(Boolean).join('\n') || null,
});

export const validateStudentBasicForm = (values = {}) => {
  const errors = {};

  if (!values.fullName?.trim()) {
    errors.fullName = 'Vui lòng nhập họ tên học sinh';
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = 'Vui lòng chọn ngày sinh';
  }

  if (!values.gender) {
    errors.gender = 'Vui lòng chọn giới tính';
  }

  if (!values.classId) {
    errors.classId = 'Vui lòng chọn lớp';
  }

  if (!values.email?.trim()) {
    errors.email = 'Vui lòng nhập email';
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Định dạng email chưa hợp lệ';
  }

  if (values.phoneNumber?.trim()) {
    const phoneError = validatePhoneNumber(values.phoneNumber.trim());
    if (phoneError) {
      errors.phoneNumber = phoneError;
    }
  }

  return errors;
};

export const validateStudentHealthForm = (values = {}) => {
  const errors = {};

  if (values.heightCm !== '' && values.heightCm !== null && values.heightCm !== undefined) {
    const height = Number(values.heightCm);
    if (Number.isNaN(height) || height <= 0) {
      errors.heightCm = 'Chiều cao phải là số lớn hơn 0';
    }
  }

  if (values.weightKg !== '' && values.weightKg !== null && values.weightKg !== undefined) {
    const weight = Number(values.weightKg);
    if (Number.isNaN(weight) || weight <= 0) {
      errors.weightKg = 'Cân nặng phải là số lớn hơn 0';
    }
  }

  return errors;
};
