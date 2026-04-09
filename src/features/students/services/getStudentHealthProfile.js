import { nurseStudentsRepository } from '../../nurse/repositories/nurseStudentsRepository';

export const getStudentHealthProfile = async (studentId) => {
  return nurseStudentsRepository.getStudentHealthProfile(studentId);
};
