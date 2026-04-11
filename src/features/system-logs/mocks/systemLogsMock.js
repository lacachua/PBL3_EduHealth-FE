const activityTemplates = [
  {
    actorName: 'Admin Trần Mai',
    actorUsername: 'admin.tm',
    actorRole: 'admin',
    module: 'users',
    action: 'create_user',
    targetType: 'user_account',
    targetLabel: 'Tài khoản Nguyễn Minh Hùng',
    targetId: 'USR-1204',
    description: 'Tạo mới tài khoản phụ huynh để kích hoạt truy cập cổng sức khỏe học sinh.',
    status: 'success',
    metadata: { createdBy: 'admin.tm', source: 'admin-user-management' },
  },
  {
    actorName: 'Admin Trần Mai',
    actorUsername: 'admin.tm',
    actorRole: 'admin',
    module: 'users',
    action: 'lock_user',
    targetType: 'user_account',
    targetLabel: 'Tài khoản phụ huynh Lê Thu Hà',
    targetId: 'USR-1038',
    description: 'Khóa tạm thời tài khoản sau nhiều lần đăng nhập thất bại liên tiếp.',
    status: 'warning',
    metadata: { reason: 'Sai mật khẩu quá 5 lần', previousStatus: 'active', currentStatus: 'locked' },
  },
  {
    actorName: 'Y tá Nguyễn Thu An',
    actorUsername: 'nurse.nta',
    actorRole: 'nurse',
    module: 'health_profiles',
    action: 'update_health_profile',
    targetType: 'health_profile',
    targetLabel: 'Hồ sơ sức khỏe Trần Gia Bảo',
    targetId: 'HP-5502',
    description: 'Cập nhật chỉ số BMI và ghi nhận tiền sử dị ứng theo xác nhận mới nhất.',
    status: 'success',
    metadata: { source: 'student-profile-screen', previousStatus: 'review', currentStatus: 'active' },
  },
  {
    actorName: 'Y tá Nguyễn Thu An',
    actorUsername: 'nurse.nta',
    actorRole: 'nurse',
    module: 'examinations',
    action: 'create_examination',
    targetType: 'examination',
    targetLabel: 'Phiếu khám học sinh Nguyễn Gia Hân',
    targetId: 'EXM-3321',
    description: 'Tạo phiếu khám mới và cập nhật chẩn đoán viêm họng cấp cho học sinh.',
    status: 'success',
    metadata: { examinationCode: 'EXM-3321' },
  },
  {
    actorName: 'Dược sĩ Lê Hoàng',
    actorUsername: 'nurse.lh',
    actorRole: 'nurse',
    module: 'medicines',
    action: 'stock_in_medicine',
    targetType: 'medicine_stock',
    targetLabel: 'Lô Paracetamol 500mg',
    targetId: 'MED-BATCH-221',
    description: 'Nhập kho thuốc mới theo phiếu nhập từ nhà cung cấp đạt chuẩn.',
    status: 'success',
    metadata: { quantityIn: 450, source: 'warehouse-inbound' },
  },
  {
    actorName: 'Y tá Hoàng Minh',
    actorUsername: 'nurse.hm',
    actorRole: 'nurse',
    module: 'vaccinations',
    action: 'update_vaccination_status',
    targetType: 'vaccination_record',
    targetLabel: 'Hồ sơ tiêm chủng lớp 5A',
    targetId: 'VAC-REC-5A',
    description: 'Cập nhật trạng thái tiêm chủng sau khi hoàn tất đợt tiêm nhắc cho lớp 5A.',
    status: 'success',
    metadata: { vaccineName: 'MMR', previousStatus: 'scheduled', currentStatus: 'completed' },
  },
  {
    actorName: 'System Scheduler',
    actorUsername: 'system.scheduler',
    actorRole: 'system',
    module: 'system_sync',
    action: 'sync_system_data',
    targetType: 'sync_job',
    targetLabel: 'Đồng bộ hồ sơ học sinh với SIS',
    targetId: 'SYNC-7788',
    description: 'Đồng bộ dữ liệu hệ thống định kỳ hoàn tất, không phát hiện xung đột bản ghi.',
    status: 'success',
    metadata: { syncBatch: 'BATCH-20260411-02', source: 'scheduler-nightly' },
  },
  {
    actorName: 'System Scheduler',
    actorUsername: 'system.scheduler',
    actorRole: 'system',
    module: 'system_sync',
    action: 'sync_system_data',
    targetType: 'sync_job',
    targetLabel: 'Đồng bộ dữ liệu tiêm chủng với hệ thống tỉnh',
    targetId: 'SYNC-7794',
    description: 'Đồng bộ dữ liệu thất bại do mất kết nối tạm thời tới hệ thống đối tác.',
    status: 'error',
    metadata: { syncBatch: 'BATCH-20260411-05', reason: 'Kết nối timeout tới cổng đối tác' },
  },
];

const rows = [];
const startDate = new Date('2026-03-20T08:00:00Z');

// Generate enough records for pagination and role/date filtering.
for (let i = 0; i < 45; i++) {
  const template = activityTemplates[i % activityTemplates.length];
  const itemDate = new Date(startDate.getTime() + i * 3600000 * 2.5);

  rows.push({
    id: `LOG-${1000 + i}-2026`,
    createdAt: itemDate.toISOString(),
    ...template,
  });
}

const filterRows = (data, query) => {
  const keyword = (query.keyword || '').toLowerCase().trim();
  const role = (query.role || 'all').toLowerCase();
  const module = (query.module || 'all').toLowerCase();
  const action = (query.action || 'all').toLowerCase();

  const fromDate = query.fromDate ? new Date(query.fromDate) : null;
  const toDate = query.toDate ? new Date(query.toDate) : null;

  if (toDate) {
    toDate.setHours(23, 59, 59, 999);
  }

  return data.filter((row) => {
    const byKeyword =
      !keyword ||
      (row.description && row.description.toLowerCase().includes(keyword)) ||
      (row.targetLabel && row.targetLabel.toLowerCase().includes(keyword)) ||
      (row.actorName && row.actorName.toLowerCase().includes(keyword)) ||
      (row.actorUsername && row.actorUsername.toLowerCase().includes(keyword)) ||
      (row.action && row.action.toLowerCase().includes(keyword)) ||
      (row.module && row.module.toLowerCase().includes(keyword));

    const byRole = role === 'all' || row.actorRole?.toLowerCase() === role;
    const byModule = module === 'all' || row.module?.toLowerCase() === module;
    const byAction = action === 'all' || row.action?.toLowerCase() === action;

    let byDateRange = true;
    if (fromDate || toDate) {
      const rowDate = new Date(row.createdAt);
      if (fromDate && rowDate < fromDate) byDateRange = false;
      if (toDate && rowDate > toDate) byDateRange = false;
    }

    return byKeyword && byRole && byModule && byAction && byDateRange;
  });
};

export const getSystemLogsMockEnvelope = (query = {}) => {
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);
  
  // Sort descending by default to show newest first
  const sortedRows = [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
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
