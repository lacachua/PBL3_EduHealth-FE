export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRequired = (value) => value.trim().length > 0;

export const validateEmail = (value) => EMAIL_REGEX.test(value.trim());

export const validateOtpCode = (value, length = 6) => {
  return new RegExp(`^\\d{${length}}$`).test(value);
};

export const getPasswordChecks = (password = '') => ({
  minLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecial: /[^A-Za-z0-9]/.test(password),
});
