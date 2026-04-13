import { apiGetData, apiPostData } from '../../../shared/api/apiClient';

export const CURRENT_USER_API_ENDPOINTS = Object.freeze({
  me: '/api/v1/auth/me',
  changePassword: '/api/v1/auth/change-password',
});

export const createPendingBackendError = (featureName) => {
  const error = new Error(`PENDING_BACKEND:${featureName}`);
  error.name = 'PendingBackendError';
  error.code = 'PENDING_BACKEND';
  error.featureName = featureName;
  return error;
};

export const getCurrentUserRequest = async () => {
  return apiGetData(CURRENT_USER_API_ENDPOINTS.me);
};

export const changeCurrentUserPasswordRequest = async (payload) => {
  return apiPostData(CURRENT_USER_API_ENDPOINTS.changePassword, payload);
};

export const updateCurrentUserProfileRequest = async () => {
  throw createPendingBackendError('updateCurrentUserProfile');
};

export const uploadCurrentUserAvatarRequest = async () => {
  throw createPendingBackendError('uploadCurrentUserAvatar');
};
