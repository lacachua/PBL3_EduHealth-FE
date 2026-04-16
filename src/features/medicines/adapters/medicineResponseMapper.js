import {
  mapMedicineAlertLabel,
  mapMedicineAlertTone,
  mapMedicineStatusLabel,
  mapMedicineStatusTone,
} from './medicineStatusMapper';
import {
  getMedicineMetaFromEnvelope,
  getMedicineRowsFromEnvelope,
  normalizeMedicineEnvelope,
  toMedicineDateTimeLabel,
} from './medicineAdapterShared';

const defaultPaged = {
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

const toDisplayDateOnly = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
};

const mapMedicineBase = (item = {}) => {
  const isLowStock = Boolean(item.isLowStock);
  const isExpiringSoon = Boolean(item.isExpiringSoon);

  return {
    id: item.id,
    name: item.name || '--',
    activeIngredient: item.activeIngredient || '--',
    unit: item.unit || '--',
    packaging: item.packaging || '--',
    warningThreshold: item.warningThreshold ?? '--',
    currentStock: item.currentStock ?? '--',
    nearestExpiryDate: toDisplayDateOnly(item.nearestExpiryDate),
    status: item.status || 'INACTIVE',
    statusLabel: mapMedicineStatusLabel(item.status),
    statusTone: mapMedicineStatusTone(item.status),
    note: item.note || '--',
    isLowStock,
    isExpiringSoon,
    alertLabel: mapMedicineAlertLabel(isLowStock, isExpiringSoon),
    alertTone: mapMedicineAlertTone(isLowStock, isExpiringSoon),
    createdAt: toMedicineDateTimeLabel(item.createdAt),
    updatedAt: toMedicineDateTimeLabel(item.updatedAt),
  };
};

export const mapMedicinesListResponse = (responseOrPayload) => {
  const envelope = normalizeMedicineEnvelope(responseOrPayload);
  if (!envelope || envelope.success === false) {
    return defaultPaged;
  }

  const sourceRows = getMedicineRowsFromEnvelope(envelope);

  const rows = sourceRows.map((item) => mapMedicineBase(item));
  const meta = getMedicineMetaFromEnvelope(envelope, {
    page: 1,
    pageSize: 10,
    totalItems: rows.length,
    totalPages: 1,
  });

  return {
    rows,
    ...meta,
  };
};

export const mapMedicineDetailResponse = (responseOrPayload) => {
  const envelope = normalizeMedicineEnvelope(responseOrPayload);
  if (!envelope || envelope.success === false || !envelope.data) {
    return null;
  }

  return mapMedicineBase(envelope.data);
};

export const mapMedicineAlertsResponse = (responseOrPayload) => {
  const envelope = normalizeMedicineEnvelope(responseOrPayload);
  const sourceRows = getMedicineRowsFromEnvelope(envelope);

  const alerts = sourceRows.map((item) => ({
    medicineId: item.medicineId,
    medicineName: item.medicineName || '--',
    alertType: item.alertType || '--',
    currentStock: item.currentStock ?? null,
    warningThreshold: item.warningThreshold ?? null,
    nearestExpiryDate: toDisplayDateOnly(item.nearestExpiryDate),
    message: item.message || '--',
  }));

  const lowStockCount = alerts.filter((item) => item.alertType === 'LOW_STOCK').length;
  const expiringCount = alerts.filter((item) => item.alertType === 'EXPIRING').length;

  return {
    alerts,
    summary: {
      lowStockCount,
      expiringCount,
      totalAlerts: alerts.length,
    },
  };
};

export const mapMedicineMovementsResponse = (responseOrPayload) => {
  const envelope = normalizeMedicineEnvelope(responseOrPayload);
  if (!envelope || envelope.success === false) {
    return defaultPaged;
  }

  const sourceRows = getMedicineRowsFromEnvelope(envelope);

  const rows = sourceRows.map((item) => ({
    movementId: item.movementId || '--',
    type: item.type || '--',
    quantity: item.quantity ?? '--',
    stockBefore: item.stockBefore ?? '--',
    stockAfter: item.stockAfter ?? '--',
    batchNumber: item.batchNumber || '--',
    expiryDate: toDisplayDateOnly(item.expiryDate),
    reason: item.reason || '--',
    createdBy: item.createdBy?.fullName || item.createdBy?.userId || '--',
    createdAt: toMedicineDateTimeLabel(item.createdAt),
  }));

  const meta = getMedicineMetaFromEnvelope(envelope, {
    page: 1,
    pageSize: 5,
    totalItems: rows.length,
    totalPages: 1,
  });

  return {
    rows,
    ...meta,
  };
};
