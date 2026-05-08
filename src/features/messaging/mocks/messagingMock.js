const nowIso = () => new Date().toISOString();

const nurseConversations = [
  {
    conversationId: 1,
    conversationType: 'DIRECT',
    title: 'Nguyễn Văn An',
    studentId: 5,
    studentName: 'Nguyễn Văn An',
    className: '6A1',
    avatarUrl: null,
    participants: [
      { userId: 3, fullName: 'Y tá Lan', role: 'NURSE', avatarUrl: null },
      { userId: 8, fullName: 'Nguyễn Văn An', role: 'STUDENT', avatarUrl: null },
    ],
    lastMessage: {
      messageId: 12,
      content: 'Em đang bị đau đầu ạ',
      messageType: 'TEXT',
      senderId: 8,
      senderName: 'Nguyễn Văn An',
      senderRole: 'STUDENT',
      sentAt: nowIso(),
    },
    unreadCount: 2,
    isPinned: false,
    updatedAt: nowIso(),
    createdAt: nowIso(),
  },
  {
    conversationId: 2,
    conversationType: 'DIRECT',
    title: 'Lê Minh Trang',
    studentId: 9,
    studentName: 'Lê Minh Trang',
    className: '4B2',
    avatarUrl: null,
    participants: [
      { userId: 3, fullName: 'Y tá Lan', role: 'NURSE', avatarUrl: null },
      { userId: 9, fullName: 'Lê Minh Trang', role: 'STUDENT', avatarUrl: null },
    ],
    lastMessage: {
      messageId: 18,
      content: 'Cảm ơn cô nhiều nhé!',
      messageType: 'TEXT',
      senderId: 9,
      senderName: 'Lê Minh Trang',
      senderRole: 'STUDENT',
      sentAt: nowIso(),
    },
    unreadCount: 0,
    isPinned: false,
    updatedAt: nowIso(),
    createdAt: nowIso(),
  },
];

const studentConversations = [
  {
    conversationId: 3,
    conversationType: 'DIRECT',
    title: 'Y tá Lan',
    studentId: 5,
    studentName: 'Nguyễn Văn An',
    className: '6A1',
    avatarUrl: null,
    participants: [
      { userId: 3, fullName: 'Y tá Lan', role: 'NURSE', avatarUrl: null },
      { userId: 8, fullName: 'Nguyễn Văn An', role: 'STUDENT', avatarUrl: null },
    ],
    lastMessage: {
      messageId: 22,
      content: 'Minh Anh đã đỡ sốt chưa chị?',
      messageType: 'TEXT',
      senderId: 3,
      senderName: 'Y tá Lan',
      senderRole: 'NURSE',
      sentAt: nowIso(),
    },
    unreadCount: 1,
    isPinned: false,
    updatedAt: nowIso(),
    createdAt: nowIso(),
  },
  {
    conversationId: 4,
    conversationType: 'DIRECT',
    title: 'Y tá Mai',
    studentId: 5,
    studentName: 'Nguyễn Văn An',
    className: '6A1',
    avatarUrl: null,
    participants: [
      { userId: 4, fullName: 'Y tá Mai', role: 'NURSE', avatarUrl: null },
      { userId: 8, fullName: 'Nguyễn Văn An', role: 'STUDENT', avatarUrl: null },
    ],
    lastMessage: {
      messageId: 30,
      content: 'Chúc em mau khỏe nhé.',
      messageType: 'TEXT',
      senderId: 4,
      senderName: 'Y tá Mai',
      senderRole: 'NURSE',
      sentAt: nowIso(),
    },
    unreadCount: 0,
    isPinned: false,
    updatedAt: nowIso(),
    createdAt: nowIso(),
  },
];

