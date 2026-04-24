import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { apiGetEnvelope, apiPostEnvelope, apiRequestRaw } from '../../../shared/api/apiClient';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import {
  getAdminReportsDashboardMockEnvelope,
  getAdminReportsClassDetailMockEnvelope,
  getSaveDirectiveMockEnvelope,
} from '../mocks/adminReportsMock';

const shouldUseMock = () => resolveModuleDataSource(DATA_MODULES.ADMIN_REPORTS) === 'mock';

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

const extractFilenameFromContentDisposition = (contentDisposition) => {
  if (!contentDisposition) return null;
  const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (match && match[1]) {
    return match[1].replace(/['"]/g, '');
  }
  return null;
};

export const adminReportsRepository = {
  getDashboard: async (filters = {}) => {
    if (shouldUseMock()) {
      await waitForMock('adminDashboard');
      return getAdminReportsDashboardMockEnvelope(filters);
    }

    return apiGetEnvelope('/api/v1/reports/admin/dashboard');
  },

  getClassDetail: async ({ classId, filters = {} }) => {
    if (shouldUseMock()) {
      await waitForMock('adminDashboard');
      return getAdminReportsClassDetailMockEnvelope({ classId, filters });
    }

    return apiGetEnvelope(`/api/v1/reports/admin/classes/${classId}`);
  },

  export: async ({ filters, format }) => {
    if (shouldUseMock()) {
      await waitForMock('adminDashboard');
      return buildMockExportBlob({ format, filters });
    }

    const params = {
      format,
      ...(filters.fromDate && { fromDate: filters.fromDate }),
      ...(filters.toDate && { toDate: filters.toDate }),
      ...(filters.classId && filters.classId !== 'all' && { classId: parseInt(filters.classId, 10) }),
    };

    const response = await apiRequestRaw({
      method: 'get',
      url: '/api/v1/reports/admin/export',
      params,
      responseType: 'blob',
    });

    const blob = response.data;
    const contentDisposition = response.headers['content-disposition'];
    const filename = extractFilenameFromContentDisposition(contentDisposition) || `admin-report.${format}`;

    return {
      mode: 'blob',
      blob,
      filename,
      mimeType: response.headers['content-type'] || 'application/octet-stream',
    };
  },

  saveDirective: async ({ classId, note }) => {
    if (shouldUseMock()) {
      await waitForMock('adminDashboard');
      return getSaveDirectiveMockEnvelope({ classId, note });
    }

    const payload = {
      classId: classId && classId !== 'all' ? parseInt(classId, 10) : null,
      title: 'Chỉ đạo từ báo cáo',
      content: note,
      priority: 'NORMAL',
    };

    return apiPostEnvelope('/api/v1/reports/admin/directives', payload);
  },
};
