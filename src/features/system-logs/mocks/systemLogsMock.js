const baseRows = [
  {
    id: 'LOG-193S-2026',
    actorName: 'Nguyễn Văn A',
    actorUsername: 'nguyenvana_student',
    actorRole: 'student',
    actionCategory: 'export',
    actionLabel: 'Xem báo cáo',
    moduleLabel: 'Báo cáo',
    targetName: 'Báo cáo sức khỏe tháng 3',
    targetTypeLabel: 'Báo cáo',
    statusTone: 'success',
    message: 'Học sinh xem báo cáo sức khỏe định kỳ tháng 3',
    statusLabel: 'Thành công'
  },
  {
    id: 'LOG-193T-2026',
    actorName: 'Admin System',
    actorUsername: 'admin_system',
    actorRole: 'admin',
    actionCategory: 'update',
    actionLabel: 'Cập nhật hệ thống',
    moduleLabel: 'Hệ thống',
    targetName: 'Cấu hình phân quyền',
    targetTypeLabel: 'Hệ thống',
    statusTone: 'warning',
    message: 'Admin thay đổi cấu hình phân quyền hệ thống',
    statusLabel: 'Cảnh báo'
  },
  {
    id: 'LOG-193U-2026',
    actorName: 'Trần Thị B',
    actorUsername: 'tranb_nurse',
    actorRole: 'nurse',
    actionCategory: 'update',
    actionLabel: 'Cập nhật hồ sơ',
    moduleLabel: 'Học sinh',
    targetName: 'Nguyễn Văn C',
    targetTypeLabel: 'Học sinh',
    statusTone: 'success',
    message: 'Cập nhật chỉ số BMI cho học sinh Nguyễn Văn C',
    statusLabel: 'Thành công'
  },
  {
    id: 'LOG-193V-2026',
    actorName: 'Admin System',
    actorUsername: 'admin_system',
    actorRole: 'admin',
    actionCategory: 'other',
    actionLabel: 'Đăng nhập',
    moduleLabel: 'Hệ thống',
    targetName: 'Hệ thống',
    targetTypeLabel: 'Hệ thống',
    statusTone: 'error',
    message: 'Đăng nhập thất bại (Sai mật khẩu)',
    statusLabel: 'Lỗi'
  },
  {
    id: 'LOG-193W-2026',
    actorName: 'Lê Thị D',
    actorUsername: 'lethid_student',
    actorRole: 'student',
    actionCategory: 'export',
    actionLabel: 'Xem lịch tiêm',
    moduleLabel: 'Tiêm chủng',
    targetName: 'Lịch tiêm chủng',
    targetTypeLabel: 'Tiêm chủng',
    statusTone: 'success',
    message: 'Học sinh xem lịch tiêm chủng mở rộng',
    statusLabel: 'Thành công'
  },
  {
    id: 'LOG-193X-2026',
    actorName: 'Phạm Văn E',
    actorUsername: 'phamvane_nurse',
    actorRole: 'nurse',
    actionCategory: 'delete',
    actionLabel: 'Xóa bản ghi',
    moduleLabel: 'Khám sức khỏe',
    targetName: 'Bản ghi khám',
    targetTypeLabel: 'Khám sức khỏe',
    statusTone: 'warning',
    message: 'Xóa bản ghi khám sức khỏe bị lỗi do vi phạm ràng buộc',
    statusLabel: 'Cảnh báo'
  },
  {
    id: 'LOG-194A-2026',
    actorName: 'Hệ Thống',
    actorUsername: 'system_auto',
    actorRole: 'system',
    actionCategory: 'sync',
    actionLabel: 'Đồng bộ dữ liệu',
    moduleLabel: 'Hệ thống',
    targetName: 'Cơ sở dữ liệu y tế',
    targetTypeLabel: 'Hệ thống',
    statusTone: 'success',
    message: 'Đồng bộ dữ liệu y tế tự động thành công',
    statusLabel: 'Thành công'
  },
  {
    id: 'LOG-194B-2026',
    actorName: 'Admin System',
    actorUsername: 'admin_system',
    actorRole: 'admin',
    actionCategory: 'update',
    actionLabel: 'Khóa tài khoản',
    moduleLabel: 'Người dùng',
    targetName: 'lethid_student',
    targetTypeLabel: 'Tài khoản',
    statusTone: 'warning',
    message: 'Khóa tài khoản học sinh do sai mật khẩu quá 5 lần',
    statusLabel: 'Cảnh báo'
  },
  {
    id: 'LOG-194C-2026',
    actorName: 'Admin System',
    actorUsername: 'admin_system',
    actorRole: 'admin',
    actionCategory: 'create',
    actionLabel: 'Tạo tài khoản',
    moduleLabel: 'Người dùng',
    targetName: 'Trần Văn F',
    targetTypeLabel: 'Tài khoản',
    statusTone: 'success',
    message: 'Tạo tài khoản học sinh mới',
    statusLabel: 'Thành công'
  },
  {
    id: 'LOG-194D-2026',
    actorName: 'Nguyễn Văn A',
    actorUsername: 'nguyenvana_student',
    actorRole: 'student',
    actionCategory: 'other',
    actionLabel: 'Đăng nhập',
    moduleLabel: 'Hệ thống',
    targetName: 'Portal',
    targetTypeLabel: 'Web',
    statusTone: 'success',
    message: 'Học sinh đăng nhập thành công',
    statusLabel: 'Thành công'
  },
  {
    id: 'LOG-194E-2026',
    actorName: 'Trần Thị B',
    actorUsername: 'tranb_nurse',
    actorRole: 'nurse',
    actionCategory: 'export',
    actionLabel: 'Xuất báo cáo',
    moduleLabel: 'Báo cáo',
    targetName: 'Thống kê dịch bệnh',
    targetTypeLabel: 'Báo cáo',
    statusTone: 'success',
    message: 'Xuất báo cáo thống kê tình hình dịch bệnh tháng 3',
    statusLabel: 'Thành công'
  },
  {
    id: 'LOG-194F-2026',
    actorName: 'Admin System',
    actorUsername: 'admin_system',
    actorRole: 'admin',
    actionCategory: 'other',
    actionLabel: 'Đăng nhập',
    moduleLabel: 'Hệ thống',
    targetName: 'Portal',
    targetTypeLabel: 'Web',
    statusTone: 'error',
    message: 'Đăng nhập thất bại (Tài khoản bị vô hiệu hóa)',
    statusLabel: 'Lỗi'
  }
];

