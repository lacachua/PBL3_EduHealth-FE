import { apiGetEnvelope, apiRequestRaw } from '../../../shared/api/apiClient';

export const getAdminReportsDashboardApi = async (params = {}) => (
  apiGetEnvelope('/api/v1/reports/admin/dashboard', { params })
);

export const getAdminClassDetailApi = async (classId, params = {}) => (
  apiGetEnvelope(`/api/v1/reports/admin/classes/${classId}`, { params })
);

export const exportAdminReportsApi = async (params = {}) => (
  apiRequestRaw({
    method: 'get',
    url: '/api/v1/reports/admin/export',
    params,
    responseType: 'blob',
  })
);

