import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { ROLE_LABEL_MAP, ROLE_TONE_MAP, STATUS_LABEL_MAP, STATUS_TONE_MAP } from '../schemas/userManagementSchema';

export const adaptUserRow = (item) => ({
  id: item.id,
  username: item.username,
  fullName: item.fullName,
  email: item.email,
  phoneNumber: item.phoneNumber || '',
  role: item.role,
  status: item.status,
  createdAt: item.createdAt || '--',
  updatedAt: item.updatedAt || '--',
  lastLoginAt: item.lastLoginAt || '--',
  roleLabel: ROLE_LABEL_MAP[item.role] || item.role,
  roleTone: ROLE_TONE_MAP[item.role] || 'neutral',
  statusLabel: STATUS_LABEL_MAP[item.status] || item.status,
  statusTone: STATUS_TONE_MAP[item.status] || 'neutral',
});

export const adaptUserListResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);

  if (!envelope || envelope.success === false) {
    return { rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 };
  }

  const sourceRows = Array.isArray(envelope.data?.users)
    ? envelope.data.users
    : Array.isArray(envelope.data?.items)
      ? envelope.data.items
      : [];

  const rows = sourceRows
      .filter((item) => item.role === 'ADMIN' || item.role === 'NURSE')
      .map(adaptUserRow);

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