const rows = [];
const startDate = new Date('2026-03-20T08:00:00Z');

// Generate 45 mock logs to span across multiple pages
for (let i = 0; i < 45; i++) {
  const baseTemplate = baseRows[i % baseRows.length];
  const itemDate = new Date(startDate.getTime() + i * 3600000 * 2.5); // Add 2.5 hours per item
  
  rows.push({
    ...baseTemplate,
    id: `LOG-${1000 + i}-2026`,
    occurredAt: itemDate.toISOString(),
  });
}

const filterRows = (data, query) => {
  const keyword = (query.keyword || '').toLowerCase().trim();
  const role = (query.role || 'all').toLowerCase();
  const action = (query.action || 'all').toLowerCase();

  const fromDate = query.fromDate ? new Date(query.fromDate) : null;
  const toDate = query.toDate ? new Date(query.toDate) : null;

  if (toDate) {
    toDate.setHours(23, 59, 59, 999);
  }

  return data.filter((row) => {
    const byKeyword =
      !keyword ||
      (row.message && row.message.toLowerCase().includes(keyword)) ||
      (row.actorUsername && row.actorUsername.toLowerCase().includes(keyword)) ||
      (row.actionLabel && row.actionLabel.toLowerCase().includes(keyword));

    const byRole = role === 'all' || row.actorRole?.toLowerCase() === role;
    const byAction = action === 'all' || row.actionCategory?.toLowerCase() === action;

    let byDateRange = true;
    if (fromDate || toDate) {
      const rowDate = new Date(row.occurredAt);
      if (fromDate && rowDate < fromDate) byDateRange = false;
      if (toDate && rowDate > toDate) byDateRange = false;
    }

    return byKeyword && byRole && byAction && byDateRange;
  });
};

export const getSystemLogsMockEnvelope = (query = {}) => {
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);
  
  // Sort descending by default to show newest first
  const sortedRows = [...rows].sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
  
  const filtered = filterRows(sortedRows, query);

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
