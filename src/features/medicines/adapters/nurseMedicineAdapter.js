import {
  ALERT_TYPE_LABELS,
  DISPOSE_REASON_LABELS,
  MEDICINE_ALERT_BADGE_CLASS,
  MEDICINE_ALERT_LABELS,
  MEDICINE_STATUS_BADGE_CLASS,
  MEDICINE_STATUS_LABELS,
  MEDICINE_UNIT_LABELS,
  MOVEMENT_TYPE_BADGE_CLASS,
  MOVEMENT_TYPE_LABELS,
} from '../constants/nurseMedicineConstants';
import {
  getMedicineMetaFromEnvelope,
  getMedicineRowsFromEnvelope,
  normalizeMedicineEnvelope,
  toMedicineDateTimeLabel,
} from './medicineAdapterShared';

const EMPTY_LIST_META = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

export const formatDateOnly = (value) => {
  if (!value) return '--';

  const normalized = String(value).split('T')[0];
  const [year, month, day] = normalized.split('-');
  if (!year || !month || !day) {
    return String(value);
  }

  return `${day}/${month}/${year}`;
};

export const formatDateTime = (value) => toMedicineDateTimeLabel(value);

const toAlertKey = (item) => {
  if (item.isLowStock && item.isExpiringSoon) return 'mixed';
  if (item.isLowStock) return 'lowStock';
  if (item.isExpiringSoon) return 'expiring';
  return 'none';
};

export const mapMedicineListEnvelope = (response) => {
  const envelope = normalizeMedicineEnvelope(response);
  if (!envelope || envelope.success === false) {
    return {
      rows: [],
      ...EMPTY_LIST_META,
    };
  }

  const rows = getMedicineRowsFromEnvelope(envelope);
  const meta = getMedicineMetaFromEnvelope(envelope, EMPTY_LIST_META);

  return {
    rows: rows.map((item) => {
      const alertKey = toAlertKey(item);
      return {
        ...item,
        statusLabel: MEDICINE_STATUS_LABELS[item.status] || item.status || '--',
        unitLabel: MEDICINE_UNIT_LABELS[item.unit] || item.unit || '--',
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
  const envelope = normalizeMedicineEnvelope(response);
  if (!envelope || envelope.success === false || !envelope.data) {
    return null;
  }

  const item = envelope.data;
  const alertKey = toAlertKey(item);

  return {
    ...item,
    statusLabel: MEDICINE_STATUS_LABELS[item.status] || item.status || '--',
    unitLabel: MEDICINE_UNIT_LABELS[item.unit] || item.unit || '--',
    statusBadgeClass: MEDICINE_STATUS_BADGE_CLASS[item.status] || MEDICINE_STATUS_BADGE_CLASS.INACTIVE,
    alertKey,
    alertLabel: MEDICINE_ALERT_LABELS[alertKey],
    alertBadgeClass: MEDICINE_ALERT_BADGE_CLASS[alertKey],
    nearestExpiryDateLabel: formatDateOnly(item.nearestExpiryDate),
    createdAtLabel: formatDateTime(item.createdAt),
    updatedAtLabel: formatDateTime(item.updatedAt),
  };
};

export const mapMedicineAlertsEnvelope = (response) => {
  const envelope = normalizeMedicineEnvelope(response);
  const rows = getMedicineRowsFromEnvelope(envelope);

  return rows.map((item) => ({
    ...item,
    alertTypeLabel: ALERT_TYPE_LABELS[item.alertType] || item.alertType || '--',
    nearestExpiryDateLabel: formatDateOnly(item.nearestExpiryDate),
  }));
};

export const mapMedicineMovementsEnvelope = (response) => {
  const envelope = normalizeMedicineEnvelope(response);
  const rows = getMedicineRowsFromEnvelope(envelope);
  const meta = getMedicineMetaFromEnvelope(envelope, {
    page: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0,
  });

  return {
    rows: rows.map((item) => ({
      ...(item || {}),
      typeLabel: MOVEMENT_TYPE_LABELS[item.type] || item.type || '--',
      typeBadgeClass: MOVEMENT_TYPE_BADGE_CLASS[item.type] || 'border-outline-variant bg-surface-container-low text-on-surface-variant',
      reasonLabel: DISPOSE_REASON_LABELS[item.reason] || item.reason || '--',
      expiryDateLabel: formatDateOnly(item.expiryDate),
      createdAtLabel: formatDateTime(item.createdAt),
      createdByName: item.createdBy?.fullName || item.createdBy?.userId || '--',
      quantityClassName: item.type === 'IMPORT' ? 'text-success' : item.type === 'DISPOSE' || item.type === 'DISPENSE' ? 'text-danger' : 'text-on-surface',
      quantityLabel: `${item.type === 'IMPORT' ? '+' : item.type === 'DISPOSE' || item.type === 'DISPENSE' ? '-' : ''}${Math.abs(Number(item.quantity || 0))}`,
    })),
    page: Number(meta.page || 1),
    pageSize: Number(meta.pageSize || 5),
    totalItems: Number(meta.totalItems || 0),
    totalPages: Number(meta.totalPages || 0),
  };
};

export const buildSummaryStats = ({ rows, totalItems, alerts }) => {
  const lowStockCount = alerts.filter((item) => item.alertType === 'LOW_STOCK').length;
  const expiringCount = alerts.filter((item) => item.alertType === 'EXPIRING').length;
  const inactiveCount = rows.filter((item) => item.status === 'INACTIVE').length;

  return {
    totalMedicines: totalItems,
    lowStockCount,
    expiringCount,
    inactiveCount,
  };
};
