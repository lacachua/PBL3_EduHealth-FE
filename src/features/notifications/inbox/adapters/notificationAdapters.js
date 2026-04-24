import { getNotificationComposeConfig } from '../constants/notificationComposeConfig';
import { getNotificationTypeMeta, normalizeSource, TARGET_MODES } from '../constants/notificationTypes';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_FEEDBACK_LENGTH = 1000;

export const normalizeRole = (role, fallback = '') => {
  const normalized = String(role || fallback || '').trim().toUpperCase();
  if (normalized === 'ADMIN' || normalized === 'NURSE' || normalized === 'STUDENT' || normalized === 'SYSTEM') {
    return normalized;
  }

  return fallback;
};

export const toInteger = (value, fallback = null) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const toNullableInteger = (value) => {
  const parsed = toInteger(value, null);
  return parsed && parsed > 0 ? parsed : null;
};

export const toText = (value, fallback = '') => {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
};

const uniquePositiveIds = (values = []) => {
  const seen = new Set();

  values.forEach((value) => {
    const parsed = toNullableInteger(value);
    if (parsed) {
      seen.add(parsed);
    }
  });

  return Array.from(seen.values());
};

export const getCurrentUserId = (currentUser) => toNullableInteger(
  currentUser?.userId
  ?? currentUser?.id
  ?? currentUser?.sub,
) || 0;

export const resolveRows = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const resolveMeta = (payload) => payload?.meta || payload?.data?.meta || {};

const normalizeRecipient = (item = {}, fallback = {}) => {
  const user = item.user || item;
  const userId = toInteger(item.userId ?? user.userId ?? user.id, toInteger(fallback.userId, 0));

  return {
    id: toInteger(item.id, toInteger(fallback.id, 0)),
    userId,
    fullName: toText(item.fullName ?? user.fullName ?? user.name, fallback.fullName || 'Người nhận'),
    role: normalizeRole(item.role ?? user.role, fallback.role || ''),
    className: toText(item.className ?? user.className, fallback.className || ''),
    isRead: Boolean(item.isRead ?? fallback.isRead ?? false),
    readAt: item.readAt ?? fallback.readAt ?? null,
    sentAt: item.sentAt ?? fallback.sentAt ?? null,
    status: toText(item.status, fallback.status || 'SENT'),
  };
};

const normalizeCurrentRecipient = ({ item, recipients, currentUser }) => {
  const explicit = item.currentRecipient || item.recipient;
  if (explicit) {
    return normalizeRecipient(explicit);
  }

  const currentUserId = getCurrentUserId(currentUser);
  const matched = currentUserId
    ? recipients.find((recipient) => Number(recipient.userId) === currentUserId)
    : null;

  if (matched) {
    return {
      id: matched.id,
      userId: matched.userId,
      isRead: matched.isRead,
      readAt: matched.readAt,
      sentAt: matched.sentAt,
      status: matched.status,
    };
  }

  return {
    id: 0,
    userId: currentUserId,
    isRead: Boolean(item.isRead ?? false),
    readAt: item.readAt ?? null,
    sentAt: item.sentAt ?? item.createdAt ?? null,
    status: toText(item.status, 'SENT'),
  };
};

export const normalizeFeedback = (item = {}, fallback = {}) => {
  const sender = item.sender || item.senderUser || {};

  return {
    feedbackId: toInteger(item.feedbackId ?? item.replyId ?? item.id, toInteger(fallback.feedbackId, 0)),
    notificationId: toInteger(item.notificationId, toInteger(fallback.notificationId, 0)),
    senderUserId: toInteger(item.senderUserId ?? sender.userId ?? sender.id, toInteger(fallback.senderUserId, 0)),
    senderName: toText(item.senderName ?? sender.fullName ?? sender.name, fallback.senderName || 'Người dùng EduHealth'),
    senderRole: normalizeRole(item.senderRole ?? sender.role, fallback.senderRole || ''),
    content: toText(item.content),
    createdAt: item.createdAt || fallback.createdAt || new Date().toISOString(),
    status: toText(item.status, fallback.status || 'SENT'),
    source: normalizeSource(item.source || fallback.source || 'MOCK'),
  };
};

