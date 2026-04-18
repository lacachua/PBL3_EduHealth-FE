import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';

const statusLabelMap = {
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Lỗi',
  info: 'Thông tin',
};

const statusToneMap = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
  info: 'info',
};

const roleLabelMap = {
  admin: 'Quản trị viên',
  nurse: 'Nhân viên y tế',
  student: 'Học sinh',
  system: 'Hệ thống',
};

const moduleLabelMap = {
  users: 'Người dùng',
  students: 'Học sinh',
  health_profiles: 'Hồ sơ sức khỏe',
  examinations: 'Khám bệnh',
  medicines: 'Thuốc',
  vaccinations: 'Tiêm chủng',
  system_sync: 'Đồng bộ hệ thống',
  system: 'Hệ thống',
};

const actionLabelMap = {
  create_user: 'Tạo tài khoản',
  lock_user: 'Khóa tài khoản',
  update_health_profile: 'Cập nhật hồ sơ sức khỏe',
  create_examination: 'Tạo phiếu khám',
  stock_in_medicine: 'Nhập kho thuốc',
  update_vaccination_status: 'Cập nhật trạng thái tiêm chủng',
  sync_system_data: 'Đồng bộ dữ liệu hệ thống',
  create: 'Tạo mới',
  update: 'Cập nhật',
  delete: 'Xóa',
  sync: 'Đồng bộ',
};

const targetTypeLabelMap = {
  user_account: 'Tài khoản',
  health_profile: 'Hồ sơ sức khỏe',
  examination: 'Phiếu khám',
  medicine_stock: 'Kho thuốc',
  vaccination_record: 'Hồ sơ tiêm chủng',
  sync_job: 'Lô đồng bộ',
};

const asCode = (value = '') => String(value || '').trim().toLowerCase();

const mapLogRow = (item = {}) => {
  const createdAt = item.createdAt || item.occurredAt || '--';
  const actorRole = item.actorRole || '--';
  const module = item.module || item.moduleCode || item.moduleLabel || '--';
  const action = item.action || item.actionCode || item.actionCategory || item.actionLabel || '--';
  const targetType = item.targetType || item.targetTypeCode || item.targetTypeLabel || '--';
  const status = item.status || item.statusCode || item.statusTone || '--';

  const roleCode = asCode(actorRole);
  const moduleCode = asCode(module);
  const actionCode = asCode(action);
  const targetTypeCode = asCode(targetType);
  const statusCode = asCode(status);

  return {
    id: item.id || '--',
    createdAt,
    actorName: item.actorName || '--',
    actorUsername: item.actorUsername || '--',
    actorRole,
    roleLabel: roleLabelMap[roleCode] || actorRole || '--',
    module,
    moduleLabel: moduleLabelMap[moduleCode] || item.moduleLabel || module || '--',
    action,
    actionLabel: actionLabelMap[actionCode] || item.actionLabel || action || '--',
    targetType,
    targetTypeLabel: targetTypeLabelMap[targetTypeCode] || item.targetTypeLabel || targetType || '--',
    targetLabel: item.targetLabel || item.targetName || '--',
    description: item.description || item.message || '--',
    status,
    statusLabel: statusLabelMap[statusCode] || item.statusLabel || status || '--',
    statusTone: statusToneMap[statusCode] || item.statusTone || 'neutral',
    targetId: item.targetId || null,
    metadata: item.metadata || null,
  };
};

export const adaptSystemLogsResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  if (!envelope || envelope.success === false) {
    return { rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 };
  }

  // Support both legacy shape { data: { logs: [] } } and current BE shape { data: [] }.
  const sourceRows = Array.isArray(envelope.data)
    ? envelope.data
    : Array.isArray(envelope.data?.logs)
      ? envelope.data.logs
      : [];

  const rows = Array.isArray(sourceRows)
    ? sourceRows.map((item) => mapLogRow(item))
    : [];

  return {
    rows,
    page: Number(envelope.meta?.page || 1),
    pageSize: Number(envelope.meta?.pageSize || 10),
    totalItems: Number(envelope.meta?.totalItems || rows.length),
    totalPages: Number(envelope.meta?.totalPages || 1),
  };
};
