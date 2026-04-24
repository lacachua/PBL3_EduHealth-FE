import { DATA_MODULES, resolveModuleDataSource } from '../../../../app/config/dataMode';
import {
  adaptReplyResponse,
  buildCreateNotificationPayload,
  buildPreviewRecipientsPayload,
} from '../adapters/notificationAdapters';
import {
  createNotificationMock,
  getNotificationDetailMock,
  getNotificationThreadMock,
  getNotificationsInboxMock,
  getRecentNotificationsMock,
  getUnreadCountMock,
  markAllNotificationsReadMock,
  markNotificationReadMock,
  notificationsMockMeta,
  replyToNotificationMock,
} from '../mocks/notificationsMock';
import { notificationsApi } from '../services/notificationsApi';
import { emitNotificationsChanged } from '../services/notificationsEvents';

const normalizeRole = (role) => {
  const normalized = String(role || '').trim().toUpperCase();
  if (normalized === 'ADMIN' || normalized === 'NURSE' || normalized === 'STUDENT') {
    return normalized;
  }

  return '';
};

const shouldUseInboxMock = () => resolveModuleDataSource(DATA_MODULES.NOTIFICATIONS_INBOX) === 'mock';
const shouldUseNurseComposeMock = () => resolveModuleDataSource(DATA_MODULES.NURSE_NOTIFICATIONS) === 'mock';

const resolveComposeSource = (viewerRole) => {
  const role = normalizeRole(viewerRole);
  if (role === 'NURSE') {
    return shouldUseNurseComposeMock() ? 'mock' : 'live';
  }

  return shouldUseInboxMock() ? 'mock' : 'pending';
};

const resolveCapabilityState = (viewerRole) => {
  const role = normalizeRole(viewerRole);
  const inboxSource = shouldUseInboxMock() ? 'mock' : 'pending';
  const composeSource = resolveComposeSource(role);

  return {
    inboxSource,
    recentSource: inboxSource,
    unreadCountSource: inboxSource,
    detailSource: inboxSource,
    threadSource: inboxSource,
    replySource: inboxSource,
    composeSource,
    markAllReadSupported: inboxSource === 'mock',
    canCompose: composeSource !== 'pending',
    canReply: inboxSource === 'mock',
  };
};

const buildPendingError = (message) => {
  const error = new Error(message);
  error.name = 'NotificationsPendingError';
  error.status = 501;
  error.source = 'pending';
  return error;
};

const mapPreviewRecipients = (payload = {}) => {
  const recipients = Array.isArray(payload?.data?.recipients) ? payload.data.recipients : [];

  return {
    totalRecipients: Number(payload?.data?.total || recipients.length || 0),
    recipients,
    source: 'live',
  };
};

