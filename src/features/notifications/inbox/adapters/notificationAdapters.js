import { getNotificationComposeConfig } from '../constants/notificationComposeConfig';
import { getNotificationTypeMeta, normalizeSource, TARGET_MODES, getRoleLabel } from '../constants/notificationTypes';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PUBLIC_PAGE_SIZE = 6;
const PUBLIC_SUMMARY_LENGTH = 140;

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

/**
 * Robustly extracts a numeric User ID from various possible fields and formats.
 * Supports:
 * - Integer IDs (e.g. 10)
 * - Numeric strings (e.g. "10")
 * - Coded identifiers (e.g. "USR001" -> 1) - used by Admin user lookup
 */
export const toRecipientUserId = (value, fallback = 0) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }

  const str = String(value).trim();
  if (!str || str === 'null' || str === 'undefined') {
    return fallback;
  }

  // Try direct parse
  const direct = Number(str);
  if (Number.isInteger(direct) && direct > 0) {
    return direct;
  }

  // Try extracting trailing digits (for "USR001" format)
  const match = str.match(/(\d+)$/);
  if (match?.[1]) {
    const extracted = Number(match[1]);
    if (Number.isInteger(extracted) && extracted > 0) {
      return extracted;
    }
  }

  return fallback;
};

export const toNullableInteger = (value) => {
  const parsed = toInteger(value, null);
  return parsed && parsed > 0 ? parsed : null;
};

export const toText = (value, fallback = '') => {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
};

export const toOptionalText = (value) => {
  const normalized = String(value ?? '').trim();
  return normalized || '';
};