export const toNotificationViewModel = (item = {}, { currentUser, viewerRole, source = 'MOCK' } = {}) => {
  const recipients = Array.isArray(item.recipients)
    ? item.recipients.map((recipient) => normalizeRecipient(recipient))
    : [];
  const currentRecipient = normalizeCurrentRecipient({ item, recipients, currentUser });
  const createdByUser = item.createdByUser || item.sender || {};
  const type = toText(item.type, 'GENERAL').toUpperCase();
  const role = normalizeRole(viewerRole || currentUser?.role, '');
  const typeMeta = getNotificationTypeMeta(type, role);
  const feedbacks = Array.isArray(item.feedbacks)
    ? item.feedbacks.map((feedback) => normalizeFeedback(feedback, { notificationId: item.notificationId, source }))
    : [];

  return {
    notificationId: toInteger(item.notificationId ?? item.id, 0),
    title: toText(item.title, 'Thông báo'),
    content: toText(item.content),
    type,
    typeLabel: typeMeta.label,
    createdByUserId: toInteger(item.createdByUserId ?? createdByUser.userId ?? createdByUser.id, 0),
    createdByName: toText(item.createdByName ?? createdByUser.fullName ?? createdByUser.name, 'Hệ thống EduHealth'),
    createdByRole: normalizeRole(item.createdByRole ?? createdByUser.role, 'SYSTEM'),
    createdAt: item.createdAt || item.sentAt || new Date().toISOString(),
    classId: toNullableInteger(item.classId ?? item.context?.classId),
    className: toText(item.className ?? item.context?.className),
    diseaseId: toNullableInteger(item.diseaseId ?? item.context?.diseaseId),
    diseaseName: toText(item.diseaseName ?? item.context?.diseaseName),
    vaccinationId: toNullableInteger(item.vaccinationId ?? item.context?.vaccinationId),
    vaccinationName: toText(item.vaccinationName ?? item.context?.vaccinationName),
    currentRecipient,
    recipients,
    feedbacks,
    feedbackCount: toInteger(item.feedbackCount ?? item.replyCount ?? feedbacks.length, feedbacks.length),
    source: normalizeSource(item.source || source),
  };
};

export const adaptNotificationsResponse = (payload = {}, fallbackParams = {}) => {
  const meta = resolveMeta(payload);
  const source = normalizeSource(meta.source || fallbackParams.source || 'MOCK');
  const rows = resolveRows(payload).map((item) => toNotificationViewModel(item, {
    currentUser: fallbackParams.currentUser,
    viewerRole: fallbackParams.viewerRole,
    source,
  }));
  const unreadCount = toInteger(
    meta.unreadCount,
    rows.reduce((sum, item) => sum + (item.currentRecipient?.isRead ? 0 : 1), 0),
  );

  return {
    items: rows,
    page: toInteger(meta.page, toInteger(fallbackParams.page, DEFAULT_PAGE)),
    pageSize: toInteger(meta.pageSize, toInteger(fallbackParams.pageSize, DEFAULT_PAGE_SIZE)),
    totalItems: toInteger(meta.totalItems ?? meta.total, rows.length),
    totalPages: toInteger(meta.totalPages, 1),
    unreadCount,
    source,
    sourceNote: toText(meta.note ?? meta.sourceNote),
  };
};

export const adaptRecentNotificationsResponse = (payload = {}, fallbackParams = {}) => {
  const data = adaptNotificationsResponse(payload, fallbackParams);
  return {
    items: data.items,
    unreadCount: data.unreadCount,
    source: data.source,
    sourceNote: data.sourceNote,
  };
};

export const adaptUnreadCountResponse = (payload = {}, fallback = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);

  return {
    unreadCount: toInteger(data.unreadCount ?? fallback.unreadCount, 0),
    source: normalizeSource(meta.source ?? fallback.source ?? 'MOCK'),
    sourceNote: toText(meta.note ?? fallback.sourceNote),
  };
};

export const adaptNotificationDetailResponse = (payload = {}, fallbackParams = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);
  const source = normalizeSource(meta.source || fallbackParams.source || 'MOCK');

  return {
    item: toNotificationViewModel(data, {
      currentUser: fallbackParams.currentUser,
      viewerRole: fallbackParams.viewerRole,
      source,
    }),
    source,
    sourceNote: toText(meta.note ?? meta.sourceNote),
  };
};

export const adaptFeedbacksResponse = (payload = {}, fallbackParams = {}) => {
  const meta = resolveMeta(payload);
  const source = normalizeSource(meta.source || fallbackParams.source || 'MOCK');
  const rows = resolveRows(payload).map((item) => normalizeFeedback(item, {
    notificationId: fallbackParams.notificationId,
    source,
  }));

  return {
    feedbacks: rows,
    source,
    sourceNote: toText(meta.note ?? meta.sourceNote),
  };
};

export const adaptCreateFeedbackResponse = (payload = {}, fallbackParams = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);
  const source = normalizeSource(meta.source || fallbackParams.source || 'MOCK_READY');

  return {
    feedback: normalizeFeedback(data, {
      notificationId: fallbackParams.notificationId,
      senderUserId: fallbackParams.senderUserId,
      senderName: fallbackParams.senderName,
      senderRole: fallbackParams.senderRole,
      source,
    }),
    source,
    sourceNote: toText(meta.note ?? meta.sourceNote),
  };
};

