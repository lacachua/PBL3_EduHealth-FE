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
  const student = source.student && typeof source.student === 'object'
    ? source.student
    : source.studentProfile && typeof source.studentProfile === 'object'
      ? source.studentProfile
      : source.profile && typeof source.profile === 'object'
        ? source.profile
        : {};
  const healthProfile = source.healthProfile && typeof source.healthProfile === 'object'
    ? source.healthProfile
    : student.healthProfile && typeof student.healthProfile === 'object'
      ? student.healthProfile
      : {};
  const guardian = source.guardian && typeof source.guardian === 'object'
    ? source.guardian
    : student.guardian && typeof student.guardian === 'object'
      ? student.guardian
      : {};

  const roleCode = resolveRoleCode(source.role || source.roleCode || source.accountType);
  const fullName = toStringOrEmpty(source.fullName || student.fullName || source.name || source.displayName);

  return {
    userId: toStringOrEmpty(source.userId || source.id || source.userID),
    fullName,
    email: toStringOrEmpty(source.email),
    phone: toStringOrEmpty(source.phone || source.phoneNumber),
    username: toStringOrEmpty(source.username || source.userName),
    role: roleCode,
    roleLabel: resolveRoleLabel(roleCode),
    isActive: toBoolean(source.isActive ?? source.active ?? source.status, true),
    avatar: toStringOrEmpty(source.avatar || source.avatarUrl || source.profileImageUrl),
    studentId: toStringOrEmpty(source.studentId || student.studentId || student.id),
    studentCode: toStringOrEmpty(source.studentCode || student.studentCode || student.code),
    classId: toStringOrEmpty(source.classId || student.classId || student.class?.id),
    className: toStringOrEmpty(source.className || student.className || student.class?.name),
    gender: toStringOrEmpty(source.gender || student.gender || student.sex),
    dateOfBirth: toStringOrEmpty(source.dateOfBirth || student.dateOfBirth || student.dob),
    guardian: toStringOrEmpty(
      (typeof source.guardian === 'string' ? source.guardian : '')
      || (typeof student.guardian === 'string' ? student.guardian : '')
      || source.guardianName
      || student.guardianName
      || guardian.fullName
      || guardian.name,
    ),
    guardianPhone: toStringOrEmpty(
      source.guardianPhone
      || student.guardianPhone
      || guardian.phone
      || guardian.phoneNumber,
    ),
    currentHeight: source.currentHeight
      ?? student.currentHeight
      ?? healthProfile.heightCm
      ?? healthProfile.currentHeight
      ?? null,
    currentWeight: source.currentWeight
      ?? student.currentWeight
      ?? healthProfile.weightKg
      ?? healthProfile.currentWeight
      ?? null,
    medicalHistoryNotes: toStringOrEmpty(
      source.medicalHistoryNotes
      || student.medicalHistoryNotes
      || healthProfile.medicalHistoryNotes
      || healthProfile.generalHealthNote
      || healthProfile.chronicNote,
    ),
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
