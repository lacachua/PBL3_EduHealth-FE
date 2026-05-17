import { adminDashboardRepository } from '../repositories/adminDashboardRepository';

export const fetchAdminDashboardOverview = async (query = {}) => {
  return adminDashboardRepository.fetchOverview(query);
};

export const fetchRecentActivities = async (limit = 4) => {
  return adminDashboardRepository.fetchRecentActivities(limit);
};
