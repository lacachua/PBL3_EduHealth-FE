import { userManagementRepository } from '../repositories/userManagementRepository';

export const getUsers = async (query = {}) => {
  return userManagementRepository.getUsers(query);
};

export const getUserById = async (userId) => {
  return userManagementRepository.getUserById(userId);
};

export const createUser = async (payload) => {
  return userManagementRepository.createUser(payload);
};

export const updateUser = async (userId, payload) => {
  return userManagementRepository.updateUser(userId, payload);
};

export const toggleUserStatus = async (userId, payload) => {
  return userManagementRepository.toggleUserStatus(userId, payload);
};

export const resetUserPassword = async (userId, payload) => {
  return userManagementRepository.resetUserPassword(userId, payload);
};

// Keep aliases for existing imports in other modules.
export const getUserListApi = getUsers;
export const getUserByIdApi = getUserById;
export const createUserApi = createUser;
export const updateUserApi = updateUser;
export const toggleUserStatusApi = toggleUserStatus;
export const resetUserPasswordApi = resetUserPassword;
