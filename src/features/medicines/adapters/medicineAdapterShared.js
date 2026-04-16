import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';

export const normalizeMedicineEnvelope = (payload) => normalizeApiEnvelope(payload);

export const getMedicineRowsFromEnvelope = (envelope) => {
  if (!envelope || envelope.success === false) {
    return [];
  }

  if (Array.isArray(envelope.data)) {
    return envelope.data;
  }

  if (Array.isArray(envelope.data?.items)) {
    return envelope.data.items;
  }

  return [];
};

export const getMedicineMetaFromEnvelope = (envelope, defaults = {}) => {
  const {
    page = 1,
    pageSize = 10,
    totalItems = 0,
    totalPages = 1,
  } = defaults;

  if (!envelope || envelope.success === false) {
    return {
      page,
      pageSize,
      totalItems,
      totalPages,
    };
  }

  const meta = envelope.meta || {};

  return {
    page: Number(meta.page || page),
    pageSize: Number(meta.pageSize || pageSize),
    totalItems: Number(meta.totalItems || totalItems),
    totalPages: Number(meta.totalPages || totalPages),
  };
};

export const toMedicineDateTimeLabel = (value) => {
  if (!value) return '--';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString('vi-VN', { hour12: false });
};
