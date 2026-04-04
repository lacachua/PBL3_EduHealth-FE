import {
  apiDeleteEnvelope,
  apiGetEnvelope,
  apiPatchEnvelope,
  apiPostEnvelope,
} from '../../../shared/api/apiClient';
import { runtimeConfig, waitForMock } from '../../../shared/config/runtimeConfig';
import {
  getStudentHealthProfileMockEnvelope,
  getStudentManagementDetailMockEnvelope,
  getStudentManagementMockEnvelope,
} from '../mocks/studentManagementMock';
import { normalizeStudentListQuery } from '../adapters/studentManagementPayloadMapper';
import { STUDENT_ENDPOINTS } from '../schemas/studentManagementSchema';

const isMockEnabled = runtimeConfig.enableMockAdminDashboard;

export const getStudentManagementListApi = async (query = {}) => {
  if (isMockEnabled) {
    await waitForMock();
    return getStudentManagementMockEnvelope(query);
  }

  const normalizedQuery = normalizeStudentListQuery(query);
  return apiGetEnvelope(STUDENT_ENDPOINTS.list, { params: normalizedQuery });
};

export const createStudentManagementApi = async (payload) => {
  if (isMockEnabled) {
    await waitForMock();
    return {
      success: true,
      message: 'Tạo học sinh thành công',
      data: { student: payload },
      errors: null,
      meta: { source: 'mock' },
    };
  }

  return apiPostEnvelope(STUDENT_ENDPOINTS.list, payload);
};

export const updateStudentManagementApi = async (studentId, payload) => {
  if (isMockEnabled) {
    await waitForMock();
    return {
      success: true,
      message: 'Cập nhật học sinh thành công',
      data: { studentId, ...payload },
      errors: null,
      meta: { source: 'mock' },
    };
  }

  return apiPatchEnvelope(STUDENT_ENDPOINTS.detail(studentId), payload);
};

export const getStudentManagementDetailApi = async (studentId) => {
  if (isMockEnabled) {
    await waitForMock();
    return getStudentManagementDetailMockEnvelope(studentId);
  }

  return apiGetEnvelope(STUDENT_ENDPOINTS.detail(studentId));
};

export const getStudentHealthProfileApi = async (studentId) => {
  if (isMockEnabled) {
    await waitForMock();
    return getStudentHealthProfileMockEnvelope(studentId);
  }

  return apiGetEnvelope(STUDENT_ENDPOINTS.detail(studentId));
};

export const updateStudentHealthProfileApi = async (studentId, payload) => {
  if (isMockEnabled) {
    await waitForMock();
    return {
      success: true,
      message: 'Cập nhật hồ sơ sức khỏe thành công',
      data: { studentId, ...payload },
      errors: null,
      meta: { source: 'mock' },
    };
  }

  return apiPatchEnvelope(STUDENT_ENDPOINTS.detail(studentId), payload);
};

export const deleteStudentManagementApi = async (studentId) => {
  if (isMockEnabled) {
    await waitForMock();
    return {
      success: true,
      message: 'Xóa học sinh thành công',
      data: { studentId },
      errors: null,
      meta: { source: 'mock' },
    };
  }

  return apiDeleteEnvelope(STUDENT_ENDPOINTS.detail(studentId));
};
