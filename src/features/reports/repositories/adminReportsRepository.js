import {
  exportAdminReportsApi,
  getAdminClassDetailApi,
  getAdminReportsDashboardApi,
  saveAdminClassDirectiveApi,
} from '../services/adminReportsApi';

const extractFilenameFromContentDisposition = (contentDisposition) => {
  if (!contentDisposition) return null;
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;\n]*)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (match?.[1]) {
    return match[1].replace(/['"]/g, '');
  }
  return null;
};

const toNullableInt = (value) => {
  if (!value || value === 'all') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const buildReportQuery = (filters = {}) => {
  const classId = toNullableInt(filters.classId);

  return {
    ...(filters.fromDate && { fromDate: filters.fromDate }),
    ...(filters.toDate && { toDate: filters.toDate }),
    ...(classId && { classId }),
  };
};

export const adminReportsRepository = {
  getDashboard: async (filters = {}) => {
    return getAdminReportsDashboardApi(buildReportQuery(filters));
  },

  getClassDetail: async ({ classId }) => {
    return getAdminClassDetailApi(classId);
  },

  export: async ({ filters, format }) => {
    const response = await exportAdminReportsApi({
      format,
      ...buildReportQuery(filters),
    });

    const blob = response.data;
    const contentDisposition = response.headers['content-disposition'];
    const filename = extractFilenameFromContentDisposition(contentDisposition)
      || (format === 'xlsx' ? 'bao-cao-y-te-hoc-duong.xlsx' : 'bao-cao-y-te-hoc-duong.pdf');

    return {
      mode: 'blob',
      blob,
      filename,
      mimeType: response.headers['content-type'] || 'application/octet-stream',
    };
  },

  saveDirective: async ({ classId, note }) => {
    return saveAdminClassDirectiveApi({
      classId: toNullableInt(classId),
      title: 'Chỉ đạo từ báo cáo',
      content: note,
    });
  },
};