export const notificationsRepository = {
  getCapabilityState: ({ viewerRole }) => resolveCapabilityState(viewerRole),

  getRecentNotifications: async ({ currentUser, viewerRole, limit = 6 }) => {
    const state = resolveCapabilityState(viewerRole);

    if (state.recentSource === 'mock') {
      return getRecentNotificationsMock({ currentUser, viewerRole, limit });
    }

    return {
      items: [],
      unreadCount: 0,
      source: 'pending',
      sourceNote: 'BE chua co GET /api/v1/notifications/recent va unread-count.',
    };
  },

  getUnreadCount: async ({ currentUser, viewerRole }) => {
    const state = resolveCapabilityState(viewerRole);

    if (state.unreadCountSource === 'mock') {
      return getUnreadCountMock({ currentUser, viewerRole });
    }

    return {
      unreadCount: 0,
      source: 'pending',
      sourceNote: 'BE chua co GET /api/v1/notifications/unread-count.',
    };
  },

  getInbox: async ({ page = 1, pageSize = 20, isRead, type = '', keyword = '', currentUser, viewerRole }) => {
    const state = resolveCapabilityState(viewerRole);

    if (state.inboxSource === 'mock') {
      return getNotificationsInboxMock({
        page,
        pageSize,
        isRead,
        type,
        keyword,
        currentUser,
        viewerRole,
      });
    }

    return {
      items: [],
      page,
      pageSize,
      totalItems: 0,
      totalPages: 1,
      unreadCount: 0,
      source: 'pending',
      sourceNote: 'BE chua co GET /api/v1/notifications.',
    };
  },

  getDetail: async ({ notificationId, currentUser, viewerRole }) => {
    const state = resolveCapabilityState(viewerRole);

    if (state.detailSource === 'mock') {
      return getNotificationDetailMock({ notificationId, currentUser, viewerRole });
    }

    throw buildPendingError('BE chua co GET /api/v1/notifications/{notificationId}.');
  },

  markRead: async ({ notificationId, currentUser, viewerRole }) => {
    const role = normalizeRole(viewerRole || currentUser?.role);
    const state = resolveCapabilityState(role);

    if (state.detailSource === 'mock') {
      const marked = await markNotificationReadMock({ notificationId, currentUser, viewerRole: role });
      return {
        success: marked,
        source: 'mock',
      };
    }

    if (role === 'NURSE') {
      await notificationsApi.markRead(notificationId);
      emitNotificationsChanged();
      return {
        success: true,
        source: 'live',
      };
    }

    throw buildPendingError('PATCH read hien chi co the live cho luong NURSE khi BE tra id thong bao that.');
  },

  markAllRead: async ({ currentUser, viewerRole } = {}) => {
    const state = resolveCapabilityState(viewerRole || currentUser?.role);

    if (state.markAllReadSupported) {
      await markAllNotificationsReadMock({ currentUser, viewerRole });
      return {
        success: true,
        source: 'mock',
      };
    }

    throw buildPendingError('BE chua co PATCH /api/v1/notifications/read-all.');
  },

  previewRecipients: async ({ draft, currentUser, viewerRole }) => {
    const role = normalizeRole(viewerRole || currentUser?.role);
    const composeSource = resolveComposeSource(role);

    if (composeSource === 'pending') {
      throw buildPendingError('Compose notifications cho role nay chua live va cung chua bat mock-ready.');
    }

    if (composeSource === 'mock') {
      const payload = buildCreateNotificationPayload(draft);
      return {
        totalRecipients: payload.classId ? 30 : (payload.recipientUserIds?.length || 0),
        recipients: [],
        source: 'mock',
      };
    }

    return mapPreviewRecipients(
      await notificationsApi.previewRecipients(buildPreviewRecipientsPayload(draft)),
    );
  },

  create: async ({ draft, currentUser, viewerRole }) => {
    const role = normalizeRole(viewerRole || currentUser?.role);
    const composeSource = resolveComposeSource(role);

    if (composeSource === 'pending') {
      throw buildPendingError('Compose notifications cho role nay dang pending backend.');
    }

    if (composeSource === 'mock') {
      return createNotificationMock({ draft, currentUser, viewerRole: role });
    }

    const preview = await notificationsRepository.previewRecipients({ draft, currentUser, viewerRole: role });
    if (preview.totalRecipients <= 0) {
      throw new Error('Khong co nguoi nhan hop le de gui thong bao.');
    }

    const response = await notificationsApi.create(buildCreateNotificationPayload(draft));
    emitNotificationsChanged();

    return {
      notificationId: Number(response?.data?.notificationId || 0),
      totalRecipients: Number(response?.data?.totalRecipients || preview.totalRecipients),
      source: 'live',
    };
  },

  getThread: async ({ notificationId, currentUser, viewerRole }) => {
    const state = resolveCapabilityState(viewerRole || currentUser?.role);

    if (state.threadSource === 'mock') {
      return getNotificationThreadMock({ notificationId, currentUser, viewerRole });
    }

    return {
      threadId: '',
      replies: [],
      source: 'pending',
      sourceNote: 'BE chua co GET /api/v1/notifications/{notificationId}/thread.',
    };
  },

  reply: async ({ notificationId, content, currentUser, viewerRole }) => {
    const state = resolveCapabilityState(viewerRole || currentUser?.role);

    if (state.replySource === 'mock') {
      return replyToNotificationMock({ notificationId, content, currentUser, viewerRole });
    }

    return adaptReplyResponse({
      data: {
        replyId: 0,
        sender: {
          userId: Number(currentUser?.userId || 0),
          fullName: String(currentUser?.fullName || currentUser?.name || 'Nguoi dung EduHealth'),
          role: normalizeRole(currentUser?.role || viewerRole),
        },
        content,
        createdAt: new Date().toISOString(),
      },
      meta: {
        source: 'pending',
        note: 'BE chua co POST /api/v1/notifications/{notificationId}/replies.',
      },
    });
  },

  mockMeta: notificationsMockMeta,
};
