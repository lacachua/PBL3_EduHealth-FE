import { normalizeApiEnvelope } from '../../../../shared/api/normalizeResponse';

const STATUS_META = {
  safe: { label: 'An toan', tone: 'success' },
  watch: { label: 'Dang theo doi', tone: 'warning' },
  alert: { label: 'Canh bao', tone: 'danger' },
};

const KPI_META = {
  students: {
    id: 'managed-students',
    title: 'Hoc sinh quan ly',
    icon: 'groups',
    valueClassName: 'text-on-surface',
    chipClassName: 'border-success/25 bg-success-soft text-success',
  },
  examinations: {
    id: 'total-examinations',
    title: 'Luot kham',
    icon: 'clinical_notes',
    valueClassName: 'text-info',
    chipClassName: 'border-info/25 bg-info-soft text-info',
  },
  medicines: {
    id: 'medicine-low-stock',
    title: 'Thuoc can bo sung',
    icon: 'inventory_2',
    valueClassName: 'text-danger',
    chipClassName: 'border-danger/25 bg-danger-soft text-danger',
  },
  vaccination: {
    id: 'vaccination-rate',
    title: 'Tiem chung TB',
    icon: 'vaccines',
    valueClassName: 'text-warning',
    chipClassName: 'border-warning/25 bg-warning-soft text-warning',
  },
};

const EMPTY_MODEL = {
  header: {
    title: 'Bao cao y te tong hop',
    description: 'Phan tich tinh hinh suc khoe hoc sinh va hoat dong y te theo lop hoc.',
  },
  source: 'live',
  sourceNote: '',
  generatedAtLabel: '--',
  appliedFilters: {},
  filterOptions: {
    classOptions: [{ value: 'all', label: 'Tat ca lop' }],
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

const toDateTimeLabel = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString('vi-VN', { hour12: false });
};

const toPercentageLabel = (value) => `${toPositiveNumber(value)}%`;

const calculateSummary = (data) => {
  const classRows = ensureArray(data.classRows);
  const topMedicines = ensureArray(data.topMedicines);
  const diseaseBreakdown = ensureArray(data.diseaseBreakdown);

  return {
    studentCount: classRows.reduce((sum, row) => sum + toPositiveNumber(row.studentCount), 0),
    classCount: classRows.length,
    examinationCount: classRows.reduce((sum, row) => sum + toPositiveNumber(row.examinationCount), 0),
    trackingCount: classRows.reduce((sum, row) => sum + toPositiveNumber(row.trackingCount), 0),
    lowStockCount: topMedicines.filter((item) => item.stockStatus === 'low').length,
    diseaseCount: diseaseBreakdown.reduce((sum, item) => sum + toPositiveNumber(item.count), 0),
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
      hint: `${summary.classCount} lop hoc`,
      badge: 'Tu API',
      badgeTone: 'positive',
    },
    {
      ...KPI_META.examinations,
      value: `${summary.examinationCount}`,
      hint: `${summary.trackingCount} hoc sinh dang theo doi`,
      badge: 'Theo bo loc',
      badgeTone: 'neutral',
    },
    {
      ...KPI_META.medicines,
      value: `${summary.lowStockCount}`,
      hint: `${summary.diseaseCount} ca benh ly ghi nhan`,
      badge: summary.lowStockCount > 0 ? 'Can kiem tra' : 'On dinh',
      badgeTone: summary.lowStockCount > 0 ? 'negative' : 'positive',
    },
    {
      ...KPI_META.vaccination,
      value: `${summary.vaccinationRate}%`,
      hint: 'Trung binh theo lop hoc',
      badge: summary.vaccinationRate >= 80 ? 'Dat' : 'Theo doi',
      badgeTone: summary.vaccinationRate >= 80 ? 'positive' : 'neutral',
      progress: summary.vaccinationRate,
    },
  ];
};

const mapTrend = (trendRows) => {
  const items = trendRows.map((item, index) => ({
    id: item.id || `trend-${index + 1}`,
    label: item.label || `Moc ${index + 1}`,
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
    label: item.label || '--',
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
    name: item.name || '--',
    category: item.category || '--',
    usedQuantity: toPositiveNumber(item.usedQuantity),
    deltaPercent: Number(item.deltaPercent || 0),
    trend: item.trend || 'stable',
    stockStatus: item.stockStatus || 'normal',
    stockLabel: item.stockStatus === 'low' ? 'Ton kho thap' : 'On dinh',
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

export const downloadNurseReportsBlob = ({ blob, filename }) => {
  if (!blob || typeof document === 'undefined') {
    return false;
  }

  return triggerFileDownload(blob, filename || 'bao-cao-y-te-dieu-duong.xlsx');
};

export const exportNurseReportsRowsToExcel = (rows, fileName = 'bao-cao-y-te-tong-hop.xls') => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return false;
  }

  if (typeof document === 'undefined') {
    return false;
  }

  const headers = [
    'Lop hoc',
    'Khoi',
    'Si so',
    'Luot kham',
    'Dang theo doi',
    'Cap thuoc',
    'Ty le tiem chung',
    'Trang thai',
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
    throw new Error(envelope?.message || 'Khong the tai bao cao y te tong hop.');
  }

  const data = envelope.data || {};
  const classOptions = ensureArray(data.filterOptions?.classOptions);

  return {
    header: {
      title: data.header?.title || EMPTY_MODEL.header.title,
      description: data.header?.description || EMPTY_MODEL.header.description,
    },
    source: envelope.meta?.source || 'live',
    sourceNote: envelope.meta?.note || '',
    generatedAtLabel: toDateTimeLabel(data.generatedAt),
    appliedFilters: data.appliedFilters || {},
    filterOptions: {
      classOptions: classOptions.length ? classOptions : EMPTY_MODEL.filterOptions.classOptions,
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
