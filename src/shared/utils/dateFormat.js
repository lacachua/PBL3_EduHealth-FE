const DEFAULT_DATE_TIME_OPTIONS = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

const DEFAULT_TIME_OPTIONS = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

const parseDate = (value, fallback = '--') => {
    if (!value) return fallback;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date;
};

export const formatDateTime = (value, options = {}) => {
    const {
        fallback = '--',
        locale = 'vi-VN',
        formatOptions = DEFAULT_DATE_TIME_OPTIONS,
    } = options;

    const date = parseDate(value, fallback);
    if (typeof date === 'string') return date;

    return date.toLocaleString(locale, formatOptions);
};

export const formatDate = (value, options = {}) => {
    const {
        fallback = '--',
        locale = 'vi-VN',
        formatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' },
    } = options;

    const date = parseDate(value, fallback);
    if (typeof date === 'string') return date;

    return date.toLocaleDateString(locale, formatOptions);
};

export const formatTime = (value, options = {}) => {
    const {
        fallback = '--',
        locale = 'vi-VN',
        formatOptions = DEFAULT_TIME_OPTIONS,
    } = options;

    const date = parseDate(value, fallback);
    if (typeof date === 'string') return date;

    return date.toLocaleTimeString(locale, formatOptions);
};