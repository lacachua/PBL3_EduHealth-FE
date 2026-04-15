import {
  changeCurrentUserPasswordRequest,
  getCurrentUserRequest,
  uploadCurrentUserAvatarRequest,
  updateCurrentUserProfileRequest,
} from '../services/currentUserApi';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import {
  changeCurrentUserPasswordMock,
  getCurrentUserMock,
  uploadCurrentUserAvatarMock,
  updateCurrentUserProfileMock,
} from '../mocks/currentUserMock';

const shouldUseMock = () => resolveModuleDataSource(DATA_MODULES.CURRENT_USER_ACCOUNT) === 'mock';

const ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  NURSE: 'Nhân viên y tế',
  STUDENT: 'Học sinh',
};

const toStringOrEmpty = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
};

const toBoolean = (value, fallback = true) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
    if (normalized === 'active') return true;
    if (normalized === 'inactive' || normalized === 'locked' || normalized === 'disabled') return false;
  }

  if (typeof value === 'number') {
    return value > 0;
  }

  return fallback;
};

const resolveRoleCode = (value) => {
  const roleCode = toStringOrEmpty(value).toUpperCase();
  return roleCode || 'NURSE';
};

const resolveRoleLabel = (roleCode) => {
  return ROLE_LABELS[roleCode] || 'Người dùng hệ thống';
};

export const normalizeCurrentUser = (payload) => {
  const source = payload?.user && typeof payload.user === 'object' ? payload.user : payload || {};

  const roleCode = resolveRoleCode(source.role || source.roleCode || source.accountType);
  const fullName = toStringOrEmpty(source.fullName || source.name || source.displayName);

  return {
    userId: toStringOrEmpty(source.userId || source.id || source.userID),
    fullName,
    email: toStringOrEmpty(source.email),
    phone: toStringOrEmpty(source.phone || source.phoneNumber),
    role: roleCode,
    roleLabel: resolveRoleLabel(roleCode),
    isActive: toBoolean(source.isActive ?? source.active ?? source.status, true),
    avatar: toStringOrEmpty(source.avatar || source.avatarUrl || source.profileImageUrl),
  };
};

export const currentUserRepository = {
  async getCurrentUser() {
    if (shouldUseMock()) {
      const mockData = await getCurrentUserMock();
      return normalizeCurrentUser(mockData);
    }

    const response = await getCurrentUserRequest();
    return normalizeCurrentUser(response);
  },

  async changeCurrentUserPassword(payload) {
    const requestBody = {
      oldPassword: toStringOrEmpty(payload?.oldPassword),
      newPassword: toStringOrEmpty(payload?.newPassword),
      confirmPassword: toStringOrEmpty(payload?.confirmPassword) || toStringOrEmpty(payload?.newPassword),
    };

    if (shouldUseMock()) {
      return changeCurrentUserPasswordMock(requestBody);
    }

    return changeCurrentUserPasswordRequest(requestBody);
  },

  async updateCurrentUserProfile(payload) {
    const requestBody = {
      fullName: toStringOrEmpty(payload?.fullName),
      phone: toStringOrEmpty(payload?.phone),
    };

    if (shouldUseMock()) {
      return updateCurrentUserProfileMock(requestBody);
    }

    return updateCurrentUserProfileRequest(requestBody);
  },

  async uploadCurrentUserAvatar(payload) {
    if (shouldUseMock()) {
      return uploadCurrentUserAvatarMock(payload);
    }

    return uploadCurrentUserAvatarRequest(payload);
  },
};
