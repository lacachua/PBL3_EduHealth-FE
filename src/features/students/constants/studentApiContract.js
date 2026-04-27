const STUDENT_ENDPOINTS_SINGLETON = Object.freeze({
    list: '/api/v1/students',
    detail: (studentId) => `/api/v1/students/${studentId}`,
    healthProfile: (studentId) => `/api/v1/students/${studentId}/health-profile`,
});

export const STUDENT_ENDPOINTS = STUDENT_ENDPOINTS_SINGLETON;