import { waitForMock } from '../../../../shared/config/runtimeConfig';
import {
  adaptDetailResponse,
  adaptInboxResponse,
  adaptRecentNotificationsResponse,
  adaptReplyResponse,
  adaptThreadResponse,
  adaptUnreadCountResponse,
  buildCreateNotificationPayload,
  buildReplyPayload,
} from '../adapters/notificationAdapters';
import { emitNotificationsChanged } from '../services/notificationsEvents';

const INBOX_PENDING_NOTE = 'Notifications dang dung mock fallback vi backend chua co inbox/recent/detail/read-all/thread.';
const THREAD_PENDING_NOTE = 'Reply thread dang dung mock fallback vi backend chua co API thread/replies.';

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000).toISOString();
const nowIso = () => new Date().toISOString();

const baseNotifications = Object.freeze({
  ADMIN: [
    {
      notificationId: 9101,
      title: 'Yeu cau cap nhat lich truc y te',
      content: 'Dieu duong vui long cap nhat lich truc tuan nay truoc 15:00.',
      type: 'GENERAL',
      createdAt: minutesAgo(18),
      sender: { userId: 5001, fullName: 'He thong EduHealth', role: 'SYSTEM' },
      context: {},
      isRead: false,
      readAt: null,
      canReply: true,
      replyCount: 2,
      threadId: 'thread-9101',
    },
    {
      notificationId: 9102,
      title: 'Hoc sinh gui yeu cau ho tro suc khoe',
      content: 'Can xac nhan tiep nhan yeu cau tu hoc sinh Tran Minh lop 5A1.',
      type: 'HEALTH_ALERT',
      createdAt: minutesAgo(110),
      sender: { userId: 3101, fullName: 'Tran Minh', role: 'STUDENT' },
      context: { classId: 7, className: '5A1' },
      isRead: true,
      readAt: minutesAgo(90),
      canReply: true,
      replyCount: 1,
      threadId: 'thread-9102',
    },
  ],
  NURSE: [
    {
      notificationId: 9201,
      title: 'Chi dao theo doi hoc sinh nguy co cao',
      content: 'Uu tien hoc sinh lop 5A1 co benh nen ho hap, cap nhat truoc 16:00.',
      type: 'HEALTH_ALERT',
      createdAt: minutesAgo(12),
      sender: { userId: 1001, fullName: 'Admin Truong', role: 'ADMIN' },
      context: { classId: 7, className: '5A1', diseaseId: 14, diseaseName: 'Hen suyen' },
      isRead: false,
      readAt: null,
      canReply: true,
      replyCount: 3,
      threadId: 'thread-9201',
    },
    {
      notificationId: 9202,
      title: 'Nhac hoan tat bien ban cap thuoc',
      content: 'Vui long xac nhan bien ban thuoc da cap cho khoi 3 trong buoi sang.',
      type: 'MEDICINE_NOTICE',
      createdAt: minutesAgo(95),
      sender: { userId: 1001, fullName: 'Admin Truong', role: 'ADMIN' },
      context: { classId: 3, className: '3A1' },
      isRead: true,
      readAt: minutesAgo(66),
      canReply: true,
      replyCount: 0,
      threadId: 'thread-9202',
    },
  ],
  STUDENT: [
    {
      notificationId: 9301,
      title: 'Nhac lich tiem chung lop 5A1',
      content: 'Hoc sinh lop 5A1 co lich tiem luc 09:00 sang thu Sau tai phong y te.',
      type: 'VACCINATION_REMINDER',
      createdAt: minutesAgo(35),
      sender: { userId: 1001, fullName: 'Admin Truong', role: 'ADMIN' },
      context: { classId: 7, className: '5A1', vaccinationId: 25, vaccinationName: 'Mui nhac lai so 2' },
      isRead: false,
      readAt: null,
      canReply: true,
      replyCount: 1,
      threadId: 'thread-9301',
    },
    {
      notificationId: 9302,
      title: 'Phan hoi tu phong y te',
      content: 'Neu co trieu chung bat thuong sau khi dung thuoc, vui long phan hoi lai thong bao nay.',
      type: 'MEDICINE_NOTICE',
      createdAt: minutesAgo(165),
      sender: { userId: 1101, fullName: 'Dieu duong Truong', role: 'NURSE' },
      context: { diseaseId: 14, diseaseName: 'Hen suyen' },
      isRead: true,
      readAt: minutesAgo(126),
      canReply: true,
      replyCount: 2,
      threadId: 'thread-9302',
    },
  ],
});

