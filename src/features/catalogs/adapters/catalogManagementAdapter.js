import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';

const toneMap = {
  active: 'success',
  review: 'warning',
};

const labelMap = {
  active: 'Đang dùng',
  review: 'Cần rà soát',
};

export const adaptCatalogManagementResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);

  if (!envelope || envelope.success === false) {
    return { group: 'vaccines', rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 };
  }

  const rows = Array.isArray(envelope.data?.items)
    ? envelope.data.items.map((item) => ({
      ...item,
      statusLabel: labelMap[item.status] || item.status,
      statusTone: toneMap[item.status] || 'neutral',
    }))
    : [];

  return {
    group: envelope.data?.group || 'vaccines',
    rows,
    page: Number(envelope.meta?.page || 1),
    pageSize: Number(envelope.meta?.pageSize || 10),
    totalItems: Number(envelope.meta?.totalItems || rows.length),
    totalPages: Number(envelope.meta?.totalPages || 1),
  };
};
