import { normalizeApiEnvelope } from '../../../../shared/api/normalizeResponse';
import { nurseReportFilterOptions } from '../config/nurseReportFilterOptions';

const STATUS_META = {
  stable: { label: 'á»”n Ä‘á»‹nh', tone: 'success' },
  watch: { label: 'Cáº§n theo dÃµi', tone: 'warning' },
  unknown: { label: 'ChÆ°a Ä‘á»§ dá»¯ liá»‡u', tone: 'neutral' },
};

const KPI_META = {
  students: {
    id: 'managed-students',
    title: 'Há»c sinh quáº£n lÃ½',
    icon: 'groups',
    valueClassName: 'text-on-surface',
    chipClassName: 'border-success/25 bg-success-soft text-success',
  },
  examinations: {
    id: 'total-examinations',
    title: 'LÆ°á»£t khÃ¡m',
    icon: 'clinical_notes',
    valueClassName: 'text-info',
    chipClassName: 'border-info/25 bg-info-soft text-info',
  },
  medicines: {
    id: 'medicine-dispenses',
    title: 'LÆ°á»£t cáº¥p thuá»‘c',
    icon: 'medication',
    valueClassName: 'text-danger',
    chipClassName: 'border-danger/25 bg-danger-soft text-danger',
  },
  vaccination: {
    id: 'vaccination-rate',
    title: 'Tá»· lá»‡ tiÃªm chá»§ng TB',
    icon: 'vaccines',
    valueClassName: 'text-warning',
    chipClassName: 'border-warning/25 bg-warning-soft text-warning',
  },
};

const EMPTY_MODEL = {
  header: {
    title: 'BÃ¡o cÃ¡o y táº¿ tá»•ng há»£p',
    description: 'PhÃ¢n tÃ­ch tÃ¬nh hÃ¬nh sá»©c khá»e há»c sinh vÃ  hoáº¡t Ä‘á»™ng y táº¿ theo lá»›p há»c.',
  },
  source: 'live',
  sourceNote: '',
  generatedAt: null,
  generatedAtLabel: '--',
  reportPeriodLabel: 'Thá»i gian bÃ¡o cÃ¡o: --',
  filterSummaryLabel: 'Bá»™ lá»c: Tá»•ng há»£p, táº¥t cáº£ khá»‘i, táº¥t cáº£ lá»›p',
  appliedFilters: {},
  filterOptions: {
    classOptions: [{ value: 'all', label: 'Táº¥t cáº£ lá»›p' }],
  },
  summaryCards: [],
  trend: {
    items: [],
    maxValue: 0,
  },
  disease: {
    totalCases: 0,
    items: [],
  },
  insights: {
    topMedicines: [],
    alerts: [],
  },
  classRows: [],
};

const DISEASE_COLORS = [
  'var(--success)',
  'var(--warning)',
  'var(--danger)',
  'var(--info)',
  'var(--primary)',
];

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const toPositiveNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return parsed > 0 ? parsed : 0;
};

export const formatNurseReportDateTime = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  const pad = (part) => String(part).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toPercentageLabel = (value) => `${toPositiveNumber(value)}%`;

const findOptionLabel = (options, value, fallback) => {
  if (value === 'examination') return 'KhÃ¡m bá»‡nh';
  return options.find((option) => option.value === value)?.label || fallback;
};

const normalizeTimeRange = (value) => {
  if (value === 'custom-range') return 'custom';
  return value || 'this-month';
};

