import { studentManagementRepository } from '../repositories/studentManagementRepository';

export const getStudentManagementListApi = async (query = {}, options = {}) => {
  return studentManagementRepository.getList(query, options);
};

export const createStudentManagementApi = async (payload, options = {}) => {
  return studentManagementRepository.create(payload, options);
};

export const updateStudentManagementApi = async (studentId, payload, options = {}) => {
  return studentManagementRepository.update(studentId, payload, options);
};

export const getStudentManagementDetailApi = async (studentId, options = {}) => {
  return studentManagementRepository.getDetail(studentId, options);
};

export const getStudentHealthProfileApi = async (studentId, options = {}) => {
  return studentManagementRepository.getHealthProfile(studentId, options);
};

export const updateStudentHealthProfileApi = async (studentId, payload, options = {}) => {
  return studentManagementRepository.updateHealthProfile(studentId, payload, options);
};

export const deleteStudentManagementApi = async (studentId, options = {}) => {
  return studentManagementRepository.remove(studentId, options);
};
