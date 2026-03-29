import { normalizeApiEnvelope } from '../../../../shared/api/normalizeResponse';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toText = (value, fallback = '') => (typeof value === 'string' ? value : fallback);

const moduleLabelMap = {
  students: 'Quản lý học sinh',
  users: 'Người dùng',
  catalogs: 'Quản lý danh mục',
  reports: 'Báo cáo',
  vaccinations: 'Tiêm chủng',
  system: 'Hệ thống',
};

const normalizeKpis = (source = {}) => ([
  {
    id: 'total-students',
    label: 'Tổng học sinh',
    value: toNumber(source.totalStudents),
    icon: 'school',
    tone: 'neutral',
  },
  {
    id: 'active-users',
    label: 'Tài khoản hoạt động',
    value: toNumber(source.activeUsers),
    icon: 'manage_accounts',
    tone: 'info',
  },
  {
    id: 'active-catalogs',
    label: 'Danh mục đang dùng',
    value: toNumber(source.activeCatalogEntries),
    icon: 'inventory_2',
    tone: 'success',
  },
  {
    id: 'review-total',
    label: 'Mục cần rà soát',
    value: toNumber(source.reviewTotal),
    icon: 'fact_check',
    tone: 'warning',
  },
]);

const normalizeReviewItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => ({
    id: item?.id || `review-${index + 1}`,
    title: toText(item?.title, 'Mục cần rà soát'),
    description: toText(item?.description, ''),
    count: toNumber(item?.count),
    tone: toText(item?.tone, 'neutral'),
    to: toText(item?.to, '/admin/dashboard'),
  }));
};

const normalizeActivities = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => ({
    id: item?.id || `activity-${index + 1}`,
    occurredAt: toText(item?.occurredAt, '--'),
    actorName: toText(item?.actorName, 'Hệ thống'),
    module: moduleLabelMap[item?.module] || 'Hệ thống',
    action: toText(item?.action, '--'),
    targetType: toText(item?.targetType, '--'),
    description: toText(item?.description, ''),
  }));
};

const buildEmpty = () => ({
  title: 'Tổng quan quản trị',
  subtitle: 'Theo dõi số liệu vận hành và danh sách cần rà soát của nhà trường.',
  schoolName: 'Trường Tiểu học Trần Cao Vân',
  generatedAt: '',
  kpis: normalizeKpis(),
  reviewItems: [],
  activities: [],
});

export const adaptAdminDashboardEnvelope = (responseOrEnvelope) => {
  const envelope = normalizeApiEnvelope(responseOrEnvelope);

  if (!envelope || envelope.success === false) {
    return buildEmpty();
  }

  const source = envelope?.data?.overview && typeof envelope.data.overview === 'object'
    ? envelope.data.overview
    : {};

  return {
    title: 'Tổng quan quản trị',
    subtitle: 'Tổng hợp dữ liệu học sinh, tài khoản, danh mục và hoạt động hệ thống.',
    schoolName: toText(source.schoolName, 'Trường Tiểu học Trần Cao Vân'),
    generatedAt: toText(source.generatedAt || envelope?.meta?.generatedAt, ''),
    kpis: normalizeKpis(source.kpis),
    reviewItems: normalizeReviewItems(source.reviewItems),
    activities: normalizeActivities(source.recentActivities),
  };
};
