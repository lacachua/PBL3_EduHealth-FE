import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';

const statusLabelMap = {
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Lỗi',
};

const roleLabelMap = {
  admin: 'Quản trị viên',
  nurse: 'Nhân viên y tế',
  student: 'Học sinh',
  system: 'Hệ thống',
};

export const adaptSystemLogsResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  if (!envelope || envelope.success === false) {
    return { rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 };
  }

  const rows = Array.isArray(envelope.data?.logs)
    ? envelope.data.logs.map((item) => ({
      id: item.id || '--',
      occurredAt: item.occurredAt || '--',
      actorName: item.actorName || '--',
      actorUsername: item.actorUsername || '--',
      actorRole: item.actorRole || '--',
      roleLabel: roleLabelMap[item.actorRole] || item.actorRole || '--',
      actionCategory: item.actionCategory || '--',
      actionLabel: item.actionLabel || '--',
      moduleLabel: item.moduleLabel || '--',
      targetName: item.targetName || '--',
      targetTypeLabel: item.targetTypeLabel || '--',
      statusTone: item.statusTone || 'neutral',
      statusLabel: statusLabelMap[item.statusTone] || item.statusLabel || item.statusTone || '--',
      message: item.message || '--',
      detail: item.detail || item.message || '--'
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
