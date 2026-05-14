import { TARGET_MODES } from './notificationTypes';

export const NOTIFICATION_COMPOSE_CONFIG = Object.freeze({
  ADMIN: {
    role: 'ADMIN',
    pageTitle: 'Thông báo quản trị',
    subtitle: 'Theo dõi và gửi thông báo điều phối trong hệ thống.',
    composeButtonLabel: 'Soạn thông báo',
    modalTitle: 'Soạn thông báo quản trị',
    submitLabel: 'Gửi thông báo',
    emptyTitle: 'Chưa có thông báo quản trị',
    emptyDescription: 'Khi có thông báo điều phối hoặc yêu cầu gửi tới quản trị, danh sách sẽ hiển thị tại đây.',
    allowedTypes: ['GENERAL', 'SYSTEM', 'HEALTH_ALERT', 'VACCINATION_REMINDER', 'MEDICINE_NOTICE'],
    allowedTargetModes: [TARGET_MODES.CLASS, TARGET_MODES.RECIPIENTS, TARGET_MODES.ROLES],
    defaultTargetMode: TARGET_MODES.CLASS,
    canCompose: true,
    canViewRecipients: true,
    canReply: false,
    contentPlaceholder: 'Nhập nội dung thông báo...',
    recipientLabel: 'Chọn người nhận',
    targetModeLabels: {
      [TARGET_MODES.CLASS]: 'Theo lớp',
      [TARGET_MODES.RECIPIENTS]: 'Người nhận cụ thể',
      [TARGET_MODES.ROLES]: 'Theo vai trò',
    },
  },
  NURSE: {
    role: 'NURSE',
    pageTitle: 'Hộp thư điều dưỡng',
    subtitle: 'Tiếp nhận, theo dõi và gửi thông báo y tế học đường.',
    composeButtonLabel: 'Soạn thông báo',
    modalTitle: 'Soạn thông báo y tế',
    submitLabel: 'Gửi thông báo',
    emptyTitle: 'Chưa có thông báo y tế',
    emptyDescription: 'Thông báo quản trị, nhắc việc y tế và phản hồi từ học sinh sẽ xuất hiện ở đây.',
    allowedTypes: ['GENERAL', 'HEALTH_ALERT', 'VACCINATION_REMINDER', 'MEDICINE_NOTICE'],
    allowedTargetModes: [TARGET_MODES.CLASS, TARGET_MODES.RECIPIENTS],
    defaultTargetMode: TARGET_MODES.CLASS,
    canCompose: true,
    canViewRecipients: true,
    canReply: false,
    contentPlaceholder: 'Nhập nội dung thông báo y tế...',
    recipientLabel: 'Chọn người nhận',
    targetModeLabels: {
      [TARGET_MODES.CLASS]: 'Theo lớp',
      [TARGET_MODES.RECIPIENTS]: 'Học sinh/người nhận cụ thể',
    },
  },
  STUDENT: {
    role: 'STUDENT',
    pageTitle: 'Thông báo học sinh',
    subtitle: 'Theo dõi thông báo và gửi yêu cầu hỗ trợ khi cần.',
    composeButtonLabel: 'Gửi yêu cầu',
    modalTitle: 'Gửi yêu cầu hỗ trợ',
    submitLabel: 'Gửi yêu cầu',
    emptyTitle: 'Chưa có thông báo học sinh',
    emptyDescription: 'Thông báo từ nhà trường và phản hồi từ phòng y tế sẽ hiển thị tại đây.',
    allowedTypes: ['GENERAL', 'HEALTH_SUPPORT', 'MEDICINE_QUESTION', 'VACCINATION_QUESTION'],
    allowedTargetModes: [TARGET_MODES.RECIPIENTS],
    defaultTargetMode: TARGET_MODES.RECIPIENTS,
    canCompose: false,
    canViewRecipients: false,
    canReply: false,
    contentPlaceholder: 'Nhập nội dung cần hỗ trợ...',
    recipientLabel: 'Gửi tới',
    targetModeLabels: {
      [TARGET_MODES.RECIPIENTS]: 'Gửi tới',
    },
  },
});

export const getNotificationComposeConfig = (role) => {
  const normalized = String(role || '').trim().toUpperCase();
  return NOTIFICATION_COMPOSE_CONFIG[normalized] || NOTIFICATION_COMPOSE_CONFIG.STUDENT;
};

export const canViewNotificationRecipients = ({ role, notification, currentUser }) => {
  const config = getNotificationComposeConfig(role);
  const currentUserId = Number(currentUser?.userId || currentUser?.id || 0);

  if (!notification) {
    return false;
  }

  return Boolean(
    config.canViewRecipients
    || Number(notification.createdByUserId || 0) === currentUserId,
  );
};

export const canReplyToNotification = ({ role, notification, currentUser }) => {
  const config = getNotificationComposeConfig(role);
  if (!config.canReply || !notification?.notificationId) {
    return false;
  }

  const normalizedRole = String(role || '').trim().toUpperCase();
  const currentUserId = Number(currentUser?.userId || currentUser?.id || 0);
  const createdByUserId = Number(notification.createdByUserId || 0);
  const currentRecipientUserId = Number(notification.currentRecipient?.userId || 0);
  const isRecipient = currentRecipientUserId > 0 && currentRecipientUserId === currentUserId;
  const isSender = createdByUserId > 0 && createdByUserId === currentUserId;
  const hasRoleFallbackRelation = currentUserId <= 0 && (
    notification.createdByRole === normalizedRole
    || (notification.recipients || []).some((recipient) => recipient.role === normalizedRole)
  );

  if (normalizedRole === 'STUDENT') {
    return Boolean(isRecipient || isSender || hasRoleFallbackRelation);
  }

  return Boolean(isRecipient || isSender || hasRoleFallbackRelation);
};
