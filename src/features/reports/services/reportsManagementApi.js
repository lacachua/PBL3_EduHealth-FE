import { apiGetEnvelope, requestEnvelope } from '../../../shared/api/apiClient';
import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';
import { getReportsManagementMockEnvelope } from '../mocks/reportsManagementMock';
import { REPORT_ENDPOINTS } from '../schemas/reportsManagementSchema';

const isMockEnabled = runtimeConfig.enableMockAdminDashboard;

const resolveReportEndpoint = (reportType) => {
  if (reportType === 'visits') return REPORT_ENDPOINTS.examinations;
  if (reportType === 'medicine-usage') return REPORT_ENDPOINTS.medicineUsage;
  if (reportType === 'vaccinations') return REPORT_ENDPOINTS.vaccinations;
  // For "students" and "all", api_be provides health overview as the closest read endpoint.
  return REPORT_ENDPOINTS.healthOverview;
};

const buildReportQuery = (query = {}) => {
  const params = {};

  if (query.range && query.range !== 'all') {
    params.range = query.range;
  }

  if (query.scope && query.scope !== 'all') {
    params.scope = query.scope;
  }

  if (query.classId && query.classId !== 'all') {
    params.classId = query.classId;
  }

  if (query.fromDate) {
    params.fromDate = query.fromDate;
  }

  if (query.toDate) {
    params.toDate = query.toDate;
  }

  return params;
};

export const getReportsManagementApi = async (query = {}) => {
  if (isMockEnabled) {
    await waitForMock();
    return getReportsManagementMockEnvelope(query);
  }

  const endpoint = resolveReportEndpoint(query.reportType);
  return apiGetEnvelope(endpoint, { params: buildReportQuery(query) });
};

export const exportReportApi = async (payload) => {
  if (isMockEnabled) {
    await waitForMock();
    return {
      success: true,
      message: 'Đã tiếp nhận yêu cầu xuất báo cáo',
      data: {
        jobId: 'exp-001',
        ...payload,
      },
      errors: null,
      meta: { source: 'mock' },
    };
  }

  return requestEnvelope({
    method: 'get',
    url: REPORT_ENDPOINTS.studentsExport,
    params: buildReportQuery(payload),
    responseType: 'blob',
  });
};
