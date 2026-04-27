const USER_ENDPOINTS_SINGLETON = Object.freeze({
    list: '/api/v1/users',
    detail: (userId) => `/api/v1/users/${userId}`,
    status: (userId) => `/api/v1/users/${userId}/status`,
    resetPassword: (userId) => `/api/v1/users/${userId}/reset-password`,
});

export const USER_ENDPOINTS = USER_ENDPOINTS_SINGLETON;