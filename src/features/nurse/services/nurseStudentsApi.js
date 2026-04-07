import { apiGetEnvelope, apiPatchEnvelope } from '../../../shared/api/apiClient';

export const getNurseStudentHealthProfileApi = (studentId) => apiGetEnvelope(`/api/v1/students/${studentId}/health-profile`);

export const getNurseStudentDetailApi = (studentId) => apiGetEnvelope(`/api/v1/students/${studentId}`);

export const updateNurseStudentHealthProfileApi = (studentId, payload) => apiPatchEnvelope(`/api/v1/students/${studentId}/health-profile`, payload);

export const getNurseStudentHealthHistoryApi = (studentId, query = {}) => apiGetEnvelope(`/api/v1/students/${studentId}/health-history`, {
	params: {
		page: Number(query.page || 1),
		pageSize: Number(query.pageSize || 10),
		...(query.fromDate ? { fromDate: query.fromDate } : {}),
		...(query.toDate ? { toDate: query.toDate } : {}),
	},
});

export const getNurseStudentVaccinationsApi = (studentId) => apiGetEnvelope(`/api/v1/students/${studentId}/vaccinations`);

export const getNurseAllergyTypesApi = () => apiGetEnvelope('/api/v1/students/allergy-types');

export const getNurseStudentsLookupApi = (query = {}) => apiGetEnvelope('/api/v1/students', {
	params: {
		page: Number(query.page || 1),
		pageSize: Number(query.pageSize || 10),
		...(query.search ? { search: query.search } : {}),
	},
});