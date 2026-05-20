export const STUDENT_PORTAL_READ_APIS = Object.freeze({
    healthProfile: (studentUserId) => `/api/v1/students/${studentUserId}/health-profile`,
    healthHistory: (studentUserId) => `/api/v1/students/${studentUserId}/health-history`,
    classGrowthComparison: (studentUserId) => `/api/v1/students/${studentUserId}/health-profile/class-growth-comparison`,
    vaccinations: (studentUserId) => `/api/v1/students/${studentUserId}/vaccinations`,
});