const messagesByConversationId = {
  1: [
    {
      messageId: 11,
      conversationId: 1,
      senderId: 3,
      senderName: 'Y tá Lan',
      senderRole: 'NURSE',
      senderAvatarUrl: null,
      content: 'Chào An, cô đã nhận được tin nhắn của em.',
      messageType: 'TEXT',
      sentAt: nowIso(),
      isMine: true,
      attachments: [],
      readBy: [],
    },
    {
      messageId: 12,
      conversationId: 1,
      senderId: 8,
      senderName: 'Nguyễn Văn An',
      senderRole: 'STUDENT',
      senderAvatarUrl: null,
      content: 'Em đang bị đau đầu ạ',
      messageType: 'TEXT',
      sentAt: nowIso(),
      isMine: false,
      attachments: [],
      readBy: [],
    },
  ],
  2: [
    {
      messageId: 17,
      conversationId: 2,
      senderId: 3,
      senderName: 'Y tá Lan',
      senderRole: 'NURSE',
      senderAvatarUrl: null,
      content: 'Cô đã ghi nhận, em nhớ nghỉ ngơi nhé.',
      messageType: 'TEXT',
      sentAt: nowIso(),
      isMine: true,
      attachments: [],
      readBy: [],
    },
    {
      messageId: 18,
      conversationId: 2,
      senderId: 9,
      senderName: 'Lê Minh Trang',
      senderRole: 'STUDENT',
      senderAvatarUrl: null,
      content: 'Cảm ơn cô nhiều nhé!',
      messageType: 'TEXT',
      sentAt: nowIso(),
      isMine: false,
      attachments: [],
      readBy: [],
    },
  ],
  3: [
    {
      messageId: 21,
      conversationId: 3,
      senderId: 3,
      senderName: 'Y tá Lan',
      senderRole: 'NURSE',
      senderAvatarUrl: null,
      content: 'Minh Anh đã đỡ sốt chưa chị?',
      messageType: 'TEXT',
      sentAt: nowIso(),
      isMine: false,
      attachments: [],
      readBy: [],
    },
    {
      messageId: 22,
      conversationId: 3,
      senderId: 8,
      senderName: 'Nguyễn Văn An',
      senderRole: 'STUDENT',
      senderAvatarUrl: null,
      content: 'Em đã khỏe hơn nhiều ạ.',
      messageType: 'TEXT',
      sentAt: nowIso(),
      isMine: true,
      attachments: [],
      readBy: [],
    },
  ],
  4: [
    {
      messageId: 30,
      conversationId: 4,
      senderId: 4,
      senderName: 'Y tá Mai',
      senderRole: 'NURSE',
      senderAvatarUrl: null,
      content: 'Chúc em mau khỏe nhé.',
      messageType: 'TEXT',
      sentAt: nowIso(),
      isMine: false,
      attachments: [],
      readBy: [],
    },
  ],
};

const studentContacts = [
  {
    userId: 8,
    studentId: 5,
    fullName: 'Nguyễn Văn An',
    className: '6A1',
    role: 'STUDENT',
    avatarUrl: null,
    gender: 'MALE',
    dateOfBirth: '2013-02-10',
    hasConversation: true,
    conversationId: 1,
    lastMessageAt: nowIso(),
  },
  {
    userId: 9,
    studentId: 9,
    fullName: 'Lê Minh Trang',
    className: '4B2',
    role: 'STUDENT',
    avatarUrl: null,
    gender: 'FEMALE',
    dateOfBirth: '2015-04-22',
    hasConversation: true,
    conversationId: 2,
    lastMessageAt: nowIso(),
  },
];

const nurseContacts = [
  {
    userId: 3,
    fullName: 'Y tá Lan',
    role: 'NURSE',
    avatarUrl: null,
    email: 'nurse.lan@example.com',
    phoneNumber: '0900000000',
    hasConversation: true,
    conversationId: 3,
    lastMessageAt: nowIso(),
  },
  {
    userId: 4,
    fullName: 'Y tá Mai',
    role: 'NURSE',
    avatarUrl: null,
    email: 'nurse.mai@example.com',
    phoneNumber: '0900000001',
    hasConversation: true,
    conversationId: 4,
    lastMessageAt: nowIso(),
  },
];

const resolveConversationsByRole = (viewerRole) => {
  const role = String(viewerRole || '').toUpperCase();
  if (role === 'STUDENT') {
    return studentConversations;
  }

  return nurseConversations;
};

