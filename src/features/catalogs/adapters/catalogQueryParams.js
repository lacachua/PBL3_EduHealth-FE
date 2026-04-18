const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const CATALOG_STATUS_QUERY_MAP = Object.freeze({
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  unstandardized: 'UNSTANDARDIZED',
  review: 'UNSTANDARDIZED',
});

export const buildCatalogListQueryParams = (query = {}) => {
  const params = {
    page: toPositiveNumber(query.page, 1),
    pageSize: toPositiveNumber(query.pageSize, 10),
  };

  if (query.keyword?.trim()) params.keyword = query.keyword.trim();
  if (query.status && query.status !== 'all') {
    const normalizedStatus = CATALOG_STATUS_QUERY_MAP[String(query.status).trim().toLowerCase()];
    if (normalizedStatus) {
      params.status = normalizedStatus;
    }
  }
  if (query.group?.trim()) params.group = query.group.trim();
  if (query.type?.trim()) params.type = query.type.trim();

  return params;
};

export const buildCatalogDetailQueryParams = (query = {}) => {
  const params = {};

  if (query.group?.trim()) params.group = query.group.trim();
  if (query.type?.trim()) params.type = query.type.trim();

  return params;
};