const baseThreads = Object.freeze({
  'thread-9101': [
    { replyId: 1, sender: { userId: 5001, fullName: 'He thong EduHealth', role: 'SYSTEM' }, content: 'Lich truc da duoc tao tu dashboard dieu phoi.', createdAt: minutesAgo(18) },
    { replyId: 2, sender: { userId: 1101, fullName: 'Dieu duong Truong', role: 'NURSE' }, content: 'Da tiep nhan va se cap nhat trong dau gio chieu.', createdAt: minutesAgo(8) },
  ],
  'thread-9102': [
    { replyId: 1, sender: { userId: 3101, fullName: 'Tran Minh', role: 'STUDENT' }, content: 'Em can duoc tu van them ve dieu tri hen suyen.', createdAt: minutesAgo(110) },
  ],
  'thread-9201': [
    { replyId: 1, sender: { userId: 1001, fullName: 'Admin Truong', role: 'ADMIN' }, content: 'Can uu tien theo doi trong ngay hom nay.', createdAt: minutesAgo(12) },
    { replyId: 2, sender: { userId: 1101, fullName: 'Dieu duong Truong', role: 'NURSE' }, content: 'Da sap xep lich kiem tra luc 14:00.', createdAt: minutesAgo(6) },
    { replyId: 3, sender: { userId: 1001, fullName: 'Admin Truong', role: 'ADMIN' }, content: 'Cap nhat ket qua sau buoi kiem tra.', createdAt: minutesAgo(3) },
  ],
  'thread-9301': [
    { replyId: 1, sender: { userId: 3002, fullName: 'Tran Minh', role: 'STUDENT' }, content: 'Em da ghi nho lich va se co mat dung gio.', createdAt: minutesAgo(12) },
  ],
  'thread-9302': [
    { replyId: 1, sender: { userId: 1101, fullName: 'Dieu duong Truong', role: 'NURSE' }, content: 'Neu co dau hieu kho tho, hay den phong y te ngay.', createdAt: minutesAgo(165) },
    { replyId: 2, sender: { userId: 3002, fullName: 'Tran Minh', role: 'STUDENT' }, content: 'Em da nho va se bao ngay neu co trieu chung.', createdAt: minutesAgo(124) },
  ],
});

const cloneJson = (value) => JSON.parse(JSON.stringify(value));

const inboxStoreByRole = {
  ADMIN: cloneJson(baseNotifications.ADMIN),
  NURSE: cloneJson(baseNotifications.NURSE),
  STUDENT: cloneJson(baseNotifications.STUDENT),
};

const threadStoreById = cloneJson(baseThreads);

const normalizeRole = (role) => {
  const normalized = String(role || 'STUDENT').trim().toUpperCase();
  if (normalized === 'ADMIN' || normalized === 'NURSE' || normalized === 'STUDENT') {
    return normalized;
  }

  return 'STUDENT';
};

const resolveViewerRole = ({ currentUser, viewerRole }) => normalizeRole(currentUser?.role || viewerRole);

const getStoreForRole = ({ currentUser, viewerRole }) => {
  const role = resolveViewerRole({ currentUser, viewerRole });
  if (!inboxStoreByRole[role]) {
    inboxStoreByRole[role] = [];
  }

  return {
    role,
    items: inboxStoreByRole[role],
  };
};