export const buildCreateNotificationPayload = (draft = {}) => {
  const recipientUserIds = uniquePositiveIds(draft.recipientUserIds || []);

  return {
    title: toText(draft.title),
    content: toText(draft.content),
    type: toText(draft.type),
    ...(toNullableInteger(draft.classId) ? { classId: toNullableInteger(draft.classId) } : {}),
    ...(recipientUserIds.length ? { recipientUserIds } : {}),
    ...(toNullableInteger(draft.diseaseId) ? { diseaseId: toNullableInteger(draft.diseaseId) } : {}),
    ...(toNullableInteger(draft.vaccinationId) ? { vaccinationId: toNullableInteger(draft.vaccinationId) } : {}),
  };
};

export const buildPreviewRecipientsPayload = (draft = {}) => {
  const recipientUserIds = uniquePositiveIds(draft.recipientUserIds || []);

  return {
    ...(toNullableInteger(draft.classId) ? { classId: toNullableInteger(draft.classId) } : {}),
    ...(recipientUserIds.length ? { userIds: recipientUserIds } : {}),
  };
};

export const buildCreateFeedbackPayload = (formState = {}) => ({
  notificationId: toNullableInteger(formState.notificationId),
  content: toText(formState.content),
});

export const createInitialComposeState = (role) => {
  const config = getNotificationComposeConfig(role);

  return {
    type: config.allowedTypes[0] || 'GENERAL',
    targetMode: config.defaultTargetMode,
    title: '',
    content: '',
    classId: '',
    recipientUserIds: [],
    diseaseId: '',
    vaccinationId: '',
  };
};

export const validateNotificationDraft = ({
  draft = {},
  role,
  recipientOptions = [],
}) => {
  const config = getNotificationComposeConfig(role);
  const payload = buildCreateNotificationPayload(draft);
  const fieldErrors = {};
  const targetMode = draft.targetMode || config.defaultTargetMode;
  const normalizedRole = normalizeRole(role, 'STUDENT');

  if (!payload.type) {
    fieldErrors.type = 'Vui lòng chọn loại thông báo.';
  } else if (!config.allowedTypes.includes(payload.type)) {
    fieldErrors.type = 'Loại thông báo không phù hợp với vai trò hiện tại.';
  }

  if (!payload.title) {
    fieldErrors.title = 'Tiêu đề là bắt buộc.';
  }

  if (!payload.content) {
    fieldErrors.content = 'Nội dung là bắt buộc.';
  }

  if (normalizedRole === 'STUDENT') {
    if (targetMode !== TARGET_MODES.RECIPIENTS) {
      fieldErrors.targetMode = 'Học sinh chỉ được gửi yêu cầu tới quản trị hoặc điều dưỡng.';
    }

    if (payload.classId) {
      fieldErrors.classId = 'Học sinh không được gửi yêu cầu theo lớp.';
    }

    if (!payload.recipientUserIds?.length) {
      fieldErrors.recipientUserIds = 'Vui lòng chọn quản trị hoặc điều dưỡng nhận yêu cầu.';
    }

    const recipientRoleMap = new Map(
      recipientOptions.map((recipient) => [Number(recipient.userId), normalizeRole(recipient.role, '')]),
    );
    const invalidRecipient = (payload.recipientUserIds || []).some((userId) => {
      const recipientRole = recipientRoleMap.get(Number(userId));
      return recipientRole && recipientRole !== 'ADMIN' && recipientRole !== 'NURSE';
    });

    if (invalidRecipient) {
      fieldErrors.recipientUserIds = 'Học sinh chỉ được gửi yêu cầu tới quản trị hoặc điều dưỡng.';
    }
  } else if (targetMode === TARGET_MODES.CLASS) {
    if (!payload.classId) {
      fieldErrors.classId = 'Vui lòng chọn lớp nhận thông báo.';
    }
  } else if (!payload.recipientUserIds?.length) {
    fieldErrors.recipientUserIds = 'Vui lòng chọn ít nhất một người nhận.';
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    payload,
  };
};

export const validateFeedbackDraft = ({ notificationId, content }) => {
  const payload = buildCreateFeedbackPayload({ notificationId, content });

  if (!payload.notificationId) {
    return {
      isValid: false,
      error: 'Không tìm thấy thông báo để phản hồi.',
      payload,
    };
  }

  if (!payload.content) {
    return {
      isValid: false,
      error: 'Nội dung phản hồi là bắt buộc.',
      payload,
    };
  }

  if (payload.content.length > MAX_FEEDBACK_LENGTH) {
    return {
      isValid: false,
      error: `Nội dung phản hồi tối đa ${MAX_FEEDBACK_LENGTH} ký tự.`,
      payload,
    };
  }

  return {
    isValid: true,
    error: '',
    payload,
  };
};

export const filterOptions = (options = [], keyword = '') => {
  const normalizedKeyword = toText(keyword).toLowerCase();

  if (!normalizedKeyword) {
    return options;
  }

  return options.filter((option) => [
    option.label,
    option.fullName,
    option.className,
    option.role,
    option.description,
  ].join(' ').toLowerCase().includes(normalizedKeyword));
};
