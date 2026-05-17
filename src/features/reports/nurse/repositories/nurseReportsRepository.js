import { apiGetEnvelope, apiRequestRaw } from '../../../../shared/api/apiClient';
import { NURSE_REPORTS_ENDPOINTS } from '../config/nurseReportsApiContract';

const formatDateForBackend = (dateString) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;

    return dateString;
  } catch {
    return null;
  }
};

const sanitizeFilters = (filters = {}) => {
  const params = {
    timeRange: 'custom-range',
    grade: String(filters.grade || 'all'),
    classId: String(filters.classId || 'all'),
    reportType: String(filters.reportType || 'overview'),
  };

  const fromDate = formatDateForBackend(filters.fromDate);
  const toDate = formatDateForBackend(filters.toDate);

  if (fromDate) {
    params.fromDate = fromDate;
  }

  if (toDate) {
    params.toDate = toDate;
  }

  return params;
};

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
    return apiGetEnvelope(NURSE_REPORTS_ENDPOINTS.dashboard, {
      params: sanitizeFilters(filters),
    });
  },

  export: async ({ filters = {}, format = 'xlsx' } = {}) => {
    const normalizedFormat = String(format || 'xlsx').trim().toLowerCase();
    const response = await apiRequestRaw({
      method: 'get',
      url: NURSE_REPORTS_ENDPOINTS.export,
      params: {
        ...sanitizeFilters(filters),
        format: normalizedFormat,
      },
      responseType: 'blob',
    });

    return {
      blob: response.data,
      filename: extractFilenameFromContentDisposition(response.headers['content-disposition'])
        || `bao-cao-y-te-dieu-duong.${normalizedFormat === 'pdf' ? 'pdf' : 'xlsx'}`,
      mimeType: response.headers['content-type'] || (
        normalizedFormat === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ),
    };
  },
};
