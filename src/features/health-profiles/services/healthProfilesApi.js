import { healthProfilesRepository } from '../repositories/healthProfilesRepository';

export const getNurseStudentHealthProfileApi = async (studentId) => {
	return healthProfilesRepository.getStudentHealthProfile(studentId);
};

export const getNurseStudentDetailApi = async (studentId) => {
	return healthProfilesRepository.getStudentDetail(studentId);
};

export const updateNurseStudentHealthProfileApi = async (studentId, payload) => {
	return healthProfilesRepository.updateStudentHealthProfile(studentId, payload);
};

export const getNurseStudentHealthHistoryApi = async (studentId, query = {}) => {
	return healthProfilesRepository.getStudentHealthHistory(studentId, query);
};

export const getNurseStudentVaccinationsApi = async (studentId) => {
	return healthProfilesRepository.getStudentVaccinations(studentId);
};

export const getNurseAllergyTypesApi = async () => {
	return healthProfilesRepository.getAllergyTypes();
};

export const getNurseStudentsLookupApi = async (query = {}) => {
	return healthProfilesRepository.getStudentsLookup(query);
};