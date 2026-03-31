import { apiGetEnvelope, apiPostEnvelope } from '../../../shared/api/apiClient';
import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import axiosClient from '../../../shared/api/axiosClient';
import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';
import {
  getAdminReportsDashboardMockEnvelope,
  getAdminReportsClassDetailMockEnvelope,
  getSaveDirectiveMockEnvelope,
} from '../mocks/adminReportsMock';
import { ADMIN_REPORT_ENDPOINTS, buildAdminReportsQuery } from '../schemas/adminReportsSchema';

const isMockEnabled = runtimeConfig.enableMockAdminDashboard;

const resolvePathParam = (endpoint, key, value) => endpoint.replace(`:${key}`, encodeURIComponent(String(value)));

const parseFileNameFromContentDisposition = (contentDisposition) => {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]).replace(/"/g, '').trim();
  }

  const asciiMatch = contentDisposition.match(/filename=([^;]+)/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1].replace(/"/g, '').trim();
  }

  return null;
};

const buildFallbackFileName = ({ format, query }) => {
  const rangePart = [query.fromDate, query.toDate].filter(Boolean).join('_to_') || query.period || 'current';
  const classPart = query.classId || 'all-classes';
  return `admin-report_${query.reportType || 'overview'}_${classPart}_${rangePart}.${format}`;
};

const createMockExportBlob = (format, query) => {
  if (format === 'xlsx') {
    const csvContent = [
      'reportType,classId,fromDate,toDate,period,riskThreshold',
      `${query.reportType || ''},${query.classId || ''},${query.fromDate || ''},${query.toDate || ''},${query.period || ''},${query.riskThreshold || ''}`,
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  }

  const textContent = [
    'BAO CAO QUAN TRI Y TE HOC DUONG',
    `Loai bao cao: ${query.reportType || ''}`,
    `Lop: ${query.classId || 'all'}`,
    `From: ${query.fromDate || ''}`,
    `To: ${query.toDate || ''}`,
    `Chu ky: ${query.period || ''}`,
  ].join('\n');

  return new Blob([textContent], { type: 'application/pdf' });
};

export const getAdminReportsDashboardApi = async (filters = {}) => {
  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return getAdminReportsDashboardMockEnvelope(filters);
  }

  return apiGetEnvelope(ADMIN_REPORT_ENDPOINTS.dashboard, {
    params: buildAdminReportsQuery(filters),
  });
};

export const getAdminClassDetailApi = async ({ classId, filters = {} }) => {
  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return getAdminReportsClassDetailMockEnvelope({ classId, filters });
  }

  return apiGetEnvelope(resolvePathParam(ADMIN_REPORT_ENDPOINTS.classDetail, 'classId', classId), {
    params: buildAdminReportsQuery(filters),
  });
};

export const exportAdminReportsApi = async ({ filters, format }) => {
  const query = buildAdminReportsQuery(filters);
  const payload = {
    ...query,
    format,
  };

  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return {
      mode: 'blob',
      blob: createMockExportBlob(format, payload),
      filename: buildFallbackFileName({ format, query: payload }),
      mimeType: format === 'xlsx' ? 'text/csv' : 'application/pdf',
    };
  }

  const response = await axiosClient.request({
    method: 'get',
    url: ADMIN_REPORT_ENDPOINTS.export,
    params: payload,
    responseType: 'blob',
  });

  const contentType = String(response.headers?.['content-type'] || '').toLowerCase();
  const contentDisposition = response.headers?.['content-disposition'] || '';
  const filenameFromHeader = parseFileNameFromContentDisposition(contentDisposition);

  if (contentType.includes('application/json')) {
    const rawText = await response.data.text();
    const jsonPayload = JSON.parse(rawText);
    const envelope = normalizeApiEnvelope(jsonPayload);
    const downloadUrl = envelope.data?.downloadUrl || envelope.data?.url;

    if (downloadUrl) {
      return {
        mode: 'url',
        downloadUrl,
        filename: envelope.data?.filename || buildFallbackFileName({ format, query: payload }),
      };
    }
  }

  return {
    mode: 'blob',
    blob: response.data,
    filename: filenameFromHeader || buildFallbackFileName({ format, query: payload }),
    mimeType: contentType,
  };
};

export const saveAdminClassDirectiveApi = async ({ classId, note, filters }) => {
  const payload = {
    note,
    context: buildAdminReportsQuery(filters),
  };

  if (isMockEnabled) {
    await waitForMock('adminDashboard');
    return getSaveDirectiveMockEnvelope({ classId, note });
  }

  return apiPostEnvelope(resolvePathParam(ADMIN_REPORT_ENDPOINTS.directive, 'classId', classId), payload);
};
