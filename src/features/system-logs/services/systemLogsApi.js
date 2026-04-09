import { systemLogsRepository } from '../repositories/systemLogsRepository';

export const getSystemLogsApi = async (query = {}) => {
  return systemLogsRepository.getList(query);
};
