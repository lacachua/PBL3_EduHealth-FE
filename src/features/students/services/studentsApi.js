import {
  createStudentManagementApi,
  deleteStudentManagementApi,
  getStudentManagementDetailApi,
  getStudentManagementListApi,
  updateStudentManagementApi,
} from './studentManagementApi';

// Compatibility API layer retained for gradual backend integration.
// Keep this legacy facade and route real endpoint updates through studentManagementApi.js.
export const getStudentsApi = async (params = {}) => {
  const envelope = await getStudentManagementListApi(params);
  const data = envelope?.data;

  if (Array.isArray(data?.students)) return data.students;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

export const getStudentByIdApi = async (studentId) => {
  const envelope = await getStudentManagementDetailApi(studentId);
  return envelope?.data || null;
};

export const createStudentApi = async (payload) => {
  const response = await createStudentManagementApi(payload);
  return response?.data?.student || null;
};

export const updateStudentApi = async (studentId, payload) => {
  const response = await updateStudentManagementApi(studentId, payload);
  return response?.data?.student || null;
};

export const deleteStudentApi = async (studentId) => {
  await deleteStudentManagementApi(studentId);
  return { success: true };
};
