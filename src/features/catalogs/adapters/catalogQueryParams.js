const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const buildCatalogListQueryParams = (query = {}) => {
  const params = {
    page: toPositiveNumber(query.page, 1),
    pageSize: toPositiveNumber(query.pageSize, 10),
  };

  if (query.keyword?.trim()) params.keyword = query.keyword.trim();
  if (query.status && query.status !== 'all') params.status = query.status;
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
