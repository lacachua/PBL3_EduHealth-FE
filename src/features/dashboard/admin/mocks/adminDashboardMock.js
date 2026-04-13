const NOW = new Date('2026-04-13T08:40:00.000Z');

const schoolOverview = {
  totalStudents: 1240,
  totalClasses: 42,
  totalUsers: 128,
};

const medicineInventory = [
  { id: 'MED-001', name: 'Paracetamol 500mg', remaining: 45, reorderLevel: 60 },
  { id: 'MED-002', name: 'ORS', remaining: 35, reorderLevel: 50 },
  { id: 'MED-003', name: 'Bông y tế', remaining: 72, reorderLevel: 40 },
  { id: 'MED-004', name: 'Povidine', remaining: 18, reorderLevel: 25 },
  { id: 'MED-005', name: 'Nước muối sinh lý', remaining: 28, reorderLevel: 30 },
  { id: 'MED-006', name: 'Gạc vô trùng', remaining: 20, reorderLevel: 24 },
  { id: 'MED-007', name: 'Thuốc hạ sốt trẻ em', remaining: 16, reorderLevel: 20 },
];

const visitTrend = [
  { id: 'trend-1', label: '01 THG 04', value: 6 },
  { id: 'trend-2', label: '04 THG 04', value: 9 },
  { id: 'trend-3', label: '07 THG 04', value: 7 },
  { id: 'trend-4', label: '10 THG 04', value: 11 },
  { id: 'trend-5', label: '13 THG 04', value: 8 },
  { id: 'trend-6', label: '16 THG 04', value: 13 },
  { id: 'trend-7', label: '19 THG 04', value: 10 },
  { id: 'trend-8', label: '22 THG 04', value: 7 },
  { id: 'trend-9', label: '25 THG 04', value: 9 },
  { id: 'trend-10', label: '30 THG 04', value: 12 },
];

const systemActivities = [
  {
    id: 'LOG-001',
    title: 'Cập nhật danh mục vaccine khối 1',
    metadata: 'Admin School • Danh mục',
    occurredAt: '2026-04-13T10:45:00.000Z',
    icon: 'edit_note',
    tone: 'info',
    to: '/admin/catalogs',
  },
  {
    id: 'LOG-002',
    title: 'Đồng bộ dữ liệu tài khoản định kỳ',
    metadata: 'Hệ thống • Người dùng',
    occurredAt: '2026-04-13T00:00:00.000Z',
    icon: 'cloud_done',
    tone: 'success',
    to: '/admin/users',
  },
  {
    id: 'LOG-003',
    title: 'Y tá Minh Hạnh hoàn tất báo cáo tuần',
    metadata: 'Y tá Minh Hạnh • Báo cáo',
    occurredAt: '2026-04-12T16:20:00.000Z',
    icon: 'assignment_turned_in',
    tone: 'neutral',
    to: '/admin/reports',
  },
  {
    id: 'LOG-004',
    title: 'Phát hiện 2 thuốc dưới ngưỡng an toàn',
    metadata: 'Hệ thống • Kho thuốc',
    occurredAt: '2026-04-12T14:00:00.000Z',
    icon: 'medication_liquid',
    tone: 'warning',
    to: '/admin/medicines',
  },
  {
    id: 'LOG-005',
    title: 'Làm mới dữ liệu tổng quan tháng',
    metadata: 'Admin School • Dashboard',
    occurredAt: '2026-04-12T09:30:00.000Z',
    icon: 'monitoring',
    tone: 'info',
    to: '/admin/dashboard',
  },
];

const formatDateTime = (value) => {
  return new Date(value).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const deriveOverview = () => {
  const lowStockMedicines = medicineInventory.filter((item) => item.remaining <= item.reorderLevel).length;
  const totalVisitsToday = visitTrend[visitTrend.length - 1]?.value || 0;
  const totalVisitsThisMonth = visitTrend.reduce((sum, item) => sum + item.value, 0) * 3;

  return {
    generatedAt: NOW.toISOString(),
    overview: {
      totalStudents: schoolOverview.totalStudents,
      totalClasses: schoolOverview.totalClasses,
      totalUsers: schoolOverview.totalUsers,
      lowStockMedicines,
      totalVisitsToday,
      totalVisitsThisMonth,
    },
    shortcuts: [
      {
        id: 'shortcut-students',
        label: 'Quản lý học sinh',
        description: 'Hồ sơ và thông tin học sinh',
        to: '/admin/students',
        icon: 'school',
      },
      {
        id: 'shortcut-users',
        label: 'Người dùng',
        description: 'Tài khoản hệ thống',
        to: '/admin/users',
        icon: 'group',
      },
      {
        id: 'shortcut-reports',
        label: 'Báo cáo',
        description: 'Theo dõi chỉ số tổng hợp',
        to: '/admin/reports',
        icon: 'assessment',
      },
      {
        id: 'shortcut-medicines',
        label: 'Kho thuốc',
        description: 'Tồn kho và cảnh báo thuốc',
        to: '/admin/medicines',
        icon: 'medication',
      },
      {
        id: 'shortcut-catalogs',
        label: 'Danh mục',
        description: 'Danh mục dùng chung',
        to: '/admin/catalogs',
        icon: 'category',
      },
    ],
    trends: visitTrend,
    managementAlerts: [
      {
        id: 'alert-medicine-stock',
        title: 'Thuốc dưới ngưỡng an toàn',
        description: 'Có thuốc tồn kho dưới mức khuyến nghị, cần ưu tiên bổ sung.',
        metric: `${lowStockMedicines} thuốc`,
        severity: 'critical',
        to: '/admin/medicines',
      },
      {
        id: 'alert-grade-4a2',
        title: 'Lớp 4A2 hoàn tất khám thấp',
        description: '8 học sinh chưa hoàn thành khám định kỳ trong tháng.',
        metric: '8 học sinh',
        severity: 'warning',
        to: '/admin/reports',
      },
      {
        id: 'alert-block-k1',
        title: 'Khối 1 cần tăng tỷ lệ tiêm',
        description: 'Tỷ lệ hoàn thành hiện tại là 78%, thấp hơn mục tiêu quản trị.',
        metric: '78%',
        severity: 'info',
        to: '/admin/reports',
      },
    ],
    recentActivities: systemActivities.map((item) => ({
      ...item,
      timeLabel: formatDateTime(item.occurredAt),
    })),
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
