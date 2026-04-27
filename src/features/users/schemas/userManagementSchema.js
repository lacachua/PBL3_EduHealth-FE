import { validatePhoneNumber } from '../../../shared/utils/phoneValidation';
import { EMAIL_REGEX } from '../../../shared/utils/emailValidation';
import { PASSWORD_CREATE_MIN_LENGTH } from '../../../shared/utils/passwordValidation';
import { USER_ROLES } from '../constants/userManagementConstants';

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
  } else if (!isEdit && values.password?.trim() && values.password.trim().length < PASSWORD_CREATE_MIN_LENGTH) {
    errors.password = `Mật khẩu phải có ít nhất ${PASSWORD_CREATE_MIN_LENGTH} ký tự`;
  }

  if (values.email?.trim() && !EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Định dạng email chưa hợp lệ';
  }

  if (!isEdit && !values.phoneNumber?.trim()) {
    errors.phoneNumber = 'Vui lòng nhập số điện thoại';
  } else if (values.phoneNumber?.trim()) {
    const phoneError = validatePhoneNumber(values.phoneNumber.trim());
    if (phoneError) {
      errors.phoneNumber = phoneError;
    }
  }

  return errors;
};

