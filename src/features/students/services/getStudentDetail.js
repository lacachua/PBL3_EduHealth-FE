import { nurseStudentsRepository } from '../../nurse/repositories/nurseStudentsRepository';

export const getStudentDetail = async (studentId) => {
  return nurseStudentsRepository.getStudentDetail(studentId);
};
