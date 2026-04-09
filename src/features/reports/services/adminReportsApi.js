import { adminReportsRepository } from '../repositories/adminReportsRepository';

export const getAdminReportsDashboardApi = async (filters = {}) => {
  return adminReportsRepository.getDashboard(filters);
};

export const getAdminClassDetailApi = async ({ classId, filters = {} }) => {
  return adminReportsRepository.getClassDetail({ classId, filters });
};

export const exportAdminReportsApi = async ({ filters, format }) => {
  return adminReportsRepository.export({ filters, format });
};

export const saveAdminClassDirectiveApi = async ({ classId, note, filters }) => {
  return adminReportsRepository.saveDirective({ classId, note, filters });
};
