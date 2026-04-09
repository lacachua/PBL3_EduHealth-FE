import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import { getExaminationsMockEnvelope } from '../mocks/examinationsMock';
import { EXAMINATION_ENDPOINTS } from '../schemas/examinationsSchema';

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const getExaminations = async (query = {}) => {
  const params = {
    page: toPositiveNumber(query.page, 1),
    pageSize: toPositiveNumber(query.pageSize, 10),
    ...(query.studentId ? { studentId: String(query.studentId).trim() } : {}),
    ...(query.classId ? { classId: String(query.classId).trim() } : {}),
    ...(query.fromDate ? { fromDate: query.fromDate } : {}),
    ...(query.toDate ? { toDate: query.toDate } : {}),
    ...(query.diseaseTypeId ? { diseaseTypeId: String(query.diseaseTypeId).trim() } : {}),
  };

  if (resolveModuleDataSource(DATA_MODULES.NURSE_EXAMINATIONS) === 'mock') {
    await waitForMock('adminDashboard');
    return getExaminationsMockEnvelope(params);
  }

  return apiGetEnvelope(EXAMINATION_ENDPOINTS.list, { params });
};
