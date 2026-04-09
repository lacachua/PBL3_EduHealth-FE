import { nurseStudentsRepository } from '../repositories/nurseStudentsRepository';

export const getNurseStudentHealthProfileApi = async (studentId) => {
	return nurseStudentsRepository.getStudentHealthProfile(studentId);
};

export const getNurseStudentDetailApi = async (studentId) => {
	return nurseStudentsRepository.getStudentDetail(studentId);
};

export const updateNurseStudentHealthProfileApi = async (studentId, payload) => {
	return nurseStudentsRepository.updateStudentHealthProfile(studentId, payload);
};

export const getNurseStudentHealthHistoryApi = async (studentId, query = {}) => {
	return nurseStudentsRepository.getStudentHealthHistory(studentId, query);
};

export const getNurseStudentVaccinationsApi = async (studentId) => {
	return nurseStudentsRepository.getStudentVaccinations(studentId);
};

export const getNurseAllergyTypesApi = async () => {
	return nurseStudentsRepository.getAllergyTypes();
};

export const getNurseStudentsLookupApi = async (query = {}) => {
	return nurseStudentsRepository.getStudentsLookup(query);
};