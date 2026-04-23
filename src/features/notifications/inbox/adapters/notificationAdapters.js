const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

const toInteger = (value, fallback = null) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
};

const toNullableInteger = (value) => {
  const parsed = toInteger(value, null);
  if (parsed === null || parsed <= 0) {
    return null;
  }

  return parsed;
};

const toText = (value, fallback = '') => {
  const normalized = String(value || '').trim();
  return normalized || fallback;
};

const uniquePositiveIds = (values = []) => {
  const seen = new Set();

  values.forEach((value) => {
    const parsed = toInteger(value, null);
    if (parsed !== null && parsed > 0) {
      seen.add(parsed);
    }
  });

  return Array.from(seen.values());
};

export const normalizeNotificationSender = (item = {}) => ({
  userId: toInteger(
    item?.sender?.userId
    ?? item?.createdByUser?.userId
    ?? item?.senderUserId
    ?? item?.createdByUserId,
    0,
  ),
  fullName: toText(
    item?.sender?.fullName
    ?? item?.createdByUser?.fullName,
    'He thong EduHealth',
  ),
  role: toText(
    item?.sender?.role
    ?? item?.createdByUser?.role,
    '',
  ).toUpperCase(),
});

export const normalizeNotificationContext = (item = {}) => ({
  classId: toNullableInteger(item?.context?.classId ?? item.classId),
  className: toText(item?.context?.className ?? item.className),
  diseaseId: toNullableInteger(item?.context?.diseaseId ?? item.diseaseId),
  diseaseName: toText(item?.context?.diseaseName ?? item.diseaseName),
  vaccinationId: toNullableInteger(item?.context?.vaccinationId ?? item.vaccinationId),
  vaccinationName: toText(item?.context?.vaccinationName ?? item.vaccinationName),
});

export const toNotificationViewModel = (item = {}) => {
  const nestedRecipient = item?.recipient || {};
  const isRead = Boolean(item?.isRead ?? nestedRecipient?.isRead);

  return {
    notificationId: toInteger(item?.notificationId ?? item?.id, 0),
    title: toText(item?.title, 'Thong bao'),
    content: toText(item?.content),
    type: toText(item?.type, 'GENERAL'),
    createdAt: item?.createdAt || item?.sentAt || new Date().toISOString(),
    sender: normalizeNotificationSender(item),
    context: normalizeNotificationContext(item),
    isRead,
    readAt: item?.readAt || nestedRecipient?.readAt || null,
    canReply: Boolean(item?.canReply ?? false),
    replyCount: toInteger(item?.replyCount, 0),
    threadId: toText(item?.threadId || (item?.notificationId ? `thread-${item.notificationId}` : ''), ''),
  };
};

export const toReplyViewModel = (item = {}) => ({
  replyId: toInteger(item?.replyId ?? item?.id, 0),
  sender: normalizeNotificationSender(item),
  content: toText(item?.content),
  createdAt: item?.createdAt || new Date().toISOString(),
});

const resolveRows = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }

  return [];
};

const resolveMeta = (payload) => payload?.meta || payload?.data?.meta || {};

export const adaptInboxResponse = (payload = {}, fallbackParams = {}) => {
  const rows = resolveRows(payload).map(toNotificationViewModel);
  const meta = resolveMeta(payload);
  const unreadCount = toInteger(
    meta?.unreadCount,
    rows.reduce((sum, item) => sum + (item.isRead ? 0 : 1), 0),
  );

  return {
    items: rows,
    page: toInteger(meta?.page, toInteger(fallbackParams?.page, DEFAULT_PAGE)),
    pageSize: toInteger(meta?.pageSize, toInteger(fallbackParams?.pageSize, DEFAULT_PAGE_SIZE)),
    totalItems: toInteger(meta?.totalItems ?? meta?.total, rows.length),
    totalPages: toInteger(meta?.totalPages, 1),
    unreadCount,
    source: toText(meta?.source, 'mock'),
    sourceNote: toText(meta?.note),
  };
};

