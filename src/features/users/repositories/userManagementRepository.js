import {
  apiGetEnvelope,
  apiPatchEnvelope,
  apiPostEnvelope,
} from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import {
  createUserMock,
  getUserByIdMock,
  getUsersMock,
  resetUserPasswordMock,
  updateUserMock,
  updateUserStatusMock,
} from '../mocks/userManagementMock';
import { USER_ENDPOINTS } from '../constants/userApiContract';

const STAFF_ROLES = new Set(['ADMIN', 'NURSE']);
const STAFF_SCOPE_SERVER_PAGE_SIZE = 100;

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const normalizeText = (value) => {
  const normalized = String(value ?? '').trim();
  return normalized.length ? normalized : undefined;
};

const extractRows = (envelope) => {
  if (Array.isArray(envelope?.data)) {
    return envelope.data;
  }

  if (Array.isArray(envelope?.data?.users)) {
    return envelope.data.users;
  }

  if (Array.isArray(envelope?.data?.items)) {
    return envelope.data.items;
  }

  return [];
};

const buildBaseQuery = (query = {}) => ({
  keyword: normalizeText(query.keyword),
  status: normalizeText(query.status),
});

const getStaffScopedUsersLive = async (query = {}) => {
  const requestedPage = toPositiveInt(query.page, 1);
  const requestedPageSize = toPositiveInt(query.pageSize, 10);
  const baseQuery = buildBaseQuery(query);

  let serverPage = 1;
  let serverTotalPages = 1;
  let lastEnvelope = null;
  const staffRows = [];

  while (serverPage <= serverTotalPages) {
    const envelope = await apiGetEnvelope(USER_ENDPOINTS.list, {
      params: {
        ...baseQuery,
        page: serverPage,
        pageSize: STAFF_SCOPE_SERVER_PAGE_SIZE,
      },
    });

    lastEnvelope = envelope;
    extractRows(envelope).forEach((item) => {
      if (STAFF_ROLES.has(item?.role)) {
        staffRows.push(item);
      }
    });

    serverTotalPages = toPositiveInt(envelope?.meta?.totalPages, serverPage);
    serverPage += 1;
  }

  const totalItems = staffRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / requestedPageSize));
  const safePage = Math.min(requestedPage, totalPages);
  const offset = (safePage - 1) * requestedPageSize;

  return {
    ...(lastEnvelope || {}),
    success: true,
    data: staffRows.slice(offset, offset + requestedPageSize),
    meta: {
      ...(lastEnvelope?.meta || {}),
      page: safePage,
      pageSize: requestedPageSize,
      totalItems,
      totalPages,
    },
  };
};

const getUsersLive = async (query = {}) => {
  const role = normalizeText(query.role);

  if (!role || role === 'all') {
    return getStaffScopedUsersLive(query);
  }

  return apiGetEnvelope(USER_ENDPOINTS.list, {
    params: {
      ...buildBaseQuery(query),
      role,
      page: toPositiveInt(query.page, 1),
      pageSize: toPositiveInt(query.pageSize, 10),
    },
  });
};

const getUsersMockSource = async (query = {}) => {
  await waitForMock('users');
  return getUsersMock(query);
};

const getUserByIdLive = async (userId) => apiGetEnvelope(USER_ENDPOINTS.detail(userId));
const getUserByIdMockSource = async (userId) => {
  await waitForMock('users');
  return getUserByIdMock(userId);
};

const logCreateFailure = (scope, error) => {
  const response = error?.response;
  if (!response) {
    console.error(`[${scope}] Network error`, error);
    return;
  }

  console.error(`[${scope}] Response`, {
    status: response.status,
    message: response.data?.message || response.data?.title || error.message,
    errors: response.data?.errors || null,
    data: response.data,
  });
};

const createUserLive = async (payload) => {
  console.debug('[Admin Users] POST /api/v1/users payload', payload);

  try {
    return await apiPostEnvelope(USER_ENDPOINTS.list, payload);
  } catch (error) {
    logCreateFailure('Admin Users create', error);
    throw error;
  }
};
const createUserMockSource = async (payload) => {
  await waitForMock('users');
  return createUserMock(payload);
};

const updateUserLive = async (userId, payload) => apiPatchEnvelope(USER_ENDPOINTS.detail(userId), payload);
const updateUserMockSource = async (userId, payload) => {
  await waitForMock('users');
  return updateUserMock(userId, payload);
};

const toggleUserStatusLive = async (userId, payload) => apiPatchEnvelope(USER_ENDPOINTS.status(userId), payload);
const toggleUserStatusMockSource = async (userId, payload) => {
  await waitForMock('users');
  return updateUserStatusMock(userId, payload);
};

const resetUserPasswordLive = async (userId, payload) => apiPostEnvelope(USER_ENDPOINTS.resetPassword(userId), payload);
const resetUserPasswordMockSource = async (userId, payload) => {
  await waitForMock('users');
  return resetUserPasswordMock(userId, payload);
};

const isMockSource = () => resolveModuleDataSource(DATA_MODULES.ADMIN_USERS) === 'mock';

export const userManagementRepository = {
  getUsers: async (query = {}) => {
    return isMockSource() ? getUsersMockSource(query) : getUsersLive(query);
  },
  getUserById: async (userId) => {
    return isMockSource() ? getUserByIdMockSource(userId) : getUserByIdLive(userId);
  },
  createUser: async (payload) => {
    return createUserLive(payload);
  },
  updateUser: async (userId, payload) => {
    return isMockSource() ? updateUserMockSource(userId, payload) : updateUserLive(userId, payload);
  },
  toggleUserStatus: async (userId, payload) => {
    return isMockSource() ? toggleUserStatusMockSource(userId, payload) : toggleUserStatusLive(userId, payload);
  },
  resetUserPassword: async (userId, payload) => {
    return isMockSource() ? resetUserPasswordMockSource(userId, payload) : resetUserPasswordLive(userId, payload);
  },
};
