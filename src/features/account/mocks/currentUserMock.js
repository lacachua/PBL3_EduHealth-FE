import { mockAuthAccounts } from '../../auth/constants/mockAuthAccounts';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import { getStoredUser } from '../../../shared/services/tokenClient';

const normalizeIdentifier = (value) => String(value || '').trim().toLowerCase();
const normalizeRole = (value) => String(value || '').trim().toUpperCase();

const ROLE_ENRICHMENTS = {
  ADMIN: {
    userId: 'ADMIN-MOCK-001',
    phone: '0901000111',
    isActive: true,
    avatar: '',
  },
  NURSE: {
    userId: 'NURSE-MOCK-001',
    phone: '0902000222',
    isActive: true,
    avatar: '',
  },
  STUDENT: {
    userId: 'STUDENT-MOCK-001',
    phone: '',
    isActive: true,
    avatar: '',
  },
};

const mockPasswordByIdentifier = new Map(
  mockAuthAccounts.map((account) => [normalizeIdentifier(account.identifier), account.password])
);
const mockProfileOverridesByIdentifier = new Map();

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh đã chọn.'));
    reader.readAsDataURL(file);
  });
};

const createMockApiError = ({ message, status = 400, errors, field }) => {
  const error = new Error(message || 'Mock request failed');
  error.response = {
    status,
    data: {
      message,
      errors,
      field,
    },
  };

  return error;
};

const resolveCurrentMockAccount = () => {
  const storedUser = getStoredUser() || {};
  const storedEmail = normalizeIdentifier(storedUser.email || storedUser.identifier);
  const storedRole = normalizeRole(storedUser.role);

  let matched = null;

  if (storedEmail) {
    matched = mockAuthAccounts.find((account) => normalizeIdentifier(account.identifier) === storedEmail) || null;
  }

  if (!matched && storedRole) {
    matched = mockAuthAccounts.find((account) => normalizeRole(account.role) === storedRole) || null;
  }

  if (!matched) {
    matched = mockAuthAccounts[0] || null;
  }

  return {
    storedUser,
    matched,
  };
};

const buildMockCurrentUser = () => {
  const { storedUser, matched } = resolveCurrentMockAccount();
  const identifier = normalizeIdentifier(storedUser.email || matched?.identifier);
  const profileOverride = identifier ? mockProfileOverridesByIdentifier.get(identifier) : null;

  const role = normalizeRole(storedUser.role || matched?.role || 'NURSE');
  const roleDefaults = ROLE_ENRICHMENTS[role] || ROLE_ENRICHMENTS.NURSE;

  return {
    userId: String(storedUser.userId || storedUser.id || roleDefaults.userId),
    fullName: String(profileOverride?.fullName || storedUser.fullName || storedUser.name || matched?.fullName || 'Người dùng EduHealth'),
    email: String(storedUser.email || matched?.identifier || ''),
    phone: String(profileOverride?.phone || storedUser.phone || storedUser.phoneNumber || roleDefaults.phone || ''),
    role,
    isActive: typeof storedUser.isActive === 'boolean' ? storedUser.isActive : roleDefaults.isActive,
    avatar: String(profileOverride?.avatar || storedUser.avatar || storedUser.avatarUrl || roleDefaults.avatar || ''),
  };
};

export const getCurrentUserMock = async () => {
  await waitForMock('auth');
  return buildMockCurrentUser();
};

const validatePasswordPayload = ({ oldPassword, newPassword, confirmPassword }) => {
  const errors = {};

  if (!oldPassword) {
    errors.oldPassword = ['Mật khẩu hiện tại là bắt buộc.'];
  }

  if (!newPassword) {
    errors.newPassword = ['Mật khẩu mới là bắt buộc.'];
  } else {
    if (newPassword.length < 8) {
      errors.newPassword = ['Mật khẩu mới phải có ít nhất 8 ký tự.'];
    } else if (oldPassword && oldPassword === newPassword) {
      errors.newPassword = ['Mật khẩu mới phải khác mật khẩu hiện tại.'];
    }
  }

  if (!confirmPassword) {
    errors.confirmPassword = ['Vui lòng xác nhận mật khẩu mới.'];
  } else if (newPassword && confirmPassword !== newPassword) {
    errors.confirmPassword = ['Xác nhận mật khẩu chưa khớp.'];
  }

  return errors;
};