export const adaptRecentNotificationsResponse = (payload = {}) => {
  const meta = resolveMeta(payload);
  const items = resolveRows(payload).map(toNotificationViewModel);

  return {
    items,
    unreadCount: toInteger(
      meta?.unreadCount,
      items.reduce((sum, item) => sum + (item.isRead ? 0 : 1), 0),
    ),
    source: toText(meta?.source, 'mock'),
    sourceNote: toText(meta?.note),
  };
};

export const adaptUnreadCountResponse = (payload = {}, fallback = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);

  return {
    unreadCount: toInteger(data?.unreadCount ?? fallback?.unreadCount, 0),
    source: toText(meta?.source ?? fallback?.source, 'mock'),
    sourceNote: toText(meta?.note ?? fallback?.sourceNote),
  };
};

export const adaptDetailResponse = (payload = {}) => {
  const data = payload?.data || payload;
  const meta = resolveMeta(payload);

  return {
    item: toNotificationViewModel(data),
    source: toText(meta?.source, 'mock'),
    sourceNote: toText(meta?.note),
  };
};

export const adaptThreadResponse = (payload = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);
  const replies = Array.isArray(data?.replies)
    ? data.replies.map(toReplyViewModel)
    : (Array.isArray(data) ? data.map(toReplyViewModel) : []);

  return {
    threadId: toText(data?.threadId, ''),
    replies,
    source: toText(meta?.source, 'mock'),
    sourceNote: toText(meta?.note),
  };
};

export const adaptReplyResponse = (payload = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);

  return {
    reply: toReplyViewModel(data),
    source: toText(meta?.source, 'mock'),
    sourceNote: toText(meta?.note),
  };
};

export const buildCreateNotificationPayload = (draft = {}) => {
  const recipientUserIds = uniquePositiveIds(draft?.recipientUserIds || []);

  return {
    title: toText(draft?.title),
    content: toText(draft?.content),
    type: toText(draft?.type),
    ...(toNullableInteger(draft?.classId) ? { classId: toNullableInteger(draft?.classId) } : {}),
    ...(toNullableInteger(draft?.diseaseId) ? { diseaseId: toNullableInteger(draft?.diseaseId) } : {}),
    ...(toNullableInteger(draft?.vaccinationId) ? { vaccinationId: toNullableInteger(draft?.vaccinationId) } : {}),
    ...(recipientUserIds.length ? { recipientUserIds } : {}),
  };
};

export const buildPreviewRecipientsPayload = (draft = {}) => {
  const recipientUserIds = uniquePositiveIds(draft?.recipientUserIds || []);

  return {
    ...(toNullableInteger(draft?.classId) ? { classId: toNullableInteger(draft?.classId) } : {}),
    ...(recipientUserIds.length ? { userIds: recipientUserIds } : {}),
  };
};

export const buildReplyPayload = (content) => ({
  content: toText(content),
});

export const validateNotificationDraft = (draft = {}) => {
  const payload = buildCreateNotificationPayload(draft);
  const fieldErrors = {};

  if (!payload.title) {
    fieldErrors.title = 'Tieu de la bat buoc.';
  }

  if (!payload.content) {
    fieldErrors.content = 'Noi dung la bat buoc.';
  }

  if (!payload.type) {
    fieldErrors.type = 'Loai thong bao la bat buoc.';
  }

  if (!payload.classId && !(payload.recipientUserIds && payload.recipientUserIds.length)) {
    fieldErrors.target = 'Can chon it nhat mot doi tuong nhan theo lop hoac nguoi nhan cu the.';
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    payload,
  };
};

export const validateReplyDraft = (value) => {
  const message = toText(value);
  if (!message) {
    return {
      isValid: false,
      error: 'Noi dung phan hoi la bat buoc.',
      payload: buildReplyPayload(value),
    };
  }

  return {
    isValid: true,
    error: '',
    payload: buildReplyPayload(value),
  };
};

export const parseRecipientUserIdsText = (value) => {
  return String(value || '')
    .split(/[\s,;]+/)
    .map((token) => toInteger(token, null))
    .filter((token) => token !== null && token > 0);
};
