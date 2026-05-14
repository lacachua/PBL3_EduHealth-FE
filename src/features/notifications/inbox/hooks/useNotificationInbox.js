import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
import {
  getNotificationComposeConfig,
} from '../constants/notificationComposeConfig';
import {
  createInitialComposeState,
  validateNotificationDraft,
} from '../adapters/notificationAdapters';
import { notificationsRepository } from '../repositories/notificationsRepository';
import { connectNotificationSse } from '../services/notificationSseClient';
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
  const effectiveConfig = useMemo(() => {
    if (!capabilityState.allowedTargetModes?.length) {
      return config;
    }

    const next = {
      ...config,
      allowedTargetModes: capabilityState.allowedTargetModes,
    };

    if (!next.allowedTargetModes.includes(next.defaultTargetMode)) {
      [next.defaultTargetMode] = next.allowedTargetModes;
    }

    return next;
  }, [capabilityState.allowedTargetModes, config]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');



  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [keyword, setKeyword] = useState('');

  const [currentTab, setCurrentTab] = useState('inbox');
  const [sentItems, setSentItems] = useState([]);
  const [sentLoading, setSentLoading] = useState(false);
  const [sentError, setSentError] = useState('');

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

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

    return {
      total: items.length,
      unread,
      read: Math.max(0, items.length - unread),
      sent: sentItems.length,
    };
  }, [currentUser?.id, currentUser?.userId, items, sentItems.length, role]);

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
    } catch (apiError) {
      console.error('Không thể tải dữ liệu chọn:', apiError);
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
    } catch (apiError) {
      setItems([]);
      setError(normalizeApiMessage(apiError, 'Không thể tải danh sách thông báo.'));
    } finally {
      setLoading(false);
    }
  }, [capabilityState.inboxSource, currentUser, keyword, role, statusFilter, typeFilter]);

  const loadSentInbox = useCallback(async () => {
    if (role !== 'ADMIN' && role !== 'NURSE') {
      return;
    }

    setSentLoading(true);
    setSentError('');

    try {
      const data = await notificationsRepository.getSentNotifications({
        page: 1,
        pageSize: 50,
      }, role);

      setSentItems(data.items || []);
    } catch (apiError) {
      setSentItems([]);
      setSentError(normalizeApiMessage(apiError, 'Không thể tải danh sách đã gửi.'));
    } finally {
      setSentLoading(false);
    }
  }, [role]);

  useEffect(() => {
    loadLookups();
  }, [loadLookups]);

  useEffect(() => {
    loadInbox();
    loadSentInbox();
  }, [loadInbox, loadSentInbox]);

  useEffect(() => {
    return subscribeNotificationsChanged(() => {
      loadInbox();
      loadSentInbox();
    });
  }, [loadInbox, loadSentInbox]);

  useEffect(() => {
    if (!capabilityState.sseSupported) {
      return undefined;
    }

    return connectNotificationSse();
  }, [capabilityState.sseSupported]);

  useEffect(() => {
    if (!composerOpen) {
      return undefined;
    }

    if (draft.visibility === 'PUBLIC') {
      setPreview({ totalRecipients: 0, recipients: [], source: capabilityState.lookupSource });
      setPreviewError('');
      return undefined;
    }

    const hasRecipients = Array.isArray(draft.recipientUserIds) && draft.recipientUserIds.length > 0;
    const hasClass = Number(draft.classId || 0) > 0;

    if (!hasRecipients && !hasClass) {
      setPreview({ totalRecipients: 0, recipients: [], source: capabilityState.lookupSource });
      setPreviewError('');
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
  }, [capabilityState.lookupSource, composerOpen, currentUser, draft, role]);

  const openDetail = useCallback(async (notificationId, mode = 'inbox') => {
    setDetailOpen(true);
    setDetailLoading(true);

    try {
      let nextItem = null;

      if (mode === 'sent') {
        nextItem = sentItems.find((item) => Number(item.notificationId) === Number(notificationId)) || null;
      } else {
        const isLive = capabilityState.inboxSource === 'LIVE';

        if (isLive) {
          nextItem = items.find((item) => Number(item.notificationId) === Number(notificationId)) || null;
        } else {
          const detail = await notificationsRepository.getNotificationDetail(notificationId, {
            currentUser,
            viewerRole: role,
          });
          nextItem = detail.item || null;
        }

        if (nextItem && !nextItem.currentRecipient?.isRead) {
          await notificationsRepository.markRead(nextItem.notificationId, {
            currentUser,
            viewerRole: role,
          });
          nextItem = buildReadNotification(nextItem);
        }
      }

      setSelectedNotification(nextItem);
      
      if (mode !== 'sent') {
        await loadInbox();
      }
    } catch (apiError) {
      setSelectedNotification(null);
      setError(normalizeApiMessage(apiError, 'Không thể tải chi tiết thông báo.'));
    } finally {
      setDetailLoading(false);
    }
  }, [capabilityState.inboxSource, currentUser, items, sentItems, loadInbox, role]);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setSelectedNotification(null);
  }, []);

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
    const nextDraft = createInitialComposeState(role);
    if (effectiveConfig?.defaultTargetMode) {
      nextDraft.targetMode = effectiveConfig.defaultTargetMode;
    }
    setDraft(nextDraft);
    setDraftErrors({});
    setFeedback('');
    setPreview({ totalRecipients: 0, recipients: [], source: capabilityState.lookupSource });
    setPreviewError('');
    setImageUploading(false);
    setImageUploadError('');
    setImageFileName('');
    setImagePreviewUrl('');
  }, [capabilityState.canCompose, capabilityState.lookupSource, effectiveConfig?.defaultTargetMode, role]);

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
        next.targetRoles = [];
      }

      if (field === 'visibility' && value === 'PUBLIC') {
        next.targetMode = '';
        next.classId = '';
        next.recipientUserIds = [];
        next.targetRoles = [];
      }

      if (field === 'visibility' && value !== 'PUBLIC' && !previous.targetMode) {
        next.targetMode = effectiveConfig?.defaultTargetMode || next.targetMode;
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
      visibility: field === 'visibility' ? undefined : previous.visibility,
      classId: field === 'targetMode' ? undefined : previous.classId,
      recipientUserIds: field === 'targetMode' ? undefined : previous.recipientUserIds,
      targetMode: undefined,
      general: undefined,
    }));
  }, [effectiveConfig?.defaultTargetMode]);

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

  const handleImageSelect = useCallback(async (file) => {
    if (!file) {
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);

    setImageUploading(true);
    setImageUploadError('');
    setImageFileName(file.name || '');
    setImagePreviewUrl(localPreviewUrl);
    setDraft((previous) => ({
      ...previous,
      imageUrl: '',
    }));

    try {
      const result = await notificationsRepository.uploadImage(file, role, {
        currentUser,
        viewerRole: role,
      });

      if (!result?.imageUrl) {
        throw new Error('Upload ảnh thất bại.');
      }

      setDraft((previous) => ({
        ...previous,
        imageUrl: result.imageUrl,
      }));
      // Can keep localPreviewUrl or use the remote one. Local is faster and already loaded.
    } catch (apiError) {
      const message = normalizeApiMessage(apiError, 'Không thể upload ảnh.');
      console.error('Lỗi upload ảnh:', apiError);
      setImageUploadError(message);
    } finally {
      setImageUploading(false);
    }
  }, [currentUser, role]);

  const clearImageUpload = useCallback(() => {
    setImageFileName('');
    setImagePreviewUrl('');
    setImageUploadError('');
    setDraft((previous) => ({
      ...previous,
      imageUrl: '',
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

    if (imageUploading) {
      setDraftErrors({
        general: 'Đang tải ảnh lên, vui lòng chờ hoàn tất.',
      });
      return false;
    }

    if (imageUploadError) {
      setDraftErrors({
        general: 'Ảnh minh họa chưa hợp lệ. Vui lòng thử lại.',
      });
      return false;
    }

    setSubmitting(true);

    try {
      const result = await notificationsRepository.createNotification(draft, role, {
        currentUser,
        viewerRole: role,
      });

      setComposerOpen(false);
      const successMessage = role === 'STUDENT'
        ? 'Đã gửi yêu cầu hỗ trợ.'
        : `Đã gửi thông báo${result.totalRecipients ? ` cho ${result.totalRecipients} người nhận` : ''}.`;
      setFeedback(successMessage);
      await loadInbox();
      await loadSentInbox();
      return true;
    } catch (apiError) {
      setDraftErrors({
        general: normalizeApiMessage(apiError, 'Không thể gửi thông báo.'),
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [currentUser, draft, imageUploadError, imageUploading, loadInbox, recipientOptions, role]);

  const showRecipients = draft.visibility !== 'PUBLIC';

  return {
    role,
    config: effectiveConfig,
    items,
    loading,
    error,
    feedback,
    summary,
    capabilityState,
    currentTab,
    sentItems,
    sentLoading,
    sentError,
    statusFilter,
    typeFilter,
    keyword,
    availableTypes,
    detailOpen,
    detailLoading,
    selectedNotification,
    composerOpen,
    draft,
    draftErrors,
    submitting,
    preview,
    previewLoading,
    previewError,
    imageUploading,
    imageUploadError,
    imageFileName,
    imagePreviewUrl,
    showRecipients,
    recipientOptions,
    classOptions,
    diseaseOptions,
    vaccinationOptions,
    setCurrentTab,
    setStatusFilter,
    setTypeFilter,
    setKeyword,
    setFeedback,
    refreshInbox: async () => {
      await loadInbox();
      await loadSentInbox();
    },
    openDetail,
    closeDetail,
    markAllRead,
    openComposer,
    closeComposer,
    updateDraftField,
    toggleRecipient,
    handleImageSelect,
    clearImageUpload,
    submitDraft,
  };
};
