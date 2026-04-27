import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { extractRows, extractMeta, extractItem } from '../../../shared/adapters/envelopeAdapter';
import { formatDateTime } from '../../../shared/utils/dateFormat';
import { mapCatalogStatusLabel, mapCatalogStatusTone } from './catalogStatusMapper';

const defaultListModel = {
  group: 'vaccines',
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

const toDisplayDate = (value) => formatDateTime(value);

const mapCatalogRecord = (item = {}, fallbackGroup = 'vaccines') => {
  const status = item.status || item.state || 'inactive';

  return {
    id: item.id || item.code || '--',
    code: item.code || item.id || '--',
    name: item.name || '--',
    description: item.description || '--',
    status,
    statusLabel: mapCatalogStatusLabel(status),
    statusTone: mapCatalogStatusTone(status),
    createdAt: toDisplayDate(item.createdAt),
    updatedAt: toDisplayDate(item.updatedAt),
    group: item.group || item.type || fallbackGroup,
    metadata: item.metadata || null,
  };
};

export const mapCatalogListResponse = (responseOrPayload, fallbackGroup = 'vaccines') => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (!envelope || envelope.success === false) {
    return defaultListModel;
  }

  const sourceRows = extractRows(envelope);
  const group = envelope.data?.group || envelope.data?.type || fallbackGroup;
  const rows = sourceRows.map((item) => mapCatalogRecord(item, group));
  const meta = extractMeta(envelope, defaultListModel);

  return {
    group,
    rows,
    ...meta,
  };
};

export const mapCatalogDetailResponse = (responseOrPayload, fallbackGroup = 'vaccines') => {
  const envelope = normalizeApiEnvelope(responseOrPayload);
  const detailSource = extractItem(envelope);

  if (!detailSource) {
    return null;
  }

  return mapCatalogRecord(detailSource, fallbackGroup);
};

/**
 * Map the groups response from BE (CatalogGroupDto[]) to the FE tab format.
 * BE shape: { key: "vaccines", label: "Vắc xin" }
 * FE shape: { value: "vaccines", label: "Vắc xin" }
 */
export const mapCatalogGroupsResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);
  if (!envelope || envelope.success === false || !Array.isArray(envelope.data)) {
    return null;
  }

  return envelope.data.map((group) => ({
    value: group.key || group.value || '',
    label: group.label || group.name || '',
  }));
};

