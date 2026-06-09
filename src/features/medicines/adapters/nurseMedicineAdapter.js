import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { extractRows, extractMeta } from '../../../shared/adapters/envelopeAdapter';
import { formatDateTime } from '../../../shared/utils/dateFormat';
import {
  ALERT_TYPE_LABELS,
  DISPOSE_REASON_LABELS,
  MEDICINE_ALERT_BADGE_CLASS,
  MEDICINE_ALERT_LABELS,
  MEDICINE_BATCH_STATUS_LABELS,
  MEDICINE_BATCH_STATUS_TONES,
  MEDICINE_STATUS_BADGE_CLASS,
  MEDICINE_STATUS_LABELS,
  MEDICINE_UNIT_LABELS,
  MOVEMENT_TYPE_BADGE_CLASS,
  MOVEMENT_TYPE_LABELS,
} from '../constants/nurseMedicineConstants';

const EMPTY_LIST_META = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

export const formatDateOnly = (value) => {
  if (!value) return null;

  const normalized = String(value).split('T')[0];
  const [year, month, day] = normalized.split('-');
  if (!year || !month || !day) {
    return String(value);
  }

  return `${day}/${month}/${year}`;
};

const toAlertKey = (item) => {
  if (item.isLowStock && item.isExpiringSoon) return 'mixed';
  if (item.isLowStock) return 'lowStock';
  if (item.isExpiringSoon) return 'expiring';
  return 'none';
};

const mapMedicineBatch = (batch = {}) => ({
  ...batch,
  receivedAtLabel: formatDateOnly(batch.receivedAt),
  expiryDateLabel: formatDateOnly(batch.expiryDate),
  statusLabel: MEDICINE_BATCH_STATUS_LABELS[batch.status] || batch.status || null,
  statusTone: MEDICINE_BATCH_STATUS_TONES[batch.status] || 'neutral',
  initialQuantity: Number(batch.initialQuantity ?? 0),
  remainingQuantity: Number(batch.remainingQuantity ?? 0),
  isExpiringSoon: Boolean(batch.isExpiringSoon),
  isExpired: Boolean(batch.isExpired),
  isFefoPriority: Boolean(batch.isFefoPriority),
});

export const mapMedicineListEnvelope = (response) => {
  const envelope = normalizeApiEnvelope(response);
  if (!envelope || envelope.success === false) {
    return {
      rows: [],
      ...EMPTY_LIST_META,
    };
  }

  const rows = extractRows(envelope);
  const meta = extractMeta(envelope, EMPTY_LIST_META);

  return {
    rows: rows.map((item) => {
      const alertKey = toAlertKey(item);
      return {
        ...item,
        statusLabel: MEDICINE_STATUS_LABELS[item.status] || item.status || null,
        unitLabel: MEDICINE_UNIT_LABELS[item.unit] || item.unit || null,
        statusBadgeClass: MEDICINE_STATUS_BADGE_CLASS[item.status] || MEDICINE_STATUS_BADGE_CLASS.INACTIVE,
        alertKey,
        alertLabel: MEDICINE_ALERT_LABELS[alertKey],
        alertBadgeClass: MEDICINE_ALERT_BADGE_CLASS[alertKey],
        nearestExpiryDateLabel: formatDateOnly(item.nearestExpiryDate),
      };
    }),
    page: Number(meta.page || 1),
    pageSize: Number(meta.pageSize || 10),
    totalItems: Number(meta.totalItems || 0),
    totalPages: Number(meta.totalPages || 0),
  };
};
export const mapMedicineDetailEnvelope = (response) => {
  const envelope = normalizeApiEnvelope(response);
  if (!envelope || envelope.success === false || !envelope.data) {
    return null;
  }

  const item = envelope.data;
  const alertKey = toAlertKey(item);

  return {
    ...item,
    statusLabel: MEDICINE_STATUS_LABELS[item.status] || item.status || null,
    unitLabel: MEDICINE_UNIT_LABELS[item.unit] || item.unit || null,
    statusBadgeClass: MEDICINE_STATUS_BADGE_CLASS[item.status] || MEDICINE_STATUS_BADGE_CLASS.INACTIVE,
    alertKey,
    alertLabel: MEDICINE_ALERT_LABELS[alertKey],
    alertBadgeClass: MEDICINE_ALERT_BADGE_CLASS[alertKey],
    nearestExpiryDateLabel: formatDateOnly(item.nearestExpiryDate),
    createdAtLabel: formatDateTime(item.createdAt),
    updatedAtLabel: formatDateTime(item.updatedAt),
    batches: Array.isArray(item.batches) ? item.batches.map(mapMedicineBatch) : [],
  };
};

export const mapMedicineAlertsEnvelope = (response) => {
  const envelope = normalizeApiEnvelope(response);
  const rows = extractRows(envelope);

  return rows.map((item) => ({
    ...item,
    alertTypeLabel: ALERT_TYPE_LABELS[item.alertType] || item.alertType || null,
    nearestExpiryDateLabel: formatDateOnly(item.nearestExpiryDate),
  }));
};

export const mapMedicineMovementsEnvelope = (response) => {
  const envelope = normalizeApiEnvelope(response);
  const rows = extractRows(envelope);
  const meta = extractMeta(envelope, {
    page: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0,
  });

  return {
    rows: rows.map((item) => ({
      ...(item || {}),
      typeLabel: MOVEMENT_TYPE_LABELS[item.type] || item.type || null,
      typeBadgeClass: MOVEMENT_TYPE_BADGE_CLASS[item.type] || 'border-outline-variant bg-surface-container-low text-on-surface-variant',
      reasonLabel: item.reason || 'Không có ghi chú',
      expiryDateLabel: formatDateOnly(item.expiryDate),
      createdAtLabel: formatDateTime(item.createdAt),
      createdByName: item.createdBy?.fullName || item.createdBy?.userId || null,
      quantityClassName: item.type === 'IMPORT' ? 'text-success' : item.type === 'DISPOSE' || item.type === 'DISPENSE' ? 'text-danger' : 'text-on-surface',
      quantityLabel: `${item.type === 'IMPORT' ? '+' : item.type === 'DISPOSE' || item.type === 'DISPENSE' ? '-' : ''}${Math.abs(Number(item.quantity || 0))}`,
    })),
    page: Number(meta.page || 1),
    pageSize: Number(meta.pageSize || 5),
    totalItems: Number(meta.totalItems || 0),
    totalPages: Number(meta.totalPages || 0),
  };
};
