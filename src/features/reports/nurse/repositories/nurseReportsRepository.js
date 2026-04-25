import { apiGetEnvelope, apiRequestRaw } from '../../../../shared/api/apiClient';

const sanitizeFilters = (filters = {}) => ({
  timeRange: String(filters.timeRange || 'this-month'),
  grade: String(filters.grade || 'all'),
  classId: String(filters.classId || 'all'),
  reportType: String(filters.reportType || 'overview'),
  ...(filters.fromDate ? { fromDate: filters.fromDate } : {}),
  ...(filters.toDate ? { toDate: filters.toDate } : {}),
});

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

export const nurseReportsRepository = {
  getDashboard: async (filters = {}) => {
    return apiGetEnvelope('/api/v1/reports/nurse/dashboard', {
      params: sanitizeFilters(filters),
    });
  },

  export: async (filters = {}) => {
    const response = await apiRequestRaw({
      method: 'get',
      url: '/api/v1/reports/nurse/export',
      params: {
        ...sanitizeFilters(filters),
        format: 'xlsx',
      },
      responseType: 'blob',
    });

    return {
      blob: response.data,
      filename: extractFilenameFromContentDisposition(response.headers['content-disposition'])
        || 'bao-cao-y-te-dieu-duong.xlsx',
      mimeType: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  },
};