export const changeCurrentUserPasswordMock = async ({ oldPassword, newPassword, confirmPassword }) => {
  await waitForMock('auth');

  const fieldErrors = validatePasswordPayload({ oldPassword, newPassword, confirmPassword });
  if (Object.keys(fieldErrors).length > 0) {
    throw createMockApiError({
      status: 400,
      message: 'Dữ liệu đổi mật khẩu chưa hợp lệ.',
      errors: fieldErrors,
    });
  }

  const { storedUser, matched } = resolveCurrentMockAccount();
  const identifier = normalizeIdentifier(storedUser.email || matched?.identifier);

  if (!identifier) {
    throw createMockApiError({
      status: 401,
      message: 'Không xác định được tài khoản hiện tại.',
    });
  }

  const currentPassword = mockPasswordByIdentifier.get(identifier) || matched?.password;

  if (!currentPassword || oldPassword !== currentPassword) {
    throw createMockApiError({
      status: 400,
      message: 'Mật khẩu hiện tại không chính xác.',
      errors: {
        oldPassword: ['Mật khẩu hiện tại không chính xác.'],
      },
      field: 'oldPassword',
    });
  }

  mockPasswordByIdentifier.set(identifier, newPassword);

  return {
    success: true,
    message: 'Đổi mật khẩu thành công (mock).',
  };
};

export const updateCurrentUserProfileMock = async ({ fullName, phone }) => {
  await waitForMock('auth');

  const nextName = String(fullName || '').trim();
  const nextPhone = String(phone || '').trim();

  const fieldErrors = {};
  if (!nextName) {
    fieldErrors.fullName = ['Họ và tên không được để trống.'];
  }

  if (nextPhone && !/^[0-9+\-\s]{9,15}$/.test(nextPhone)) {
    fieldErrors.phone = ['Số điện thoại không hợp lệ.'];
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw createMockApiError({
      status: 400,
      message: 'Thông tin hồ sơ chưa hợp lệ.',
      errors: fieldErrors,
    });
  }

  const { storedUser, matched } = resolveCurrentMockAccount();
  const identifier = normalizeIdentifier(storedUser.email || matched?.identifier);

  if (!identifier) {
    throw createMockApiError({
      status: 401,
      message: 'Không xác định được tài khoản hiện tại.',
    });
  }

  const previous = mockProfileOverridesByIdentifier.get(identifier) || {};
  mockProfileOverridesByIdentifier.set(identifier, {
    ...previous,
    fullName: nextName,
    phone: nextPhone,
  });

  return {
    success: true,
    message: 'Cập nhật thông tin thành công (mock).',
    data: buildMockCurrentUser(),
  };
};

export const uploadCurrentUserAvatarMock = async (payload) => {
  await waitForMock('auth');

  const { storedUser, matched } = resolveCurrentMockAccount();
  const identifier = normalizeIdentifier(storedUser.email || matched?.identifier);

  if (!identifier) {
    throw createMockApiError({
      status: 401,
      message: 'Không xác định được tài khoản hiện tại.',
    });
  }

  const avatarFile = payload instanceof FormData
    ? (payload.get('avatar') || payload.get('file'))
    : payload instanceof File
      ? payload
      : null;
  if (!(avatarFile instanceof File)) {
    throw createMockApiError({
      status: 400,
      message: 'Vui lòng chọn ảnh đại diện hợp lệ.',
      errors: {
        avatar: ['Vui lòng chọn ảnh đại diện hợp lệ.'],
      },
      field: 'avatar',
    });
  }

  if (!String(avatarFile.type || '').startsWith('image/')) {
    throw createMockApiError({
      status: 400,
      message: 'Tệp tải lên phải là ảnh.',
      errors: {
        avatar: ['Tệp tải lên phải là ảnh.'],
      },
      field: 'avatar',
    });
  }

  const avatarDataUrl = await fileToDataUrl(avatarFile);

  const previous = mockProfileOverridesByIdentifier.get(identifier) || {};
  mockProfileOverridesByIdentifier.set(identifier, {
    ...previous,
    avatar: avatarDataUrl,
  });

  return {
    success: true,
    message: 'Cập nhật ảnh đại diện thành công (mock).',
    data: buildMockCurrentUser(),
  };
};
