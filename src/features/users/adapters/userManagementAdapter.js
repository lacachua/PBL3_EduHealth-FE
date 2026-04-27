import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { formatDateTime } from '../../../shared/utils/dateFormat';
import { ROLE_LABEL_MAP, ROLE_TONE_MAP, STATUS_LABEL_MAP, STATUS_TONE_MAP, USER_ROLES } from '../constants/userManagementConstants';

import { normalizeAccountStatus } from '../../../shared/utils/statusHelper';

export const adaptUserRow = (item) => {
  const lastLogin = item.lastLoginAt || item.lastLogin || item.lastSignedInAt || null;
  const status = normalizeAccountStatus(item.status, item.isActive);

  return {
    id: item.id,
    username: item.username,
    fullName: item.fullName,
    email: item.email,
    phoneNumber: item.phoneNumber || '',
    role: item.role,
    status: status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    lastLoginAt: lastLogin,
    createdAtLabel: formatDateTime(item.createdAt),
    updatedAtLabel: formatDateTime(item.updatedAt),
    lastLoginAtLabel: formatDateTime(lastLogin),
    roleLabel: ROLE_LABEL_MAP[item.role] || item.role,
    roleTone: ROLE_TONE_MAP[item.role] || 'neutral',
    statusLabel: STATUS_LABEL_MAP[status] || status,
    statusTone: STATUS_TONE_MAP[status] || 'neutral',
  };
};

export const adaptUserListResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);

  if (!envelope || envelope.success === false) {
    return { rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 };
  }

  const sourceRows = Array.isArray(envelope.data)
    ? envelope.data
    : Array.isArray(envelope.data?.users)
      ? envelope.data.users
      : Array.isArray(envelope.data?.items)
        ? envelope.data.items
        : [];

  const rows = sourceRows.map(adaptUserRow);

  return {
    rows,
    page: Number(envelope.meta?.page || 1),
    pageSize: Number(envelope.meta?.pageSize || 10),
    totalItems: Number(envelope.meta?.totalItems || rows.length),
    totalPages: Number(envelope.meta?.totalPages || 1),
  };
};

export const adaptUserDetailResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  const item = envelope.data?.user || envelope.data;

  if (!item) {
    return null;
  }

  return adaptUserRow(item);
};

export const buildCreateUserPayload = (values) => ({
  username: values.username?.trim(),
  password: values.password?.trim(),
  fullName: values.fullName?.trim(),
  email: values.email?.trim(),
  phoneNumber: values.phoneNumber?.trim() || '',
  role: USER_ROLES.NURSE,
});

export const buildUpdateUserPayload = (values) => ({
  fullName: values.fullName?.trim(),
  email: values.email?.trim(),
  ...(values.phoneNumber?.trim() ? { phoneNumber: values.phoneNumber.trim() } : { phoneNumber: null }),
});

export const buildStatusPayload = ({ status, reason }) => {
  const payload = { status };
  if (reason?.trim()) {
    payload.reason = reason.trim();
  }
  return payload;
};
