export const NOTIFICATION_TYPES = Object.freeze({
  GENERAL: {
    value: 'GENERAL',
    label: 'Thông báo chung',
    studentLabel: 'Yêu cầu chung',
    tone: 'info',
  },
  SYSTEM: {
    value: 'SYSTEM',
    label: 'Thông báo hệ thống',
    tone: 'surface',
  },
  HEALTH_ALERT: {
    value: 'HEALTH_ALERT',
    label: 'Cảnh báo sức khỏe',
    tone: 'danger',
  },
  HEALTH_SUPPORT: {
    value: 'HEALTH_SUPPORT',
    label: 'Hỗ trợ sức khỏe',
    tone: 'danger',
  },
  VACCINATION_REMINDER: {
    value: 'VACCINATION_REMINDER',
    label: 'Nhắc tiêm chủng',
    tone: 'warning',
  },
  VACCINATION_QUESTION: {
    value: 'VACCINATION_QUESTION',
    label: 'Hỏi về tiêm chủng',
    tone: 'warning',
  },
  MEDICINE_NOTICE: {
    value: 'MEDICINE_NOTICE',
    label: 'Thông báo thuốc',
    tone: 'success',
  },
  MEDICINE_QUESTION: {
    value: 'MEDICINE_QUESTION',
    label: 'Hỏi về thuốc',
    tone: 'success',
  },
});

export const ROLE_LABELS = Object.freeze({
  ADMIN: 'Quản trị',
  NURSE: 'Điều dưỡng',
  STUDENT: 'Học sinh',
  SYSTEM: 'Hệ thống',
});

export const TARGET_MODES = Object.freeze({
  CLASS: 'CLASS',
  RECIPIENTS: 'RECIPIENTS',
  ROLES: 'ROLES',
});

export const SOURCE_LABELS = Object.freeze({
  LIVE: 'Dữ liệu thật',
  MOCK: 'Dữ liệu mẫu',
  MOCK_READY: 'Dữ liệu mẫu',
  PENDING: 'Chờ backend',
});

export const SOURCE_TONE_CLASS_MAP = Object.freeze({
  LIVE: 'border-success/25 bg-success-soft text-success',
  MOCK: 'border-warning/30 bg-warning-soft text-warning',
  MOCK_READY: 'border-warning/30 bg-warning-soft text-warning',
  PENDING: 'border-outline-variant bg-surface-container-low text-on-surface-variant',
});

export const TYPE_TONE_CLASS_MAP = Object.freeze({
  info: 'border-info/25 bg-info-soft text-info',
  danger: 'border-danger/25 bg-danger-soft text-danger',
  warning: 'border-warning/25 bg-warning-soft text-warning',
  success: 'border-success/25 bg-success-soft text-success',
  surface: 'border-outline-variant bg-surface-container-low text-on-surface-variant',
});

export const getNotificationTypeMeta = (type, role) => {
  const meta = NOTIFICATION_TYPES[String(type || '').toUpperCase()] || NOTIFICATION_TYPES.GENERAL;

  if (String(role || '').toUpperCase() === 'STUDENT' && meta.studentLabel) {
    return {
      ...meta,
      label: meta.studentLabel,
    };
  }

  return meta;
};

export const getRoleLabel = (role) => ROLE_LABELS[String(role || '').toUpperCase()] || role || '';

export const normalizeSource = (source) => {
  const normalized = String(source || '').trim().toUpperCase();
  if (normalized === 'LIVE' || normalized === 'MOCK' || normalized === 'MOCK_READY' || normalized === 'PENDING') {
    return normalized;
  }

  if (normalized === 'MOCK-READY') {
    return 'MOCK_READY';
  }

  return 'PENDING';
};
