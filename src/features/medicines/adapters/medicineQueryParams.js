const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const buildMedicinesListQueryParams = (query = {}) => {
  const params = {
    page: toPositiveNumber(query.page, 1),
    pageSize: toPositiveNumber(query.pageSize, 10),
  };

  if (query.keyword?.trim()) params.keyword = query.keyword.trim();
  if (query.status && query.status !== 'all') params.status = query.status;
  if (query.lowStock) params.lowStock = true;
  if (query.expiring) params.expiring = true;

  return params;
};

export const buildMedicineMovementsQueryParams = (query = {}) => {
  const params = {
    page: toPositiveNumber(query.page, 1),
    pageSize: toPositiveNumber(query.pageSize, 5),
  };

  if (query.type) params.type = query.type;
  if (query.fromDate) params.fromDate = query.fromDate;
  if (query.toDate) params.toDate = query.toDate;

  return params;
};

export const buildMedicineAlertsQueryParams = (query = {}) => {
  return {
    type: query.type || 'ALL',
  };
};
