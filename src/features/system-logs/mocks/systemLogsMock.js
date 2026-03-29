const rows = [
  { id: 'LOG-001', occurredAt: '2026-03-28 09:25', actorName: 'Nguyễn Thị Mai', module: 'students', action: 'CREATE_STUDENT', actionCategory: 'create', targetType: 'student', status: 'success', message: 'Thêm 12 học sinh khối 1' },
  { id: 'LOG-002', occurredAt: '2026-03-28 08:40', actorName: 'Lê Thanh Quân', module: 'users', action: 'UPDATE_ROLE', actionCategory: 'update', targetType: 'user-account', status: 'success', message: 'Cập nhật vai trò cho 5 tài khoản' },
  { id: 'LOG-003', occurredAt: '2026-03-28 08:12', actorName: 'Trần Cao Vân', module: 'catalogs', action: 'DELETE_DUPLICATE', actionCategory: 'delete', targetType: 'catalog-item', status: 'warning', message: 'Xóa bản ghi danh mục trùng lặp' },
  { id: 'LOG-004', occurredAt: '2026-03-28 07:30', actorName: 'Trần Cao Vân', module: 'reports', action: 'EXPORT_REPORT', actionCategory: 'export', targetType: 'report', status: 'success', message: 'Xuất báo cáo tuần 12' },
  { id: 'LOG-005', occurredAt: '2026-03-28 07:12', actorName: 'Hệ thống', module: 'integration', action: 'SYNC_ERROR', actionCategory: 'sync', targetType: 'integration-job', status: 'error', message: 'Lỗi đồng bộ tài khoản từ cổng ngoài' },
  { id: 'LOG-006', occurredAt: '2026-03-27 16:02', actorName: 'Phạm Minh Hà', module: 'vaccinations', action: 'UPDATE_VACCINATION', actionCategory: 'update', targetType: 'student-vaccination', status: 'success', message: 'Cập nhật mũi tiêm nhắc lại cho lớp 3A' },
];

const now = new Date('2026-03-28T23:59:59');

const inTimeRange = (occurredAt, timeRange) => {
  if (!timeRange || timeRange === 'all') return true;

  const date = new Date(occurredAt.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return true;

  const diffMs = now.getTime() - date.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (timeRange === 'today') return diffMs <= oneDay;
  if (timeRange === '7d') return diffMs <= oneDay * 7;
  if (timeRange === '30d') return diffMs <= oneDay * 30;
  return true;
};

const filterRows = (data, query) => {
  const keyword = (query.keyword || '').toLowerCase().trim();
  const actor = (query.actor || '').toLowerCase().trim();

  return data.filter((row) => {
    const byKeyword = !keyword || row.message.toLowerCase().includes(keyword) || row.action.toLowerCase().includes(keyword);
    const byActor = !actor || row.actorName.toLowerCase().includes(actor);
    const byModule = !query.module || query.module === 'all' || row.module === query.module;
    const byAction = !query.action || query.action === 'all' || row.actionCategory === query.action;
    const byTimeRange = inTimeRange(row.occurredAt, query.timeRange);
    return byKeyword && byActor && byModule && byAction && byTimeRange;
  });
};

export const getSystemLogsMockEnvelope = (query = {}) => {
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);
  const filtered = filterRows(rows, query);

  return {
    success: true,
    message: 'Tải nhật ký hệ thống thành công',
    data: {
      logs: filtered.slice((page - 1) * pageSize, page * pageSize),
    },
    errors: null,
    meta: {
      page,
      pageSize,
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      source: 'mock',
    },
  };
};
