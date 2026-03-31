import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';

const ensureArray = (value) => (Array.isArray(value) ? value : []);

export const adaptAdminReportsDashboardResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);

  if (!envelope || envelope.success === false) {
    return {
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
    };
  }

  const data = envelope.data || {};

  return {
    header: data.header || null,
    filterOptions: data.filterOptions || null,
    summaryCards: ensureArray(data.summaryCards),
    chartData: ensureArray(data.chartData),
    classRows: ensureArray(data.classRows),
    sidePanel: {
      highPriorityAlerts: ensureArray(data.sidePanel?.highPriorityAlerts),
      lowSupplies: ensureArray(data.sidePanel?.lowSupplies),
      lowVaccinationCoverage: ensureArray(data.sidePanel?.lowVaccinationCoverage),
    },
    classDetails: data.classDetails && typeof data.classDetails === 'object' ? data.classDetails : {},
  };
};
