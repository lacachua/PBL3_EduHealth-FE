import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { ADMIN_REPORT_TYPE_LABELS } from '../../../shared/constants/adminLabels';

const statusTone = {
  ready: 'success',
  processing: 'warning',
};

const statusLabel = {
  ready: 'Sẵn sàng',
  processing: 'Đang xử lý',
};

const rangeLabel = {
  week: 'Tuần này',
  month: 'Tháng này',
  quarter: 'Quý này',
  'school-year': 'Năm học này',
};

const scopeLabel = {
  all: 'Toàn trường',
  'khoi 1': 'Khối 1',
  'khoi 2': 'Khối 2',
  'khoi 3': 'Khối 3',
};

export const adaptReportsManagementResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);

  if (!envelope || envelope.success === false) {
    return { rows: [], totalItems: 0 };
  }

  const rows = Array.isArray(envelope.data?.reports)
    ? envelope.data.reports.map((item) => ({
      ...item,
      reportTypeLabel: ADMIN_REPORT_TYPE_LABELS[item.reportType] || item.reportType,
      rangeLabel: rangeLabel[item.range] || item.range,
      scopeLabel: scopeLabel[item.scope] || item.scope,
      statusLabel: statusLabel[item.status] || item.status,
      statusTone: statusTone[item.status] || 'neutral',
    }))
    : [];

  return {
    rows,
    totalItems: Number(envelope.meta?.totalItems || rows.length),
  };
};
