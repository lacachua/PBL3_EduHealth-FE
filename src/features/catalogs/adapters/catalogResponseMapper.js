import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { mapCatalogStatusLabel, mapCatalogStatusTone } from './catalogStatusMapper';

const defaultListModel = {
  group: 'vaccines',
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

const toDisplayDate = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN', { hour12: false });
};

const mapCatalogRecord = (item = {}, fallbackGroup = 'vaccines') => {
  const status = item.status || item.state || 'inactive';

  return {
    id: item.id || item.code || '--',
    code: item.code || item.id || '--',
    name: item.name || '--',
    shortDescription: item.shortDescription || item.description || '--',
    description: item.description || item.shortDescription || '--',
    status,
    statusLabel: mapCatalogStatusLabel(status),
    statusTone: mapCatalogStatusTone(status),
    createdAt: toDisplayDate(item.createdAt),
    updatedAt: toDisplayDate(item.updatedAt),
    group: item.group || item.type || fallbackGroup,
    metadata: item.metadata || null,
  };
};

export const mapCatalogListResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (!envelope || envelope.success === false) {
    return defaultListModel;
  }

  const sourceRows = Array.isArray(envelope.data)
    ? envelope.data
    : Array.isArray(envelope.data?.items)
      ? envelope.data.items
      : [];

  const group = envelope.data?.group || envelope.data?.type || 'vaccines';
  const rows = sourceRows.map((item) => mapCatalogRecord(item, group));

  return {
    group,
    rows,
    page: Number(envelope.meta?.page || 1),
    pageSize: Number(envelope.meta?.pageSize || 10),
    totalItems: Number(envelope.meta?.totalItems || rows.length),
    totalPages: Number(envelope.meta?.totalPages || 1),
  };
};

export const mapCatalogDetailResponse = (responseOrPayload, fallbackGroup = 'vaccines') => {
  const envelope = normalizeApiEnvelope(responseOrPayload);
  if (!envelope || envelope.success === false || !envelope.data) {
    return null;
  }

  const detailSource = envelope.data.item || envelope.data;
  return mapCatalogRecord(detailSource, fallbackGroup);
};
