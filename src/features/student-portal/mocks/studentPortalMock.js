import { waitForMock } from '../../../shared/config/runtimeConfig';
import { getStoredUser } from '../../../shared/services/tokenClient';
import { PHONE_REGEX } from '../../../shared/utils/phoneValidation';
import { validateChangePasswordForm } from '../../../shared/utils/passwordValidation';
import {
  STUDENT_PORTAL_ACCOUNT_BASE,
  STUDENT_PORTAL_CARE_HISTORY_BASE,
  STUDENT_PORTAL_IDENTITY_BASE,
  STUDENT_PORTAL_OVERVIEW_BASE,
  STUDENT_PORTAL_ROLE_LABELS,
  STUDENT_PORTAL_VACCINATIONS_BASE,
} from './studentPortalMockData';

const accountOverrides = {
  fullName: '',
  phone: '',
  avatar: '',
};

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const buildMockEnvelope = ({ data, message, meta = null }) => ({
  success: true,
  message,
  data,
  errors: null,
  meta,
});

const createMockApiError = ({ message, status = 400, field = null, errors = null, code = null }) => {
  const error = new Error(message || 'Mock request failed');
  error.name = 'ApiError';
  error.status = status;
  error.code = code || null;
  error.response = {
    status,
    data: {
      success: false,
      message,
      field,
      errors,
      data: null,
      meta: null,
    },
  };

  return error;
};

const resolveRoleLabel = (role) => {
  const normalized = String(role || '').trim().toUpperCase();
  return STUDENT_PORTAL_ROLE_LABELS[normalized] || 'Nguoi dung he thong';
};

const resolveStoredIdentity = () => {
  const storedUser = getStoredUser() || {};

  return {
    fullName: String(storedUser.fullName || storedUser.name || '').trim(),
    email: String(storedUser.email || '').trim(),
    phone: String(storedUser.phone || storedUser.phoneNumber || '').trim(),
    avatar: String(storedUser.avatar || storedUser.avatarUrl || '').trim(),
    role: String(storedUser.role || '').trim().toUpperCase(),
    studentCode: String(storedUser.studentCode || '').trim(),
    className: String(storedUser.className || '').trim(),
  };
};

const resolveAccountSnapshot = () => {
  const storedIdentity = resolveStoredIdentity();
  const role = storedIdentity.role || STUDENT_PORTAL_ACCOUNT_BASE.role;
  const email = storedIdentity.email || STUDENT_PORTAL_ACCOUNT_BASE.email;

  return {
    ...STUDENT_PORTAL_ACCOUNT_BASE,
    fullName: accountOverrides.fullName || storedIdentity.fullName || STUDENT_PORTAL_ACCOUNT_BASE.fullName,
    email,
    username: email ? email.split('@')[0] : STUDENT_PORTAL_ACCOUNT_BASE.username,
    phone: accountOverrides.phone || storedIdentity.phone || STUDENT_PORTAL_ACCOUNT_BASE.phone,
    avatar: accountOverrides.avatar || storedIdentity.avatar || STUDENT_PORTAL_ACCOUNT_BASE.avatar,
    role,
    roleLabel: resolveRoleLabel(role),
    studentCode: storedIdentity.studentCode || STUDENT_PORTAL_ACCOUNT_BASE.studentCode,
    className: storedIdentity.className || STUDENT_PORTAL_ACCOUNT_BASE.className,
  };
};

const resolveIdentitySnapshot = () => {
  const account = resolveAccountSnapshot();

  return {
    ...STUDENT_PORTAL_IDENTITY_BASE,
    fullName: account.fullName,
    studentCode: account.studentCode,
    className: account.className,
    avatar: account.avatar,
  };
};

const buildOverviewSnapshot = () => {
  return {
    ...deepClone(STUDENT_PORTAL_OVERVIEW_BASE),
    account: resolveAccountSnapshot(),
    student: resolveIdentitySnapshot(),
  };
};

const buildCareHistorySnapshot = () => {
  return {
    ...deepClone(STUDENT_PORTAL_CARE_HISTORY_BASE),
    student: resolveIdentitySnapshot(),
  };
};

