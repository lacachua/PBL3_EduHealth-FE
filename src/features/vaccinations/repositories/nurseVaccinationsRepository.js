import {
  apiGetEnvelope,
  apiPatchEnvelope,
  apiPostEnvelope,
} from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import {
  getPendingVaccinationsMockEnvelope,
  getStudentVaccinationHistoryMockEnvelope,
  getVaccinationCampaignDetailMockEnvelope,
  getVaccinationCampaignsMockEnvelope,
  getVaccinationCampaignStudentsMockEnvelope,
  createVaccinationCampaignMockEnvelope,
  updateStudentVaccinationMockEnvelope,
} from '../mocks/nurseVaccinationsMock';
import { VACCINATION_ENDPOINTS } from '../constants/vaccinationApiContract';

const isMockSource = () => resolveModuleDataSource(DATA_MODULES.NURSE_VACCINATIONS) === 'mock';

const getCampaignsLive = async (query) => apiGetEnvelope(VACCINATION_ENDPOINTS.campaigns, { params: query });
const createCampaignLive = async (payload) => apiPostEnvelope(VACCINATION_ENDPOINTS.campaigns, payload);
const getCampaignDetailLive = async (campaignId) => apiGetEnvelope(VACCINATION_ENDPOINTS.campaignDetail(campaignId));
const getCampaignStudentsLive = async (campaignId, query) => apiGetEnvelope(VACCINATION_ENDPOINTS.campaignStudents(campaignId), { params: query });
const updateStudentVaccinationLive = async (studentVaccinationId, payload) => apiPatchEnvelope(VACCINATION_ENDPOINTS.studentVaccinationDetail(studentVaccinationId), payload);
const getPendingLive = async (query) => apiGetEnvelope(VACCINATION_ENDPOINTS.pending, { params: query });
const getStudentHistoryLive = async (studentId) => apiGetEnvelope(VACCINATION_ENDPOINTS.studentHistory(studentId));

const getCampaignsMock = async (query) => {
  await waitForMock('nurseVaccinations');
  return getVaccinationCampaignsMockEnvelope(query);
};

const createCampaignMock = async (payload) => {
  await waitForMock('nurseVaccinations');
  return createVaccinationCampaignMockEnvelope(payload);
};

const getCampaignDetailMock = async (campaignId) => {
  await waitForMock('nurseVaccinations');
  return getVaccinationCampaignDetailMockEnvelope(campaignId);
};

const getCampaignStudentsMock = async (campaignId, query) => {
  await waitForMock('nurseVaccinations');
  return getVaccinationCampaignStudentsMockEnvelope(campaignId, query);
};

const updateStudentVaccinationMock = async (studentVaccinationId, payload) => {
  await waitForMock('nurseVaccinations');
  return updateStudentVaccinationMockEnvelope(studentVaccinationId, payload);
};

const getPendingMock = async (query) => {
  await waitForMock('nurseVaccinations');
  return getPendingVaccinationsMockEnvelope(query);
};

const getStudentHistoryMock = async (studentId) => {
  await waitForMock('nurseVaccinations');
  return getStudentVaccinationHistoryMockEnvelope(studentId);
};

export const nurseVaccinationsRepository = {
  getCampaigns: async (query = {}) => {
    return isMockSource() ? getCampaignsMock(query) : getCampaignsLive(query);
  },
  createCampaign: async (payload) => {
    return isMockSource() ? createCampaignMock(payload) : createCampaignLive(payload);
  },
  getCampaignDetail: async (campaignId) => {
    return isMockSource() ? getCampaignDetailMock(campaignId) : getCampaignDetailLive(campaignId);
  },
  getCampaignStudents: async (campaignId, query = {}) => {
    return isMockSource() ? getCampaignStudentsMock(campaignId, query) : getCampaignStudentsLive(campaignId, query);
  },
  updateStudentVaccination: async (studentVaccinationId, payload) => {
    return isMockSource() ? updateStudentVaccinationMock(studentVaccinationId, payload) : updateStudentVaccinationLive(studentVaccinationId, payload);
  },
  getPending: async (query = {}) => {
    return isMockSource() ? getPendingMock(query) : getPendingLive(query);
  },
  getStudentHistory: async (studentId) => {
    return isMockSource() ? getStudentHistoryMock(studentId) : getStudentHistoryLive(studentId);
  },
};
