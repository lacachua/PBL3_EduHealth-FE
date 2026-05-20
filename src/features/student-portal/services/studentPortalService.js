import {
  mapAccountToViewModel,
  mapCareHistoryToViewModel,
  mapOverviewToViewModel,
  mapVaccinationsToViewModel,
} from '../adapters/studentPortalViewModelAdapter';
import { studentPortalRepository } from '../repositories/studentPortalRepository';

export const studentPortalService = {
  async getIdentity() {
    return studentPortalRepository.getIdentity();
  },

  async getOverviewViewModel() {
    const response = await studentPortalRepository.getOverview();

    return {
      ...response,
      data: mapOverviewToViewModel(response.data),
    };
  },

  async getClassGrowthComparison(metric) {
    return studentPortalRepository.getClassGrowthComparison(metric);
  },

  async getCareHistoryViewModel() {
    const response = await studentPortalRepository.getCareHistory();

    return {
      ...response,
      data: mapCareHistoryToViewModel(response.data),
    };
  },

  async getVaccinationsViewModel() {
    const response = await studentPortalRepository.getVaccinations();

    return {
      ...response,
      data: mapVaccinationsToViewModel(response.data),
    };
  },

  async getAccountViewModel() {
    const response = await studentPortalRepository.getAccount();

    return {
      ...response,
      data: mapAccountToViewModel(response.data),
    };
  },

  async updateAccountProfile(payload) {
    const response = await studentPortalRepository.updateAccountProfile(payload);

    return {
      ...response,
      data: mapAccountToViewModel(response.data),
    };
  },

  async uploadAccountAvatar(file) {
    const response = await studentPortalRepository.uploadAccountAvatar(file);

    return {
      ...response,
      data: mapAccountToViewModel(response.data),
    };
  },

  async changePassword(payload) {
    return studentPortalRepository.changePassword(payload);
  },
};
