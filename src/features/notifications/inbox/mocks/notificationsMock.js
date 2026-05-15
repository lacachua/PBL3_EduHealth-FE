import { waitForMock } from '../../../../shared/config/runtimeConfig';
import {
  adaptNotificationDetailResponse,
  adaptNotificationsResponse,
  adaptRecentNotificationsResponse,
  adaptUnreadCountResponse,
  buildCreateNotificationPayload,
  getCurrentUserId,
  normalizeRole,
  toNullableInteger,
  toText,
} from '../adapters/notificationAdapters';
import { TARGET_MODES } from '../constants/notificationTypes';
import { emitNotificationsChanged } from '../services/notificationsEvents';

const INBOX_NOTE = '';
const LOOKUP_NOTE = '';

const nowIso = () => new Date().toISOString();
const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

export const notificationLookupMock = Object.freeze({
  classes: [
    { classId: 501, label: '5A1', className: '5A1', description: '32 học sinh' },
    { classId: 502, label: '5A2', className: '5A2', description: '30 học sinh' },
    { classId: 401, label: '4A1', className: '4A1', description: '29 học sinh' },
  ],
  diseases: [
    { diseaseId: 11, label: 'Hen suyễn', diseaseName: 'Hen suyễn' },
    { diseaseId: 12, label: 'Dị ứng', diseaseName: 'Dị ứng' },
    { diseaseId: 13, label: 'Cận thị', diseaseName: 'Cận thị' },
    { diseaseId: 14, label: 'Sốt', diseaseName: 'Sốt' },
    { diseaseId: 15, label: 'Béo phì', diseaseName: 'Béo phì' },
  ],
  vaccinations: [
    {
      vaccinationId: 21,
      label: 'Tiêm sởi khối 1 - 20/10/2026',
      vaccinationName: 'Tiêm sởi khối 1 - 20/10/2026',
    },
    {
      vaccinationId: 22,
      label: 'Tiêm nhắc lại Rubella - Lớp 5A1',
      vaccinationName: 'Tiêm nhắc lại Rubella - Lớp 5A1',
    },
  ],
  recipients: [
    { userId: 1001, fullName: 'Nguyễn Tường Vy', role: 'ADMIN', className: '', label: 'Nguyễn Tường Vy' },
    { userId: 1101, fullName: 'Lê Minh Châu', role: 'NURSE', className: '', label: 'Lê Minh Châu' },
    { userId: 1102, fullName: 'Phạm Thu Hà', role: 'NURSE', className: '', label: 'Phạm Thu Hà' },
    { userId: 3001, fullName: 'Trần Minh', role: 'STUDENT', classId: 501, className: '5A1', label: 'Trần Minh' },
    { userId: 3002, fullName: 'Nguyễn An', role: 'STUDENT', classId: 501, className: '5A1', label: 'Nguyễn An' },
    { userId: 3003, fullName: 'Lê Bảo Ngọc', role: 'STUDENT', classId: 502, className: '5A2', label: 'Lê Bảo Ngọc' },
    { userId: 3004, fullName: 'Phạm Gia Hân', role: 'STUDENT', classId: 401, className: '4A1', label: 'Phạm Gia Hân' },
  ],
});

const cloneJson = (value) => JSON.parse(JSON.stringify(value));

const buildRecipient = (userId, overrides = {}) => {
  const option = notificationLookupMock.recipients.find((recipient) => Number(recipient.userId) === Number(userId)) || {};

  return {
    id: Number(`${Math.abs(Number(userId) || 0)}${Math.floor(Math.random() * 9)}`),
    userId: Number(userId || option.userId || 0),
    fullName: option.fullName || overrides.fullName || 'Người nhận',
    role: option.role || overrides.role || '',
    className: option.className || overrides.className || '',
    isRead: Boolean(overrides.isRead ?? false),
    readAt: overrides.readAt || null,
    sentAt: overrides.sentAt || minutesAgo(30),
    status: overrides.status || 'SENT',
  };
};

