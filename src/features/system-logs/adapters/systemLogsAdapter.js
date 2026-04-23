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
  system: 'Hệ thống',
};

const actionLabelMap = {
  create_user: 'Tạo tài khoản',
  lock_user: 'Khóa tài khoản',
  unlock_user: 'Mở khóa tài khoản',
  update_user_avatar: 'Cập nhật ảnh đại diện',
  stock_in: 'Nhập kho thuốc',
  dispose_medicine: 'Hủy thuốc',
  create: 'Tạo mới',
  update: 'Cập nhật',
  delete: 'Xóa',
};

const targetTypeLabelMap = {
  user: 'Tài khoản',
  student: 'Học sinh',
  medicine: 'Thuốc',
};

const asCode = (value = '') => String(value || '').trim().toLowerCase();

const mapLogRow = (item = {}) => {
  const createdAt = item.createdAt || '--';
  const actorRole = item.actorRole || '--';
  const module = item.module || '--';
  const action = item.action || '--';
  const targetType = item.targetType || '--';
  const status = item.status || '--';

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
    roleLabel: roleLabelMap[roleCode] || actorRole,
    module,
    moduleLabel: moduleLabelMap[moduleCode] || module,
    action,
    actionLabel: actionLabelMap[actionCode] || action,
    targetType,
    targetTypeLabel: targetTypeLabelMap[targetTypeCode] || targetType,
    targetLabel: item.targetLabel || '--',
    description: item.description || '--',
    status,
    statusLabel: statusLabelMap[statusCode] || status,
    statusTone: statusToneMap[statusCode] || 'neutral',
    targetId: item.targetId || null,
    metadata: item.metadata || null,
  };
};

export const adaptSystemLogsResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  if (!envelope || envelope.success === false) {
    return { rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 };
  }

  const sourceRows = Array.isArray(envelope.data)
    ? envelope.data
    : [];

  const rows = sourceRows.map((item) => mapLogRow(item));

  return {
    rows,
    page: Number(envelope.meta?.page || 1),
    pageSize: Number(envelope.meta?.pageSize || 10),
    totalItems: Number(envelope.meta?.totalItems || rows.length),
    totalPages: Number(envelope.meta?.totalPages || 1),
  };
};

export const adaptSystemLogDetailResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  if (!envelope || envelope.success === false || !envelope.data) {
    return null;
  }

  return mapLogRow(envelope.data);
};
