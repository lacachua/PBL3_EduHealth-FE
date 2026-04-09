import { nurseStudentsRepository } from '../../nurse/repositories/nurseStudentsRepository';

export const getStudents = async (query = {}) => {
  return nurseStudentsRepository.getStudentsLookup(query);
};
