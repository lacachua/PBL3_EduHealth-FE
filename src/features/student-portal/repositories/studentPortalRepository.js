import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { currentUserRepository, normalizeCurrentUser } from '../../account/repositories/currentUserRepository';
import {
  changeStudentPasswordMock,
  getStudentAccountMock,
  getStudentCareHistoryMock,
  getStudentIdentityMock,
  getStudentOverviewMock,
  getStudentVaccinationsMock,
  updateStudentAccountMock,
  uploadStudentAvatarMock,
} from '../mocks/studentPortalMock';

const isCurrentUserMockSource = () => resolveModuleDataSource(DATA_MODULES.CURRENT_USER_ACCOUNT) === 'mock';

const ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  NURSE: 'Nhân viên y tế',
  STUDENT: 'Học sinh',
};

// Read endpoints for student portal are pending backend delivery.
// Keep these definitions centralized so BE integration later only updates this object
// and the read methods below in this repository.
export const STUDENT_PORTAL_READ_API_PENDING = Object.freeze({
  identity: 'GET /api/v1/student/me/identity',
  overview: 'GET /api/v1/student/me/overview',
  careHistory: 'GET /api/v1/student/me/care-history',
  vaccinations: 'GET /api/v1/student/me/vaccinations',
  account: 'GET /api/v1/student/me/account',
});

const safeGetCurrentUser = async () => {
  try {
    return await currentUserRepository.getCurrentUser();
  } catch {
    return null;
  }
};

const toStatusLabel = (isActive) => {
  return isActive ? 'Đang hoạt động' : 'Tạm khóa';
};

const toRoleLabel = (roleCode, fallback = '') => {
  if (fallback) {
    return fallback;
  }

  const normalized = String(roleCode || '').toUpperCase();
  return ROLE_LABELS[normalized] || 'Người dùng hệ thống';
};

const mergeAccountData = (mockAccount, currentUser) => {
  const baseAccount = mockAccount || {};

  if (!currentUser) {
    return {
      ...baseAccount,
      studentCode: baseAccount.studentCode || '--',
      className: baseAccount.className || '--',
      username: baseAccount.username || 'student',
      roleLabel: toRoleLabel(baseAccount.role, baseAccount.roleLabel),
      statusLabel: toStatusLabel(baseAccount.isActive),
    };
  }

  const normalizedRole = String(currentUser.role || baseAccount.role || 'STUDENT').toUpperCase();
  const isActive = typeof currentUser.isActive === 'boolean'
    ? currentUser.isActive
    : Boolean(baseAccount.isActive);

  return {
    ...baseAccount,
    userId: currentUser.userId || baseAccount.userId,
    fullName: currentUser.fullName || baseAccount.fullName,
    email: currentUser.email || baseAccount.email,
    phone: currentUser.phone || baseAccount.phone,
    avatar: currentUser.avatar || baseAccount.avatar,
    username: baseAccount.username || (currentUser.email ? currentUser.email.split('@')[0] : 'student'),
    studentCode: baseAccount.studentCode || '--',
    className: baseAccount.className || '--',
    role: normalizedRole,
    roleLabel: toRoleLabel(normalizedRole, currentUser.roleLabel || baseAccount.roleLabel),
    isActive,
    statusLabel: toStatusLabel(isActive),
  };
};

const mergeStudentIdentity = (identity, account) => {
  return {
    ...identity,
    fullName: account?.fullName || identity?.fullName,
    avatar: account?.avatar || identity?.avatar,
    studentCode: account?.studentCode || identity?.studentCode,
    className: account?.className || identity?.className,
  };
};

const buildCapabilities = () => ({
  canUpdateProfile: true,
  canChangePassword: true,
  canUploadAvatar: isCurrentUserMockSource(),
  canViewHealthProfile: false,
  canViewHealthHistory: false,
  canViewVaccinations: false,
});

const withCapabilities = (payload) => ({
  ...payload,
  capabilities: buildCapabilities(),
});

const toProfilePayload = (payload) => ({
  fullName: String(payload?.fullName || '').trim(),
  phone: String(payload?.phone || '').trim(),
});