const baseNotifications = Object.freeze({
  ADMIN: [
    {
      notificationId: 9101,
      title: 'Yêu cầu cập nhật lịch trực y tế',
      content: 'Điều dưỡng vui lòng cập nhật lịch trực tuần này trước 15:00 để nhà trường điều phối ca trực.',
      type: 'SYSTEM',
      createdByUserId: 1001,
      createdByName: 'Nguyễn Tường Vy',
      createdByRole: 'ADMIN',
      createdAt: minutesAgo(18),
      classId: null,
      diseaseId: null,
      vaccinationId: null,
      currentRecipient: { id: 1, userId: 1001, isRead: false, readAt: null, sentAt: minutesAgo(18), status: 'SENT' },
      recipients: [buildRecipient(1101), buildRecipient(1102)],
      source: 'MOCK',
    },
    {
      notificationId: 9102,
      title: 'Học sinh gửi yêu cầu hỗ trợ sức khỏe',
      content: 'Học sinh Trần Minh lớp 5A1 cần được tư vấn thêm về triệu chứng khó thở sau giờ thể dục.',
      type: 'HEALTH_SUPPORT',
      createdByUserId: 3001,
      createdByName: 'Trần Minh',
      createdByRole: 'STUDENT',
      createdAt: minutesAgo(110),
      classId: 501,
      className: '5A1',
      diseaseId: 11,
      diseaseName: 'Hen suyễn',
      vaccinationId: null,
      currentRecipient: { id: 2, userId: 1001, isRead: true, readAt: minutesAgo(90), sentAt: minutesAgo(110), status: 'SENT' },
      recipients: [buildRecipient(1001, { isRead: true, readAt: minutesAgo(90) }), buildRecipient(1101)],
      source: 'MOCK',
    },
  ],
  NURSE: [
    {
      notificationId: 9201,
      title: 'Theo dõi học sinh có nguy cơ cao',
      content: 'Ưu tiên học sinh lớp 5A1 có bệnh nền hô hấp, cập nhật tình trạng trước 16:00.',
      type: 'HEALTH_ALERT',
      createdByUserId: 1001,
      createdByName: 'Nguyễn Tường Vy',
      createdByRole: 'ADMIN',
      createdAt: minutesAgo(12),
      classId: 501,
      className: '5A1',
      diseaseId: 11,
      diseaseName: 'Hen suyễn',
      vaccinationId: null,
      currentRecipient: { id: 3, userId: 1101, isRead: false, readAt: null, sentAt: minutesAgo(12), status: 'SENT' },
      recipients: [buildRecipient(1101), buildRecipient(1102)],
      source: 'MOCK',
    },
    {
      notificationId: 9202,
      title: 'Nhắc hoàn tất biên bản cấp thuốc',
      content: 'Vui lòng xác nhận biên bản thuốc đã cấp cho khối 3 trong buổi sáng.',
      type: 'MEDICINE_NOTICE',
      createdByUserId: 1001,
      createdByName: 'Nguyễn Tường Vy',
      createdByRole: 'ADMIN',
      createdAt: minutesAgo(95),
      classId: 401,
      className: '4A1',
      diseaseId: null,
      vaccinationId: null,
      currentRecipient: { id: 4, userId: 1101, isRead: true, readAt: minutesAgo(66), sentAt: minutesAgo(95), status: 'SENT' },
      recipients: [buildRecipient(1101, { isRead: true, readAt: minutesAgo(66) })],
      source: 'MOCK',
    },
  ],
  STUDENT: [
    {
      notificationId: 9301,
      title: 'Nhắc lịch tiêm chủng lớp 5A1',
      content: 'Học sinh lớp 5A1 có lịch tiêm lúc 09:00 sáng thứ Sáu tại phòng y tế.',
      type: 'VACCINATION_REMINDER',
      createdByUserId: 1001,
      createdByName: 'Nguyễn Tường Vy',
      createdByRole: 'ADMIN',
      createdAt: minutesAgo(35),
      classId: 501,
      className: '5A1',
      diseaseId: null,
      vaccinationId: 22,
      vaccinationName: 'Tiêm nhắc lại Rubella - Lớp 5A1',
      currentRecipient: { id: 5, userId: 3002, isRead: false, readAt: null, sentAt: minutesAgo(35), status: 'SENT' },
      recipients: [buildRecipient(3001), buildRecipient(3002), buildRecipient(3003)],
      source: 'MOCK',
    },
    {
      notificationId: 9302,
      title: 'Phản hồi từ phòng y tế',
      content: 'Nếu có triệu chứng bất thường sau khi dùng thuốc, em hãy phản hồi lại thông báo này.',
      type: 'MEDICINE_NOTICE',
      createdByUserId: 1101,
      createdByName: 'Lê Minh Châu',
      createdByRole: 'NURSE',
      createdAt: minutesAgo(165),
      classId: null,
      diseaseId: 12,
      diseaseName: 'Dị ứng',
      vaccinationId: null,
      currentRecipient: { id: 6, userId: 3002, isRead: true, readAt: minutesAgo(126), sentAt: minutesAgo(165), status: 'SENT' },
      recipients: [buildRecipient(3002, { isRead: true, readAt: minutesAgo(126) })],
      source: 'MOCK',
    },
  ],
});

