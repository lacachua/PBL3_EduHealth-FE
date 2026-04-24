import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
import {
  canReplyToNotification,
  getNotificationComposeConfig,
} from '../constants/notificationComposeConfig';
import {
  createInitialComposeState,
  validateFeedbackDraft,
  validateNotificationDraft,
} from '../adapters/notificationAdapters';
import { notificationsRepository } from '../repositories/notificationsRepository';
import { subscribeNotificationsChanged } from '../services/notificationsEvents';

const buildReadNotification = (item) => ({
  ...item,
  currentRecipient: {
    ...(item.currentRecipient || {}),
    isRead: true,
    readAt: item.currentRecipient?.readAt || new Date().toISOString(),
  },
});

export const useNotificationInbox = ({
  currentUser,
  viewerRole,
}) => {
  const role = String(viewerRole || currentUser?.role || 'STUDENT').toUpperCase();
  const config = useMemo(() => getNotificationComposeConfig(role), [role]);
  const capabilityState = useMemo(
    () => notificationsRepository.getCapabilityState({ viewerRole: role }),
    [role],
  );

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const [inboxSource, setInboxSource] = useState(capabilityState.inboxSource);
  const [inboxSourceNote, setInboxSourceNote] = useState('');
  const [sendSource, setSendSource] = useState(capabilityState.composeSource);
  const [feedbackSource, setFeedbackSource] = useState(capabilityState.feedbackSource);
  const [feedbackSourceNote, setFeedbackSourceNote] = useState('');
  const [lookupSourceNote, setLookupSourceNote] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [keyword, setKeyword] = useState('');

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [feedbackItems, setFeedbackItems] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState(() => createInitialComposeState(role));
  const [draftErrors, setDraftErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState({ totalRecipients: 0, recipients: [], source: capabilityState.lookupSource });
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');

  const [recipientOptions, setRecipientOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [diseaseOptions, setDiseaseOptions] = useState([]);
  const [vaccinationOptions, setVaccinationOptions] = useState([]);

  const summary = useMemo(() => {
    const unread = items.reduce((sum, item) => sum + (item.currentRecipient?.isRead ? 0 : 1), 0);
    const sent = items.reduce((sum, item) => {
      const currentUserId = Number(currentUser?.userId || currentUser?.id || 0);
      if (!currentUserId) {
        return sum + (item.createdByRole === role ? 1 : 0);
      }

      return sum + (Number(item.createdByUserId) === currentUserId ? 1 : 0);
    }, 0);

    return {
      total: items.length,
      unread,
      read: Math.max(0, items.length - unread),
      sent,
    };
  }, [currentUser?.id, currentUser?.userId, items, role]);

  const availableTypes = useMemo(() => {
    const seen = new Set(config.allowedTypes);
    items.forEach((item) => {
      if (item.type) {
        seen.add(item.type);
      }
    });

    return Array.from(seen.values());
  }, [config.allowedTypes, items]);

  const loadLookups = useCallback(async () => {
    try {
      const [recipients, classes, diseases, vaccinations] = await Promise.all([
        notificationsRepository.getRecipientOptions({ viewerRole: role }, role),
        notificationsRepository.getClassOptions({ viewerRole: role }),
        notificationsRepository.getDiseaseOptions({ viewerRole: role }),
        notificationsRepository.getVaccinationOptions({ viewerRole: role }),
      ]);

      setRecipientOptions(recipients.options || []);
      setClassOptions(classes.options || []);
      setDiseaseOptions(diseases.options || []);
      setVaccinationOptions(vaccinations.options || []);
      setLookupSourceNote(recipients.sourceNote || classes.sourceNote || diseases.sourceNote || vaccinations.sourceNote || '');
    } catch (apiError) {
      setLookupSourceNote(normalizeApiMessage(apiError, 'Không thể tải dữ liệu chọn.'));
    }
  }, [role]);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await notificationsRepository.getNotifications({
        page: 1,
        pageSize: 50,
        isRead: statusFilter === 'all' ? undefined : statusFilter === 'read',
        type: typeFilter,
        keyword,
        currentUser,
        viewerRole: role,
      }, role);

      setItems(data.items || []);
      setInboxSource(String(data.source || capabilityState.inboxSource));
      setInboxSourceNote(String(data.sourceNote || ''));
    } catch (apiError) {
      setItems([]);
      setError(normalizeApiMessage(apiError, 'Không thể tải danh sách thông báo.'));
    } finally {
      setLoading(false);
    }
  }, [capabilityState.inboxSource, currentUser, keyword, role, statusFilter, typeFilter]);

  const loadFeedbacks = useCallback(async (notificationId) => {
    setFeedbackLoading(true);
    setFeedbackError('');

    try {
      const result = await notificationsRepository.getFeedbacks(notificationId, {
        currentUser,
        viewerRole: role,
      });

      setFeedbackItems(result.feedbacks || []);
      setFeedbackSource(String(result.source || capabilityState.feedbackSource));
      setFeedbackSourceNote(String(result.sourceNote || ''));
    } catch (apiError) {
      setFeedbackItems([]);
      setFeedbackSource('PENDING');
      setFeedbackSourceNote(normalizeApiMessage(apiError, 'Không thể tải phản hồi.'));
    } finally {
      setFeedbackLoading(false);
    }
  }, [capabilityState.feedbackSource, currentUser, role]);

  useEffect(() => {
    loadLookups();
  }, [loadLookups]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  useEffect(() => {
    return subscribeNotificationsChanged(() => {
      loadInbox();
    });
  }, [loadInbox]);

  useEffect(() => {
    if (!composerOpen) {
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      setPreviewLoading(true);
      setPreviewError('');

      try {
        const result = await notificationsRepository.previewRecipients(draft, role, {
          currentUser,
          viewerRole: role,
        });
        setPreview(result);
      } catch (apiError) {
        setPreview({ totalRecipients: 0, recipients: [], source: 'PENDING' });
        setPreviewError(normalizeApiMessage(apiError, 'Không thể xem trước người nhận.'));
      } finally {
        setPreviewLoading(false);
      }
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [composerOpen, currentUser, draft, role]);

  const openDetail = useCallback(async (notificationId) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setFeedbackDraft('');
    setFeedbackError('');

    try {
      const detail = await notificationsRepository.getNotificationDetail(notificationId, {
        currentUser,
        viewerRole: role,
      });

      let nextItem = detail.item || null;

      if (nextItem && !nextItem.currentRecipient?.isRead) {
        await notificationsRepository.markRead(nextItem.notificationId, {
          currentUser,
          viewerRole: role,
        });
        nextItem = buildReadNotification(nextItem);
      }

      setSelectedNotification(nextItem);
      await Promise.all([loadInbox(), loadFeedbacks(notificationId)]);
    } catch (apiError) {
      setSelectedNotification(null);
      setFeedbackItems([]);
      setError(normalizeApiMessage(apiError, 'Không thể tải chi tiết thông báo.'));
    } finally {
      setDetailLoading(false);
    }
  }, [currentUser, loadFeedbacks, loadInbox, role]);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setSelectedNotification(null);
    setFeedbackItems([]);
    setFeedbackDraft('');
    setFeedbackError('');
    setFeedbackSource(capabilityState.feedbackSource);
    setFeedbackSourceNote('');
  }, [capabilityState.feedbackSource]);

  const markAllRead = useCallback(async () => {
    try {
      await notificationsRepository.markAllRead({ currentUser, viewerRole: role });
      setFeedback('Đã đánh dấu tất cả thông báo là đã đọc.');
      await loadInbox();
    } catch (apiError) {
      setError(normalizeApiMessage(apiError, 'Không thể đánh dấu đã đọc toàn bộ.'));
    }
  }, [currentUser, loadInbox, role]);

  const openComposer = useCallback(() => {
    if (!capabilityState.canCompose) {
      return;
    }

    setComposerOpen(true);
    setDraft(createInitialComposeState(role));
    setDraftErrors({});
    setFeedback('');
    setPreview({ totalRecipients: 0, recipients: [], source: capabilityState.lookupSource });
    setPreviewError('');
  }, [capabilityState.canCompose, capabilityState.lookupSource, role]);

  const closeComposer = useCallback(() => {
    setComposerOpen(false);
    setDraftErrors({});
  }, []);

  const updateDraftField = useCallback((field, value) => {
    setDraft((previous) => {
      const next = {
        ...previous,
        [field]: value,
      };

      if (field === 'targetMode') {
        next.classId = '';
        next.recipientUserIds = [];
      }

      if (field === 'type') {
        if (!['HEALTH_ALERT', 'HEALTH_SUPPORT'].includes(value)) {
          next.diseaseId = '';
        }

        if (!['VACCINATION_REMINDER', 'VACCINATION_QUESTION'].includes(value)) {
          next.vaccinationId = '';
        }
      }

      return next;
    });

    setDraftErrors((previous) => ({
      ...previous,
      [field]: undefined,
      classId: field === 'targetMode' ? undefined : previous.classId,
      recipientUserIds: field === 'targetMode' ? undefined : previous.recipientUserIds,
      targetMode: undefined,
      general: undefined,
    }));
  }, []);

  const toggleRecipient = useCallback((userId) => {
    const parsedId = Number(userId || 0);
    if (!parsedId) {
      return;
    }

    setDraft((previous) => {
      const currentIds = Array.isArray(previous.recipientUserIds) ? previous.recipientUserIds : [];
      const nextIds = currentIds.includes(parsedId)
        ? currentIds.filter((id) => id !== parsedId)
        : [...currentIds, parsedId];

      return {
        ...previous,
        recipientUserIds: nextIds,
      };
    });

    setDraftErrors((previous) => ({
      ...previous,
      recipientUserIds: undefined,
      general: undefined,
    }));
  }, []);

  const submitDraft = useCallback(async () => {
    const validation = validateNotificationDraft({
      draft,
      role,
      recipientOptions,
    });

    if (!validation.isValid) {
      setDraftErrors(validation.fieldErrors);
      return false;
    }

    setSubmitting(true);

    try {
      const result = await notificationsRepository.createNotification(draft, role, {
        currentUser,
        viewerRole: role,
      });

      setSendSource(String(result.source || capabilityState.composeSource));
      setComposerOpen(false);
      setFeedback(
        role === 'STUDENT'
          ? 'Đã gửi yêu cầu mẫu. Chờ backend hỗ trợ lưu dữ liệu thật.'
          : `Đã gửi thông báo${result.totalRecipients ? ` cho ${result.totalRecipients} người nhận` : ''}.`,
      );
      await loadInbox();
      return true;
    } catch (apiError) {
      setDraftErrors({
        general: normalizeApiMessage(apiError, 'Không thể gửi thông báo.'),
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [capabilityState.composeSource, currentUser, draft, loadInbox, recipientOptions, role]);

  const submitFeedback = useCallback(async () => {
    if (!selectedNotification?.notificationId) {
      setFeedbackError('Không tìm thấy thông báo để phản hồi.');
      return false;
    }

    if (!canReplyToNotification({ role, notification: selectedNotification, currentUser })) {
      setFeedbackError('Bạn không có quyền phản hồi thông báo này.');
      return false;
    }

    const validation = validateFeedbackDraft({
      notificationId: selectedNotification.notificationId,
      content: feedbackDraft,
    });

    if (!validation.isValid) {
      setFeedbackError(validation.error);
      return false;
    }

    setFeedbackSubmitting(true);

    try {
      const result = await notificationsRepository.createFeedback(
        selectedNotification.notificationId,
        validation.payload,
        { currentUser, viewerRole: role },
      );

      setFeedbackSource(String(result.source || capabilityState.feedbackSource));
      setFeedbackSourceNote(String(result.sourceNote || ''));
      setFeedbackDraft('');
      setFeedback('Đã ghi nhận phản hồi mẫu. Chờ backend hỗ trợ lưu dữ liệu thật.');
      await Promise.all([
        loadFeedbacks(selectedNotification.notificationId),
        loadInbox(),
      ]);
      return true;
    } catch (apiError) {
      setFeedbackError(normalizeApiMessage(apiError, 'Không thể gửi phản hồi.'));
      return false;
    } finally {
      setFeedbackSubmitting(false);
    }
  }, [capabilityState.feedbackSource, currentUser, feedbackDraft, loadFeedbacks, loadInbox, role, selectedNotification]);

  return {
    role,
    config,
    items,
    loading,
    error,
    feedback,
    summary,
    inboxSource,
    inboxSourceNote,
    sendSource,
    feedbackSource,
    feedbackSourceNote,
    lookupSourceNote,
    capabilityState,
    statusFilter,
    typeFilter,
    keyword,
    availableTypes,
    detailOpen,
    detailLoading,
    selectedNotification,
    feedbackItems,
    feedbackLoading,
    feedbackDraft,
    feedbackError,
    feedbackSubmitting,
    composerOpen,
    draft,
    draftErrors,
    submitting,
    preview,
    previewLoading,
    previewError,
    recipientOptions,
    classOptions,
    diseaseOptions,
    vaccinationOptions,
    setStatusFilter,
    setTypeFilter,
    setKeyword,
    setFeedback,
    setFeedbackDraft,
    refreshInbox: loadInbox,
    openDetail,
    closeDetail,
    markAllRead,
    openComposer,
    closeComposer,
    updateDraftField,
    toggleRecipient,
    submitDraft,
    submitFeedback,
  };
};
