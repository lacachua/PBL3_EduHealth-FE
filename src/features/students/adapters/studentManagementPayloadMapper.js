const clean = (value) => (typeof value === 'string' ? value.trim() : value);

export const normalizeStudentListQuery = (query = {}) => {
  const params = {
    page: Number(query.page || 1),
    pageSize: Number(query.pageSize || 10),
  };

  const keyword = clean(query.keyword || '');
  if (keyword) params.keyword = keyword;

  const grade = clean(query.grade || 'all');
  if (grade && grade !== 'all') params.grade = grade;

  const className = clean(query.className || 'all');
  if (className && className !== 'all') params.className = className;

  const status = clean(query.status || 'all');
  if (status && status !== 'all') params.status = status;

  const dataMissing = clean(query.dataMissing || 'all');
  if (dataMissing && dataMissing !== 'all') params.dataMissing = dataMissing;

  return params;
};