const normalizeUpdatedCurrentUser = (payload) => {
  const source = payload && typeof payload === 'object' && 'data' in payload
    ? payload.data
    : payload;

  return normalizeCurrentUser(source);
};

const createPendingFeatureError = (featureName, message) => {
  const error = new Error(message);
  error.name = 'PendingBackendError';
  error.code = 'PENDING_BACKEND';
  error.featureName = featureName;
  return error;
};

export const studentPortalRepository = {
  async getIdentity() {
    const [identityEnvelope, currentUser] = await Promise.all([
      getStudentIdentityMock(),
      safeGetCurrentUser(),
    ]);

    const accountSeed = mergeAccountData({}, currentUser);
    const identity = mergeStudentIdentity(identityEnvelope.data, accountSeed);

    return {
      ...identityEnvelope,
      data: identity,
    };
  },

  async getOverview() {
    const [overviewEnvelope, currentUser] = await Promise.all([
      getStudentOverviewMock(),
      safeGetCurrentUser(),
    ]);

    const mergedAccount = withCapabilities(mergeAccountData(overviewEnvelope.data?.account || {}, currentUser));
    const mergedStudent = mergeStudentIdentity(overviewEnvelope.data?.student || {}, mergedAccount);

    return {
      ...overviewEnvelope,
      data: {
        ...overviewEnvelope.data,
        account: mergedAccount,
        student: mergedStudent,
        healthProfile: {
          ...overviewEnvelope.data?.healthProfile,
          fullName: mergedStudent.fullName,
          studentCode: mergedStudent.studentCode,
          className: mergedStudent.className,
        },
      },
    };
  },

  async getCareHistory() {
    const [careEnvelope, currentUser] = await Promise.all([
      getStudentCareHistoryMock(),
      safeGetCurrentUser(),
    ]);

    const mergedAccount = mergeAccountData({}, currentUser);

    return {
      ...careEnvelope,
      data: {
        ...careEnvelope.data,
        student: mergeStudentIdentity(careEnvelope.data?.student || {}, mergedAccount),
      },
    };
  },

  async getVaccinations() {
    const [vaccinationEnvelope, currentUser] = await Promise.all([
      getStudentVaccinationsMock(),
      safeGetCurrentUser(),
    ]);

    const mergedAccount = mergeAccountData({}, currentUser);

    return {
      ...vaccinationEnvelope,
      data: {
        ...vaccinationEnvelope.data,
        student: mergeStudentIdentity(vaccinationEnvelope.data?.student || {}, mergedAccount),
      },
    };
  },

  async getAccount() {
    const [mockEnvelope, currentUser] = await Promise.all([
      getStudentAccountMock(),
      safeGetCurrentUser(),
    ]);

    return {
      ...mockEnvelope,
      data: withCapabilities(mergeAccountData(mockEnvelope.data, currentUser)),
    };
  },

  async updateAccountProfile(payload) {
    const profilePayload = toProfilePayload(payload);

    if (isCurrentUserMockSource()) {
      const mockResponse = await updateStudentAccountMock(profilePayload);
      return {
        ...mockResponse,
        data: withCapabilities(mockResponse.data),
      };
    }

    const updatedCurrentUser = await currentUserRepository.updateCurrentUserProfile(profilePayload);
    const normalizedCurrentUser = normalizeUpdatedCurrentUser(updatedCurrentUser);

    return {
      success: true,
      message: 'Cập nhật thông tin tài khoản thành công.',
      data: withCapabilities(mergeAccountData({}, normalizedCurrentUser)),
      errors: null,
      meta: { source: 'live' },
    };
  },

  async uploadAccountAvatar(avatarFile) {
    if (!isCurrentUserMockSource()) {
      throw createPendingFeatureError(
        'uploadCurrentUserAvatar',
        'Chức năng cập nhật ảnh đại diện chưa được backend hỗ trợ cho tài khoản học sinh.',
      );
    }

    const mockResponse = await uploadStudentAvatarMock(avatarFile);

    return {
      ...mockResponse,
      data: withCapabilities(mockResponse.data),
    };
  },

  async changePassword(payload) {
    if (isCurrentUserMockSource()) {
      return changeStudentPasswordMock(payload);
    }

    return currentUserRepository.changeCurrentUserPassword(payload);
  },
};