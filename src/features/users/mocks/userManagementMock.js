export const userRows = [
  {
    id: '101',
    username: 'admin01',
    fullName: 'Nguyễn Thị Mai',
    email: 'admin@eduhealth.vn',
    phoneNumber: '0912000101',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastLoginAt: '2026-03-15 08:45',
    createdAt: '2025-09-01',
    updatedAt: '2026-01-10',
  },
  {
    id: '102',
    username: 'nurse01',
    fullName: 'Trần Hoàng Yến',
    email: 'nurse01@eduhealth.vn',
    phoneNumber: '0912000102',
    role: 'NURSE',
    status: 'ACTIVE',
    lastLoginAt: '2026-03-16 09:10',
    createdAt: '2025-09-10',
    updatedAt: '2026-01-11',
  },
  {
    id: '103',
    username: 'nurse02',
    fullName: 'Lê Minh An',
    email: 'nurse02@eduhealth.vn',
    phoneNumber: '0912000103',
    role: 'NURSE',
    status: 'LOCKED',
    lastLoginAt: '2026-02-28 14:35',
    createdAt: '2025-10-03',
    updatedAt: '2026-02-03',
  },
];

const compareDate = (first, second) => new Date(first).getTime() - new Date(second).getTime();

const applyFilters = (data, query) => {
  const keyword = (query.keyword || '').trim().toLowerCase();

  return data.filter((item) => {
    const byKeyword = !keyword
      || item.username.toLowerCase().includes(keyword)
      || item.fullName.toLowerCase().includes(keyword)
      || item.email.toLowerCase().includes(keyword);

    const byRole = !query.role || query.role === 'all' || item.role === query.role;
    const byStatus = !query.status || query.status === 'all' || item.status === query.status;

    return byKeyword && byRole && byStatus;
  });
};

const applySort = (data) => {
  const cloned = [...data];
  return cloned.sort((a, b) => compareDate(b.createdAt, a.createdAt));
};

const formatPayloadToUser = (payload, current) => {
  const source = payload?.userPayload || payload || {};

  return {
    ...current,
    username: source.username?.trim() || current.username,
    fullName: source.fullName?.trim() || current.fullName,
    email: source.email?.trim() || current.email,
    phoneNumber: source.phoneNumber?.trim() || null,
    role: source.role || current.role,
    status: source.status || current.status,
    updatedAt: new Date().toISOString(),
  };
};

export const getUserManagementMockEnvelope = (query = {}) => {
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);
  const filtered = applyFilters(userRows, query);
  const sorted = applySort(filtered);

  return {
    success: true,
    message: 'Tải danh sách tài khoản thành công',
    data: {
      users: sorted.slice((page - 1) * pageSize, page * pageSize),
    },
    errors: null,
    meta: {
      page,
      pageSize,
      totalItems: sorted.length,
      totalPages: Math.max(1, Math.ceil(sorted.length / pageSize)),
      source: 'mock',
    },
  };
};

export const getUserByIdMock = (userId) => {
  const user = userRows.find((row) => row.id === userId);

  if (!user) {
    return {
      success: false,
      message: 'Không tìm thấy tài khoản',
      data: null,
      errors: [{ message: 'Không tìm thấy tài khoản' }],
      meta: { source: 'mock' },
    };
  }

  return {
    success: true,
    message: 'Lấy thông tin tài khoản thành công',
    data: { user },
    errors: null,
    meta: { source: 'mock' },
  };
};

export const createUserMock = (payload) => {
  const newUser = formatPayloadToUser(payload, {
    id: String(Date.now()).slice(-6),
    username: '',
    role: 'NURSE',
    status: 'ACTIVE',
    lastLoginAt: '--',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  userRows.unshift(newUser);

  return {
    success: true,
    message: 'Tạo tài khoản thành công',
    data: { user: newUser },
    errors: null,
    meta: { source: 'mock' },
  };
};

export const updateUserMock = (userId, payload) => {
  const index = userRows.findIndex((row) => row.id === userId);

  if (index < 0) {
    return {
      success: false,
      message: 'Không tìm thấy tài khoản',
      data: null,
      errors: [{ message: 'Không tìm thấy tài khoản' }],
      meta: { source: 'mock' },
    };
  }

  const nextUser = formatPayloadToUser(payload, userRows[index]);
  userRows[index] = nextUser;

  return {
    success: true,
    message: 'Cập nhật tài khoản thành công',
    data: { user: nextUser },
    errors: null,
    meta: { source: 'mock' },
  };
};

export const toggleUserStatusMock = (userId, payload = {}) => {
  const index = userRows.findIndex((row) => row.id === userId);

  if (index < 0) {
    return {
      success: false,
      message: 'Không tìm thấy tài khoản',
      data: null,
      errors: [{ message: 'Không tìm thấy tài khoản' }],
      meta: { source: 'mock' },
    };
  }

  const nextStatus = payload?.status || (userRows[index].status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE');
  userRows[index] = {
    ...userRows[index],
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    message: 'Cập nhật trạng thái tài khoản thành công.',
    data: {
      id: userRows[index].id,
      status: userRows[index].status,
      reason: payload?.reason || null,
      updatedAt: userRows[index].updatedAt,
    },
    errors: null,
    meta: { source: 'mock' },
  };
};

export const resetUserPasswordMock = (userId, payload = {}) => {
  const mode = payload?.mode || 'TEMPORARY';

  if (mode === 'CUSTOM') {
    return {
      success: true,
      message: 'Reset mật khẩu thành công.',
      data: {
        id: userId,
        resetMode: 'CUSTOM',
        updatedAt: new Date().toISOString(),
      },
      errors: null,
      meta: { source: 'mock' },
    };
  }

  return {
    success: true,
    message: 'Reset mật khẩu tạm thành công.',
    data: {
      id: userId,
      resetMode: 'TEMPORARY',
      temporaryPassword: `Tmp@${String(Math.floor(1000 + Math.random() * 9000))}`,
      updatedAt: new Date().toISOString(),
    },
    errors: null,
    meta: { source: 'mock' },
  };
};