const startOfDay = (date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const startOfWeek = (date) => {
  const nextDate = startOfDay(date);
  const day = nextDate.getDay() || 7;
  nextDate.setDate(nextDate.getDate() - day + 1);
  return nextDate;
};

const buildReportPeriodLabel = ({ filters = {}, generatedAt }) => {
  const end = generatedAt ? new Date(generatedAt) : new Date();
  const safeEnd = Number.isNaN(end.getTime()) ? new Date() : end;
  let start;

  if (filters.fromDate) {
    start = new Date(filters.fromDate);
  } else {
    const timeRange = normalizeTimeRange(filters.timeRange);
    if (timeRange === 'today') {
      start = startOfDay(safeEnd);
    } else if (timeRange === 'this-week') {
      start = startOfWeek(safeEnd);
    } else if (timeRange === 'this-quarter') {
      start = new Date(safeEnd.getFullYear(), Math.floor(safeEnd.getMonth() / 3) * 3, 1);
    } else if (timeRange === 'this-year') {
      start = new Date(safeEnd.getFullYear(), 0, 1);
    } else {
      start = new Date(safeEnd.getFullYear(), safeEnd.getMonth(), 1);
    }
  }

  const toDate = filters.toDate ? new Date(filters.toDate) : safeEnd;
  const safeStart = Number.isNaN(start.getTime()) ? startOfDay(safeEnd) : start;
  const safeToDate = Number.isNaN(toDate.getTime()) ? safeEnd : toDate;

  return `Thá»i gian bÃ¡o cÃ¡o: ${formatNurseReportDateTime(safeStart)} - ${formatNurseReportDateTime(safeToDate)}`;
};

const buildFilterSummary = ({ filters = {}, classOptions = [] }) => {
  const timeRange = normalizeTimeRange(filters.timeRange);
  const timeLabel = findOptionLabel(nurseReportFilterOptions.timeRanges, timeRange, 'ThÃ¡ng nÃ y');
  const reportTypeLabel = findOptionLabel(nurseReportFilterOptions.reportTypes, filters.reportType, 'Tá»•ng há»£p');
  const gradeLabel = findOptionLabel(nurseReportFilterOptions.grades, filters.grade, 'Táº¥t cáº£ khá»‘i');
  const classLabel = findOptionLabel(classOptions, filters.classId, 'Táº¥t cáº£ lá»›p');
  return `Bá»™ lá»c: ${timeLabel}, ${reportTypeLabel}, ${gradeLabel}, ${classLabel}`;
};

const calculateSummary = (data) => {
  const classRows = ensureArray(data.classRows);

  return {
    studentCount: classRows.reduce((sum, row) => sum + toPositiveNumber(row.studentCount), 0),
    classCount: classRows.length,
    examinationCount: classRows.reduce((sum, row) => sum + toPositiveNumber(row.examinationCount), 0),
    trackingCount: classRows.reduce((sum, row) => sum + toPositiveNumber(row.trackingCount), 0),
    medicineDispenseCount: classRows.reduce((sum, row) => sum + toPositiveNumber(row.medicineDispenseCount), 0),
    vaccinationRate: classRows.length
      ? Math.round(classRows.reduce((sum, row) => sum + toPositiveNumber(row.vaccinationRate), 0) / classRows.length)
      : 0,
  };
};

const buildSummaryCardsFromDto = (data) => {
  const summary = calculateSummary(data);

  return [
    {
      ...KPI_META.students,
      value: `${summary.studentCount}`,
      hint: `${summary.classCount} lá»›p há»c`,
      badge: 'ÄÃ£ Ä‘á»“ng bá»™',
      badgeTone: 'positive',
    },
    {
      ...KPI_META.examinations,
      value: `${summary.examinationCount}`,
      hint: `${summary.trackingCount} há»c sinh Ä‘ang theo dÃµi`,
      badge: 'Theo bá»™ lá»c',
      badgeTone: 'neutral',
    },
    {
      ...KPI_META.medicines,
      value: `${summary.medicineDispenseCount}`,
      hint: 'Sá»‘ lÆ°á»£ng thuá»‘c Ä‘Ã£ cáº¥p trong ká»³',
      badge: 'Theo bá»™ lá»c',
      badgeTone: 'neutral',
    },
    {
      ...KPI_META.vaccination,
      value: `${summary.vaccinationRate}%`,
      hint: 'Trung bÃ¬nh theo lá»›p há»c',
      badge: summary.vaccinationRate >= 80 ? 'á»”n Ä‘á»‹nh' : 'Cáº§n theo dÃµi',
      badgeTone: summary.vaccinationRate >= 80 ? 'positive' : 'negative',
      progress: summary.vaccinationRate,
    },
  ];
};

const mapTrend = (trendRows) => {
  const items = trendRows.map((item, index) => ({
    id: item.id || `trend-${index + 1}`,
    label: item.label || `Tuáº§n ${index + 1}`,
    value: toPositiveNumber(item.value),
  }));

  const maxValue = items.reduce((max, item) => Math.max(max, item.value), 0);

  return {
    items,
    maxValue,
  };
};

const mapDiseaseBreakdown = (rows) => {
  const items = rows.map((item, index) => ({
    id: item.id || `disease-${index + 1}`,
    label: item.label || 'ChÆ°a phÃ¢n loáº¡i',
    count: toPositiveNumber(item.count),
    color: DISEASE_COLORS[index % DISEASE_COLORS.length],
  }));
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return {
    totalCases: total,
    items: items.map((item) => ({
      ...item,
      ratio: total ? Math.round((item.count / total) * 100) : 0,
    })),
  };
};

const mapTopMedicines = (rows) => {
  return rows.map((item, index) => ({
    id: item.id || `medicine-${index + 1}`,
    name: item.name || 'ChÆ°a rÃµ tÃªn thuá»‘c',
    category: item.category || 'ChÆ°a phÃ¢n loáº¡i',
    usedQuantity: toPositiveNumber(item.usedQuantity),
    deltaPercent: Number(item.deltaPercent || 0),
    trend: item.trend || 'stable',
    stockStatus: item.stockStatus || 'normal',
    stockLabel: item.stockStatus === 'low' ? 'Tá»“n kho tháº¥p' : 'á»”n Ä‘á»‹nh',
  }));
};

const mapAlerts = (rows) => {
  return rows.map((item, index) => ({
    id: item.id || `alert-${index + 1}`,
    tone: item.tone || 'info',
    title: item.title || 'Cáº§n rÃ  soÃ¡t dá»¯ liá»‡u',
    message: item.message || 'ChÆ°a cÃ³ mÃ´ táº£ chi tiáº¿t.',
    timeLabel: item.timeLabel || 'Trong ká»³ bÃ¡o cÃ¡o',
  }));
};

const resolveStatus = (row) => {
  const hasAnyData = [
    row.studentCount,
    row.examinationCount,
    row.trackingCount,
    row.medicineDispenseCount,
    row.vaccinationRate,
  ].some((value) => toPositiveNumber(value) > 0);

  if (!hasAnyData) {
    return 'unknown';
  }

  const studentCount = toPositiveNumber(row.studentCount);
  const trackingCount = toPositiveNumber(row.trackingCount);
  const vaccinationRate = toPositiveNumber(row.vaccinationRate);
  const trackingRatio = studentCount ? trackingCount / studentCount : 0;

  if (vaccinationRate < 50 || trackingRatio >= 0.2) {
    return 'watch';
  }

  return 'stable';
};

const mapClassRows = (rows) => {
  return rows.map((row, index) => {
    const statusKey = resolveStatus(row);
    const statusMeta = STATUS_META[statusKey] || STATUS_META.unknown;

    return {
      id: row.id || `class-${index + 1}`,
      className: row.className || 'ChÆ°a rÃµ lá»›p',
      grade: row.grade || 'all',
      gradeLabel: row.gradeLabel || 'ChÆ°a rÃµ khá»‘i',
      studentCount: toPositiveNumber(row.studentCount),
      examinationCount: toPositiveNumber(row.examinationCount),
      trackingCount: toPositiveNumber(row.trackingCount),
      medicineDispenseCount: toPositiveNumber(row.medicineDispenseCount),
      vaccinationRate: toPositiveNumber(row.vaccinationRate),
      vaccinationRateLabel: toPercentageLabel(row.vaccinationRate),
      statusKey,
      statusLabel: statusMeta.label,
      statusTone: statusMeta.tone,
    };
  });
};

const triggerFileDownload = (blob, fileName) => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
  return true;
};