const inboxStoreByRole = {
  ADMIN: cloneJson(baseNotifications.ADMIN),
  NURSE: cloneJson(baseNotifications.NURSE),
  STUDENT: cloneJson(baseNotifications.STUDENT),
};

const resolveRole = ({ currentUser, viewerRole }) => {
  const normalized = normalizeRole(viewerRole || currentUser?.role, 'STUDENT');
  return normalized === 'SYSTEM' ? 'STUDENT' : normalized;
};

const getStore = ({ currentUser, viewerRole }) => {
  const role = resolveRole({ currentUser, viewerRole });
  if (!inboxStoreByRole[role]) {
    inboxStoreByRole[role] = [];
  }

  return {
    role,
    items: inboxStoreByRole[role],
  };
};

const sortByNewest = (items = []) => [...items].sort((left, right) => {
  const leftTime = new Date(left.createdAt || 0).getTime();
  const rightTime = new Date(right.createdAt || 0).getTime();
  return rightTime - leftTime;
});

const filterNotifications = ({ items, isRead, type = '', keyword = '' }) => {
  const normalizedType = toText(type).toUpperCase();
  const normalizedKeyword = toText(keyword).toLowerCase();

  return sortByNewest(items).filter((item) => {
    if (typeof isRead === 'boolean' && Boolean(item.currentRecipient?.isRead) !== isRead) {
      return false;
    }

    if (normalizedType && item.type !== normalizedType) {
      return false;
    }

    if (!normalizedKeyword) {
      return true;
    }

    return [
      item.title,
      item.content,
      item.createdByName,
      item.createdByRole,
      item.className,
      item.diseaseName,
      item.vaccinationName,
    ].join(' ').toLowerCase().includes(normalizedKeyword);
  });
};

const paginate = ({ items, page = 1, pageSize = 20 }) => {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safePageSize = Math.max(1, Number.parseInt(pageSize, 10) || 20);
  const offset = (safePage - 1) * safePageSize;

  return {
    rows: items.slice(offset, offset + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    totalItems: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / safePageSize)),
  };
};

const metaFor = ({ items, page, pageSize, note = INBOX_NOTE, source = 'MOCK' }) => ({
  page,
  pageSize,
  totalItems: items.length,
  totalPages: Math.max(1, Math.ceil(items.length / Math.max(1, pageSize))),
  unreadCount: items.reduce((sum, item) => sum + (item.currentRecipient?.isRead ? 0 : 1), 0),
  source,
  note,
});

const findNotification = ({ notificationId, currentUser, viewerRole }) => {
  const { items } = getStore({ currentUser, viewerRole });
  return items.find((item) => Number(item.notificationId) === Number(notificationId));
};

const getLookupById = ({ collection, id, idKey }) => {
  const parsedId = Number(id || 0);
  return collection.find((item) => Number(item[idKey]) === parsedId) || null;
};