const toSummary = (value) => {
  const text = toText(value);
  if (!text) {
    return '';
  }

  if (text.length <= PUBLIC_SUMMARY_LENGTH) {
    return text;
  }

  return `${text.slice(0, PUBLIC_SUMMARY_LENGTH).trim()}...`;
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
  const userId = toRecipientUserId(
    item.userId ?? item.UserId ?? user.userId ?? user.id ?? user.Id,
    toRecipientUserId(fallback.userId, 0)
  );

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

export const normalizeRecipientCandidate = (item = {}) => {
  const userId = toRecipientUserId(item.userId ?? item.UserId ?? item.id ?? item.Id, 0);
  const fullName = toText(item.fullName ?? item.FullName, 'Người nhận');
  const role = normalizeRole(item.role ?? item.Role, 'STUDENT');

  return {
    id: userId, // FE identifier
    userId,     // BE payload identifier
    fullName,
    role,
    roleLabel: getRoleLabel(role),
    className: toText(item.className ?? item.ClassName, ''),
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

export const toNotificationViewModel = (item = {}, { currentUser, viewerRole, source = 'MOCK' } = {}) => {
  const recipients = Array.isArray(item.recipients)
    ? item.recipients.map((recipient) => normalizeRecipient(recipient))
    : [];
  const currentRecipient = normalizeCurrentRecipient({ item, recipients, currentUser });
  const notificationId = toInteger(item.notificationId ?? item.id, 0);
  const imageUrl = toOptionalText(item.imageUrl ?? item.image);

  const type = toText(item.type, 'GENERAL').toUpperCase();
  const role = normalizeRole(viewerRole || currentUser?.role, '');
  const typeMeta = getNotificationTypeMeta(type, role);
  const createdByUser = item.createdByUser || item.sender || {};

  return {
    id: notificationId,
    notificationId,
    title: toText(item.title, 'Thông báo'),
    content: toText(item.content),
    imageUrl,
    type,
    typeLabel: typeMeta.label,
    createdByUserId: toInteger(item.createdByUserId ?? createdByUser.userId ?? createdByUser.id, 0),
    createdByName: toText(item.createdByName ?? item.createdByUserName ?? createdByUser.fullName ?? createdByUser.name, 'Hệ thống EduHealth'),
    createdByRole: normalizeRole(item.createdByRole ?? createdByUser.role, 'SYSTEM'),
    createdAt: item.createdAt || item.sentAt || new Date().toISOString(),
    classId: toNullableInteger(item.classId ?? item.context?.classId),
    className: toText(item.className ?? item.context?.className),
    diseaseId: toNullableInteger(item.diseaseId ?? item.context?.diseaseId),
    diseaseName: toText(item.diseaseName ?? item.context?.diseaseName),
    vaccinationId: toNullableInteger(item.vaccinationId ?? item.context?.vaccinationId),
    vaccinationName: toText(item.vaccinationName ?? item.context?.vaccinationName),
    currentRecipient,
    isRead: Boolean(currentRecipient?.isRead),
    readAt: currentRecipient?.readAt ?? null,
    recipients,
    source: normalizeSource(item.source || source),
  };
};

export const toPublicNotificationModel = (item = {}) => {
  const notificationId = toInteger(item.notificationId ?? item.NotificationId ?? item.id ?? item.Id, 0);
  const content = toText(item.content ?? item.Content);

  return {
    id: notificationId,
    notificationId,
    title: toText(item.title ?? item.Title, 'Bản tin y tế'),
    summary: toSummary(item.summary ?? item.Summary ?? content),
    content,
    imageUrl: toOptionalText(item.imageUrl ?? item.Image ?? item.image),
    type: toText(item.type ?? item.Type).toUpperCase() || 'GENERAL',
    createdAt: item.publishedAt || item.PublishedAt || item.createdAt || item.CreatedAt || new Date().toISOString(),
    createdByName: toText(item.createdByName ?? item.createdByUserName, 'Hệ thống EduHealth'),
  };
};

export const toSentNotificationModel = (item = {}) => {
  const notificationId = toInteger(item.notificationId ?? item.NotificationId ?? item.id ?? item.Id, 0);

  return {
    id: notificationId,
    notificationId,
    isSentItem: true,
    title: toText(item.title ?? item.Title, 'Thông báo'),
    content: toText(item.content ?? item.Content),
    imageUrl: toOptionalText(item.imageUrl ?? item.image ?? item.Image),
    type: toText(item.type ?? item.Type).toUpperCase() || 'GENERAL',
    visibility: toText(item.visibility ?? item.Visibility, 'INTERNAL').toUpperCase(),
    createdAt: item.createdAt ?? item.CreatedAt ?? new Date().toISOString(),
    totalRecipients: Number(item.totalRecipients ?? item.TotalRecipients ?? 0),
    readCount: Number(item.readCount ?? item.ReadCount ?? 0),
    unreadCount: Number(item.unreadCount ?? item.UnreadCount ?? 0),
    classId: toNullableInteger(item.classId ?? item.ClassId),
    diseaseId: toNullableInteger(item.diseaseId ?? item.DiseaseId),
    vaccinationId: toNullableInteger(item.vaccinationId ?? item.VaccinationId),
    // Recipients details are not returned by current BE /sent endpoint, only stats.
    recipients: [],
  };
};

export const adaptNotificationsResponse = (payload = {}, fallbackParams = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);
  const source = normalizeSource(meta.source || data.source || fallbackParams.source || 'MOCK');
  const rows = resolveRows(payload).map((item) => toNotificationViewModel(item, {
    currentUser: fallbackParams.currentUser,
    viewerRole: fallbackParams.viewerRole,
    source,
  }));
  const unreadCount = toInteger(
    data.unreadCount ?? meta.unreadCount,
    rows.reduce((sum, item) => sum + (item.currentRecipient?.isRead ? 0 : 1), 0),
  );

  return {
    items: rows,
    page: toInteger(data.page ?? meta.page, toInteger(fallbackParams.page, DEFAULT_PAGE)),
    pageSize: toInteger(data.pageSize ?? meta.pageSize, toInteger(fallbackParams.pageSize, DEFAULT_PAGE_SIZE)),
    totalItems: toInteger(data.totalItems ?? data.total ?? meta.totalItems ?? meta.total, rows.length),
    totalPages: toInteger(data.totalPages ?? meta.totalPages, 1),
    unreadCount,
    source,
  };
};

export const adaptRecentNotificationsResponse = (payload = {}, fallbackParams = {}) => {
  const data = adaptNotificationsResponse(payload, fallbackParams);
  return {
    items: data.items,
    unreadCount: data.unreadCount,
    source: data.source,
  };
};

export const adaptUnreadCountResponse = (payload = {}, fallback = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);

  return {
    unreadCount: toInteger(data.unreadCount ?? fallback.unreadCount, 0),
    source: normalizeSource(meta.source ?? data.source ?? fallback.source ?? 'MOCK'),
  };
};

export const adaptPublicNotificationsResponse = (payload = {}, fallbackParams = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);
  const rows = resolveRows(payload).map((item) => toPublicNotificationModel(item));

  return {
    items: rows,
    page: toInteger(data.page ?? meta.page, toInteger(fallbackParams.page, DEFAULT_PAGE)),
    pageSize: toInteger(data.pageSize ?? meta.pageSize, toInteger(fallbackParams.pageSize, DEFAULT_PUBLIC_PAGE_SIZE)),
    totalItems: toInteger(data.total ?? meta.total, rows.length),
    totalPages: toInteger(data.totalPages ?? meta.totalPages, 1),
    source: normalizeSource(meta.source ?? data.source ?? fallbackParams.source ?? 'LIVE'),
  };
};

