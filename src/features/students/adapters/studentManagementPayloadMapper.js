const clean = (value) => (typeof value === 'string' ? value.trim() : value);

export const normalizeStudentListQuery = (query = {}) => {
  const params = {
    page: Number(query.page || 1),
    pageSize: Number(query.pageSize || 10),
  };

  const keyword = clean(query.keyword || '');
  if (keyword) params.search = keyword;

  const classId = clean(query.classId || 'all');
  if (classId && classId !== 'all') {
    const parsed = Number(classId);
    if (Number.isFinite(parsed)) {
      params.classId = parsed;
    }
  }

  const status = clean(query.status || 'all');
  if (status === 'ACTIVE') params.isActive = true;
  if (status === 'LOCKED') params.isActive = false;

  return params;
};
