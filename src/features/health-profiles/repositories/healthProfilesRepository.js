import { apiGetEnvelope, apiPatchEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import {
  getNurseHealthHistoryMockEnvelope,
  getNurseHealthProfileMockEnvelope,
  getNurseHealthProfileStudentsMockRows,
  getNurseHealthStudentDetailMockEnvelope,
} from '../mocks/nurseHealthProfileDetailMock';
import { getNurseHealthProfileSupplementaryMock } from '../mocks/nurseHealthProfileSupplementaryMock';
import { HEALTH_PROFILES_ENDPOINTS } from '../constants/healthProfilesApiContract';

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildMockEnvelope = ({
  data,
  message,
  meta = null,
}) => ({
  success: true,
  message,
  data,
  errors: null,
  meta,
});

const shouldUseMock = (moduleKey) => resolveModuleDataSource(moduleKey) === 'mock';

const getHealthProfileLive = async (studentId) => apiGetEnvelope(HEALTH_PROFILES_ENDPOINTS.studentHealthProfile(studentId));
const getHealthProfileMock = async (studentId) => {
  await waitForMock('adminDashboard');
  return getNurseHealthProfileMockEnvelope(studentId);
};

const getDetailLive = async (studentId) => apiGetEnvelope(HEALTH_PROFILES_ENDPOINTS.studentDetail(studentId));
const getDetailMock = async (studentId) => {
  await waitForMock('adminDashboard');
  return getNurseHealthStudentDetailMockEnvelope(studentId);
};

const updateHealthProfileLive = async (studentId, payload) => apiPatchEnvelope(HEALTH_PROFILES_ENDPOINTS.studentHealthProfile(studentId), payload);
const updateHealthProfileMock = async (studentId, payload) => {
  await waitForMock('adminDashboard');
  return buildMockEnvelope({
    message: 'Cập nhật hồ sơ sức khỏe thành công',
    data: {
      studentId,
      ...payload,
    },
    meta: { source: 'mock' },
  });
};

const getHistoryLive = async (studentId, params) => apiGetEnvelope(HEALTH_PROFILES_ENDPOINTS.studentHealthHistory(studentId), { params });
const getHistoryMock = async (studentId, params) => {
  await waitForMock('adminDashboard');
  return getNurseHealthHistoryMockEnvelope(studentId, params);
};

const getVaccinationsLive = async (studentId) => apiGetEnvelope(HEALTH_PROFILES_ENDPOINTS.studentVaccinations(studentId));
const getVaccinationsMock = async (studentId) => {
  await waitForMock('adminDashboard');
  const supplementary = getNurseHealthProfileSupplementaryMock(studentId);
  return buildMockEnvelope({
    message: 'Lấy dữ liệu tiêm chủng thành công',
    data: supplementary.vaccinations,
    meta: { source: 'mock' },
  });
};

const getAllergyTypesLive = async () => apiGetEnvelope(HEALTH_PROFILES_ENDPOINTS.allergyTypes);
const getAllergyTypesMock = async () => {
  await waitForMock('adminDashboard');
  return buildMockEnvelope({
    message: 'Lấy danh mục dị ứng thành công',
    data: [
      { allergyId: 1, allergyTypeId: 'ALG001', allergyTypeName: 'Dị ứng hải sản', severity: 'Mild' },
      { allergyId: 2, allergyTypeId: 'ALG002', allergyTypeName: 'Dị ứng phấn hoa', severity: 'Moderate' },
      { allergyId: 3, allergyTypeId: 'ALG003', allergyTypeName: 'Dị ứng sữa bò', severity: 'Mild' },
    ],
    meta: { source: 'mock' },
  });
};

const getStudentsLookupLive = async (params) => apiGetEnvelope(HEALTH_PROFILES_ENDPOINTS.studentsLookup, { params });
const getStudentsLookupMock = async (params) => {
  await waitForMock('adminDashboard');

  const keyword = String(params.search || '').toLowerCase();
  const source = getNurseHealthProfileStudentsMockRows().filter((item) => {
    if (typeof params.isActive === 'boolean' && Boolean(item?.isActive) !== params.isActive) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const text = `${item.studentCode || ''} ${item.fullName || ''} ${item.className || ''}`.toLowerCase();
    return text.includes(keyword);
  });

  const start = (params.page - 1) * params.pageSize;
  const items = source.slice(start, start + params.pageSize);

  return buildMockEnvelope({
    message: 'Lấy danh sách học sinh thành công',
    data: items,
    meta: {
      page: params.page,
      pageSize: params.pageSize,
      totalItems: source.length,
      totalPages: Math.max(1, Math.ceil(source.length / params.pageSize)),
      source: 'mock',
    },
  });
};

export const healthProfilesRepository = {
  getStudentHealthProfile: async (studentId) => {
    return shouldUseMock(DATA_MODULES.NURSE_HEALTH_PROFILE)
      ? getHealthProfileMock(studentId)
      : getHealthProfileLive(studentId);
  },
  getStudentDetail: async (studentId) => {
    return shouldUseMock(DATA_MODULES.NURSE_STUDENTS)
      ? getDetailMock(studentId)
      : getDetailLive(studentId);
  },
  updateStudentHealthProfile: async (studentId, payload) => {
    return shouldUseMock(DATA_MODULES.NURSE_HEALTH_PROFILE)
      ? updateHealthProfileMock(studentId, payload)
      : updateHealthProfileLive(studentId, payload);
  },
  getStudentHealthHistory: async (studentId, query = {}) => {
    const params = {
      page: toPositiveNumber(query.page, 1),
      pageSize: toPositiveNumber(query.pageSize, 10),
      ...(query.fromDate ? { fromDate: query.fromDate } : {}),
      ...(query.toDate ? { toDate: query.toDate } : {}),
    };

    return shouldUseMock(DATA_MODULES.NURSE_HEALTH_PROFILE)
      ? getHistoryMock(studentId, params)
      : getHistoryLive(studentId, params);
  },
  getStudentVaccinations: async (studentId) => {
    return shouldUseMock(DATA_MODULES.NURSE_VACCINATIONS)
      ? getVaccinationsMock(studentId)
      : getVaccinationsLive(studentId);
  },
  getAllergyTypes: async () => {
    return shouldUseMock(DATA_MODULES.NURSE_HEALTH_PROFILE)
      ? getAllergyTypesMock()
      : getAllergyTypesLive();
  },
  getStudentsLookup: async (query = {}) => {
    const normalizedIsActive = typeof query.isActive === 'boolean' ? query.isActive : undefined;
    const params = {
      page: toPositiveNumber(query.page, 1),
      pageSize: toPositiveNumber(query.pageSize, 10),
      ...(query.search ? { search: String(query.search).trim() } : {}),
      ...(typeof normalizedIsActive === 'boolean' ? { isActive: normalizedIsActive } : {}),
    };

    return shouldUseMock(DATA_MODULES.NURSE_STUDENTS)
      ? getStudentsLookupMock(params)
      : getStudentsLookupLive(params);
  },
};