export const downloadNurseReportsBlob = ({ blob, filename }) => {
  if (!blob || typeof document === 'undefined') {
    return false;
  }

  return triggerFileDownload(blob, filename || 'bao-cao-y-te-dieu-duong.xlsx');
};

export const adaptNurseReportsDashboardResponse = (payload, filters = {}) => {
  const envelope = normalizeApiEnvelope(payload);

  if (!envelope || envelope.success === false) {
    throw new Error(envelope?.message || 'KhÃ´ng thá»ƒ táº£i bÃ¡o cÃ¡o y táº¿ tá»•ng há»£p.');
  }

  const data = envelope.data || {};
  const requestedTimeRange = normalizeTimeRange(filters.timeRange);
  const responseTimeRange = normalizeTimeRange(data.appliedFilters?.timeRange);
  const appliedFilters = {
    ...filters,
    ...(data.appliedFilters || {}),
    timeRange: ['today', 'this-year', 'custom'].includes(requestedTimeRange)
      ? requestedTimeRange
      : responseTimeRange,
  };
  const classOptions = ensureArray(data.filterOptions?.classOptions).map((option) => ({
    value: option.value,
    label: option.value === 'all' ? 'Táº¥t cáº£ lá»›p' : option.label,
  }));
  const resolvedClassOptions = classOptions.length ? classOptions : EMPTY_MODEL.filterOptions.classOptions;
  const generatedAt = data.generatedAt || null;

  return {
    header: {
      title: data.header?.title || EMPTY_MODEL.header.title,
      description: data.header?.description || EMPTY_MODEL.header.description,
    },
    source: envelope.meta?.source || 'live',
    sourceNote: envelope.meta?.note || '',
    generatedAt,
    generatedAtLabel: formatNurseReportDateTime(generatedAt),
    reportPeriodLabel: buildReportPeriodLabel({ filters: appliedFilters, generatedAt }),
    filterSummaryLabel: buildFilterSummary({ filters: appliedFilters, classOptions: resolvedClassOptions }),
    appliedFilters,
    filterOptions: {
      classOptions: resolvedClassOptions,
    },
    summaryCards: buildSummaryCardsFromDto(data),
    trend: mapTrend(ensureArray(data.trend)),
    disease: mapDiseaseBreakdown(ensureArray(data.diseaseBreakdown)),
    insights: {
      topMedicines: mapTopMedicines(ensureArray(data.topMedicines)),
      alerts: mapAlerts(ensureArray(data.riskAlerts)),
    },
    classRows: mapClassRows(ensureArray(data.classRows)),
  };
};

export const createEmptyNurseReportsViewModel = () => EMPTY_MODEL;
