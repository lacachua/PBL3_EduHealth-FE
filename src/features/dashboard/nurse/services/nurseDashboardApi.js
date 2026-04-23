import { nurseDashboardRepository } from '../repositories/nurseDashboardRepository';

export const fetchNurseDashboardOverview = async () => {
    return nurseDashboardRepository.fetchOverview();
};