const sortByNewest = (items = []) => {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left?.createdAt || 0).getTime();
    const rightTime = new Date(right?.createdAt || 0).getTime();
    return rightTime - leftTime;
  });
};

const filterItems = ({ items = [], isRead, type = '', keyword = '' }) => {
  const normalizedType = String(type || '').trim();
  const normalizedKeyword = String(keyword || '').trim().toLowerCase();

  return sortByNewest(items).filter((item) => {
    if (typeof isRead === 'boolean' && Boolean(item?.isRead) !== isRead) {
      return false;
    }

    if (normalizedType && item?.type !== normalizedType) {
      return false;
    }

    if (!normalizedKeyword) {
      return true;
    }

    return [
      item?.title,
      item?.content,
      item?.sender?.fullName,
      item?.context?.className,
      item?.context?.diseaseName,
      item?.context?.vaccinationName,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedKeyword);
  });
};

const paginate = (items = [], page = 1, pageSize = 20) => {
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

const buildMeta = ({ items = [], page, pageSize, note = INBOX_PENDING_NOTE, source = 'mock' }) => {
  const pagination = paginate(items, page, pageSize);

  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalItems: pagination.totalItems,
    totalPages: pagination.totalPages,
    unreadCount: items.reduce((sum, item) => sum + (item?.isRead ? 0 : 1), 0),
    source,
    note,
  };
};

const updateReadState = (item) => {
  if (!item || item.isRead) {
    return;
  }

  item.isRead = true;
  item.readAt = nowIso();
};

const touchThreadId = (threadId) => {
  if (!threadStoreById[threadId]) {
    threadStoreById[threadId] = [];
  }
};

