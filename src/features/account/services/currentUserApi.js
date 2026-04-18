import {
  apiGetData,
  apiPatchData,
  apiPatchEnvelope,
  apiPostData,
} from '../../../shared/api/apiClient';

export const CURRENT_USER_API_ENDPOINTS = Object.freeze({
  me: '/api/v1/auth/me',
  meAvatar: '/api/v1/auth/me/avatar',
  changePassword: '/api/v1/auth/change-password',
});

const createAvatarPayloadError = () => {
  const error = new Error('Vui lòng chọn ảnh đại diện hợp lệ.');
  error.name = 'AvatarPayloadError';
  error.code = 'INVALID_AVATAR_PAYLOAD';
  return error;
};

const toAvatarFormData = (payload) => {
  let avatarFile = null;

  if (payload instanceof FormData) {
    const candidate = payload.get('file') || payload.get('avatar');
    if (candidate instanceof File) {
      avatarFile = candidate;
    }
  } else if (payload instanceof File) {
    avatarFile = payload;
  }

  if (!avatarFile) {
    return null;
  }

  const formData = new FormData();
  // Keep both keys for compatibility between existing FE mock and BE DTO binding.
  formData.append('avatar', avatarFile);
  formData.append('file', avatarFile);
  return formData;
};

export const getCurrentUserRequest = async () => {
  return apiGetData(CURRENT_USER_API_ENDPOINTS.me);
};

export const changeCurrentUserPasswordRequest = async (payload) => {
  return apiPostData(CURRENT_USER_API_ENDPOINTS.changePassword, payload);
};

export const updateCurrentUserProfileRequest = async (payload) => {
  return apiPatchData(CURRENT_USER_API_ENDPOINTS.me, payload);
};

export const uploadCurrentUserAvatarRequest = async (payload) => {
  const formData = toAvatarFormData(payload);

  if (!formData) {
    throw createAvatarPayloadError();
  }

  return apiPatchEnvelope(CURRENT_USER_API_ENDPOINTS.meAvatar, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
