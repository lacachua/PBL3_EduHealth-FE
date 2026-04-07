export const EXAMINATION_ENDPOINTS = Object.freeze({
  list: '/api/v1/examinations',
  create: '/api/v1/examinations',
  detail: (examinationId) => `/api/v1/examinations/${examinationId}`,
});

export const EXAMINATION_PAGE_SIZE = 10;
export const STUDENT_PICKER_PAGE_SIZE = 10;
export const MEDICINE_PICKER_PAGE_SIZE = 100;