const buildVaccinationsSnapshot = () => {
  return {
    ...deepClone(STUDENT_PORTAL_VACCINATIONS_BASE),
    student: resolveIdentitySnapshot(),
  };
};

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Khong the doc tep anh da chon.'));
    reader.readAsDataURL(file);
  });
};

export const getStudentIdentityMock = async () => {
  await waitForMock('studentPortal');

  return buildMockEnvelope({
    message: 'Lay thong tin hoc sinh thanh cong (mock).',
    data: resolveIdentitySnapshot(),
    meta: { source: 'mock' },
  });
};

export const getStudentOverviewMock = async () => {
  await waitForMock('studentPortal');

  return buildMockEnvelope({
    message: 'Lay du lieu tong quan thanh cong (mock).',
    data: buildOverviewSnapshot(),
    meta: { source: 'mock' },
  });
};

export const getStudentCareHistoryMock = async () => {
  await waitForMock('studentPortal');

  return buildMockEnvelope({
    message: 'Lay lich su cham soc thanh cong (mock).',
    data: buildCareHistorySnapshot(),
    meta: { source: 'mock' },
  });
};

export const getStudentVaccinationsMock = async () => {
  await waitForMock('studentPortal');

  return buildMockEnvelope({
    message: 'Lay du lieu tiem chung thanh cong (mock).',
    data: buildVaccinationsSnapshot(),
    meta: { source: 'mock' },
  });
};

export const getStudentAccountMock = async () => {
  await waitForMock('studentPortal');

  return buildMockEnvelope({
    message: 'Lay tai khoan hoc sinh thanh cong (mock).',
    data: resolveAccountSnapshot(),
    meta: { source: 'mock' },
  });
};

export const updateStudentAccountMock = async (payload = {}) => {
  await waitForMock('studentPortal');

  const fullName = String(payload.fullName || '').trim();
  const phone = String(payload.phone || '').trim();

  const fieldErrors = {};

  if (!fullName) {
    fieldErrors.fullName = ['Ho va ten khong duoc de trong.'];
  }

  if (phone && !PHONE_REGEX.test(phone)) {
    fieldErrors.phone = ['So dien thoai khong hop le.'];
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw createMockApiError({
      message: 'Thong tin tai khoan chua hop le.',
      errors: fieldErrors,
    });
  }

  accountOverrides.fullName = fullName;
  accountOverrides.phone = phone;

  return buildMockEnvelope({
    message: 'Cap nhat thong tin tai khoan thanh cong (mock).',
    data: resolveAccountSnapshot(),
    meta: { source: 'mock' },
  });
};

export const uploadStudentAvatarMock = async (avatarFile) => {
  await waitForMock('studentPortal');

  if (!(avatarFile instanceof File)) {
    throw createMockApiError({
      message: 'Vui long chon anh dai dien hop le.',
      field: 'avatar',
      errors: {
        avatar: ['Vui long chon anh dai dien hop le.'],
      },
    });
  }

  if (!String(avatarFile.type || '').startsWith('image/')) {
    throw createMockApiError({
      message: 'Tep tai len phai la anh.',
      field: 'avatar',
      errors: {
        avatar: ['Tep tai len phai la anh.'],
      },
    });
  }

  if (avatarFile.size > 5 * 1024 * 1024) {
    throw createMockApiError({
      message: 'Anh dai dien khong duoc vuot qua 5MB.',
      field: 'avatar',
      errors: {
        avatar: ['Anh dai dien khong duoc vuot qua 5MB.'],
      },
    });
  }

  accountOverrides.avatar = await fileToDataUrl(avatarFile);

  return buildMockEnvelope({
    message: 'Cap nhat anh dai dien thanh cong (mock).',
    data: resolveAccountSnapshot(),
    meta: { source: 'mock' },
  });
};

export const changeStudentPasswordMock = async (payload = {}) => {
  await waitForMock('studentPortal');

  const fieldErrors = validateChangePasswordForm(payload);

  if (Object.keys(fieldErrors).length > 0) {
    throw createMockApiError({
      message: 'Thong tin doi mat khau chua hop le.',
      errors: fieldErrors,
    });
  }

  return buildMockEnvelope({
    message: 'Doi mat khau thanh cong (mock).',
    data: null,
    meta: { source: 'mock' },
  });
};
