import { nurseStudentsRepository } from '../../nurse/repositories/nurseStudentsRepository';

export const getStudentHealthHistory = async (studentId, query = {}) => {
  return nurseStudentsRepository.getStudentHealthHistory(studentId, query);
};
