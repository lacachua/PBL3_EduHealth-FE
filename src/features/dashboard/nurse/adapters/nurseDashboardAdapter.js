import { normalizeApiEnvelope } from '../../../../shared/api/normalizeResponse';
import {
  VACCINATION_STATUS_META,
} from '../../../vaccinations/constants/vaccinationConstants';
import {
  NURSE_DASHBOARD_EXAM_WINDOW_DAYS,
  NURSE_DASHBOARD_MEDICINE_ALERT_LIMIT,
  NURSE_DASHBOARD_PENDING_LIMIT,
  NURSE_DASHBOARD_QUICK_ACTIONS,
  NURSE_DASHBOARD_RECENT_EXAM_LIMIT,
  NURSE_DASHBOARD_SOURCE_KEYS,
} from '../constants/nurseDashboardConfig';

const numberFormatter = new Intl.NumberFormat('vi-VN');

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MEDICINE_ALERT_LABELS = {
  LOW_STOCK: 'Dưới ngưỡng',
  EXPIRING: 'Sắp hết hạn',
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toText = (value, fallback = '') => {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateOnly = (value) => {
  const parsed = parseDate(value);
  if (!parsed) {
    return '--';
  }

  return parsed.toLocaleDateString('vi-VN');
};

const formatDateTime = (value) => {
  const parsed = parseDate(value);
  if (!parsed) {
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

const formatClockTime = (value) => {
  const parsed = parseDate(value);
  if (!parsed) {
    return '--';
  }

  return parsed.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const extractRows = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (Array.isArray(envelope?.data)) {
    return {
      rows: envelope.data,
      meta: envelope?.meta || null,
    };
  }

  if (Array.isArray(envelope?.data?.items)) {
    return {
      rows: envelope.data.items,
      meta: envelope?.meta || envelope?.data?.meta || null,
    };
  }

  return {
    rows: [],
    meta: envelope?.meta || null,
  };
};

const deriveBlockStatus = ({ error, itemCount }) => {
  if (toText(error)) {
    return 'error';
  }

  return itemCount > 0 ? 'success' : 'empty';
};

const mapExaminationRow = (item = {}, index = 0) => {
  const id = toText(item.id || item.examinationId || item.code, `VIS-${index + 1}`);
  const visitDateRaw = item.visitDate || item.createdAt || item.date;
  const visitDate = parseDate(visitDateRaw);

  return {
    id,
    visitDate: visitDate ? visitDate.toISOString() : '',
    sortTime: visitDate ? visitDate.getTime() : 0,
    visitDateLabel: formatDateOnly(visitDateRaw),
    visitTimeLabel: formatClockTime(visitDateRaw),
    studentName: toText(item?.student?.fullName || item.studentName, '--'),
    studentCode: toText(item?.student?.studentCode || item.studentCode, '--'),
    className: toText(item?.student?.className || item.className, '--'),
    diagnosis: toText(item.diagnosis, '--'),
  };
};

const mapMedicineAlertRow = (item = {}, index = 0) => {
  const alertType = toText(item.alertType, 'LOW_STOCK').toUpperCase();

  return {
    id: `${toText(item.medicineId, 'MED')}-${index}`,
    medicineName: toText(item.medicineName, '--'),
    alertType,
    alertTypeLabel: MEDICINE_ALERT_LABELS[alertType] || alertType,
    currentStock: Number.isFinite(Number(item.currentStock)) ? Number(item.currentStock) : null,
    warningThreshold: Number.isFinite(Number(item.warningThreshold)) ? Number(item.warningThreshold) : null,
    nearestExpiryDateLabel: formatDateOnly(item.nearestExpiryDate),
  };
};

const mapPendingVaccinationRow = (item = {}, index = 0) => {
  const status = toText(item.status, 'UNKNOWN').toUpperCase();
  const statusMeta = VACCINATION_STATUS_META[status] || VACCINATION_STATUS_META.UNKNOWN;

  return {
    id: toText(item.studentVaccinationId, `SV-${index + 1}`),
    campaignName: toText(item.campaignName, '--'),
    studentName: toText(item?.student?.fullName, '--'),
    studentCode: toText(item?.student?.studentCode, '--'),
    className: toText(item?.student?.className, '--'),
    scheduledDateLabel: formatDateOnly(item.scheduledDate),
    status,
    statusLabel: statusMeta.label,
    statusBadgeClassName: statusMeta.badgeClassName,
  };
};

const sortByVisitDateDesc = (left, right) => right.sortTime - left.sortTime;

const buildTrendPoints = (examinationRows, generatedAt) => {
  const referenceDate = parseDate(generatedAt) || new Date();
  referenceDate.setHours(0, 0, 0, 0);

  const skeleton = [];
  for (let offset = NURSE_DASHBOARD_EXAM_WINDOW_DAYS - 1; offset >= 0; offset -= 1) {
    const dayDate = new Date(referenceDate);
    dayDate.setDate(referenceDate.getDate() - offset);

    skeleton.push({
      id: `day-${toDateKey(dayDate)}`,
      dateKey: toDateKey(dayDate),
      dateLabel: dayDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      }),
      weekdayLabel: WEEKDAY_LABELS[dayDate.getDay()] || '--',
      value: 0,
    });
  }

  const countsByDate = examinationRows.reduce((accumulator, item) => {
    const visitDate = parseDate(item.visitDate);
    if (!visitDate) {
      return accumulator;
    }

    const key = toDateKey(visitDate);
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  const maxValue = Math.max(1, ...skeleton.map((point) => countsByDate[point.dateKey] || 0));

  return skeleton.map((point) => {
    const value = countsByDate[point.dateKey] || 0;
    return {
      ...point,
      value,
      heightPercent: value > 0 ? Math.max(18, Math.round((value / maxValue) * 100)) : 12,
    };
  });
};

const buildEmptyData = () => ({
  hasLoaded: false,
  title: 'Tổng quan nghiệp vụ y tế',
  description: 'Theo dõi công việc trong ngày về khám bệnh, kho thuốc, tiêm chủng và các đầu việc cần ưu tiên xử lý.',
  generatedAtLabel: '',
  quickActions: NURSE_DASHBOARD_QUICK_ACTIONS,
  kpis: [
    {
      id: 'visits-today',
      label: 'Lượt khám hôm nay',
      value: null,
      icon: 'calendar_today',
      tone: 'success',
      to: '/nurse/examinations',
    },
    {
      id: 'visits-seven-days',
      label: 'Lượt khám 7 ngày gần nhất',
      value: null,
      icon: 'monitoring',
      tone: 'info',
      to: '/nurse/examinations',
    },
    {
      id: 'medicines-low-stock',
      label: 'Thuốc dưới ngưỡng',
      value: null,
      icon: 'inventory_2',
      tone: 'warning',
      to: '/nurse/medicines',
    },
    {
      id: 'medicines-expiring',
      label: 'Thuốc sắp hết hạn',
      value: null,
      icon: 'event_busy',
      tone: 'critical',
      to: '/nurse/medicines',
    },
    {
      id: 'vaccinations-pending',
      label: 'Chưa hoàn thành tiêm',
      value: null,
      icon: 'pending_actions',
      tone: 'warning',
      to: '/nurse/vaccinations/pending',
    },
    {
      id: 'campaigns-active',
      label: 'Đợt tiêm hoạt động',
      value: null,
      icon: 'campaign',
      tone: 'success',
      to: '/nurse/vaccinations',
    },
  ],
  trend: {
    points: [],
    totalVisits: 0,
    status: 'empty',
    error: '',
  },
  panels: {
    medicineAlerts: {
      items: [],
      status: 'empty',
      error: '',
      to: '/nurse/medicines',
    },
    pendingVaccinations: {
      items: [],
      status: 'empty',
      error: '',
      to: '/nurse/vaccinations/pending',
    },
  },
  recentExaminations: {
    items: [],
    status: 'empty',
    error: '',
    to: '/nurse/examinations',
  },
});

const buildKpis = ({
  visitsToday,
  visitsSevenDays,
  lowStockCount,
  expiringCount,
  pendingCount,
  activeCampaignCount,
  errors,
}) => {
  const kpis = buildEmptyData().kpis;

  return kpis.map((item) => {
    if (item.id === 'visits-today') {
      return { ...item, value: errors.examinations ? null : visitsToday };
    }

    if (item.id === 'visits-seven-days') {
      return { ...item, value: errors.examinations ? null : visitsSevenDays };
    }

    if (item.id === 'medicines-low-stock') {
      return { ...item, value: errors.medicineAlerts ? null : lowStockCount };
    }

    if (item.id === 'medicines-expiring') {
      return { ...item, value: errors.medicineAlerts ? null : expiringCount };
    }

    if (item.id === 'vaccinations-pending') {
      return { ...item, value: errors.pendingVaccinations ? null : pendingCount };
    }

    if (item.id === 'campaigns-active') {
      return { ...item, value: errors.activeCampaigns ? null : activeCampaignCount };
    }

    return item;
  });
};

export const formatDashboardNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return '--';
  }

  return numberFormatter.format(parsed);
};

export const adaptNurseDashboardSnapshot = (snapshot) => {
  const base = buildEmptyData();
  if (!snapshot || typeof snapshot !== 'object') {
    return base;
  }

  const sourceMap = snapshot?.sources || {};
  const sourceErrors = snapshot?.errors || {};

  const examinationsWindow = extractRows(sourceMap[NURSE_DASHBOARD_SOURCE_KEYS.examinationsWindow]);
  const recentExaminations = extractRows(sourceMap[NURSE_DASHBOARD_SOURCE_KEYS.recentExaminations]);
  const medicineAlerts = extractRows(sourceMap[NURSE_DASHBOARD_SOURCE_KEYS.medicineAlerts]);
  const pendingVaccinations = extractRows(sourceMap[NURSE_DASHBOARD_SOURCE_KEYS.pendingVaccinations]);
  const activeCampaigns = extractRows(sourceMap[NURSE_DASHBOARD_SOURCE_KEYS.activeCampaigns]);

  const mappedExamWindowRows = examinationsWindow.rows.map(mapExaminationRow).sort(sortByVisitDateDesc);
  const mappedRecentRows = recentExaminations.rows.map(mapExaminationRow).sort(sortByVisitDateDesc);

  const effectiveRecentRows = (
    mappedRecentRows.length
      ? mappedRecentRows
      : mappedExamWindowRows.slice(0, NURSE_DASHBOARD_RECENT_EXAM_LIMIT)
  );

  const mappedMedicineAlerts = medicineAlerts.rows.map(mapMedicineAlertRow).slice(0, NURSE_DASHBOARD_MEDICINE_ALERT_LIMIT);
  const mappedPendingRows = pendingVaccinations.rows.map(mapPendingVaccinationRow).slice(0, NURSE_DASHBOARD_PENDING_LIMIT);

  const trendPoints = buildTrendPoints(mappedExamWindowRows, snapshot.generatedAt);
  const visitsToday = trendPoints[trendPoints.length - 1]?.value || 0;
  const visitsSevenDays = trendPoints.reduce((sum, point) => sum + point.value, 0);

  const lowStockCount = mappedMedicineAlerts.filter((item) => item.alertType === 'LOW_STOCK').length;
  const expiringCount = mappedMedicineAlerts.filter((item) => item.alertType === 'EXPIRING').length;
  const pendingCount = toNumber(pendingVaccinations?.meta?.totalItems, mappedPendingRows.length);
  const activeCampaignCount = toNumber(activeCampaigns?.meta?.totalItems, activeCampaigns.rows.length);

  const hasExamWindowError = toText(sourceErrors[NURSE_DASHBOARD_SOURCE_KEYS.examinationsWindow]);
  const hasRecentExamsError = toText(sourceErrors[NURSE_DASHBOARD_SOURCE_KEYS.recentExaminations]);
  const hasMedicineAlertsError = toText(sourceErrors[NURSE_DASHBOARD_SOURCE_KEYS.medicineAlerts]);
  const hasPendingError = toText(sourceErrors[NURSE_DASHBOARD_SOURCE_KEYS.pendingVaccinations]);
  const hasCampaignError = toText(sourceErrors[NURSE_DASHBOARD_SOURCE_KEYS.activeCampaigns]);

  return {
    hasLoaded: true,
    title: base.title,
    description: base.description,
    generatedAtLabel: formatDateTime(snapshot.generatedAt),
    quickActions: NURSE_DASHBOARD_QUICK_ACTIONS,
    kpis: buildKpis({
      visitsToday,
      visitsSevenDays,
      lowStockCount,
      expiringCount,
      pendingCount,
      activeCampaignCount,
      errors: {
        examinations: hasExamWindowError,
        medicineAlerts: hasMedicineAlertsError,
        pendingVaccinations: hasPendingError,
        activeCampaigns: hasCampaignError,
      },
    }),
    trend: {
      points: trendPoints,
      totalVisits: visitsSevenDays,
      status: deriveBlockStatus({
        error: hasExamWindowError,
        itemCount: trendPoints.filter((item) => item.value > 0).length,
      }),
      error: hasExamWindowError,
    },
    panels: {
      medicineAlerts: {
        items: mappedMedicineAlerts,
        status: deriveBlockStatus({
          error: hasMedicineAlertsError,
          itemCount: mappedMedicineAlerts.length,
        }),
        error: hasMedicineAlertsError,
        to: '/nurse/medicines',
      },
      pendingVaccinations: {
        items: mappedPendingRows,
        status: deriveBlockStatus({
          error: hasPendingError,
          itemCount: mappedPendingRows.length,
        }),
        error: hasPendingError,
        to: '/nurse/vaccinations/pending',
      },
    },
    recentExaminations: {
      items: effectiveRecentRows,
      status: deriveBlockStatus({
        error: effectiveRecentRows.length ? '' : hasRecentExamsError,
        itemCount: effectiveRecentRows.length,
      }),
      error: effectiveRecentRows.length ? '' : hasRecentExamsError,
      to: '/nurse/examinations',
    },
  };
};
