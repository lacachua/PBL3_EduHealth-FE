import { normalizeApiEnvelope } from '../../../../shared/api/normalizeResponse';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toText = (value, fallback = '') => (typeof value === 'string' ? value : fallback);
const toLowerText = (value, fallback = '') => toText(value, fallback).toLowerCase();

const moduleLabelMap = {
  students: 'Quản lý học sinh',
  users: 'Người dùng',
  catalogs: 'Quản lý danh mục',
  reports: 'Báo cáo',
  vaccinations: 'Tiêm chủng',
  medicines: 'Kho thuốc',
  system: 'Hệ thống',
};

const defaultShortcuts = [
  {
    id: 'shortcut-students',
    label: 'Quản lý học sinh',
    description: 'Hồ sơ và thông tin học sinh',
    to: '/admin/students',
    icon: 'school',
  },
  {
    id: 'shortcut-users',
    label: 'Người dùng',
    description: 'Tài khoản hệ thống',
    to: '/admin/users',
    icon: 'group',
  },
  {
    id: 'shortcut-reports',
    label: 'Báo cáo',
    description: 'Theo dõi chỉ số tổng hợp',
    to: '/admin/reports',
    icon: 'assessment',
  },
  {
    id: 'shortcut-medicines',
    label: 'Kho thuốc',
    description: 'Tồn kho và cảnh báo thuốc',
    to: '/admin/medicines',
    icon: 'medication',
  },
  {
    id: 'shortcut-catalogs',
    label: 'Danh mục',
    description: 'Danh mục dùng chung',
    to: '/admin/catalogs',
    icon: 'category',
  },
];

const formatDateTime = (value) => {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const normalizeOverview = (source = {}) => {
  return {
    totalStudents: toNumber(source.totalStudents),
    totalClasses: toNumber(source.totalClasses),
    totalUsers: toNumber(source.totalUsers ?? source.activeUsers),
    lowStockMedicines: toNumber(source.lowStockMedicines ?? source.lowStockMedicinesCount),
    totalVisitsToday: toNumber(source.totalVisitsToday),
    totalVisitsThisMonth: toNumber(source.totalVisitsThisMonth),
  };
};

const normalizeShortcuts = (source) => {
  if (!Array.isArray(source) || !source.length) {
    return defaultShortcuts;
  }

  const normalized = source
    .map((item, index) => ({
      id: item?.id || `shortcut-${index + 1}`,
      label: toText(item?.label, ''),
      description: toText(item?.description, ''),
      to: toText(item?.to, '/admin/dashboard'),
      icon: toText(item?.icon, 'link'),
    }))
    .filter((item) => item.label && item.to);

  return normalized.length ? normalized : defaultShortcuts;
};

const normalizeTrends = (source) => {
  if (!Array.isArray(source)) return [];

  return source
    .map((item, index) => ({
      id: item?.id || `trend-${index + 1}`,
      label: toText(item?.label, `Mốc ${index + 1}`),
      value: toNumber(item?.value),
    }))
    .filter((item) => item.value >= 0);
};

const normalizeAlerts = (source) => {
  if (!Array.isArray(source)) return [];

  return source
    .map((item, index) => ({
      id: item?.id || `alert-${index + 1}`,
      title: toText(item?.title, ''),
      description: toText(item?.description, ''),
      severity: toLowerText(item?.severity, 'warning'),
      metric: toText(item?.metric, ''),
      to: toText(item?.to, ''),
    }))
    .filter((item) => item.title);
};

const normalizeActivities = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => ({
    id: item?.id || `activity-${index + 1}`,
    title: toText(item?.title || item?.description, ''),
    metadata: toText(
      item?.metadata,
      `${toText(item?.actorName, 'Hệ thống')} • ${moduleLabelMap[item?.module] || 'Hệ thống'}`
    ),
    timeLabel: toText(item?.timeLabel, formatDateTime(item?.occurredAt) || '--'),
    icon: toText(item?.icon, 'history'),
    tone: toLowerText(item?.tone, 'neutral'),
    to: toText(item?.to, ''),
  }));
};

const buildEmpty = () => ({
  title: 'Tổng quan quản trị',
  description: 'Theo dõi nhanh tình trạng vận hành y tế học đường toàn trường.',
  generatedAtLabel: '',
  overview: normalizeOverview(),
  shortcuts: defaultShortcuts,
  trends: [],
  managementAlerts: [],
  recentActivities: [],
});

export const adaptAdminDashboardEnvelope = (responseOrEnvelope) => {
  const envelope = normalizeApiEnvelope(responseOrEnvelope);

  if (!envelope || envelope.success === false) {
    return buildEmpty();
  }

  const dataRoot = envelope?.data && typeof envelope.data === 'object' ? envelope.data : {};
  const source = dataRoot?.overview && typeof dataRoot.overview === 'object'
    ? dataRoot.overview
    : dataRoot;

  const generatedAtIso = toText(source.generatedAt || envelope?.meta?.generatedAt, '');

  return {
    title: 'Tổng quan quản trị',
    description: 'Theo dõi nhanh tình trạng vận hành y tế học đường toàn trường.',
    generatedAtLabel: formatDateTime(generatedAtIso),
    overview: normalizeOverview(source.overview || source),
    shortcuts: normalizeShortcuts(source.shortcuts),
    trends: normalizeTrends(source.trends),
    managementAlerts: normalizeAlerts(source.managementAlerts),
    recentActivities: normalizeActivities(source.recentActivities).slice(0, 4),
  };
};
