export const HEALTH_PROFILES_ENDPOINTS = Object.freeze({
    studentHealthProfile: (studentId) => `/api/v1/students/${studentId}/health-profile`,
    studentDetail: (studentId) => `/api/v1/students/${studentId}`,
    studentHealthHistory: (studentId) => `/api/v1/students/${studentId}/health-history`,
    studentVaccinations: (studentId) => `/api/v1/students/${studentId}/vaccinations`,
    allergyTypes: '/api/v1/students/allergy-types',
    studentsLookup: '/api/v1/students',
});