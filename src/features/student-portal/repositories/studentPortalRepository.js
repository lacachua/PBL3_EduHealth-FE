import { apiGetEnvelope } from '../../../shared/api/apiClient';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { getStoredUser } from '../../../shared/services/tokenClient';
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
import { STUDENT_PORTAL_READ_APIS } from '../constants/studentPortalApiContract';

const isStudentPortalMockSource = () => resolveModuleDataSource(DATA_MODULES.STUDENT_PORTAL) === 'mock';
const isCurrentUserMockSource = () => resolveModuleDataSource(DATA_MODULES.CURRENT_USER_ACCOUNT) === 'mock';

const ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  NURSE: 'Nhân viên y tế',
  STUDENT: 'Học sinh',
};

const DEFAULT_HISTORY_QUERY = Object.freeze({
  page: 1,
  pageSize: 50,
});

const toText = (value, fallback = '') => {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toDateLabel = (value, fallback = 'Chưa cập nhật') => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return toText(value, fallback);
  }

  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(date);
};

const toTimestamp = (value) => {
  const parsed = new Date(value || '');
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const safeNormalizeStoredUser = () => {
  const stored = getStoredUser();
  if (!stored || typeof stored !== 'object') {
    return null;
  }

  const normalized = normalizeCurrentUser(stored);
  return normalized.userId ? normalized : null;
};

const safeGetCurrentUser = async () => {
  try {
    return await currentUserRepository.getCurrentUser();
  } catch {
    return safeNormalizeStoredUser();
  }
};

const resolveStudentUserId = (currentUser) => {
  const parsed = Number.parseInt(String(currentUser?.userId || '').trim(), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const requireStudentContext = async () => {
  const currentUser = await safeGetCurrentUser();
  const studentUserId = resolveStudentUserId(currentUser);

  if (!studentUserId) {
    const error = new Error('Không xác định được học sinh hiện tại. Vui lòng đăng nhập lại.');
    error.name = 'StudentUserIdMissingError';
    error.code = 'STUDENT_USER_ID_MISSING';
    throw error;
  }

  return { currentUser, studentUserId };
};

const getHealthProfileLive = async (studentUserId) => {
  return apiGetEnvelope(STUDENT_PORTAL_READ_APIS.healthProfile(studentUserId));
};

const getHealthHistoryLive = async (studentUserId, query = DEFAULT_HISTORY_QUERY) => {
  return apiGetEnvelope(STUDENT_PORTAL_READ_APIS.healthHistory(studentUserId), {
    params: {
      page: Number(query.page) > 0 ? Number(query.page) : DEFAULT_HISTORY_QUERY.page,
      pageSize: Number(query.pageSize) > 0 ? Number(query.pageSize) : DEFAULT_HISTORY_QUERY.pageSize,
    },
  });
};

const getClassGrowthComparisonLive = async (studentUserId, metric) => {
  return apiGetEnvelope(STUDENT_PORTAL_READ_APIS.classGrowthComparison(studentUserId), {
    params: { metric },
  });
};

const getVaccinationsLive = async (studentUserId) => {
  return apiGetEnvelope(STUDENT_PORTAL_READ_APIS.vaccinations(studentUserId));
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

const mergeAccountData = (baseAccount, currentUser) => {
  const account = baseAccount || {};

  if (!currentUser) {
    return {
      ...account,
      studentCode: account.studentCode || '--',
      className: account.className || '--',
      username: account.username || 'student',
      roleLabel: toRoleLabel(account.role, account.roleLabel),
      statusLabel: toStatusLabel(account.isActive),
    };
  }

  const normalizedRole = String(currentUser.role || account.role || 'STUDENT').toUpperCase();
  const isActive = typeof currentUser.isActive === 'boolean'
    ? currentUser.isActive
    : Boolean(account.isActive);

  return {
    ...account,
    userId: currentUser.userId || account.userId,
    fullName: currentUser.fullName || account.fullName,
    email: currentUser.email || account.email,
    phone: currentUser.phone || account.phone,
    avatar: currentUser.avatar || account.avatar,
    username: account.username || (currentUser.email ? currentUser.email.split('@')[0] : 'student'),
    studentCode: account.studentCode || '--',
    className: account.className || '--',
    role: normalizedRole,
    roleLabel: toRoleLabel(normalizedRole, currentUser.roleLabel || account.roleLabel),
    isActive,
    statusLabel: toStatusLabel(isActive),
  };
};

const mergeStudentIdentity = (identity, account) => {
  const seed = identity || {};
  return {
    ...seed,
    fullName: account?.fullName || seed.fullName,
    avatar: account?.avatar || seed.avatar,
    studentCode: account?.studentCode || seed.studentCode,
    className: account?.className || seed.className,
  };
};

const buildAccountSeedFromHealthProfile = (healthProfileEnvelopeData = {}) => {
  const profile = healthProfileEnvelopeData?.healthProfile || {};

  return {
    fullName: healthProfileEnvelopeData?.fullName,
    studentCode: healthProfileEnvelopeData?.studentCode,
    className: healthProfileEnvelopeData?.className,
    currentHeight: profile?.heightCm,
    currentWeight: profile?.weightKg,
    bloodType: profile?.bloodType,
    eyeStatus: profile?.eyeStatus,
    medicalHistoryNotes: profile?.generalHealthNote || profile?.chronicNote,
  };
};

const toArrayData = (envelope) => (Array.isArray(envelope?.data) ? envelope.data : []);

const isVaccinationCompleted = (item) => {
  const normalizedStatus = String(item?.status || '').trim().toUpperCase();
  return normalizedStatus === 'DONE' || Boolean(item?.vaccinatedAt);
};

const isVaccinationUpcoming = (item) => {
  const normalizedStatus = String(item?.status || '').trim().toUpperCase();
  if (normalizedStatus !== 'PENDING') {
    return false;
  }

  const scheduledDate = new Date(item?.scheduledDate || '');
  if (Number.isNaN(scheduledDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return scheduledDate >= today;
};

const buildVaccinationSummary = (records = []) => {
  const total = records.length;
  const completed = records.filter(isVaccinationCompleted).length;
  const upcoming = records.filter(isVaccinationUpcoming).length;
  const pending = Math.max(total - completed - upcoming, 0);

  return { total, completed, upcoming, pending };
};

const buildOverviewSummaryCards = ({ historyItems, vaccinationRecords }) => {
  const vaccinationSummary = buildVaccinationSummary(vaccinationRecords);
  const latestHistoryDate = historyItems[0]?.visitDate
    ? toDateLabel(historyItems[0].visitDate, 'Chưa có lượt theo dõi')
    : 'Chưa có lượt theo dõi';

  const healthStatus = vaccinationSummary.pending > 0 ? 'Cần theo dõi thêm' : 'Ổn định';

  return [
    {
      id: 'recentFollowUp',
      label: 'Theo dõi gần đây',
      value: `${historyItems.length} lượt ghi nhận`,
      hint: `Lần gần nhất: ${latestHistoryDate}`,
    },
    {
      id: 'vaccinationProgress',
      label: 'Tiến độ tiêm chủng',
      value: `${vaccinationSummary.completed}/${vaccinationSummary.total} mũi hoàn tất`,
      hint: 'Đối chiếu theo lịch tiêm hiện tại.',
    },
    {
      id: 'upcomingReminder',
      label: 'Nhắc lịch sắp tới',
      value: `${vaccinationSummary.upcoming} mốc đang chờ`,
      hint: vaccinationSummary.upcoming > 0 ? 'Theo dõi các mũi PENDING trong lịch.' : 'Chưa có lịch tiêm sắp tới.',
    },
    {
      id: 'overallStatus',
      label: 'Tình trạng chung',
      value: healthStatus,
      hint: vaccinationSummary.pending > 0 ? 'Có bản ghi cần cập nhật kết quả.' : 'Không có bản ghi chờ xử lý.',
    },
  ];
};

const buildOverviewGrowthChart = (healthProfile = {}) => {
  const heightCm = toNumber(healthProfile?.heightCm);
  const weightKg = toNumber(healthProfile?.weightKg);

  if (heightCm === null && weightKg === null) {
    return {
      subtitle: 'Theo dõi chiều cao và cân nặng theo từng tháng.',
      points: [],
    };
  }

  const monthLabel = `T${new Date().getMonth() + 1}`;
  return {
    subtitle: 'Dữ liệu hiện tại được đồng bộ từ hồ sơ sức khỏe gần nhất.',
    points: [
      {
        id: 'growth-current',
        label: monthLabel,
        heightCm,
        weightKg,
      },
    ],
  };
};

const buildOverviewHealthHighlights = ({ healthProfile, historyItems }) => {
  const allergyNames = Array.isArray(healthProfile?.allergies)
    ? healthProfile.allergies
      .map((item) => toText(item?.allergyTypeName, ''))
      .filter(Boolean)
    : [];

  const latestCheck = historyItems[0]?.visitDate ? toDateLabel(historyItems[0].visitDate) : 'Chưa cập nhật';
  const heightCm = toNumber(healthProfile?.heightCm);
  const weightKg = toNumber(healthProfile?.weightKg);

  const growthValue = (heightCm === null && weightKg === null)
    ? 'Chưa cập nhật'
    : `${heightCm === null ? '--' : `${heightCm} cm`} / ${weightKg === null ? '--' : `${weightKg} kg`}`;

  return [
    {
      id: 'general',
      label: 'Tình trạng chung',
      value: toText(healthProfile?.generalHealthNote || healthProfile?.chronicNote, 'Chưa cập nhật'),
    },
    {
      id: 'allergy',
      label: 'Lưu ý dị ứng',
      value: allergyNames.length ? allergyNames.join(', ') : 'Chưa ghi nhận',
    },
    {
      id: 'latestCheck',
      label: 'Theo dõi gần nhất',
      value: latestCheck,
    },
    {
      id: 'growth',
      label: 'Chiều cao/Cân nặng',
      value: growthValue,
    },
  ];
};

const buildOverviewReminders = ({ vaccinationRecords, healthProfile }) => {
  const reminders = [];

  const nextUpcoming = vaccinationRecords
    .filter(isVaccinationUpcoming)
    .sort((left, right) => toTimestamp(left?.scheduledDate) - toTimestamp(right?.scheduledDate))[0];

  if (nextUpcoming) {
    reminders.push({
      id: 'reminder-upcoming-vaccination',
      title: 'Nhắc lịch tiêm sắp tới',
      dateLabel: toDateLabel(nextUpcoming?.scheduledDate, 'Sắp tới'),
      note: toText(nextUpcoming?.note, 'Theo dõi thông báo xác nhận trước ngày tiêm.'),
      tone: 'amber',
      icon: 'vaccines',
    });
  }

  const pendingCount = buildVaccinationSummary(vaccinationRecords).pending;
  if (pendingCount > 0) {
    reminders.push({
      id: 'reminder-pending-vaccination',
      title: 'Cần bổ sung kết quả tiêm',
      dateLabel: 'Trong tuần này',
      note: `${pendingCount} bản ghi tiêm chủng đang chờ cập nhật kết quả.`,
      tone: 'sky',
      icon: 'notifications_active',
    });
  }

  const healthNote = toText(healthProfile?.generalHealthNote || healthProfile?.chronicNote, '');
  if (healthNote) {
    reminders.push({
      id: 'reminder-health-note',
      title: 'Lưu ý sức khỏe',
      dateLabel: 'Theo dõi thường xuyên',
      note: healthNote,
      tone: 'mint',
      icon: 'monitor_heart',
    });
  }

  if (!reminders.length) {
    reminders.push({
      id: 'reminder-default',
      title: 'Hiện chưa có nhắc nhở mới',
      dateLabel: 'Cập nhật realtime',
      note: 'Hệ thống sẽ hiển thị nhắc nhở khi có lịch tiêm hoặc thay đổi hồ sơ sức khỏe.',
      tone: 'mint',
      icon: 'task_alt',
    });
  }

  return reminders.slice(0, 4);
};

const buildOverviewRecentActivities = ({ historyItems, vaccinationRecords }) => {
  const healthActivities = historyItems.slice(0, 3).map((item, index) => ({
    id: `activity-health-${index + 1}`,
    title: toText(item?.diseaseType?.name, 'Cập nhật theo dõi sức khỏe'),
    description: toText(item?.diagnosis || item?.symptoms || item?.treatment, 'Đã ghi nhận thông tin sức khỏe tại trường.'),
    timeLabel: toDateLabel(item?.visitDate),
    tag: 'Sức khỏe',
    tone: 'mint',
    icon: 'monitor_heart',
    timestamp: toTimestamp(item?.visitDate),
  }));

  const vaccinationActivities = vaccinationRecords.slice(0, 3).map((item, index) => {
    const status = String(item?.status || '').trim().toUpperCase();
    const title = status === 'DONE' ? 'Đã hoàn tất mũi tiêm' : 'Cập nhật lịch tiêm chủng';

    return {
      id: `activity-vaccination-${index + 1}`,
      title,
      description: toText(item?.vaccineName, 'Theo dõi thông tin tiêm chủng'),
      timeLabel: toDateLabel(item?.vaccinatedAt || item?.scheduledDate),
      tag: 'Tiêm chủng',
      tone: 'amber',
      icon: 'vaccines',
      timestamp: toTimestamp(item?.vaccinatedAt || item?.scheduledDate),
    };
  });

  return [...healthActivities, ...vaccinationActivities]
    .sort((left, right) => right.timestamp - left.timestamp)
    .slice(0, 6)
    .map((item) => {
      const activity = { ...item };
      delete activity.timestamp;
      return activity;
    });
};

const buildLiveCareHistoryRecords = (historyItems = []) => {
  return historyItems.map((item, index) => {
    const prescriptions = Array.isArray(item?.prescriptions)
      ? item.prescriptions.map((prescription, itemIndex) => ({
        id: toText(prescription?.prescriptionId, `rx-${index + 1}-${itemIndex + 1}`),
        medicineName: toText(prescription?.medicineName, 'Thuốc hỗ trợ'),
        dosage: toText(prescription?.usageInstruction, `SL: ${Number(prescription?.quantity || 0)} đơn vị`),
        instruction: toText(prescription?.usageInstruction, 'Theo chỉ định của nhân viên y tế.'),
      }))
      : [];

    let status = 'RECORDED';
    if (prescriptions.length > 0) {
      status = 'UPDATED';
    } else if (toText(item?.diagnosis, '') || toText(item?.treatment, '')) {
      status = 'STABILIZED';
    }

    const statusLabel = status === 'UPDATED'
      ? 'Đã cập nhật'
      : status === 'STABILIZED'
        ? 'Đã ổn định'
        : 'Đã ghi nhận';

    const diseaseName = toText(item?.diseaseType?.name, '');
    const nurseName = toText(item?.nurse?.fullName, 'Nhân viên y tế');

    return {
      id: toText(item?.visitId, `care-${index + 1}`),
      visitId: toText(item?.visitId, ''),
      visitDate: item?.visitDate || null,
      title: diseaseName || 'Theo dõi sức khỏe tại trường',
      category: diseaseName || 'Theo dõi sức khỏe',
      detailType: 'Theo dõi tại trường',
      summary: toText(item?.diagnosis || item?.symptoms || item?.treatment, 'Đã ghi nhận thông tin theo dõi sức khỏe.'),
      handledBy: nurseName,
      nurseName,
      staffName: nurseName,
      status,
      statusLabel,
      symptoms: toText(item?.symptoms, 'Chưa ghi nhận triệu chứng rõ ràng.'),
      diagnosis: toText(item?.diagnosis, 'Chưa ghi nhận bất thường.'),
      treatment: toText(item?.treatment, 'Theo dõi thêm theo hướng dẫn.'),
      note: toText(item?.note, 'Chưa cập nhật'),
      advice: '',
      treatmentSummary: toText(item?.treatment, ''),
      prescriptionsSummary: prescriptions.length ? `${prescriptions.length} mục hỗ trợ` : 'Không phát sinh đơn thuốc.',
      prescriptions,
    };
  });
};

const buildLiveVaccinationRecords = (vaccinationRecords = []) => {
  return vaccinationRecords.map((item, index) => {
    const doseNumber = Number(item?.doseNumber);

    return {
      id: toText(item?.studentVaccinationId, `svac-${index + 1}`),
      studentVaccinationId: toText(item?.studentVaccinationId, ''),
      campaignId: toText(item?.campaignId, ''),
      campaignName: toText(item?.campaignName, 'Đợt tiêm chưa đặt tên'),
      vaccineName: toText(item?.vaccineName, 'Vaccine chưa cập nhật'),
      doseNumber: Number.isFinite(doseNumber) ? doseNumber : null,
      scheduledDate: item?.scheduledDate || null,
      status: toText(item?.status, 'PENDING').toUpperCase(),
      vaccinatedAt: item?.vaccinatedAt || null,
      lotNumber: toText(item?.lotNumber, ''),
      note: toText(item?.note, ''),
    };
  });
};

const buildCapabilities = () => ({
  canUpdateProfile: true,
  canChangePassword: true,
  canUploadAvatar: true,
  canViewHealthProfile: true,
  canViewHealthHistory: true,
  canViewVaccinations: true,
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

const resolveAvatarFromResponse = (response) => {
  const source = response && typeof response === 'object' && 'data' in response
    ? response.data
    : response;

  return toText(source?.avatar || source?.avatarUrl, '');
};

const createLiveEnvelope = (data, message) => ({
  success: true,
  message,
  data,
  errors: null,
  meta: { source: 'live' },
});

const normalizeGrowthMetric = (metric) => (metric === 'weight' ? 'weight' : 'height');

const buildMockClassGrowthComparison = (metric = 'height') => {
  const normalizedMetric = normalizeGrowthMetric(metric);
  const unit = normalizedMetric === 'weight' ? 'kg' : 'cm';
  const values = normalizedMetric === 'weight'
    ? [28.2, 29.4, 30.1, 31.5, 32.8, 33.4, 35.0, 36.2]
    : [128, 131, 133, 136, 138, 140, 142, 145];
  const currentIndex = 5;
  const students = values.map((value, index) => ({
    studentId: `STD${String(index + 1).padStart(3, '0')}`,
    studentCode: `HS${String(index + 1).padStart(3, '0')}`,
    fullName: index === currentIndex ? 'Tran Minh An' : `Hoc sinh ${index + 1}`,
    value,
    rank: index + 1,
    isCurrentStudent: index === currentIndex,
  }));
  const currentStudent = students[currentIndex];

  return {
    classId: 'CLS001',
    className: 'Lop 4A',
    metric: normalizedMetric,
    unit,
    currentStudent,
    students,
    summary: {
      totalStudents: students.length,
      min: Math.min(...values),
      max: Math.max(...values),
      average: values.reduce((sum, value) => sum + value, 0) / values.length,
      currentValue: currentStudent.value,
      percentile: 75,
    },
  };
};

export const studentPortalRepository = {
  async getIdentity() {
    if (isStudentPortalMockSource()) {
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
    }

    const { currentUser, studentUserId } = await requireStudentContext();
    const healthProfileEnvelope = await getHealthProfileLive(studentUserId);

    const accountSeed = mergeAccountData(buildAccountSeedFromHealthProfile(healthProfileEnvelope.data), currentUser);
    const identity = mergeStudentIdentity({
      fullName: healthProfileEnvelope.data?.fullName,
      studentCode: healthProfileEnvelope.data?.studentCode,
      className: healthProfileEnvelope.data?.className,
    }, accountSeed);

    return createLiveEnvelope(identity, healthProfileEnvelope.message || 'Lấy thông tin học sinh thành công.');
  },

  async getOverview() {
    if (isStudentPortalMockSource()) {
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
    }

    const { currentUser, studentUserId } = await requireStudentContext();

    const [healthProfileEnvelope, historyEnvelope, vaccinationEnvelope] = await Promise.all([
      getHealthProfileLive(studentUserId),
      getHealthHistoryLive(studentUserId),
      getVaccinationsLive(studentUserId),
    ]);

    const healthProfileData = healthProfileEnvelope.data || {};
    const healthProfile = healthProfileData.healthProfile || {};
    const historyItems = toArrayData(historyEnvelope);
    const vaccinationRecords = toArrayData(vaccinationEnvelope);

    const mergedAccount = withCapabilities(mergeAccountData(
      buildAccountSeedFromHealthProfile(healthProfileData),
      currentUser,
    ));
    const mergedStudent = mergeStudentIdentity({
      fullName: healthProfileData.fullName,
      studentCode: healthProfileData.studentCode,
      className: healthProfileData.className,
    }, mergedAccount);

    return createLiveEnvelope({
      account: mergedAccount,
      student: mergedStudent,
      summaryCards: buildOverviewSummaryCards({ historyItems, vaccinationRecords }),
      growthChart: buildOverviewGrowthChart(healthProfile),
      healthHighlights: buildOverviewHealthHighlights({ healthProfile, historyItems }),
      reminders: buildOverviewReminders({ vaccinationRecords, healthProfile }),
      recentActivities: buildOverviewRecentActivities({ historyItems, vaccinationRecords }),
    }, 'Lấy dữ liệu tổng quan thành công.');
  },

  async getClassGrowthComparison(metric = 'height') {
    const normalizedMetric = normalizeGrowthMetric(metric);

    if (isStudentPortalMockSource()) {
      return {
        success: true,
        message: 'Lay du lieu so sanh trong lop thanh cong (mock).',
        data: buildMockClassGrowthComparison(normalizedMetric),
        errors: null,
        meta: { source: 'mock' },
      };
    }

    const { studentUserId } = await requireStudentContext();
    return getClassGrowthComparisonLive(studentUserId, normalizedMetric);
  },

  async getCareHistory() {
    if (isStudentPortalMockSource()) {
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
    }

    const { currentUser, studentUserId } = await requireStudentContext();
    const [healthProfileEnvelope, historyEnvelope] = await Promise.all([
      getHealthProfileLive(studentUserId),
      getHealthHistoryLive(studentUserId),
    ]);

    const mergedAccount = mergeAccountData(buildAccountSeedFromHealthProfile(healthProfileEnvelope.data), currentUser);
    const student = mergeStudentIdentity({
      fullName: healthProfileEnvelope.data?.fullName,
      studentCode: healthProfileEnvelope.data?.studentCode,
      className: healthProfileEnvelope.data?.className,
    }, mergedAccount);

    return createLiveEnvelope({
      student,
      records: buildLiveCareHistoryRecords(toArrayData(historyEnvelope)),
    }, 'Lấy lịch sử khám bệnh thành công.');
  },

  async getVaccinations() {
    if (isStudentPortalMockSource()) {
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
    }

    const { currentUser, studentUserId } = await requireStudentContext();
    const [healthProfileEnvelope, vaccinationEnvelope] = await Promise.all([
      getHealthProfileLive(studentUserId),
      getVaccinationsLive(studentUserId),
    ]);

    const vaccinationRecords = buildLiveVaccinationRecords(toArrayData(vaccinationEnvelope));
    const mergedAccount = mergeAccountData(buildAccountSeedFromHealthProfile(healthProfileEnvelope.data), currentUser);
    const student = mergeStudentIdentity({
      fullName: healthProfileEnvelope.data?.fullName,
      studentCode: healthProfileEnvelope.data?.studentCode,
      className: healthProfileEnvelope.data?.className,
    }, mergedAccount);

    return createLiveEnvelope({
      student,
      summary: buildVaccinationSummary(vaccinationRecords),
      records: vaccinationRecords,
    }, 'Lấy dữ liệu tiêm chủng thành công.');
  },

  async getAccount() {
    if (isStudentPortalMockSource()) {
      const [mockEnvelope, currentUser] = await Promise.all([
        getStudentAccountMock(),
        safeGetCurrentUser(),
      ]);

      return {
        ...mockEnvelope,
        data: withCapabilities(mergeAccountData(mockEnvelope.data, currentUser)),
      };
    }

    const { currentUser, studentUserId } = await requireStudentContext();

    let healthProfileData = null;
    try {
      const healthProfileEnvelope = await getHealthProfileLive(studentUserId);
      healthProfileData = healthProfileEnvelope.data;
    } catch {
      healthProfileData = null;
    }

    return createLiveEnvelope(
      withCapabilities(mergeAccountData(buildAccountSeedFromHealthProfile(healthProfileData), currentUser)),
      'Lấy thông tin tài khoản thành công.',
    );
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

    return createLiveEnvelope(
      withCapabilities(mergeAccountData({}, normalizedCurrentUser)),
      'Cập nhật thông tin tài khoản thành công.',
    );
  },

  async uploadAccountAvatar(avatarFile) {
    if (isCurrentUserMockSource()) {
      const mockResponse = await uploadStudentAvatarMock(avatarFile);

      return {
        ...mockResponse,
        data: withCapabilities(mockResponse.data),
      };
    }

    const response = await currentUserRepository.uploadCurrentUserAvatar(avatarFile);
    const refreshedCurrentUser = await safeGetCurrentUser();
    const normalizedCurrentUser = normalizeUpdatedCurrentUser(response);
    const effectiveCurrentUser = normalizedCurrentUser?.userId ? normalizedCurrentUser : refreshedCurrentUser;

    return createLiveEnvelope(
      withCapabilities(mergeAccountData({ avatar: resolveAvatarFromResponse(response) }, effectiveCurrentUser)),
      response?.message || 'Cập nhật ảnh đại diện thành công.',
    );
  },

  async changePassword(payload) {
    if (isCurrentUserMockSource()) {
      return changeStudentPasswordMock(payload);
    }

    return currentUserRepository.changeCurrentUserPassword(payload);
  },
};