const filterByKeyword = (items, keyword) => {
  const normalized = String(keyword || '').trim().toLowerCase();
  if (!normalized) {
    return items;
  }

  return items.filter((item) => (
    String(item.title || '').toLowerCase().includes(normalized)
    || String(item.fullName || '').toLowerCase().includes(normalized)
    || String(item.studentName || '').toLowerCase().includes(normalized)
    || String(item.className || '').toLowerCase().includes(normalized)
    || String(item.lastMessage?.content || '').toLowerCase().includes(normalized)
  ));
};

const buildEnvelope = ({ items, page = 1, pageSize = 20 }) => {
  const totalItems = items.length;
  const totalPages = pageSize ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

  return {
    success: true,
    message: 'Lấy dữ liệu thành công.',
    data: items,
    meta: {
      page,
      pageSize,
      total: totalItems,
      totalPages,
    },
  };
};

export const getConversationsMockEnvelope = ({ viewerRole, page = 1, pageSize = 20, keyword = '' } = {}) => {
  const items = filterByKeyword(resolveConversationsByRole(viewerRole), keyword);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return buildEnvelope({ items: paged, page, pageSize });
};

export const getConversationDetailMockEnvelope = (conversationId, params = {}) => {
  const items = resolveConversationsByRole(params.viewerRole);
  const conversation = items.find((item) => Number(item.conversationId) === Number(conversationId)) || null;

  return {
    success: Boolean(conversation),
    message: conversation ? 'Lấy dữ liệu thành công.' : 'Không tìm thấy hội thoại.',
    data: conversation,
    meta: null,
  };
};

export const getMessagesMockEnvelope = ({ conversationId, page = 1, pageSize = 30, beforeMessageId } = {}) => {
  const messages = messagesByConversationId[conversationId] || [];
  const filtered = beforeMessageId
    ? messages.filter((item) => Number(item.messageId) < Number(beforeMessageId))
    : messages;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return buildEnvelope({ items: paged, page, pageSize });
};

export const createConversationMockEnvelope = (payload = {}, params = {}) => {
  const conversations = resolveConversationsByRole(params.viewerRole);
  const participantUserId = Number(payload.participantUserId);
  const matched = conversations.find((item) =>
    item.participants?.some((participant) => Number(participant.userId) === participantUserId)
  );

  if (matched) {
    return {
      success: true,
      message: 'Lấy dữ liệu thành công.',
      data: matched,
      meta: null,
    };
  }

  const fallback = conversations[0] || nurseConversations[0] || studentConversations[0] || {
    conversationId: 0,
    conversationType: 'DIRECT',
    title: 'Hội thoại mới',
    studentId: payload.studentId || null,
    studentName: '',
    className: '',
    avatarUrl: null,
    participants: [],
    lastMessage: null,
    unreadCount: 0,
    isPinned: false,
    updatedAt: nowIso(),
    createdAt: nowIso(),
  };
  const baseId = conversations.length
    ? Math.max(...conversations.map((item) => item.conversationId))
    : 100;
  const newConversation = {
    ...fallback,
    conversationId: baseId + 1,
    title: payload.participantName || fallback?.title || 'Hội thoại mới',
    lastMessage: null,
    unreadCount: 0,
    updatedAt: nowIso(),
    createdAt: nowIso(),
  };

  return {
    success: true,
    message: 'Tạo hội thoại thành công.',
    data: newConversation,
    meta: null,
  };
};

export const getStudentContactsMockEnvelope = ({ page = 1, pageSize = 20, keyword = '', className = '' } = {}) => {
  let items = filterByKeyword(studentContacts, keyword);

  if (className) {
    const normalized = String(className).trim().toLowerCase();
    items = items.filter((item) => String(item.className).toLowerCase().includes(normalized));
  }

  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return buildEnvelope({ items: paged, page, pageSize });
};

export const getNurseContactsMockEnvelope = ({ page = 1, pageSize = 20, keyword = '' } = {}) => {
  const items = filterByKeyword(nurseContacts, keyword);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return buildEnvelope({ items: paged, page, pageSize });
};

export const markConversationReadMockEnvelope = () => ({
  success: true,
  message: 'Đã đánh dấu đã đọc.',
  data: { success: true },
  meta: null,
});
