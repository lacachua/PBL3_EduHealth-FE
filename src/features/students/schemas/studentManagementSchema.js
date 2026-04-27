import { validatePhoneNumber } from '../../../shared/utils/phoneValidation';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// REMOVED: phoneRegex - now using centralized validation from shared utils

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
