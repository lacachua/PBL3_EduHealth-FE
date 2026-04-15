import { normalizeApiEnvelope } from '../../../../shared/api/normalizeResponse';

const STATUS_META = {
  safe: { label: 'An toàn', tone: 'success' },
  watch: { label: 'Đang theo dõi', tone: 'warning' },
  alert: { label: 'Cảnh báo', tone: 'danger' },
};

const KPI_META = {
  examinations: {
    id: 'total-examinations',
    title: 'Tổng lượt khám',
    icon: 'clinical_notes',
    valueClassName: 'text-on-surface',
    chipClassName: 'border-success/25 bg-success-soft text-success',
  },
  tracking: {
    id: 'tracking-students',
    title: 'Đang theo dõi',
    icon: 'monitoring',
    valueClassName: 'text-warning',
    chipClassName: 'border-warning/25 bg-warning-soft text-warning',
  },
  stock: {
    id: 'medicine-low-stock',
    title: 'Tồn kho thuốc',
    icon: 'inventory_2',
    valueClassName: 'text-danger',
    chipClassName: 'border-danger/25 bg-danger-soft text-danger',
  },
  vaccination: {
    id: 'vaccination-rate',
    title: 'Tỷ lệ tiêm chủng',
    icon: 'vaccines',
    valueClassName: 'text-info',
    chipClassName: 'border-info/25 bg-info-soft text-info',
  },
};

const EMPTY_MODEL = {
  header: {
    title: 'Báo cáo y tế tổng hợp',
    description: 'Phân tích tình hình sức khỏe học sinh và hiệu quả hoạt động của trạm y tế.',
  },
  source: 'mock',
  sourceNote: '',
  generatedAtLabel: '--',
  filterOptions: {
    classOptions: [{ value: 'all', label: 'Tất cả lớp' }],
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

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const toPositiveNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return parsed > 0 ? parsed : 0;
};

const toDateTimeLabel = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString('vi-VN', { hour12: false });
};

const toPercentageLabel = (value) => `${toPositiveNumber(value)}%`;

const buildSummaryCards = ({ trendItems, classRows, topMedicines }) => {
  const totalExaminations = classRows.reduce((sum, item) => sum + toPositiveNumber(item.examinationCount), 0);
  const totalTracking = classRows.reduce((sum, item) => sum + toPositiveNumber(item.trackingCount), 0);
  const lowStockCount = topMedicines.filter((item) => item.stockStatus === 'low').length;

  const totalStudents = classRows.reduce((sum, item) => sum + toPositiveNumber(item.studentCount), 0);
  const weightedVaccination = classRows.reduce(
    (sum, item) => sum + (toPositiveNumber(item.studentCount) * toPositiveNumber(item.vaccinationRate)),
    0
  );
  const vaccinationRate = totalStudents ? Math.round(weightedVaccination / totalStudents) : 0;

  const latestTrend = trendItems[trendItems.length - 1]?.value || 0;
  const previousTrend = trendItems[trendItems.length - 2]?.value || 0;
  const trendDelta = previousTrend > 0
    ? Math.round(((latestTrend - previousTrend) / previousTrend) * 100)
    : 0;

  return [
    {
      ...KPI_META.examinations,
      value: `${totalExaminations}`,
      hint: 'Theo bộ lọc hiện tại',
      badge: `${trendDelta >= 0 ? '+' : ''}${trendDelta}%`,
      badgeTone: trendDelta >= 0 ? 'positive' : 'negative',
    },
    {
      ...KPI_META.tracking,
      value: `${totalTracking}`,
      hint: 'Học sinh cần theo dõi',
      badge: 'Theo thời gian thực',
      badgeTone: 'neutral',
    },
    {
      ...KPI_META.stock,
      value: `${lowStockCount}`,
      hint: 'Thuốc tồn kho thấp',
      badge: lowStockCount ? 'Cần bổ sung' : 'Ổn định',
      badgeTone: lowStockCount ? 'negative' : 'positive',
    },
    {
      ...KPI_META.vaccination,
      value: toPercentageLabel(vaccinationRate),
      hint: 'Tỷ lệ tiêm hoàn thành',
      badge: 'Đã đồng bộ',
      badgeTone: 'neutral',
      progress: vaccinationRate,
    },
  ];
};

const mapTrend = (trendRows) => {
  const items = trendRows.map((item, index) => ({
    id: item.id || `trend-${index + 1}`,
    label: item.label || `Mốc ${index + 1}`,
    value: toPositiveNumber(item.value),
  }));

  const maxValue = items.reduce((max, item) => Math.max(max, item.value), 0);

  return {
    items,
    maxValue,
  };
};

