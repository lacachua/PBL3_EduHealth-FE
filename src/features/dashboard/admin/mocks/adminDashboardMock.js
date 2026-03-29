const NOW = new Date('2026-03-28T09:40:00.000Z');

const users = [
  { id: 'USR-201', username: 'admin.trancaovan', fullName: 'Trần Cao Vân Admin', status: 'active' },
  { id: 'USR-202', username: 'nurse.huong', fullName: 'Nguyễn Thị Hương', status: 'active' },
  { id: 'USR-203', username: 'staff.minh', fullName: 'Phạm Đức Minh', status: 'locked' },
  { id: 'USR-204', username: 'parent.loan', fullName: 'Lê Thanh Loan', status: 'pending' },
  { id: 'USR-205', username: 'staff.mai', fullName: 'Trần Thị Mai', status: 'active' },
  { id: 'USR-206', username: 'parent.hanh', fullName: 'Lê Thị Hạnh', status: 'active' },
];

const guardians = [
  { id: 'GUA-01', fullName: 'Nguyễn Văn Minh', email: 'minh.ph@school.edu.vn', phone: '0909123123', userId: 'USR-210' },
  { id: 'GUA-02', fullName: 'Trần Thị Lan', email: '', phone: '', userId: null },
  { id: 'GUA-03', fullName: 'Lê Văn Hiếu', email: 'hieu.ph@school.edu.vn', phone: '0911888999', userId: null },
  { id: 'GUA-04', fullName: 'Phạm Thị My', email: 'my.ph@school.edu.vn', phone: '0933555444', userId: 'USR-211' },
  { id: 'GUA-05', fullName: 'Đoàn Văn Lộc', email: 'loc.ph@school.edu.vn', phone: '0988111122', userId: 'USR-212' },
  { id: 'GUA-06', fullName: 'Võ Thị Vân', email: 'van.ph@school.edu.vn', phone: '0909000222', userId: null },
];

const students = [
  { id: 'HS-1001', fullName: 'Nguyễn Minh Châu', className: '1A', guardianId: 'GUA-01', heightCm: 122, weightKg: 24.5, status: 'complete' },
  { id: 'HS-1002', fullName: 'Trần Gia Hân', className: '2B', guardianId: 'GUA-02', heightCm: null, weightKg: null, status: 'missing-contact' },
  { id: 'HS-1003', fullName: 'Lê Quốc Bảo', className: '3C', guardianId: 'GUA-03', heightCm: 128, weightKg: null, status: 'pending' },
  { id: 'HS-1004', fullName: 'Phạm Khánh Linh', className: '4A', guardianId: 'GUA-04', heightCm: 134, weightKg: 31.2, status: 'complete' },
  { id: 'HS-1005', fullName: 'Đoàn Tuấn Kiệt', className: '5B', guardianId: 'GUA-05', heightCm: 137, weightKg: 33.4, status: 'complete' },
  { id: 'HS-1006', fullName: 'Võ Bảo Ngân', className: '1B', guardianId: 'GUA-06', heightCm: null, weightKg: 23.1, status: 'pending' },
];

const catalogItems = [
  { id: 'VAC-001', type: 'vaccine', status: 'active' },
  { id: 'VAC-002', type: 'vaccine', status: 'active' },
  { id: 'DIS-001', type: 'disease', status: 'active' },
  { id: 'DIS-002', type: 'disease', status: 'inactive' },
  { id: 'ALL-001', type: 'allergy', status: 'active' },
  { id: 'ALL-002', type: 'allergy', status: 'active' },
];

const medicines = [
  { id: 'MED-001', name: 'Paracetamol 250mg', currentStock: 35, alertThreshold: 40, expiryDate: '2026-04-05', status: 'active' },
  { id: 'MED-002', name: 'ORS', currentStock: 120, alertThreshold: 30, expiryDate: '2026-11-12', status: 'active' },
  { id: 'MED-003', name: 'Vitamin C 500mg', currentStock: 18, alertThreshold: 20, expiryDate: '2026-05-10', status: 'active' },
  { id: 'MED-004', name: 'Povidone', currentStock: 9, alertThreshold: 10, expiryDate: '2026-03-31', status: 'active' },
];

