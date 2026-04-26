import { apiGetEnvelope, apiPostEnvelope, apiRequestRaw } from '../../../shared/api/apiClient';

export const getAdminReportsDashboardApi = async (params = {}) => (
  apiGetEnvelope('/api/v1/reports/admin/dashboard', { params })
);

export const getAdminClassDetailApi = async (classId) => (
  apiGetEnvelope(`/api/v1/reports/admin/classes/${classId}`)
);

export const exportAdminReportsApi = async (params = {}) => (
  apiRequestRaw({
    method: 'get',
    url: '/api/v1/reports/admin/export',
    params,
    responseType: 'blob',
  })
);

export const saveAdminClassDirectiveApi = async (payload) => (
  apiPostEnvelope('/api/v1/reports/admin/directives', payload)
);
