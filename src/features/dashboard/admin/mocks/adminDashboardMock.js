const NOW = new Date('2026-03-28T09:40:00.000Z');

const users = [
  { id: 'USR-201', username: 'admin.trancaovan', fullName: 'Trần Cao Vân Admin', status: 'active' },
  { id: 'USR-202', username: 'nurse.huong', fullName: 'Nguyễn Thị Hương', status: 'active' },
  { id: 'USR-203', username: 'staff.minh', fullName: 'Phạm Đức Minh', status: 'locked' },
  { id: 'USR-204', username: 'parent.loan', fullName: 'Lê Thanh Loan', status: 'pending' },
  { id: 'USR-205', username: 'staff.mai', fullName: 'Trần Thị Mai', status: 'active' },
  { id: 'USR-206', username: 'parent.hanh', fullName: 'Lê Thị Hạnh', status: 'active' },
];

const students = [
  { id: 'HS-1001', fullName: 'Nguyễn Minh Châu', className: '1A', status: 'active' },
  { id: 'HS-1002', fullName: 'Trần Gia Hân', className: '2B', status: 'active' },
  { id: 'HS-1003', fullName: 'Lê Quốc Bảo', className: '3C', status: 'active' },
  { id: 'HS-1004', fullName: 'Phạm Khánh Linh', className: '4A', status: 'active' },
  { id: 'HS-1005', fullName: 'Đoàn Tuấn Kiệt', className: '5B', status: 'active' },
  { id: 'HS-1006', fullName: 'Võ Bảo Ngân', className: '1B', status: 'active' },
];

const catalogItems = [
  { id: 'VAC-001', type: 'vaccine', status: 'active' },
  { id: 'VAC-002', type: 'vaccine', status: 'active' },
  { id: 'DIS-001', type: 'disease', status: 'active' },
  { id: 'DIS-002', type: 'disease', status: 'inactive' },
  { id: 'ALL-001', type: 'allergy', status: 'active' },
  { id: 'ALL-002', type: 'allergy', status: 'active' },
];

const systemLogs = [
  {
    id: 'LOG-001',
    occurredAt: '2026-03-28T09:25:00.000Z',
    actorName: 'Nguyễn Thị Mai',
    module: 'students',
    action: 'CREATE_STUDENT',
    targetType: 'Student',
    description: 'Thêm mới hồ sơ học sinh HS-1201',
  },
  {
    id: 'LOG-002',
    occurredAt: '2026-03-28T08:40:00.000Z',
    actorName: 'Lê Thanh Quân',
    module: 'users',
    action: 'UPDATE_ROLE',
    targetType: 'User',
    description: 'Cập nhật vai trò 5 tài khoản nhân sự',
  },
  {
    id: 'LOG-003',
    occurredAt: '2026-03-28T08:12:00.000Z',
    actorName: 'Trần Cao Vân Admin',
    module: 'catalogs',
    action: 'UPDATE_CATALOG_ITEM',
    targetType: 'CatalogItem',
    description: 'Rà soát danh mục bệnh lý học đường',
  },
  {
    id: 'LOG-004',
    occurredAt: '2026-03-28T07:30:00.000Z',
    actorName: 'Trần Cao Vân Admin',
    module: 'reports',
    action: 'EXPORT_REPORT',
    targetType: 'Report',
    description: 'Xuất báo cáo khám sức khỏe tuần 12',
  },
  {
    id: 'LOG-005',
    occurredAt: '2026-03-28T07:15:00.000Z',
    actorName: 'Nguyễn Thị Hương',
    module: 'vaccinations',
    action: 'UPDATE_VACCINATION_STATUS',
    targetType: 'StudentVaccination',
    description: 'Cập nhật trạng thái tiêm chủng lớp 2B',
  },
];

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const deriveOverview = () => {
  const recentActivities = [...systemLogs]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      occurredAt: formatDateTime(item.occurredAt),
      actorName: item.actorName,
      module: item.module,
      action: item.action,
      targetType: item.targetType,
      description: item.description,
    }));

  const activeCatalogItems = catalogItems.filter((item) => item.status === 'active').length;
  return {
    schoolName: 'Trường Tiểu học Trần Cao Vân',
    generatedAt: NOW.toISOString(),
    kpis: {
      totalStudents: students.length,
      activeUsers: users.filter((item) => item.status === 'active').length,
      activeCatalogEntries: activeCatalogItems,
    },
    recentActivities,
  };
};

export const getAdminDashboardMockEnvelope = () => ({
  success: true,
  message: 'Dashboard overview loaded',
  data: {
    overview: deriveOverview(),
  },
  errors: null,
  meta: {
    requestId: 'mock-admin-dashboard-001',
    generatedAt: NOW.toISOString(),
    source: 'mock',
  },
});
