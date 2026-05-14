import { DATA_MODULES, resolveModuleDataSource } from '../../../../app/config/dataMode';
import {
  adaptNotificationsResponse,
  adaptRecentNotificationsResponse,
  adaptUnreadCountResponse,
  adaptPublicNotificationsResponse,
  adaptSentNotificationsResponse,
  adaptUploadImageResponse,
  buildCreateNotificationPayload,
  buildPreviewRecipientsPayload,
  normalizeRole,
  toInteger,
  toText,
} from '../adapters/notificationAdapters';
import {
  createNotificationMock,
  getClassOptionsMock,
  getDiseaseOptionsMock,
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

const createLocalApiError = (message, field) => {
  const error = new Error(message || 'Request failed');
  error.response = {
    data: {
      message,
      field,
    },
  };
  return error;
};

const normalizeViewerRole = (role) => {
  const normalized = normalizeRole(role, '');
  if (normalized === 'ADMIN' || normalized === 'NURSE' || normalized === 'STUDENT') {
    return normalized;
  }

  return 'STUDENT';
};

const resolveModuleKey = (role) => {
  const normalizedRole = normalizeViewerRole(role);
  return normalizedRole === 'NURSE'
    ? DATA_MODULES.NURSE_NOTIFICATIONS
    : DATA_MODULES.NOTIFICATIONS_INBOX;
};

const isMockModeForRole = (role) => resolveModuleDataSource(resolveModuleKey(role)) === 'mock';

const resolveCapabilityState = (role) => {
  const normalizedRole = normalizeViewerRole(role);
  const isLive = !isMockModeForRole(normalizedRole);
  const canAccessLookups = isLive && (normalizedRole === 'ADMIN' || normalizedRole === 'NURSE');
  const canCompose = !isLive ? true : normalizedRole !== 'STUDENT' || canAccessLookups;
  const allowedTargetModes = (() => {
    if (!isLive) {
      return null;
    }

    if (normalizedRole === 'ADMIN' || normalizedRole === 'NURSE') {
      return ['CLASS', 'RECIPIENTS'];
    }

    return null;
  })();

  return {
    inboxSource: isLive ? 'LIVE' : 'MOCK',
    recentSource: isLive ? 'LIVE' : 'MOCK',
    unreadCountSource: isLive ? 'LIVE' : 'MOCK',
    detailSource: isLive ? 'LIVE' : 'MOCK',
    composeSource: isLive ? 'LIVE' : 'MOCK',
    lookupSource: !isLive ? 'MOCK' : (canAccessLookups ? 'LIVE' : 'PENDING'),
    markAllReadSupported: true,
    canCompose,
    canLoadRecipients: canAccessLookups,
    canLoadClasses: canAccessLookups,
    canLoadDiseases: canAccessLookups,
    canLoadVaccinations: false,
    allowedTargetModes,
    sseSupported: isLive,
  };
};

const normalizeRecipientOption = (item = {}) => {
  const userId = toInteger(item.userId ?? item.UserId, 0);

  return {
    userId,
    fullName: toText(item.fullName ?? item.FullName, 'Người nhận'),
    role: normalizeRole(item.role ?? item.Role, 'STUDENT'),
    classId: toInteger(item.classId ?? item.ClassId, null),
    className: toText(item.className ?? item.ClassName),
    label: toText(item.fullName ?? item.FullName, 'Người nhận'),
  };
};

const mapPreviewRecipients = (payload = {}) => {
  const data = payload?.data || payload || {};
  const recipients = Array.isArray(data.recipients) ? data.recipients : [];

  return {
    totalRecipients: toInteger(data.totalRecipients ?? data.total ?? recipients.length, recipients.length),
    recipients: recipients.map((item) => normalizeRecipientOption(item)),
    source: 'LIVE',
    sourceNote: '',
  };
};

const buildPendingResult = (message) => ({
  source: 'PENDING',
  sourceNote: message,
});

const buildMockResult = (message) => ({
  source: 'MOCK',
  sourceNote: message,
});

const filterNotificationItems = ({ items = [], isRead, type, keyword }) => {
  const normalizedType = toText(type).toUpperCase();
  const normalizedKeyword = toText(keyword).toLowerCase();

  return items.filter((item) => {
    if (typeof isRead === 'boolean' && Boolean(item.currentRecipient?.isRead) !== isRead) {
      return false;
    }

    if (normalizedType && item.type !== normalizedType) {
      return false;
    }

    if (!normalizedKeyword) {
      return true;
    }

    const haystack = [
      item.title,
      item.content,
      item.createdByName,
      item.createdByRole,
      item.className,
      item.diseaseName,
      item.vaccinationName,
    ].join(' ').toLowerCase();

    return haystack.includes(normalizedKeyword);
  });
};

export const notificationsRepository = {
  getCapabilityState: ({ viewerRole }) => resolveCapabilityState(viewerRole),

  getNotifications: async (params = {}, role) => {
    const normalizedRole = normalizeViewerRole(role || params.viewerRole);

    if (isMockModeForRole(normalizedRole)) {
      return getNotificationsMock({
        ...params,
        viewerRole: normalizedRole,
      });
    }

    const page = toInteger(params.page, 1);
    const pageSize = toInteger(params.pageSize, 20);
    const response = await notificationsApi.getList({ page, pageSize });
    const data = adaptNotificationsResponse(response, {
      currentUser: params.currentUser,
      viewerRole: normalizedRole,
      page,
      pageSize,
      source: 'LIVE',
    });
    const filteredItems = filterNotificationItems({
      items: data.items,
      isRead: params.isRead,
      type: params.type,
      keyword: params.keyword,
    });

    return {
      ...data,
      items: filteredItems,
      totalItems: filteredItems.length,
      source: 'LIVE',
      sourceNote: '',
    };
  },

  getNotificationDetail: async (notificationId, params = {}) => {
    const normalizedRole = normalizeViewerRole(params.viewerRole || params.role);

    if (isMockModeForRole(normalizedRole)) {
      return getNotificationDetailMock({
        ...params,
        notificationId,
      });
    }

    return {
      item: params.item || null,
      source: 'LIVE',
      sourceNote: '',
    };
  },

  getRecentNotifications: async ({ currentUser, viewerRole, limit = 6 }) => {
    const normalizedRole = normalizeViewerRole(viewerRole || currentUser?.role);

    if (isMockModeForRole(normalizedRole)) {
      return getRecentNotificationsMock({ currentUser, viewerRole: normalizedRole, limit });
    }

    const response = await notificationsApi.getList({ page: 1, pageSize: Math.max(1, limit) });
    return adaptRecentNotificationsResponse(response, {
      currentUser,
      viewerRole: normalizedRole,
      source: 'LIVE',
    });
  },

  getUnreadCount: async ({ currentUser, viewerRole }) => {
    const normalizedRole = normalizeViewerRole(viewerRole || currentUser?.role);

    if (isMockModeForRole(normalizedRole)) {
      return getUnreadCountMock({ currentUser, viewerRole: normalizedRole });
    }

    const response = await notificationsApi.getList({ page: 1, pageSize: 1 });
    return adaptUnreadCountResponse(response, { source: 'LIVE', sourceNote: '' });
  },

  getPublicNotifications: async (params = {}) => {
    const moduleSource = resolveModuleDataSource(DATA_MODULES.NOTIFICATIONS_INBOX);
    if (moduleSource === 'mock') {
      return {
        items: [],
        page: toInteger(params.page, 1),
        pageSize: toInteger(params.pageSize, 6),
        totalItems: 0,
        totalPages: 0,
        ...buildMockResult('Chưa hỗ trợ dữ liệu bản tin y tế mẫu.'),
      };
    }

    const page = toInteger(params.page, 1);
    const pageSize = toInteger(params.pageSize, 6);
    const response = await notificationsApi.getPublicList({
      page,
      pageSize,
      type: params.type ? String(params.type).trim().toUpperCase() : undefined,
    });

    return adaptPublicNotificationsResponse(response, {
      page,
      pageSize,
      source: 'LIVE',
    });
  },

  getSentNotifications: async (params = {}, role) => {
    const normalizedRole = normalizeViewerRole(role || params.viewerRole);

    if (normalizedRole !== 'ADMIN' && normalizedRole !== 'NURSE') {
      return {
        items: [],
        page: toInteger(params.page, 1),
        pageSize: toInteger(params.pageSize, 10),
        totalItems: 0,
        totalPages: 0,
        ...buildPendingResult('Chỉ quản trị hoặc điều dưỡng được xem thông báo đã gửi.'),
      };
    }

    if (isMockModeForRole(normalizedRole)) {
      return {
        items: [],
        page: toInteger(params.page, 1),
        pageSize: toInteger(params.pageSize, 10),
        totalItems: 0,
        totalPages: 0,
        ...buildMockResult('Chưa hỗ trợ dữ liệu thông báo đã gửi mẫu.'),
      };
    }

    const page = toInteger(params.page, 1);
    const pageSize = toInteger(params.pageSize, 10);
    const response = await notificationsApi.getSentList({ page, pageSize });

    return adaptSentNotificationsResponse(response, {
      page,
      pageSize,
      source: 'LIVE',
    });
  },

  uploadImage: async (file, role, context = {}) => {
    const normalizedRole = normalizeViewerRole(role || context.viewerRole || context.currentUser?.role);

    if (normalizedRole === 'STUDENT') {
      throw createLocalApiError('Học sinh không có quyền upload ảnh thông báo.', 'role');
    }

    if (isMockModeForRole(normalizedRole)) {
      return {
        imageUrl: '',
        publicId: '',
        ...buildPendingResult('Chức năng upload ảnh chưa được hỗ trợ trong chế độ mock.'),
      };
    }

    const response = await notificationsApi.uploadImage(file);
    return adaptUploadImageResponse(response, { source: 'LIVE' });
  },

  createNotification: async (payloadOrDraft, role, context = {}) => {
    const normalizedRole = normalizeViewerRole(role || context.viewerRole || context.currentUser?.role);

    if (!isMockModeForRole(normalizedRole)) {
      if (normalizedRole === 'STUDENT') {
        throw createLocalApiError('Học sinh không có quyền gửi thông báo qua API.', 'role');
      }

      const payload = buildCreateNotificationPayload(payloadOrDraft);
      const uploadFile = payloadOrDraft?.imageFile || payloadOrDraft?.imageUpload;
      if (uploadFile) {
        const uploadResult = await notificationsRepository.uploadImage(uploadFile, normalizedRole, context);
        if (uploadResult?.imageUrl) {
          payload.image = uploadResult.imageUrl;
        }
      }

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

    if (!isMockModeForRole(normalizedRole)) {
      if (normalizedRole === 'STUDENT') {
        return {
          totalRecipients: 0,
          recipients: [],
          ...buildPendingResult('Học sinh không có quyền xem trước người nhận.'),
        };
      }

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
    const normalizedRole = normalizeViewerRole(context.viewerRole || context.role || context.currentUser?.role);

    if (isMockModeForRole(normalizedRole)) {
      const marked = await markNotificationReadMock({
        notificationId,
        currentUser: context.currentUser,
        viewerRole: normalizedRole,
      });

      return {
        success: marked,
        source: 'MOCK',
        sourceNote: notificationsMockMeta.inboxNote,
      };
    }

    await notificationsApi.markRead(notificationId);
    emitNotificationsChanged();

    return {
      success: true,
      source: 'LIVE',
      sourceNote: '',
    };
  },

  markAllRead: async (context = {}) => {
    const normalizedRole = normalizeViewerRole(context.viewerRole || context.role || context.currentUser?.role);

    if (isMockModeForRole(normalizedRole)) {
      await markAllNotificationsReadMock({
        currentUser: context.currentUser,
        viewerRole: normalizedRole,
      });

      return {
        success: true,
        source: 'MOCK',
        sourceNote: notificationsMockMeta.inboxNote,
      };
    }

    await notificationsApi.markAllRead();
    emitNotificationsChanged();

    return {
      success: true,
      source: 'LIVE',
      sourceNote: '',
    };
  },

  getRecipientOptions: async (params = {}, role) => {
    const normalizedRole = normalizeViewerRole(role || params.role || params.viewerRole);

    if (isMockModeForRole(normalizedRole)) {
      return getRecipientOptionsMock({
        ...params,
        role: normalizedRole,
      });
    }

    const capabilityState = resolveCapabilityState(normalizedRole);
    if (!capabilityState.canLoadRecipients) {
      return {
        options: [],
        source: 'PENDING',
        sourceNote: 'Chưa có dữ liệu người nhận phù hợp với vai trò hiện tại.',
      };
    }

    const response = await notificationsApi.getStudents({
      page: 1,
      pageSize: 200,
      isActive: true,
      search: params.keyword ? String(params.keyword).trim() : undefined,
    });
    const rows = Array.isArray(response?.data) ? response.data : [];

    return {
      options: rows.map((item) => ({
        ...normalizeRecipientOption(item),
        role: 'STUDENT',
      })),
      source: 'LIVE',
      sourceNote: '',
    };
  },

  getClassOptions: async (params = {}, role) => {
    const normalizedRole = normalizeViewerRole(role || params.role || params.viewerRole);

    if (isMockModeForRole(normalizedRole)) {
      return getClassOptionsMock();
    }

    const capabilityState = resolveCapabilityState(normalizedRole);
    if (!capabilityState.canLoadClasses) {
      return {
        options: [],
        source: 'PENDING',
        sourceNote: 'Chưa có dữ liệu lớp học cho vai trò hiện tại.',
      };
    }

    const response = await notificationsApi.getClasses();
    const rows = Array.isArray(response?.data) ? response.data : [];

    return {
      options: rows.map((item) => ({
        classId: toInteger(item.classId ?? item.ClassId, 0),
        className: toText(item.className ?? item.ClassName),
        label: toText(item.className ?? item.ClassName),
      })),
      source: 'LIVE',
      sourceNote: '',
    };
  },

  getDiseaseOptions: async (params = {}, role) => {
    const normalizedRole = normalizeViewerRole(role || params.role || params.viewerRole);

    if (isMockModeForRole(normalizedRole)) {
      return getDiseaseOptionsMock();
    }

    const capabilityState = resolveCapabilityState(normalizedRole);
    if (!capabilityState.canLoadDiseases) {
      return {
        options: [],
        source: 'PENDING',
        sourceNote: 'Chưa có dữ liệu bệnh liên quan cho vai trò hiện tại.',
      };
    }

    const response = await notificationsApi.getDiseases();
    const rows = Array.isArray(response?.data) ? response.data : [];

    return {
      options: rows.map((item) => ({
        diseaseId: toInteger(item.id ?? item.Id, 0),
        diseaseName: toText(item.name ?? item.Name),
        description: toText(item.description ?? item.Description),
        label: toText(item.name ?? item.Name),
      })),
      source: 'LIVE',
      sourceNote: '',
    };
  },

  getVaccinationOptions: async (params = {}, role) => {
    const normalizedRole = normalizeViewerRole(role || params.role || params.viewerRole);

    if (isMockModeForRole(normalizedRole)) {
      return getVaccinationOptionsMock();
    }

    return {
      options: [],
      source: 'PENDING',
      sourceNote: 'Chưa có danh sách đợt tiêm phù hợp để liên kết thông báo.',
    };
  },



  // Compatibility aliases for existing bell/inbox code paths while the module is being migrated.
  getInbox: async (params = {}) => notificationsRepository.getNotifications(params, params.viewerRole),
  getDetail: async ({ notificationId, ...params }) => notificationsRepository.getNotificationDetail(notificationId, params),
  create: async ({ draft, currentUser, viewerRole }) => notificationsRepository.createNotification(draft, viewerRole, { currentUser, viewerRole }),

  mockMeta: notificationsMockMeta,
};
