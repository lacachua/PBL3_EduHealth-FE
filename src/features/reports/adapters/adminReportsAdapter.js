import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { adminReportFilterOptions } from '../constants/adminReportFilterOptions';
import { getCardMetadata } from '../constants/adminReportCardMetadata';

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const mapSummaryCard = (card) => {
  if (!card) return null;

  const metadata = getCardMetadata(card.id);

  return {
    id: card.id || '',
    label: card.label || '',
    value: card.value || '0',
    note: card.note || null,
    progress: card.progress || null,
    icon: metadata.icon,
    iconTone: metadata.iconTone,
    iconFill: metadata.iconFill,
    noteTone: card.note ? metadata.noteTone : 'neutral',
    valueTone: metadata.valueTone,
  };
};

const mapChartData = (chartItem) => {
  if (!chartItem) return null;

  return {
    id: chartItem.classId || chartItem.id,
    classId: chartItem.classId,
    label: chartItem.label || '',
    stable: chartItem.stable || 0,
    followUp: chartItem.followUp || 0,
    highRisk: chartItem.highRisk || 0,
    stablePct: chartItem.stablePct || 0,
    followUpPct: chartItem.followUpPct || 0,
    highRiskPct: chartItem.highRiskPct || 0,
  };
};

const mapClassRow = (row) => {
  if (!row) return null;

  return {
    id: `class-${row.classId}`,
    classId: row.classId,
    className: row.className || '',
    classSize: row.classSize || 0,
    stable: row.stable || 0,
    followUp: row.followUp || 0,
    highRisk: row.highRisk || 0,
    vaccinationCompletionRate: row.vaccinationCompletionRate || 0,
    riskLabel: row.riskLabel || '',
    riskTone: row.riskTone || 'default',
    rowTone: row.rowTone || 'default',
  };
};

const mapHighPriorityAlert = (alert) => {
  if (!alert) return null;

  return {
    id: alert.id || '',
    classId: alert.classId,
    className: alert.className || '',
    severity: alert.severity || '',
    severityTone: alert.severityTone || 'neutral',
    description: alert.description || '',
    metric: alert.metric || '',
    updatedAt: alert.updatedAt || '',
    updatedAtShort: alert.updatedAtShort || '',
  };
};

const mapLowSupply = (supply) => {
  if (!supply) return null;

  return {
    id: supply.id || '',
    name: supply.name || '',
    remaining: supply.remaining || '',
    tone: supply.tone || 'neutral',
    thresholdLabel: supply.thresholdLabel || '',
  };
};

const mapLowVaccinationCoverage = (vac) => {
  if (!vac) return null;

  return {
    id: vac.id || '',
    label: vac.label || '',
    coverage: vac.coverage || 0,
    tone: vac.tone || 'neutral',
    note: vac.note || null,
  };
};

const buildClassOptions = (classRows) => {
  const options = classRows.map((row) => ({
    id: String(row.classId),
    label: `Lớp ${row.className}`,
  }));
  return [{ id: 'all', label: 'Toàn bộ lớp' }, ...options];
};

const filterRowsByRiskThreshold = (rows, riskThreshold) => {
  const normalized = String(riskThreshold || '').toLowerCase();

  if (normalized.includes('cao') || normalized.includes('đỏ')) {
    return rows.filter((row) => row.riskTone === 'danger');
  }

  if (normalized.includes('trung') || normalized.includes('theo')) {
    return rows.filter((row) => row.riskTone === 'warning');
  }

  if (normalized.includes('ổn') || normalized.includes('on')) {
    return rows.filter((row) => row.riskTone === 'success');
  }

  return rows;
};

const mapClassRowToChartData = (row) => {
  const total = Number(row.classSize || 0);
  const stable = Number(row.stable || 0);
  const followUp = Number(row.followUp || 0);
  const highRisk = Number(row.highRisk || 0);

  return {
    id: row.id,
    classId: row.classId,
    label: `Lớp ${row.className}`,
    stable,
    followUp,
    highRisk,
    stablePct: total ? Math.round((stable * 100) / total) : 0,
    followUpPct: total ? Math.round((followUp * 100) / total) : 0,
    highRiskPct: total ? Math.round((highRisk * 100) / total) : 0,
  };
};

const emptyDashboardModel = () => ({
  header: null,
  filterOptions: null,
  summaryCards: [],
  chartData: [],
  classRows: [],
  sidePanel: {
    highPriorityAlerts: [],
    lowSupplies: [],
    lowVaccinationCoverage: [],
  },
  classDetails: {},
  chartMeta: null,
});

export const adaptAdminReportsDashboardResponse = (payload, filters = {}) => {
  const envelope = normalizeApiEnvelope(payload);

  if (!envelope || envelope.success === false) {
    return emptyDashboardModel();
  }

  const data = envelope.data || {};
  const allClassRows = ensureArray(data.classRows).map(mapClassRow).filter(Boolean);
  const mappedClassRows = filterRowsByRiskThreshold(allClassRows, filters.riskThreshold);
  const visibleClassIds = new Set(mappedClassRows.map((row) => row.classId));
  const mappedChartData = ensureArray(data.chartData)
    .map(mapChartData)
    .filter(Boolean)
    .filter((item) => visibleClassIds.has(item.classId));

  return {
    header: data.header || {
      title: 'Báo cáo quản trị y tế học đường',
      description: 'Đánh giá tổng quát sức khỏe học sinh toàn trường.',
    },
    filterOptions: {
      ...adminReportFilterOptions,
      classOptions: buildClassOptions(allClassRows),
    },
    summaryCards: ensureArray(data.summaryCards).map(mapSummaryCard).filter(Boolean),
    chartData: mappedChartData.length ? mappedChartData : mappedClassRows.map(mapClassRowToChartData),
    classRows: mappedClassRows,
    sidePanel: {
      highPriorityAlerts: ensureArray(data.sidePanel?.highPriorityAlerts).map(mapHighPriorityAlert).filter(Boolean),
      lowSupplies: ensureArray(data.sidePanel?.lowSupplies).map(mapLowSupply).filter(Boolean),
      lowVaccinationCoverage: ensureArray(data.sidePanel?.lowVaccinationCoverage).map(mapLowVaccinationCoverage).filter(Boolean),
    },
    classDetails: data.classDetails && typeof data.classDetails === 'object' ? data.classDetails : {},
    chartMeta: {
      title: 'Phân bố trạng thái sức khỏe theo lớp',
      description: 'Theo dõi tỷ trọng ổn định, theo dõi và nguy cơ cao trên từng lớp học.',
      grouping: 'class',
      groupingHint: null,
    },
  };
};