const studentVaccinations = [
  { id: 'SV-001', studentId: 'HS-1001', status: 'completed' },
  { id: 'SV-002', studentId: 'HS-1002', status: 'pending' },
  { id: 'SV-003', studentId: 'HS-1003', status: 'in-progress' },
  { id: 'SV-004', studentId: 'HS-1004', status: 'completed' },
  { id: 'SV-005', studentId: 'HS-1005', status: 'completed' },
  { id: 'SV-006', studentId: 'HS-1006', status: 'pending' },
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

const getDayDiff = (fromDate, toDate) => {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.ceil((toDate.getTime() - fromDate.getTime()) / oneDay);
};

const deriveOverview = () => {
  const guardianMap = new Map(guardians.map((item) => [item.id, item]));

  const missingHealth = students.filter((item) => !item.heightCm || !item.weightKg);

  const missingGuardianAccount = students.filter((item) => {
    const guardian = guardianMap.get(item.guardianId);
    return !guardian || !guardian.userId || !guardian.email;
  });

  const lowStockMedicines = medicines.filter((item) => item.currentStock <= item.alertThreshold);

  const expiringMedicines = medicines.filter((item) => {
    const dayDiff = getDayDiff(NOW, new Date(item.expiryDate));
    return dayDiff >= 0 && dayDiff <= 45;
  });

  const incompleteVaccinationStudentIds = new Set(
    studentVaccinations
      .filter((item) => item.status !== 'completed')
      .map((item) => item.studentId)
  );

  const reviewItems = [
    {
      id: 'missing-health-metrics',
      title: 'Học sinh thiếu chiều cao hoặc cân nặng',
      count: missingHealth.length,
      tone: 'warning',
      to: '/admin/students',
      description: 'Bổ sung dữ liệu nhân trắc để hoàn tất hồ sơ sức khỏe.',
    },
    {
      id: 'missing-parent-account',
      title: 'Học sinh chưa có guardian/account phụ huynh',
      count: missingGuardianAccount.length,
      tone: 'warning',
      to: '/admin/students',
      description: 'Liên kết guardian và kích hoạt tài khoản phụ huynh.',
    },
    {
      id: 'medicine-low-stock',
      title: 'Thuốc dưới ngưỡng cảnh báo',
      count: lowStockMedicines.length,
      tone: 'danger',
      to: '/admin/catalogs',
      description: 'Theo dõi tồn kho thuốc theo AlertThreshold.',
    },
    {
      id: 'medicine-expiring',
      title: 'Thuốc sắp hết hạn trong 45 ngày',
      count: expiringMedicines.length,
      tone: 'warning',
      to: '/admin/catalogs',
      description: 'Rà soát và xử lý thuốc cận hạn sử dụng.',
    },
    {
      id: 'vaccination-incomplete',
      title: 'Học sinh tiêm chủng chưa hoàn tất',
      count: incompleteVaccinationStudentIds.size,
      tone: 'info',
      to: '/admin/reports',
      description: 'Theo dõi các trường hợp pending/in-progress.',
    },
  ];

  const recentActivities = [...systemLogs]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 8)
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
  const activeMedicines = medicines.filter((item) => item.status === 'active').length;

  return {
    schoolName: 'Trường Tiểu học Trần Cao Vân',
    generatedAt: NOW.toISOString(),
    kpis: {
      totalStudents: students.length,
      activeUsers: users.filter((item) => item.status === 'active').length,
      activeCatalogEntries: activeCatalogItems + activeMedicines,
      reviewTotal: reviewItems.reduce((sum, item) => sum + item.count, 0),
    },
    reviewItems,
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
