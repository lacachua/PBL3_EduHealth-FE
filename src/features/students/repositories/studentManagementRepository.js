import {
  apiDeleteEnvelope,
  apiGetEnvelope,
  apiPatchEnvelope,
  apiPostEnvelope,
} from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import { normalizeStudentListQuery } from '../adapters/studentManagementPayloadMapper';
import {
  getStudentHealthProfileMockEnvelope,
  getStudentManagementDetailMockEnvelope,
  getStudentManagementMockEnvelope,
} from '../mocks/studentManagementMock';
import { STUDENT_ENDPOINTS } from '../schemas/studentManagementSchema';

const resolveMockSource = ({ moduleKey, forceMock }) => {
  if (typeof forceMock === 'boolean') {
    return forceMock;
  }

  const resolvedModule = moduleKey || DATA_MODULES.ADMIN_STUDENTS;
  return resolveModuleDataSource(resolvedModule) === 'mock';
};

const buildMockSuccessEnvelope = (message, data) => ({
  success: true,
  message,
  data,
  errors: null,
  meta: { source: 'mock' },
});

const getListLive = async (query = {}) => {
  const normalizedQuery = normalizeStudentListQuery(query);
  return apiGetEnvelope(STUDENT_ENDPOINTS.list, { params: normalizedQuery });
};

const getListMock = async (query = {}) => {
  await waitForMock();
  return getStudentManagementMockEnvelope(query);
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

const createLive = async (payload) => {
  console.debug('[Admin Students] POST /api/v1/students payload', payload);

  try {
    return await apiPostEnvelope(STUDENT_ENDPOINTS.list, payload);
  } catch (error) {
    logCreateFailure('Admin Students create', error);
    throw error;
  }
};
const createMock = async (payload) => {
  await waitForMock();
  return buildMockSuccessEnvelope('Tạo học sinh thành công', { student: payload });
};

const updateLive = async (studentId, payload) => apiPatchEnvelope(STUDENT_ENDPOINTS.detail(studentId), payload);
const updateMock = async (studentId, payload) => {
  await waitForMock();
  return buildMockSuccessEnvelope('Cập nhật học sinh thành công', { studentId, ...payload });
};

const getDetailLive = async (studentId) => apiGetEnvelope(STUDENT_ENDPOINTS.detail(studentId));
const getDetailMock = async (studentId) => {
  await waitForMock();
  return getStudentManagementDetailMockEnvelope(studentId);
};

const getHealthProfileLive = async (studentId) => apiGetEnvelope(STUDENT_ENDPOINTS.healthProfile(studentId));
const getHealthProfileMock = async (studentId) => {
  await waitForMock();
  return getStudentHealthProfileMockEnvelope(studentId);
};

const updateHealthProfileLive = async (studentId, payload) => apiPatchEnvelope(STUDENT_ENDPOINTS.healthProfile(studentId), payload);
const updateHealthProfileMock = async (studentId, payload) => {
  await waitForMock();
  return buildMockSuccessEnvelope('Cập nhật hồ sơ sức khỏe thành công', { studentId, ...payload });
};

const deleteLive = async (studentId) => apiDeleteEnvelope(STUDENT_ENDPOINTS.detail(studentId));
const deleteMock = async (studentId) => {
  await waitForMock();
  return buildMockSuccessEnvelope('Xóa học sinh thành công', { studentId });
};

export const studentManagementRepository = {
  getList: async (query = {}, options = {}) => {
    const isMock = resolveMockSource({
      moduleKey: options.moduleKey,
      forceMock: options.mockEnabled,
    });

    return isMock ? getListMock(query) : getListLive(query);
  },
  create: async (payload, options = {}) => {
    return createLive(payload);
  },
  update: async (studentId, payload, options = {}) => {
    const isMock = resolveMockSource({
      moduleKey: options.moduleKey || DATA_MODULES.ADMIN_STUDENTS,
      forceMock: options.mockEnabled,
    });

    return isMock ? updateMock(studentId, payload) : updateLive(studentId, payload);
  },
  getDetail: async (studentId, options = {}) => {
    const isMock = resolveMockSource({
      moduleKey: options.moduleKey || DATA_MODULES.ADMIN_STUDENTS,
      forceMock: options.mockEnabled,
    });

    return isMock ? getDetailMock(studentId) : getDetailLive(studentId);
  },
  getHealthProfile: async (studentId, options = {}) => {
    const isMock = resolveMockSource({
      moduleKey: options.moduleKey || DATA_MODULES.ADMIN_STUDENTS,
      forceMock: options.mockEnabled,
    });

    return isMock ? getHealthProfileMock(studentId) : getHealthProfileLive(studentId);
  },
  updateHealthProfile: async (studentId, payload, options = {}) => {
    const isMock = resolveMockSource({
      moduleKey: options.moduleKey || DATA_MODULES.ADMIN_STUDENTS,
      forceMock: options.mockEnabled,
    });

    return isMock ? updateHealthProfileMock(studentId, payload) : updateHealthProfileLive(studentId, payload);
  },
  remove: async (studentId, options = {}) => {
    const isMock = resolveMockSource({
      moduleKey: options.moduleKey || DATA_MODULES.ADMIN_STUDENTS,
      forceMock: options.mockEnabled,
    });

    return isMock ? deleteMock(studentId) : deleteLive(studentId);
  },
};
