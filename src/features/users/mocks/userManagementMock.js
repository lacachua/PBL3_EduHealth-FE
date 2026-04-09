const nowIso = () => new Date().toISOString();

let sequence = 4;

const users = [
  {
    id: 'USR001',
    username: 'admin',
    fullName: 'System Admin',
    email: 'admin@eduhealth.local',
    phoneNumber: '0900000001',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-03-28T08:00:00Z',
    updatedAt: '2026-04-02T08:00:00Z',
    lastLoginAt: '2026-04-08T09:00:00Z',
    lockReason: null,
  },
  {
    id: 'USR002',
    username: 'nurse01',
    fullName: 'Nguyen Thi Lan',
    email: 'nurse01@eduhealth.local',
    phoneNumber: '0900000002',
    role: 'NURSE',
    status: 'ACTIVE',
    createdAt: '2026-03-28T09:00:00Z',
    updatedAt: '2026-04-02T09:00:00Z',
    lastLoginAt: '2026-04-08T09:30:00Z',
    lockReason: null,
  },
  {
    id: 'USR003',
    username: 'nurse02',
    fullName: 'Tran Minh Chau',
    email: 'nurse02@eduhealth.local',
    phoneNumber: '0900000003',
    role: 'NURSE',
    status: 'LOCKED',
    createdAt: '2026-03-28T10:00:00Z',
    updatedAt: '2026-04-03T10:00:00Z',
    lastLoginAt: '2026-04-07T15:10:00Z',
    lockReason: 'Mock: policy violation',
  },
];

const createEnvelope = ({ message, data, meta = null }) => ({
  success: true,
  message,
  data,
  meta,
  timestamp: nowIso(),
  traceId: 'mock-users-trace-id',
});

