export const VACCINATION_ENDPOINTS = Object.freeze({
    campaigns: '/api/v1/vaccination-campaigns',
    campaignDetail: (campaignId) => `/api/v1/vaccination-campaigns/${campaignId}`,
    campaignStudents: (campaignId) => `/api/v1/vaccination-campaigns/${campaignId}/students`,
    studentVaccinationDetail: (studentVaccinationId) => `/api/v1/student-vaccinations/${studentVaccinationId}`,
    pending: '/api/v1/student-vaccinations/pending',
    studentHistory: (studentId) => `/api/v1/students/${studentId}/vaccinations`,
});