const resolvePreviewRecipients = ({ payload, draft, role }) => {
  const targetMode = draft?.targetMode || '';
  const classId = toNullableInteger(payload.classId);
  const ids = Array.isArray(payload.recipientUserIds) ? payload.recipientUserIds : [];

  if (targetMode === TARGET_MODES.CLASS && classId) {
    return notificationLookupMock.recipients.filter((recipient) => (
      recipient.role === 'STUDENT' && Number(recipient.classId) === classId
    ));
  }

  if (ids.length) {
    return notificationLookupMock.recipients.filter((recipient) => ids.includes(Number(recipient.userId)));
  }

  if (role === 'STUDENT') {
    return notificationLookupMock.recipients.filter((recipient) => recipient.role === 'ADMIN' || recipient.role === 'NURSE').slice(0, 1);
  }

  return [];
};

const buildCreatedBy = ({ currentUser, role }) => {
  const fallback = notificationLookupMock.recipients.find((recipient) => recipient.role === role) || {};
  const userId = getCurrentUserId(currentUser) || Number(fallback.userId || (role === 'ADMIN' ? 1001 : role === 'NURSE' ? 1101 : 3002));

  return {
    createdByUserId: userId,
    createdByName: toText(currentUser?.fullName || currentUser?.name || fallback.fullName, 'Người dùng EduHealth'),
    createdByRole: role,
  };
};