export const getNotificationsInboxMock = async ({
  page = 1,
  pageSize = 20,
  isRead,
  type,
  keyword,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const { items } = getStoreForRole({ currentUser, viewerRole });
  const filtered = filterItems({ items, isRead, type, keyword });
  const pagination = paginate(filtered, page, pageSize);

  return adaptInboxResponse({
    data: pagination.rows,
    meta: buildMeta({ items: filtered, page, pageSize }),
  }, { page, pageSize });
};

export const getRecentNotificationsMock = async ({
  limit = 6,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const { items } = getStoreForRole({ currentUser, viewerRole });
  const rows = sortByNewest(items).slice(0, Math.max(1, limit));

  return adaptRecentNotificationsResponse({
    data: rows,
    meta: {
      source: 'mock',
      note: INBOX_PENDING_NOTE,
      unreadCount: items.reduce((sum, item) => sum + (item?.isRead ? 0 : 1), 0),
    },
  });
};

export const getUnreadCountMock = async ({
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const { items } = getStoreForRole({ currentUser, viewerRole });

  return adaptUnreadCountResponse({
    data: {
      unreadCount: items.reduce((sum, item) => sum + (item?.isRead ? 0 : 1), 0),
    },
    meta: {
      source: 'mock',
      note: INBOX_PENDING_NOTE,
    },
  });
};

export const getNotificationDetailMock = async ({
  notificationId,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const { items } = getStoreForRole({ currentUser, viewerRole });
  const item = items.find((entry) => Number(entry?.notificationId) === Number(notificationId));

  if (!item) {
    const error = new Error('Khong tim thay thong bao.');
    error.status = 404;
    throw error;
  }

  return adaptDetailResponse({
    data: item,
    meta: {
      source: 'mock',
      note: INBOX_PENDING_NOTE,
    },
  });
};

export const getNotificationThreadMock = async ({
  notificationId,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const { items } = getStoreForRole({ currentUser, viewerRole });
  const item = items.find((entry) => Number(entry?.notificationId) === Number(notificationId));

  if (!item) {
    const error = new Error('Khong tim thay chuoi phan hoi.');
    error.status = 404;
    throw error;
  }

  touchThreadId(item.threadId);

  return adaptThreadResponse({
    data: {
      threadId: item.threadId,
      replies: threadStoreById[item.threadId],
    },
    meta: {
      source: 'mock',
      note: THREAD_PENDING_NOTE,
    },
  });
};

export const createNotificationMock = async ({
  draft,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const payload = buildCreateNotificationPayload(draft);
  const { role, items } = getStoreForRole({ currentUser, viewerRole });
  const maxId = items.reduce((maxValue, item) => Math.max(maxValue, Number(item?.notificationId || 0)), 9000);
  const nextId = maxId + 1;
  const threadId = `thread-${nextId}`;
  const senderRole = normalizeRole(currentUser?.role || role);

  const item = {
    notificationId: nextId,
    title: payload.title,
    content: payload.content,
    type: payload.type,
    createdAt: nowIso(),
    sender: {
      userId: Number(currentUser?.userId || 0),
      fullName: String(currentUser?.fullName || currentUser?.name || 'Nguoi dung EduHealth'),
      role: senderRole,
    },
    context: {
      classId: payload.classId || null,
      className: payload.classId ? `Lop ${payload.classId}` : '',
      diseaseId: payload.diseaseId || null,
      diseaseName: payload.diseaseId ? `Benh #${payload.diseaseId}` : '',
      vaccinationId: payload.vaccinationId || null,
      vaccinationName: payload.vaccinationId ? `Dot tiem #${payload.vaccinationId}` : '',
    },
    isRead: false,
    readAt: null,
    canReply: true,
    replyCount: 0,
    threadId,
  };

  items.unshift(item);
  threadStoreById[threadId] = [];
  emitNotificationsChanged();

  return {
    notificationId: nextId,
    totalRecipients: payload.classId ? 30 : (payload.recipientUserIds?.length || 1),
    source: 'mock',
  };
};

export const markNotificationReadMock = async ({
  notificationId,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const { items } = getStoreForRole({ currentUser, viewerRole });
  const target = items.find((item) => Number(item?.notificationId) === Number(notificationId));

  if (!target) {
    return false;
  }

  updateReadState(target);
  emitNotificationsChanged();
  return true;
};

export const markAllNotificationsReadMock = async ({
  currentUser,
  viewerRole,
} = {}) => {
  await waitForMock('default');
  const { items } = getStoreForRole({ currentUser, viewerRole });
  items.forEach(updateReadState);
  emitNotificationsChanged();
  return true;
};

export const replyToNotificationMock = async ({
  notificationId,
  content,
  currentUser,
  viewerRole,
}) => {
  await waitForMock('default');
  const { items, role } = getStoreForRole({ currentUser, viewerRole });
  const target = items.find((item) => Number(item?.notificationId) === Number(notificationId));

  if (!target) {
    const error = new Error('Khong tim thay thong bao de phan hoi.');
    error.status = 404;
    throw error;
  }

  touchThreadId(target.threadId);

  const payload = buildReplyPayload(content);
  const nextReplyId = threadStoreById[target.threadId].reduce((maxValue, item) => Math.max(maxValue, Number(item?.replyId || 0)), 0) + 1;
  const reply = {
    replyId: nextReplyId,
    sender: {
      userId: Number(currentUser?.userId || 0),
      fullName: String(currentUser?.fullName || currentUser?.name || 'Nguoi dung EduHealth'),
      role: normalizeRole(currentUser?.role || role),
    },
    content: payload.content,
    createdAt: nowIso(),
  };

  threadStoreById[target.threadId].push(reply);
  target.replyCount = threadStoreById[target.threadId].length;
  emitNotificationsChanged();

  return adaptReplyResponse({
    data: reply,
    meta: {
      source: 'mock',
      note: THREAD_PENDING_NOTE,
    },
  });
};

export const notificationsMockMeta = Object.freeze({
  inboxNote: INBOX_PENDING_NOTE,
  threadNote: THREAD_PENDING_NOTE,
  source: 'mock',
});
