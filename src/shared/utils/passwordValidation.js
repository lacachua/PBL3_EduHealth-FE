export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_CREATE_MIN_LENGTH = 6;

/**
 * @param {string} password
 * @param {number} minLength
 * @returns {string|null}
 */
export const validatePasswordMinLength = (password, minLength = PASSWORD_MIN_LENGTH) => {
    if (!password || typeof password !== 'string') {
        return null;
    }

    if (password.length < minLength) {
        return `Mật khẩu phải có ít nhất ${minLength} ký tự.`;
    }

    return null;
};

/**
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {string|null}
 */
export const validatePasswordNotSameAsOld = (oldPassword, newPassword) => {
    if (!oldPassword || !newPassword) {
        return null;
    }

    if (oldPassword === newPassword) {
        return 'Mật khẩu mới phải khác mật khẩu hiện tại.';
    }

    return null;
};

/**
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string|null}
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    if (!password || !confirmPassword) {
        return null;
    }

    if (password !== confirmPassword) {
        return 'Xác nhận mật khẩu chưa khớp.';
    }

    return null;
};

/**
 * Full change-password form validation.
 * Aligned with AuthService.ChangePasswordAsync: min 8, required, newPassword ≠ oldPassword, confirmPassword = newPassword.
 *
 * @param {{ oldPassword: string, newPassword: string, confirmPassword: string }} values
 * @returns {Object} errors object
 */
export const validateChangePasswordForm = ({ oldPassword, newPassword, confirmPassword }) => {
    const errors = {};

    const old = String(oldPassword || '').trim();
    const next = String(newPassword || '').trim();
    const confirm = String(confirmPassword || '').trim();

    if (!old) {
        errors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    }

    if (!next) {
        errors.newPassword = 'Vui lòng nhập mật khẩu mới.';
    } else {
        const lengthError = validatePasswordMinLength(next, PASSWORD_MIN_LENGTH);
        if (lengthError) {
            errors.newPassword = lengthError;
        } else {
            const sameError = validatePasswordNotSameAsOld(old, next);
            if (sameError) {
                errors.newPassword = sameError;
            }
        }
    }

    if (!confirm) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
    } else {
        const matchError = validatePasswordMatch(next, confirm);
        if (matchError) {
            errors.confirmPassword = matchError;
        }
    }

    return errors;
};
