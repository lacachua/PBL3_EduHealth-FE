import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { ADMIN_MODULE_LABELS } from '../../../shared/constants/adminLabels';

const statusTone = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
};

const actionLabelMap = {
  CREATE_STUDENT: 'Tạo mới học sinh',
  UPDATE_ROLE: 'Cập nhật vai trò',
  DELETE_DUPLICATE: 'Xóa bản ghi trùng',
  EXPORT_REPORT: 'Xuất báo cáo',
  SYNC_ERROR: 'Đồng bộ lỗi',
  UPDATE_VACCINATION: 'Cập nhật tiêm chủng',
};

const targetTypeLabelMap = {
  student: 'Học sinh',
  'user-account': 'Tài khoản người dùng',
  'catalog-item': 'Mục danh mục',
  report: 'Báo cáo',
  'integration-job': 'Phiên đồng bộ',
  'student-vaccination': 'Tiêm chủng học sinh',
};

const statusLabelMap = {
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Lỗi',
};

export const adaptSystemLogsResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  if (!envelope || envelope.success === false) {
    return { rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 };
  }

  const rows = Array.isArray(envelope.data?.logs)
    ? envelope.data.logs.map((item) => ({
      ...item,
      moduleLabel: ADMIN_MODULE_LABELS[item.module] || item.module,
      actionLabel: actionLabelMap[item.action] || item.action,
      targetTypeLabel: targetTypeLabelMap[item.targetType] || item.targetType || '--',
      statusTone: statusTone[item.status] || 'neutral',
      statusLabel: statusLabelMap[item.status] || item.status,
    }))
    : [];

  return {
    rows,
    page: Number(envelope.meta?.page || 1),
    pageSize: Number(envelope.meta?.pageSize || 10),
    totalItems: Number(envelope.meta?.totalItems || rows.length),
    totalPages: Number(envelope.meta?.totalPages || 1),
  };
};