const createApiError = (status, message, errors = []) => {
  const error = new Error(message);
  error.response = {
    status,
    data: {
      success: false,
      message,
      errors,
      timestamp: nowIso(),
      traceId: 'mock-users-trace-id',
    },
  };

  throw error;
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const withPaging = (items, page, pageSize) => {
  const safePage = Math.max(1, Number(page || 1));
  const safePageSize = Math.max(1, Number(pageSize || 10));
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const offset = (safePage - 1) * safePageSize;

  return {
    rows: items.slice(offset, offset + safePageSize),
    meta: {
      page: safePage,
      pageSize: safePageSize,
      totalItems,
      totalPages,
    },
  };
};

export const getUsersMock = async (query = {}) => {
  const keyword = normalizeText(query.keyword);
  const role = String(query.role || '').trim();
  const status = String(query.status || '').trim();

  const filtered = users
    .filter((item) => {
      if (keyword) {
        const searchable = `${item.username} ${item.fullName} ${item.email} ${item.phoneNumber || ''}`.toLowerCase();
        if (!searchable.includes(keyword)) {
          return false;
        }
      }

      if (role && role !== 'all' && item.role !== role) {
        return false;
      }

      if (status && status !== 'all' && item.status !== status) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const { rows, meta } = withPaging(filtered, query.page, query.pageSize);

  return createEnvelope({
    message: 'Mock: lấy danh sách người dùng thành công',
    data: rows,
    meta,
  });
};

export const getUserByIdMock = async (userCode) => {
  const item = users.find((user) => user.id === userCode);
  if (!item) {
    createApiError(404, 'Không tìm thấy người dùng', [
      { field: 'id', code: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng với mã đã cung cấp' },
    ]);
  }

  return createEnvelope({
    message: 'Mock: lấy chi tiết người dùng thành công',
    data: item,
  });
};

export const createUserMock = async (payload = {}) => {
  const username = String(payload.username || '').trim();
  const fullName = String(payload.fullName || '').trim();
  const email = String(payload.email || '').trim();
  const password = String(payload.password || '').trim();
  const role = String(payload.role || '').trim() || 'NURSE';

  if (!username || !fullName || !email || !password) {
    createApiError(400, 'Dữ liệu không hợp lệ', [
      { field: 'body', code: 'VALIDATION_ERROR', message: 'Thiếu trường bắt buộc' },
    ]);
  }

  if (role !== 'NURSE') {
    createApiError(400, 'Dữ liệu không hợp lệ', [
      { field: 'role', code: 'INVALID_ROLE', message: 'Chỉ hỗ trợ tạo tài khoản NURSE' },
    ]);
  }

  if (users.some((item) => item.username.toLowerCase() === username.toLowerCase())) {
    createApiError(409, 'Trùng dữ liệu', [
      { field: 'username', code: 'DUPLICATE', message: 'Tên đăng nhập đã tồn tại' },
    ]);
  }

  if (users.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
    createApiError(409, 'Trùng dữ liệu', [
      { field: 'email', code: 'DUPLICATE', message: 'Email đã tồn tại' },
    ]);
  }

  const created = {
    id: `USR${String(sequence).padStart(3, '0')}`,
    username,
    fullName,
    email,
    phoneNumber: payload.phoneNumber ? String(payload.phoneNumber).trim() : null,
    role: 'NURSE',
    status: 'ACTIVE',
    createdAt: nowIso(),
    updatedAt: nowIso(),
    lastLoginAt: null,
    lockReason: null,
  };

  sequence += 1;
  users.unshift(created);

  return createEnvelope({
    message: 'Mock: tạo tài khoản thành công',
    data: created,
  });
};

export const updateUserMock = async (userCode, payload = {}) => {
  const index = users.findIndex((item) => item.id === userCode);
  if (index < 0) {
    createApiError(404, 'Không tìm thấy người dùng', [
      { field: 'id', code: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng với mã đã cung cấp' },
    ]);
  }

  const current = users[index];
  const next = {
    ...current,
    fullName: payload.fullName ? String(payload.fullName).trim() : current.fullName,
    email: payload.email ? String(payload.email).trim() : current.email,
    phoneNumber: Object.prototype.hasOwnProperty.call(payload, 'phoneNumber')
      ? (payload.phoneNumber ? String(payload.phoneNumber).trim() : null)
      : current.phoneNumber,
    updatedAt: nowIso(),
  };

  users[index] = next;

  return createEnvelope({
    message: 'Mock: cập nhật tài khoản thành công',
    data: next,
  });
};

export const updateUserStatusMock = async (userCode, payload = {}) => {
  const index = users.findIndex((item) => item.id === userCode);
  if (index < 0) {
    createApiError(404, 'Không tìm thấy người dùng', [
      { field: 'id', code: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng với mã đã cung cấp' },
    ]);
  }

  const status = String(payload.status || '').trim().toUpperCase();
  if (status !== 'ACTIVE' && status !== 'LOCKED') {
    createApiError(400, 'Dữ liệu không hợp lệ', [
      { field: 'status', code: 'INVALID_STATUS', message: 'status chỉ nhận ACTIVE hoặc LOCKED' },
    ]);
  }

  users[index] = {
    ...users[index],
    status,
    lockReason: status === 'LOCKED' ? String(payload.reason || '').trim() || null : null,
    updatedAt: nowIso(),
  };

  return createEnvelope({
    message: 'Mock: cập nhật trạng thái thành công',
    data: {
      id: users[index].id,
      status: users[index].status,
      reason: users[index].lockReason,
      updatedAt: users[index].updatedAt,
    },
  });
};

export const resetUserPasswordMock = async (userCode, payload = {}) => {
  const index = users.findIndex((item) => item.id === userCode);
  if (index < 0) {
    createApiError(404, 'Không tìm thấy người dùng', [
      { field: 'id', code: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng với mã đã cung cấp' },
    ]);
  }

  const mode = String(payload.mode || '').trim().toUpperCase();
  if (mode !== 'CUSTOM' && mode !== 'TEMPORARY') {
    createApiError(400, 'Dữ liệu không hợp lệ', [
      { field: 'mode', code: 'INVALID_MODE', message: 'mode chỉ nhận CUSTOM hoặc TEMPORARY' },
    ]);
  }

  if (mode === 'CUSTOM' && String(payload.newPassword || '').trim().length < 6) {
    createApiError(400, 'Dữ liệu không hợp lệ', [
      { field: 'newPassword', code: 'INVALID_PASSWORD', message: 'Mật khẩu mới tối thiểu 6 ký tự' },
    ]);
  }

  users[index] = {
    ...users[index],
    updatedAt: nowIso(),
  };

  return createEnvelope({
    message: 'Mock: đặt lại mật khẩu thành công',
    data: {
      id: users[index].id,
      resetMode: mode,
      temporaryPassword: mode === 'TEMPORARY' ? `Tmp@${Math.floor(100000 + Math.random() * 900000)}` : null,
      updatedAt: users[index].updatedAt,
    },
  });
};
