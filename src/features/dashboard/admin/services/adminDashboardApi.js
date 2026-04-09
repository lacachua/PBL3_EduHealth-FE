import { adminDashboardRepository } from '../repositories/adminDashboardRepository';

export const fetchAdminDashboardOverview = async (query = {}) => {
  return adminDashboardRepository.fetchOverview(query);
};