export const getNotificationsMock = async ({
  page = 1,
  pageSize = 20,
  isRead,
  type,
  keyword,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const { items, role } = getStore({ currentUser, viewerRole });
  const filtered = filterNotifications({ items, isRead, type, keyword });
  const pagination = paginate({ items: filtered, page, pageSize });

  return adaptNotificationsResponse({
    data: pagination.rows,
    meta: metaFor({
      items: filtered,
      page: pagination.page,
      pageSize: pagination.pageSize,
    }),
  }, { currentUser, viewerRole: role, page, pageSize });
};

export const getRecentNotificationsMock = async ({
  limit = 6,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const { items, role } = getStore({ currentUser, viewerRole });
  const rows = sortByNewest(items).slice(0, Math.max(1, limit));

  return adaptRecentNotificationsResponse({
    data: rows,
    meta: {
      source: 'MOCK',
      note: INBOX_NOTE,
      unreadCount: items.reduce((sum, item) => sum + (item.currentRecipient?.isRead ? 0 : 1), 0),
    },
  }, { currentUser, viewerRole: role });
};

export const getUnreadCountMock = async ({ currentUser, viewerRole }) => {
  await waitForMock('default');
  const { items } = getStore({ currentUser, viewerRole });

  return adaptUnreadCountResponse({
    data: {
      unreadCount: items.reduce((sum, item) => sum + (item.currentRecipient?.isRead ? 0 : 1), 0),
    },
    meta: {
      source: 'MOCK',
      note: INBOX_NOTE,
    },
  });
};

export const getNotificationDetailMock = async ({
  notificationId,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const role = resolveRole({ currentUser, viewerRole });
  const item = findNotification({ notificationId, currentUser, viewerRole: role });

  if (!item) {
    const error = new Error('Không tìm thấy thông báo.');
    error.status = 404;
    throw error;
  }

  return adaptNotificationDetailResponse({
    data: {
      ...item,
    },
    meta: {
      source: 'MOCK',
      note: INBOX_NOTE,
    },
  }, { currentUser, viewerRole: role });
};

export const previewRecipientsMock = async ({
  draft,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const role = resolveRole({ currentUser, viewerRole });
  const payload = buildCreateNotificationPayload(draft);
  const recipients = resolvePreviewRecipients({ payload, draft, role });

  return {
    totalRecipients: recipients.length,
    recipients,
    source: 'MOCK',
    sourceNote: LOOKUP_NOTE,
  };
};

export const createNotificationMock = async ({
  draft,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const { role, items } = getStore({ currentUser, viewerRole });
  const payload = buildCreateNotificationPayload(draft);
  const preview = await previewRecipientsMock({ draft, currentUser, viewerRole: role });
  const maxId = items.reduce((maxValue, item) => Math.max(maxValue, Number(item.notificationId || 0)), 9000);
  const nextId = maxId + 1;
  const createdBy = buildCreatedBy({ currentUser, role });
  const classLookup = getLookupById({ collection: notificationLookupMock.classes, id: payload.classId, idKey: 'classId' });
  const diseaseLookup = getLookupById({ collection: notificationLookupMock.diseases, id: payload.diseaseId, idKey: 'diseaseId' });
  const vaccinationLookup = getLookupById({ collection: notificationLookupMock.vaccinations, id: payload.vaccinationId, idKey: 'vaccinationId' });
  const recipients = preview.recipients.map((recipient) => buildRecipient(recipient.userId, { sentAt: nowIso() }));

  const item = {
    notificationId: nextId,
    title: payload.title,
    content: payload.content,
    type: payload.type,
    ...createdBy,
    createdAt: nowIso(),
    classId: payload.classId || null,
    className: classLookup?.className || '',
    diseaseId: payload.diseaseId || null,
    diseaseName: diseaseLookup?.diseaseName || '',
    vaccinationId: payload.vaccinationId || null,
    vaccinationName: vaccinationLookup?.vaccinationName || '',
    currentRecipient: {
      id: nextId,
      userId: createdBy.createdByUserId,
      isRead: true,
      readAt: nowIso(),
      sentAt: nowIso(),
      status: 'SENT',
    },
    recipients,
    source: 'MOCK',
  };

  items.unshift(item);
  emitNotificationsChanged();

  return {
    notificationId: nextId,
    item,
    totalRecipients: recipients.length,
    source: 'MOCK',
    sourceNote: INBOX_NOTE,
  };
};

export const markNotificationReadMock = async ({
  notificationId,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const item = findNotification({ notificationId, currentUser, viewerRole });
  if (!item) {
    return false;
  }

  item.currentRecipient = {
    ...(item.currentRecipient || {}),
    isRead: true,
    readAt: item.currentRecipient?.readAt || nowIso(),
  };
  emitNotificationsChanged();
  return true;
};

export const markAllNotificationsReadMock = async ({ currentUser, viewerRole } = {}) => {
  await waitForMock('default');
  const { items } = getStore({ currentUser, viewerRole });

  items.forEach((item) => {
    item.currentRecipient = {
      ...(item.currentRecipient || {}),
      isRead: true,
      readAt: item.currentRecipient?.readAt || nowIso(),
    };
  });
  emitNotificationsChanged();
  return true;
};

export const getRecipientOptionsMock = async ({ role, keyword = '' } = {}) => {
  await waitForMock('fast');
  const normalizedRole = normalizeRole(role, '');
  const normalizedKeyword = toText(keyword).toLowerCase();

  const base = notificationLookupMock.recipients.filter((recipient) => {
    if (normalizedRole === 'STUDENT') {
      return recipient.role === 'ADMIN' || recipient.role === 'NURSE';
    }

    if (normalizedRole === 'NURSE') {
      return recipient.role === 'STUDENT';
    }

    return recipient.role === 'ADMIN' || recipient.role === 'NURSE' || recipient.role === 'STUDENT';
  });

  const filtered = normalizedKeyword
    ? base.filter((recipient) => [
      recipient.fullName,
      recipient.role,
      recipient.className,
    ].join(' ').toLowerCase().includes(normalizedKeyword))
    : base;

  return {
    options: filtered,
    source: 'MOCK',
    sourceNote: LOOKUP_NOTE,
  };
};

export const getClassOptionsMock = async () => {
  await waitForMock('fast');
  return {
    options: cloneJson(notificationLookupMock.classes),
    source: 'MOCK',
    sourceNote: LOOKUP_NOTE,
  };
};

export const getDiseaseOptionsMock = async () => {
  await waitForMock('fast');
  return {
    options: cloneJson(notificationLookupMock.diseases),
    source: 'MOCK',
    sourceNote: LOOKUP_NOTE,
  };
};

export const getVaccinationOptionsMock = async () => {
  await waitForMock('fast');
  return {
    options: cloneJson(notificationLookupMock.vaccinations),
    source: 'MOCK',
    sourceNote: LOOKUP_NOTE,
  };
};

export const notificationsMockMeta = Object.freeze({
  inboxNote: INBOX_NOTE,
  feedbackNote: '',
  lookupNote: LOOKUP_NOTE,
  source: 'MOCK',
});
