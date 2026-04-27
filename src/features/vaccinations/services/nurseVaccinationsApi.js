import { nurseVaccinationsRepository } from '../repositories/nurseVaccinationsRepository';
import {
  buildCampaignListQuery,
  buildCampaignStudentsQuery,
  buildCreateCampaignPayload,
  buildPendingQuery,
  buildUpdateStudentVaccinationPayload,
} from '../adapters/vaccinationPayloadMapper';

export const getVaccinationCampaignsApi = async (query = {}) => {
  return nurseVaccinationsRepository.getCampaigns(buildCampaignListQuery(query));
};

export const createVaccinationCampaignApi = async (values = {}) => {
  return nurseVaccinationsRepository.createCampaign(buildCreateCampaignPayload(values));
};

export const getVaccinationCampaignDetailApi = async (campaignId) => {
  return nurseVaccinationsRepository.getCampaignDetail(campaignId);
};

export const getVaccinationCampaignStudentsApi = async (campaignId, query = {}) => {
  return nurseVaccinationsRepository.getCampaignStudents(campaignId, buildCampaignStudentsQuery(query));
};

export const updateStudentVaccinationApi = async (studentVaccinationId, values = {}) => {
  return nurseVaccinationsRepository.updateStudentVaccination(studentVaccinationId, buildUpdateStudentVaccinationPayload(values));
};

export const getPendingVaccinationsApi = async (query = {}) => {
  return nurseVaccinationsRepository.getPending(buildPendingQuery(query));
};

export const getStudentVaccinationHistoryApi = async (studentId) => {
  return nurseVaccinationsRepository.getStudentHistory(studentId);
};
