import {
  apiGetEnvelope,
  apiPatchEnvelope,
  apiPostEnvelope,
} from '../../../shared/api/apiClient';
import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';
import {
  createUserMock,
  getUserByIdMock,
  getUserManagementMockEnvelope,
  resetUserPasswordMock,
  toggleUserStatusMock,
  updateUserMock,
} from '../mocks/userManagementMock';
import { USER_ENDPOINTS } from '../schemas/userManagementSchema';

const isMockEnabled = runtimeConfig.enableMockAdminDashboard;

export const getUsers = async (query = {}) => {
  if (isMockEnabled) {
    await waitForMock('users');
    return getUserManagementMockEnvelope(query);
  }

  return apiGetEnvelope(USER_ENDPOINTS.list, { params: query });
};

export const getUserById = async (userId) => {
  if (isMockEnabled) {
    await waitForMock();
    return getUserByIdMock(userId);
  }

  return apiGetEnvelope(USER_ENDPOINTS.detail(userId));
};

export const createUser = async (payload) => {
  if (isMockEnabled) {
    await waitForMock('users');
    return createUserMock(payload);
  }

  return apiPostEnvelope(USER_ENDPOINTS.list, payload);
};

export const updateUser = async (userId, payload) => {
  if (isMockEnabled) {
    await waitForMock('users');
    return updateUserMock(userId, payload);
  }

  return apiPatchEnvelope(USER_ENDPOINTS.detail(userId), payload);
};

export const toggleUserStatus = async (userId, payload) => {
  if (isMockEnabled) {
    await waitForMock('users');
    return toggleUserStatusMock(userId, payload);
  }

  return apiPatchEnvelope(USER_ENDPOINTS.status(userId), payload);
};

export const resetUserPassword = async (userId, payload) => {
  if (isMockEnabled) {
    await waitForMock('users');
    return resetUserPasswordMock(userId, payload);
  }

  return apiPostEnvelope(USER_ENDPOINTS.resetPassword(userId), payload);
};

// Keep aliases for existing imports in other modules.
export const getUserListApi = getUsers;
export const getUserByIdApi = getUserById;
export const createUserApi = createUser;
export const updateUserApi = updateUser;
export const toggleUserStatusApi = toggleUserStatus;
export const resetUserPasswordApi = resetUserPassword;
