export const EXAMINATION_ENDPOINTS = Object.freeze({
    list: '/api/v1/examinations',
    create: '/api/v1/examinations',
    detail: (examinationId) => `/api/v1/examinations/${examinationId}`,
});