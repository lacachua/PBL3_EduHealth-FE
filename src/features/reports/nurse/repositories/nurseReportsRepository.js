import { DATA_MODULES, resolveModuleDataSource } from '../../../../app/config/dataMode';
import { waitForMock } from '../../../../shared/config/runtimeConfig';
import { getNurseReportsMockSnapshot } from '../mocks/nurseReportsMock';

const shouldUseMock = () => resolveModuleDataSource(DATA_MODULES.NURSE_REPORTS) === 'mock';

const sanitizeFilters = (filters = {}) => ({
  timeRange: String(filters.timeRange || 'this-month'),
  grade: String(filters.grade || 'all'),
  classId: String(filters.classId || 'all'),
  reportType: String(filters.reportType || 'overview'),
});

export const nurseReportsRepository = {
  getDashboard: async (filters = {}) => {
    const normalizedFilters = sanitizeFilters(filters);

    if (!shouldUseMock()) {
      const error = new Error('Backend chua ho tro endpoint report nurse chinh thuc. Tam thoi dung mock data.');
      error.name = 'UnsupportedFeatureError';
      error.code = 'NURSE_REPORTS_API_UNAVAILABLE';
      throw error;
    }

    await waitForMock('default');
    return getNurseReportsMockSnapshot(normalizedFilters, {
      source: 'mock',
      note: 'Du lieu mo phong: backend bao cao chua ho tro endpoint truc tiep cho dieu duong.',
    });
  },
};