export const adaptSentNotificationsResponse = (payload = {}, fallbackParams = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);
  const rows = resolveRows(payload).map((item) => toSentNotificationModel(item));

  return {
    items: rows,
    page: toInteger(data.page ?? meta.page, toInteger(fallbackParams.page, DEFAULT_PAGE)),
    pageSize: toInteger(data.pageSize ?? meta.pageSize, toInteger(fallbackParams.pageSize, DEFAULT_PAGE_SIZE)),
    totalItems: toInteger(data.total ?? meta.total, rows.length),
    totalPages: toInteger(data.totalPages ?? meta.totalPages, 1),
    source: normalizeSource(meta.source ?? data.source ?? fallbackParams.source ?? 'LIVE'),
  };
};

export const adaptUploadImageResponse = (payload = {}, fallbackParams = {}) => {
  const data = payload?.data || payload || {};
  const meta = resolveMeta(payload);
  const source = normalizeSource(meta.source ?? data.source ?? fallbackParams.source ?? 'LIVE');

  return {
    imageUrl: toText(data.url ?? data.imageUrl),
    publicId: toText(data.publicId ?? data.public_id),
    source,
  };
};

const normalizeTargetRoles = (roles = []) => {
  if (!Array.isArray(roles)) {
    return [];
  }

  const normalized = roles
    .map((role) => normalizeRole(role, ''))
    .filter((role) => role === 'ADMIN' || role === 'NURSE' || role === 'STUDENT');

  return Array.from(new Set(normalized));
};

const resolveTargetModeForApi = ({ targetMode, visibility }) => {
  if (visibility === 'PUBLIC') {
    return 'NONE';
  }

  const normalized = toText(targetMode).toUpperCase();

  if (normalized === 'CLASS') {
    return 'CLASS';
  }

  if (normalized === 'USERS' || normalized === 'RECIPIENTS') {
    return 'USERS';
  }

  if (normalized === 'ROLES' || normalized === 'STAFF') {
    return 'ROLES';
  }

  return 'NONE';
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
  };
};