const mapDisease = (diseaseRows) => {
  const rows = diseaseRows.map((item, index) => ({
    id: item.id || `disease-${index + 1}`,
    label: item.label || 'Khác',
    count: toPositiveNumber(item.count),
    color: item.color || 'var(--app-border)',
  }));

  const totalCases = rows.reduce((sum, item) => sum + item.count, 0);

  return {
    totalCases,
    items: rows.map((item) => ({
      ...item,
      ratio: totalCases ? Math.round((item.count / totalCases) * 100) : 0,
    })),
  };
};

const mapTopMedicines = (rows) => {
  return rows.map((item, index) => ({
    id: item.id || `medicine-${index + 1}`,
    name: item.name || '--',
    category: item.category || '--',
    usedQuantity: toPositiveNumber(item.usedQuantity),
    deltaPercent: Number(item.deltaPercent || 0),
    trend: item.trend || 'stable',
    stockStatus: item.stockStatus || 'normal',
    stockLabel: item.stockStatus === 'low' ? 'Tồn kho thấp' : 'Ổn định',
  }));
};

const mapAlerts = (rows) => {
  return rows.map((item, index) => ({
    id: item.id || `alert-${index + 1}`,
    tone: item.tone || 'info',
    title: item.title || '--',
    message: item.message || '--',
    timeLabel: item.timeLabel || '--',
  }));
};

const mapClassRows = (rows) => {
  return rows.map((row, index) => {
    const statusKey = row.status || 'safe';
    const statusMeta = STATUS_META[statusKey] || STATUS_META.safe;

    return {
      id: row.id || `class-${index + 1}`,
      className: row.className || '--',
      grade: row.grade || '--',
      gradeLabel: row.gradeLabel || '--',
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

const escapeHtmlValue = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

export const exportNurseReportsRowsToExcel = (rows, fileName = 'bao-cao-y-te-tong-hop.xls') => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return false;
  }

  if (typeof document === 'undefined') {
    return false;
  }

  const headers = [
    'Lớp học',
    'Khối',
    'Sĩ số',
    'Lượt khám',
    'Đang theo dõi',
    'Cấp thuốc',
    'Tỷ lệ tiêm chủng',
    'Trạng thái',
  ];

  const contentRows = rows.map((row) => [
    row.className,
    row.gradeLabel,
    row.studentCount,
    row.examinationCount,
    row.trackingCount,
    row.medicineDispenseCount,
    row.vaccinationRateLabel,
    row.statusLabel,
  ]);

  const tableHeader = headers
    .map((header) => `<th>${escapeHtmlValue(header)}</th>`)
    .join('');

  const tableBody = contentRows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtmlValue(cell)}</td>`).join('')}</tr>`)
    .join('');

  const excelHtml = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="UTF-8" />',
    '<style>',
    'table{border-collapse:collapse;font-family:Segoe UI,Arial,sans-serif;font-size:12px;}',
    'th,td{border:1px solid lightgray;padding:6px 8px;text-align:left;}',
    'th{background:whitesmoke;font-weight:700;}',
    '</style>',
    '</head>',
    '<body>',
    `<table><thead><tr>${tableHeader}</tr></thead><tbody>${tableBody}</tbody></table>`,
    '</body>',
    '</html>',
  ].join('');

  const blob = new Blob([`\uFEFF${excelHtml}`], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });

  return triggerFileDownload(blob, fileName);
};

export const adaptNurseReportsDashboardResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);

  if (!envelope || envelope.success === false) {
    return EMPTY_MODEL;
  }

  const data = envelope.data || {};
  const classRows = mapClassRows(ensureArray(data.classRows));
  const trend = mapTrend(ensureArray(data.trend));
  const disease = mapDisease(ensureArray(data.diseaseBreakdown));
  const medicines = mapTopMedicines(ensureArray(data.topMedicines));

  return {
    header: {
      title: data.header?.title || EMPTY_MODEL.header.title,
      description: data.header?.description || EMPTY_MODEL.header.description,
    },
    source: envelope.meta?.source || 'mock',
    sourceNote: envelope.meta?.note || '',
    generatedAtLabel: toDateTimeLabel(data.generatedAt),
    filterOptions: {
      classOptions: ensureArray(data.filterOptions?.classOptions).length
        ? ensureArray(data.filterOptions?.classOptions)
        : EMPTY_MODEL.filterOptions.classOptions,
    },
    summaryCards: buildSummaryCards({
      trendItems: trend.items,
      classRows,
      topMedicines: medicines,
    }),
    trend,
    disease,
    insights: {
      topMedicines: medicines,
      alerts: mapAlerts(ensureArray(data.riskAlerts)),
    },
    classRows,
  };
};

export const createEmptyNurseReportsViewModel = () => EMPTY_MODEL;
