import { normalizeApiEnvelope } from '../../../../shared/api/normalizeResponse';
import {
  NURSE_DASHBOARD_EXAM_WINDOW_DAYS,
  NURSE_DASHBOARD_QUICK_ACTIONS,
} from '../constants/nurseDashboardConfig';

const numberFormatter = new Intl.NumberFormat('vi-VN');

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

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
    year: '2-digit',
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

const deriveBlockStatus = ({ itemCount }) => {
  return itemCount > 0 ? 'success' : 'empty';
};

const mapExaminationRow = (item = {}, index = 0) => {
  const id = toText(item.visitId || item.code, `VIS-${index + 1}`);
  const visitDateRaw = item.visitDate;
  const visitDate = parseDate(visitDateRaw);

  return {
    id,
    visitDate: visitDate ? visitDate.toISOString() : '',
    sortTime: visitDate ? visitDate.getTime() : 0,
    visitDateLabel: formatDateOnly(visitDateRaw),
    visitTimeLabel: formatClockTime(visitDateRaw),
    studentName: toText(item.studentName, '--'),
    studentCode: toText(item.code, '--'),
    className: '--', // BE doesn't provide className in RecentExaminationDto
    diagnosis: toText(item.diagnosis, '--'),
  };
};

const mapMedicineAlertRow = (item = {}, alertType = 'LOW_STOCK', index = 0) => {
  const alertTypeLabel = alertType === 'LOW_STOCK' ? 'Dưới ngưỡng' : 'Sắp hết hạn';

  return {
    id: `${toText(item.medicineId, 'MED')}-${index}`,
    medicineName: toText(item.name, '--'),
    alertType,
    alertTypeLabel,
    currentStock: toNumber(item.stockQuantity),
    warningThreshold: toNumber(item.warningThreshold),
    nearestExpiryDateLabel: formatDateOnly(item.expiryDate),
  };
};

const sortByVisitDateDesc = (left, right) => right.sortTime - left.sortTime;

const buildTrendPoints = (recentExaminations, totalVisitsToday) => {
  const referenceDate = new Date();
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

  // Count examinations by date from recentExaminations
  const countsByDate = recentExaminations.reduce((accumulator, item) => {
    const visitDate = parseDate(item.visitDate);
    if (!visitDate) {
      return accumulator;
    }

    const key = toDateKey(visitDate);
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  // Set today's value from BE
  const todayKey = toDateKey(referenceDate);
  countsByDate[todayKey] = totalVisitsToday;

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
  },
  recentExaminations: {
    items: [],
    status: 'empty',
    error: '',
    to: '/nurse/examinations',
  },
});

export const formatDashboardNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return '--';
  }

  return numberFormatter.format(parsed);
};

export const adaptNurseDashboardOverview = (responseOrEnvelope) => {
  const envelope = normalizeApiEnvelope(responseOrEnvelope);
  const base = buildEmptyData();

  if (!envelope || envelope.success === false) {
    return base;
  }

  const data = envelope?.data || {};

  // Extract data from NurseDashboardOverviewDto
  const totalVisitsToday = toNumber(data.totalVisitsToday);
  const recentExaminations = Array.isArray(data.recentExaminations) ? data.recentExaminations : [];
  const lowStockMedicines = Array.isArray(data.lowStockMedicines) ? data.lowStockMedicines : [];
  const expiringMedicines = Array.isArray(data.expiringMedicines) ? data.expiringMedicines : [];
  const pendingVaccinationsCount = toNumber(data.pendingVaccinationsCount);

  // Map examinations
  const mappedRecentRows = recentExaminations.map(mapExaminationRow).sort(sortByVisitDateDesc);

  // Map medicine alerts - combine low stock and expiring
  const mappedLowStock = lowStockMedicines.map((item, index) => mapMedicineAlertRow(item, 'LOW_STOCK', index));
  const mappedExpiring = expiringMedicines.map((item, index) => mapMedicineAlertRow(item, 'EXPIRING', index + lowStockMedicines.length));
  const allMedicineAlerts = [...mappedLowStock, ...mappedExpiring];

  // Build trend points
  const trendPoints = buildTrendPoints(recentExaminations, totalVisitsToday);
  const visitsSevenDays = trendPoints.reduce((sum, point) => sum + point.value, 0);

  // Build KPIs
  const kpis = base.kpis.map((item) => {
    if (item.id === 'visits-today') {
      return { ...item, value: totalVisitsToday };
    }

    if (item.id === 'visits-seven-days') {
      return { ...item, value: visitsSevenDays };
    }

    if (item.id === 'medicines-low-stock') {
      return { ...item, value: lowStockMedicines.length };
    }

    if (item.id === 'medicines-expiring') {
      return { ...item, value: expiringMedicines.length };
    }

    if (item.id === 'vaccinations-pending') {
      return { ...item, value: pendingVaccinationsCount };
    }

    return item;
  });

  return {
    hasLoaded: true,
    title: base.title,
    description: base.description,
    generatedAtLabel: formatDateTime(new Date().toISOString()),
    quickActions: NURSE_DASHBOARD_QUICK_ACTIONS,
    kpis,
    trend: {
      points: trendPoints,
      totalVisits: visitsSevenDays,
      status: deriveBlockStatus({
        itemCount: trendPoints.filter((item) => item.value > 0).length,
      }),
      error: '',
    },
    panels: {
      medicineAlerts: {
        items: allMedicineAlerts,
        status: deriveBlockStatus({
          itemCount: allMedicineAlerts.length,
        }),
        error: '',
        to: '/nurse/medicines',
      },
    },
    recentExaminations: {
      items: mappedRecentRows,
      status: deriveBlockStatus({
        itemCount: mappedRecentRows.length,
      }),
      error: '',
      to: '/nurse/examinations',
    },
  };
};