export const buildCreateNotificationPayload = (draft = {}) => {
  const title = toText(draft.title);
  const content = toText(draft.content);
  const type = toText(draft.type);
  const image = toOptionalText(draft.image ?? draft.imageUrl);
  const visibility = toOptionalText(draft.visibility || 'INTERNAL').toUpperCase();
  const targetMode = resolveTargetModeForApi({
    targetMode: draft.targetMode,
    visibility,
  });

  const payload = {
    title,
    content,
    type,
    image: image || null,
    visibility,
    targetMode,
    classId: toNullableInteger(draft.classId),
    diseaseId: toNullableInteger(draft.diseaseId),
    vaccinationId: toNullableInteger(draft.vaccinationId),
    recipientUserIds: null,
    targetRoles: null,
  };

  if (visibility === 'PUBLIC' || targetMode === 'NONE') {
    payload.targetMode = 'NONE';
    payload.classId = null;
    payload.recipientUserIds = null;
    payload.targetRoles = null;
  } else {
    if (targetMode === 'CLASS') {
      payload.recipientUserIds = null;
      payload.targetRoles = null;
    } else if (targetMode === 'USERS') {
      payload.classId = null;
      payload.targetRoles = null;
      payload.recipientUserIds = uniquePositiveIds(draft.recipientUserIds || []);
    } else if (targetMode === 'ROLES') {
      payload.classId = null;
      payload.recipientUserIds = null;
      payload.targetRoles = normalizeTargetRoles(draft.targetRoles || []);
    }
  }

  return payload;
};

export const buildPreviewRecipientsPayload = (draft = {}) => {
  const targetMode = resolveTargetModeForApi({
    targetMode: draft.targetMode,
    visibility: draft.visibility,
  });

  if (targetMode === 'CLASS') {
    return {
      classId: toNullableInteger(draft.classId),
      userIds: null,
    };
  }

  if (targetMode === 'USERS' || targetMode === 'RECIPIENTS') {
    return {
      classId: null,
      userIds: uniquePositiveIds(draft.recipientUserIds || []),
    };
  }

  return {
    classId: null,
    userIds: null,
  };
};

export const createInitialComposeState = (role) => {
  const config = getNotificationComposeConfig(role);

  return {
    type: config.allowedTypes[0] || 'GENERAL',
    targetMode: config.defaultTargetMode,
    visibility: 'INTERNAL',
    title: '',
    content: '',
    imageUrl: '',
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
  const visibility = toText(draft.visibility, 'INTERNAL').toUpperCase();

  if (visibility !== 'INTERNAL' && visibility !== 'PUBLIC' && visibility !== 'BOTH') {
    fieldErrors.visibility = 'Vui lòng chọn phạm vi hiển thị.';
  }

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
  } else if (visibility !== 'PUBLIC' && targetMode === TARGET_MODES.CLASS) {
    if (!payload.classId) {
      fieldErrors.classId = 'Vui lòng chọn lớp nhận thông báo.';
    }
  } else if (visibility !== 'PUBLIC' && targetMode === TARGET_MODES.ROLES) {
    if (!payload.targetRoles?.length) {
      fieldErrors.targetRoles = 'Vui lòng chọn ít nhất một vai trò.';
    }
  } else if (visibility !== 'PUBLIC' && (targetMode === TARGET_MODES.RECIPIENTS || targetMode === 'USERS')) {
    if (!payload.recipientUserIds?.length) {
      fieldErrors.recipientUserIds = 'Vui lòng chọn ít nhất một người nhận.';
    }
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    payload,
  };
};

export const filterOptions = (options, keyword) => {
  if (!Array.isArray(options)) {
    return [];
  }
  
  const normalizedKeyword = toText(keyword).toLowerCase();
  if (!normalizedKeyword) {
    return options;
  }

  return options.filter((option) => {
    const fullName = toText(option.fullName || option.label).toLowerCase();
    const className = toText(option.className).toLowerCase();
    const roleLabel = getRoleLabel(option.role).toLowerCase();

    return (
      fullName.includes(normalizedKeyword) ||
      className.includes(normalizedKeyword) ||
      roleLabel.includes(normalizedKeyword)
    );
  });
};
