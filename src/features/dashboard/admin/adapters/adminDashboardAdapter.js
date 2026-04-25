import { normalizeApiEnvelope } from '../../../../shared/api/normalizeResponse';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toText = (value, fallback = '') => (typeof value === 'string' ? value : fallback);

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
    lowStockMedicines: toNumber(source.lowStockMedicinesCount ?? source.lowStockMedicines),
    totalVisitsToday: toNumber(source.totalVisitsToday),
    totalVisitsThisMonth: toNumber(source.totalVisitsThisMonth),
    totalMedicines: toNumber(source.totalMedicines),
    activeUsers: toNumber(source.activeUsers),
    lockedUsers: toNumber(source.lockedUsers),
    vaccinationCampaignsActive: toNumber(source.vaccinationCampaignsActive),
  };
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
    overview: normalizeOverview(source),
    shortcuts: defaultShortcuts, // BE doesn't provide shortcuts - use defaults directly
    trends: [], // BE doesn't provide trends - return empty array
    managementAlerts: [], // BE doesn't provide managementAlerts - return empty array
    recentActivities: [], // BE doesn't provide recentActivities - return empty array
  };
};
