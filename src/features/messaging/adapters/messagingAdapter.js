import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { getStoredUser } from '../../../shared/services/tokenClient';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

const toText = (value, fallback = '') => {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
};

const toInteger = (value, fallback = null) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toNullableInteger = (value) => {
  const parsed = toInteger(value, null);
  return parsed && parsed > 0 ? parsed : null;
};

const toBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return fallback;
};

const resolveEnvelope = (payload) => normalizeApiEnvelope(payload);

const resolveRows = (envelope) => {
  if (Array.isArray(envelope?.data)) {
    return envelope.data;
  }

  if (Array.isArray(envelope?.data?.items)) {
    return envelope.data.items;
  }

  if (Array.isArray(envelope?.items)) {
    return envelope.items;
  }

  return [];
};

const resolveMeta = (envelope) => envelope?.meta || envelope?.data?.meta || {};

const resolveCurrentUserId = (currentUser) => toNullableInteger(
  currentUser?.userId ?? currentUser?.id ?? currentUser?.sub,
) || 0;

const createClientMessageId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const normalizeAttachment = (item = {}) => ({
  attachmentId: toInteger(item.attachmentId ?? item.id, 0),
  fileName: toText(item.fileName ?? item.name),
  originalFileName: toText(item.originalFileName ?? item.fileName ?? item.name, 'Tệp đính kèm'),
  fileUrl: item.fileUrl ?? item.url ?? '',
  contentType: toText(item.contentType ?? item.type),
  sizeBytes: toInteger(item.sizeBytes ?? item.size, 0),
});

export const normalizeMessage = (item = {}, options = {}) => {
  const currentUserId = resolveCurrentUserId(options.currentUser || getStoredUser());
  const senderId = toInteger(item.senderId ?? item.senderUserId ?? item.userId, 0);
  const isMine = Boolean(currentUserId && senderId && currentUserId === senderId);

  return {
    messageId: toInteger(item.messageId ?? item.id, 0),
    conversationId: toInteger(item.conversationId, 0),
    senderId,
    senderName: toText(item.senderName ?? item.sender?.fullName, 'Người dùng EduHealth'),
    senderRole: toText(item.senderRole ?? item.sender?.role, ''),
    senderAvatarUrl: item.senderAvatarUrl ?? item.sender?.avatarUrl ?? null,
    content: toText(item.content),
    messageType: toText(item.messageType, 'TEXT'),
    clientMessageId: toText(item.clientMessageId, ''),
    sentAt: item.sentAt || item.createdAt || null,
    editedAt: item.editedAt ?? null,
    deletedAt: item.deletedAt ?? null,
    isDeleted: toBoolean(item.isDeleted, false),
    isMine,
    attachments: Array.isArray(item.attachments) ? item.attachments.map(normalizeAttachment) : [],
    readBy: Array.isArray(item.readBy) ? item.readBy : [],
    status: toText(item.status, ''),
  };
};

export const normalizeConversation = (item = {}, options = {}) => {
  const lastMessage = item.lastMessage ? normalizeMessage(item.lastMessage, options) : null;

  return {
    conversationId: toInteger(item.conversationId ?? item.id, 0),
    conversationType: toText(item.conversationType, 'DIRECT'),
    title: toText(item.title, 'Hội thoại'),
    studentId: toNullableInteger(item.studentId),
    studentName: toText(item.studentName, ''),
    className: toText(item.className, ''),
    avatarUrl: item.avatarUrl ?? null,
    participants: Array.isArray(item.participants) ? item.participants : [],
    lastMessage,
    unreadCount: toInteger(item.unreadCount, 0),
    isPinned: toBoolean(item.isPinned, false),
    updatedAt: item.updatedAt || item.lastMessage?.sentAt || null,
    createdAt: item.createdAt || null,
  };
};

const normalizeContact = (item = {}) => {
  return {
    userId: toInteger(item.userId ?? item.id, 0),
    studentId: toNullableInteger(item.studentId),
    fullName: toText(item.fullName ?? item.name, 'Người dùng EduHealth'),
    className: toText(item.className, ''),
    role: toText(item.role, ''),
    avatarUrl: item.avatarUrl ?? null,
    gender: toText(item.gender, ''),
    dateOfBirth: item.dateOfBirth ?? null,
    hasConversation: toBoolean(item.hasConversation, false),
    conversationId: toNullableInteger(item.conversationId),
    lastMessageAt: item.lastMessageAt ?? null,
    email: toText(item.email, ''),
    phoneNumber: toText(item.phoneNumber, ''),
  };
};

const resolvePagination = (meta = {}, fallback = {}) => {
  const pageSize = toInteger(meta.pageSize, toInteger(fallback.pageSize, DEFAULT_PAGE_SIZE));
  const page = toInteger(meta.page, toInteger(fallback.page, DEFAULT_PAGE));
  const totalItems = toInteger(meta.total ?? meta.totalItems, toInteger(fallback.totalItems, 0));
  const totalPages = toInteger(meta.totalPages, totalItems && pageSize ? Math.ceil(totalItems / pageSize) : 1);

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
  };
};

export const adaptConversationsResponse = (payload = {}, fallback = {}) => {
  const envelope = resolveEnvelope(payload);
  const meta = resolveMeta(envelope);
  const items = resolveRows(envelope).map((item) => normalizeConversation(item, fallback));
  const pagination = resolvePagination(meta, { ...fallback, totalItems: items.length });

  return {
    items,
    ...pagination,
  };
};

export const adaptConversationDetailResponse = (payload = {}, fallback = {}) => {
  const envelope = resolveEnvelope(payload);
  const data = envelope?.data || payload?.data || payload || {};

  return {
    conversation: normalizeConversation(data, fallback),
  };
};

export const adaptMessagesResponse = (payload = {}, fallback = {}) => {
  const envelope = resolveEnvelope(payload);
  const meta = resolveMeta(envelope);
  const items = resolveRows(envelope).map((item) => normalizeMessage(item, fallback));
  const pagination = resolvePagination(meta, { ...fallback, totalItems: items.length, pageSize: 30 });

  return {
    items,
    ...pagination,
  };
};

export const adaptContactsResponse = (payload = {}, fallback = {}) => {
  const envelope = resolveEnvelope(payload);
  const meta = resolveMeta(envelope);
  const items = resolveRows(envelope).map((item) => normalizeContact(item));
  const pagination = resolvePagination(meta, { ...fallback, totalItems: items.length });

  return {
    items,
    ...pagination,
  };
};

export const buildOptimisticMessage = ({ conversationId, content, currentUser, files = [] }) => {
  const now = new Date().toISOString();
  const clientMessageId = createClientMessageId();

  return normalizeMessage(
    {
      messageId: 0,
      conversationId,
      senderId: resolveCurrentUserId(currentUser),
      senderName: currentUser?.fullName || currentUser?.name || 'Bạn',
      senderRole: currentUser?.role || '',
      content,
      messageType: 'TEXT',
      clientMessageId,
      sentAt: now,
      isMine: true,
      status: 'sending',
      attachments: files.map((file, index) => ({
        attachmentId: -(index + 1),
        fileName: file.name,
        originalFileName: file.name,
        fileUrl: '',
        contentType: file.type,
        sizeBytes: file.size,
      })),
    },
    { currentUser }
  );
};
