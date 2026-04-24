import { systemLogsRepository } from '../repositories/systemLogsRepository';

export const getSystemLogsApi = async (query = {}) => {
  return systemLogsRepository.getList(query);
};

export const getSystemLogDetailApi = async (logId) => {
  return systemLogsRepository.getDetail(logId);
};
