import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import {
  getAdminReportsDashboardMockEnvelope,
  getAdminReportsClassDetailMockEnvelope,
  getSaveDirectiveMockEnvelope,
} from '../mocks/adminReportsMock';

const shouldUseMock = () => resolveModuleDataSource(DATA_MODULES.ADMIN_REPORTS) === 'mock';

const createUnsupportedLiveError = () => {
  const error = new Error('Backend chua ho tro endpoint report admin chinh thuc. Tam thoi dung mock data.');
  error.name = 'UnsupportedFeatureError';
  error.code = 'ADMIN_REPORTS_API_UNAVAILABLE';
  throw error;
};

const buildMockExportBlob = ({ format, filters = {} }) => {
  const reportType = String(filters.reportType || 'overview');
  const classId = String(filters.classId || 'all');
  const fromDate = String(filters.fromDate || '');
  const toDate = String(filters.toDate || '');

  if (format === 'xlsx') {
    const csv = [
      'reportType,classId,fromDate,toDate',
      `${reportType},${classId},${fromDate},${toDate}`,
    ].join('\n');

    return {
      mode: 'blob',
      blob: new Blob([csv], { type: 'text/csv;charset=utf-8' }),
      filename: 'admin-report-mock.csv',
      mimeType: 'text/csv',
    };
  }

  const lines = [
    'BAO CAO ADMIN (MOCK)',
    `Loai bao cao: ${reportType}`,
    `Lop: ${classId}`,
    `From: ${fromDate}`,
    `To: ${toDate}`,
  ].join('\n');

  return {
    mode: 'blob',
    blob: new Blob([lines], { type: 'application/pdf' }),
    filename: 'admin-report-mock.pdf',
    mimeType: 'application/pdf',
  };
};

export const adminReportsRepository = {
  getDashboard: async (filters = {}) => {
    if (!shouldUseMock()) {
      createUnsupportedLiveError();
    }

    await waitForMock('adminDashboard');
    return getAdminReportsDashboardMockEnvelope(filters);
  },

  getClassDetail: async ({ classId, filters = {} }) => {
    if (!shouldUseMock()) {
      createUnsupportedLiveError();
    }

    await waitForMock('adminDashboard');
    return getAdminReportsClassDetailMockEnvelope({ classId, filters });
  },

  export: async ({ filters, format }) => {
    if (!shouldUseMock()) {
      createUnsupportedLiveError();
    }

    await waitForMock('adminDashboard');
    return buildMockExportBlob({ format, filters });
  },

  saveDirective: async ({ classId, note }) => {
    if (!shouldUseMock()) {
      createUnsupportedLiveError();
    }

    await waitForMock('adminDashboard');
    return getSaveDirectiveMockEnvelope({ classId, note });
  },
};
