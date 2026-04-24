import { DATA_MODULES, resolveModuleDataSource } from '../../../../app/config/dataMode';
import {
  buildCreateFeedbackPayload,
  buildCreateNotificationPayload,
  buildPreviewRecipientsPayload,
  normalizeRole,
  toInteger,
  toText,
} from '../adapters/notificationAdapters';
import {
  createFeedbackMock,
  createNotificationMock,
  getClassOptionsMock,
  getDiseaseOptionsMock,
  getFeedbacksMock,
  getNotificationDetailMock,
  getNotificationsMock,
  getRecentNotificationsMock,
  getRecipientOptionsMock,
  getUnreadCountMock,
  getVaccinationOptionsMock,
  markAllNotificationsReadMock,
  markNotificationReadMock,
  notificationsMockMeta,
  previewRecipientsMock,
} from '../mocks/notificationsMock';
import { notificationsApi } from '../services/notificationsApi';
import { emitNotificationsChanged } from '../services/notificationsEvents';

const normalizeViewerRole = (role) => {
  const normalized = normalizeRole(role, '');
  if (normalized === 'ADMIN' || normalized === 'NURSE' || normalized === 'STUDENT') {
    return normalized;
  }

  return 'STUDENT';
};

const isMockMode = (moduleKey) => resolveModuleDataSource(moduleKey) === 'mock';

const resolveComposeSource = (role) => {
  const normalizedRole = normalizeViewerRole(role);

  if (isMockMode(DATA_MODULES.NOTIFICATIONS_INBOX) || isMockMode(DATA_MODULES.NURSE_NOTIFICATIONS)) {
    return 'MOCK';
  }

  if (normalizedRole === 'NURSE') {
    return 'LIVE';
  }

  return 'MOCK_READY';
};

const resolveCapabilityState = (role) => {
  const normalizedRole = normalizeViewerRole(role);
  const composeSource = resolveComposeSource(normalizedRole);

  return {
    inboxSource: 'MOCK',
    recentSource: 'MOCK',
    unreadCountSource: 'MOCK',
    detailSource: 'MOCK',
    feedbackSource: 'MOCK_READY',
    replySource: 'MOCK_READY',
    composeSource,
    lookupSource: 'MOCK',
    markAllReadSupported: true,
    canCompose: true,
    canReply: true,
  };
};

const mapPreviewRecipients = (payload = {}) => {
  const data = payload?.data || payload || {};
  const recipients = Array.isArray(data.recipients) ? data.recipients : [];

  return {
    totalRecipients: toInteger(data.totalRecipients ?? data.total ?? recipients.length, recipients.length),
    recipients,
    source: 'LIVE',
    sourceNote: '',
  };
};

const buildPendingResult = (message) => ({
  source: 'PENDING',
  sourceNote: message,
});

export const notificationsRepository = {
  getCapabilityState: ({ viewerRole }) => resolveCapabilityState(viewerRole),

  getNotifications: async (params = {}, role) => {
    return getNotificationsMock({
      ...params,
      viewerRole: role || params.viewerRole,
    });
  },

  getNotificationDetail: async (notificationId, params = {}) => {
    return getNotificationDetailMock({
      ...params,
      notificationId,
    });
  },

  getRecentNotifications: async ({ currentUser, viewerRole, limit = 6 }) => {
    return getRecentNotificationsMock({ currentUser, viewerRole, limit });
  },

  getUnreadCount: async ({ currentUser, viewerRole }) => {
    return getUnreadCountMock({ currentUser, viewerRole });
  },

  createNotification: async (payloadOrDraft, role, context = {}) => {
    const normalizedRole = normalizeViewerRole(role || context.viewerRole || context.currentUser?.role);
    const composeSource = resolveComposeSource(normalizedRole);

    if (composeSource === 'LIVE' && normalizedRole === 'NURSE') {
      const payload = buildCreateNotificationPayload(payloadOrDraft);
      const response = await notificationsApi.create(payload);
      emitNotificationsChanged();

      return {
        notificationId: toInteger(response?.data?.notificationId, 0),
        totalRecipients: toInteger(response?.data?.totalRecipients, payload.recipientUserIds?.length || 0),
        source: 'LIVE',
        sourceNote: '',
      };
    }

    return createNotificationMock({
      draft: payloadOrDraft,
      currentUser: context.currentUser,
      viewerRole: normalizedRole,
    });
  },

  previewRecipients: async (payloadOrDraft, role, context = {}) => {
    const normalizedRole = normalizeViewerRole(role || context.viewerRole || context.currentUser?.role);
    const composeSource = resolveComposeSource(normalizedRole);

    if (composeSource === 'LIVE' && normalizedRole === 'NURSE') {
      return mapPreviewRecipients(
        await notificationsApi.previewRecipients(buildPreviewRecipientsPayload(payloadOrDraft)),
      );
    }

    return previewRecipientsMock({
      draft: payloadOrDraft,
      currentUser: context.currentUser,
      viewerRole: normalizedRole,
    });
  },

  markRead: async (notificationId, context = {}) => {
    const marked = await markNotificationReadMock({
      notificationId,
      currentUser: context.currentUser,
      viewerRole: context.viewerRole,
    });

    return {
      success: marked,
      source: 'MOCK',
      sourceNote: notificationsMockMeta.inboxNote,
    };
  },

  markAllRead: async (context = {}) => {
    await markAllNotificationsReadMock(context);

    return {
      success: true,
      source: 'MOCK',
      sourceNote: notificationsMockMeta.inboxNote,
    };
  },

  getRecipientOptions: async (params = {}, role) => {
    return getRecipientOptionsMock({
      ...params,
      role: role || params.role || params.viewerRole,
    });
  },

  getClassOptions: async () => getClassOptionsMock(),

  getDiseaseOptions: async () => getDiseaseOptionsMock(),

  getVaccinationOptions: async () => getVaccinationOptionsMock(),

  getFeedbacks: async (notificationId, context = {}) => {
    if (!notificationId) {
      return {
        feedbacks: [],
        ...buildPendingResult('Không tìm thấy thông báo để tải phản hồi.'),
      };
    }

    return getFeedbacksMock({
      notificationId,
      currentUser: context.currentUser,
      viewerRole: context.viewerRole,
    });
  },

  createFeedback: async (notificationId, payload, context = {}) => {
    const createPayload = buildCreateFeedbackPayload({
      notificationId,
      content: payload?.content,
    });

    return createFeedbackMock({
      notificationId,
      payload: createPayload,
      currentUser: context.currentUser,
      viewerRole: context.viewerRole,
    });
  },

  // Compatibility aliases for existing bell/inbox code paths while the module is being migrated.
  getInbox: async (params = {}) => notificationsRepository.getNotifications(params, params.viewerRole),
  getDetail: async ({ notificationId, ...params }) => notificationsRepository.getNotificationDetail(notificationId, params),
  create: async ({ draft, currentUser, viewerRole }) => notificationsRepository.createNotification(draft, viewerRole, { currentUser, viewerRole }),
  getThread: async ({ notificationId, ...params }) => {
    const result = await notificationsRepository.getFeedbacks(notificationId, params);
    return {
      threadId: notificationId ? `notification-${notificationId}` : '',
      replies: result.feedbacks,
      source: result.source,
      sourceNote: result.sourceNote,
    };
  },
  reply: async ({ notificationId, content, ...params }) => {
    const result = await notificationsRepository.createFeedback(notificationId, { content: toText(content) }, params);
    return {
      reply: result.feedback,
      source: result.source,
      sourceNote: result.sourceNote,
    };
  },

  mockMeta: notificationsMockMeta,
};
