
export const PHONE_REGEX = /^[0-9+\-\s()]{8,15}$/;

export const PHONE_VALIDATION_MESSAGE = 'Số điện thoại không hợp lệ';

/**
 * Validates a phone number using the centralized pattern
 * @param {string} phone - The phone number to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validatePhoneNumber = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return null; // Empty/null phone is handled by required field validation
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
        return null; // Empty string after trim is valid (optional field)
    }

    if (!PHONE_REGEX.test(trimmedPhone)) {
        return PHONE_VALIDATION_MESSAGE;
    }

    return null; // Valid phone number
};

/**
 * Checks if a phone number is valid
 * @param {string} phone - The phone number to check
 * @returns {boolean} - True if valid, false if invalid
 */
export const isValidPhoneNumber = (phone) => {
    return validatePhoneNumber(phone) === null;
};

/**
 * Formats a phone number for display (optional utility)
 * @param {string} phone - The phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return '';
    }

    // Simple formatting - can be enhanced later if needed
    return phone.trim();
};

// Export the regex and message for backward compatibility
export { PHONE_REGEX as phoneRegex };
export { PHONE_VALIDATION_MESSAGE as phoneValidationMessage };