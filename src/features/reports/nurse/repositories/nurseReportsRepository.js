import { apiGetEnvelope, apiRequestRaw } from '../../../../shared/api/apiClient';
import { NURSE_REPORTS_ENDPOINTS } from '../config/nurseReportsApiContract';

const toIsoString = (date) => date.toISOString();

const startOfDay = (date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const buildCustomRangeParams = (filters, timeRange) => {
  const now = new Date();
  let fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
  let toDate = filters.toDate ? new Date(filters.toDate) : now;

  if (!fromDate) {
    if (timeRange === 'today') {
      fromDate = startOfDay(now);
    } else if (timeRange === 'this-year') {
      fromDate = new Date(now.getFullYear(), 0, 1);
    } else {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }

  if (Number.isNaN(fromDate.getTime())) {
    fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  if (Number.isNaN(toDate.getTime())) {
    toDate = now;
  }

  return {
    timeRange: 'custom-range',
    fromDate: toIsoString(fromDate),
    toDate: toIsoString(toDate),
  };
};

const sanitizeFilters = (filters = {}) => {
  const rawTimeRange = String(filters.timeRange || 'this-month');
  const timeRange = rawTimeRange === 'custom' ? 'custom-range' : rawTimeRange;
  const needsCustomRange = ['today', 'this-year', 'custom-range'].includes(timeRange);

  return {
    ...(needsCustomRange ? buildCustomRangeParams(filters, timeRange) : { timeRange }),
    grade: String(filters.grade || 'all'),
    classId: String(filters.classId || 'all'),
    reportType: String(filters.reportType || 'overview'),
    ...(!needsCustomRange && filters.fromDate ? { fromDate: filters.fromDate } : {}),
    ...(!needsCustomRange && filters.toDate ? { toDate: filters.toDate } : {}),
  };
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
