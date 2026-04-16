import { DATA_MODULES, resolveModuleDataSource } from '../../../../app/config/dataMode';
import { waitForMock } from '../../../../shared/config/runtimeConfig';
import { getNurseReportsMockSnapshot } from '../mocks/nurseReportsMock';
import { getNurseReportsDashboardLive } from '../services/nurseReportsApi';

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

    if (shouldUseMock()) {
      await waitForMock('default');
      return getNurseReportsMockSnapshot(normalizedFilters, {
        source: 'mock',
        note: 'Mock-only: backend reports chưa hỗ trợ endpoint live cho nurse.',
      });
    }

    return getNurseReportsDashboardLive(normalizedFilters);
  },
};
