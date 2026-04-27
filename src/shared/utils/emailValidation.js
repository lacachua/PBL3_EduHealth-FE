export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMAIL_VALIDATION_MESSAGE = 'Định dạng email chưa hợp lệ';

/**
 * Validates email format
 * @param {string} email
 * @returns {string|null} error message or null if valid
 */
export const validateEmailFormat = (email) => {
    if (!email || typeof email !== 'string') {
        return null;
    }

    const trimmed = email.trim();
    if (!trimmed) {
        return null;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
        return EMAIL_VALIDATION_MESSAGE;
    }

    return null;
};

/**
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => validateEmailFormat(email) === null;
