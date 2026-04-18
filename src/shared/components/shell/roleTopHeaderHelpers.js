const ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  NURSE: 'Nhân viên y tế',
  STUDENT: 'Học sinh',
};

const ROLE_DEFAULT_NAMES = {
  ADMIN: 'Quản trị viên',
  NURSE: 'Nhân viên y tế',
  STUDENT: 'Học sinh',
};

const ROLE_INITIALS = {
  ADMIN: 'AD',
  NURSE: 'YT',
  STUDENT: 'HS',
};

const trimRoleSuffix = (value) => {
  return String(value || '')
    .replace(/\s*\((admin|quản trị viên|nurse|nhân viên y tế|student|học sinh|hoc sinh)\)\s*$/i, '')
    .trim();
};

const normalizeRole = (value) => String(value || '').trim().toUpperCase();

const capitalizeFirstLetter = (value) => {
  const text = String(value || '').trim();
  if (!text) {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const normalizeRoleCode = (roleCode, fallbackRoleCode = '') => {
  const normalizedRole = normalizeRole(roleCode);
  if (normalizedRole) {
    return normalizedRole;
  }

  const normalizedFallback = normalizeRole(fallbackRoleCode);
  return normalizedFallback || 'ADMIN';
};

export const resolveRoleLabel = ({ roleCode, roleLabel, fallbackRoleCode = '' }) => {
  const explicitLabel = String(roleLabel || '').trim();
  if (explicitLabel) {
    return explicitLabel;
  }

  const resolvedRole = normalizeRoleCode(roleCode, fallbackRoleCode);
  return ROLE_LABELS[resolvedRole] || ROLE_LABELS[normalizeRoleCode(fallbackRoleCode)] || 'Quản trị viên';
};

export const resolveDisplayName = (user, fallbackRoleCode = '') => {
  const primaryName = trimRoleSuffix(user?.fullName || user?.name || user?.displayName);
  if (primaryName) {
    return primaryName;
  }

  const username = String(user?.username || '').trim();
  if (username) {
    return username;
  }

  const emailOrIdentifier = String(user?.email || user?.identifier || '').trim();
  if (emailOrIdentifier) {
    const localPart = emailOrIdentifier.split('@')[0]?.trim();
    return localPart || emailOrIdentifier;
  }

  const resolvedRole = normalizeRoleCode(user?.role, fallbackRoleCode);
  return ROLE_DEFAULT_NAMES[resolvedRole] || 'Quản trị viên';
};

export const resolveAvatarUrl = (user) => {
  return String(user?.avatar || user?.avatarUrl || user?.image || '').trim();
};

export const resolveFallbackInitialsByRole = (roleCode) => {
  const resolvedRole = normalizeRoleCode(roleCode);
  return ROLE_INITIALS[resolvedRole] || 'AD';
};

export const resolveInitials = (value, fallbackInitials = 'EH') => {
  const text = String(value || '').trim();
  if (!text) {
    return fallbackInitials;
  }

  const tokens = text.split(/\s+/).filter(Boolean);
  const initials = tokens
    .slice(0, 2)
    .map((token) => token.charAt(0).toUpperCase())
    .join('');

  if (initials) {
    return initials;
  }

  return text.slice(0, 2).toUpperCase() || fallbackInitials;
};

export const getGreetingByTime = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Chào buổi sáng';
  }

  if (hour < 18) {
    return 'Chào buổi chiều';
  }

  return 'Chào buổi tối';
};

export const formatCurrentDateVi = (date = new Date()) => {
  const formatted = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  return capitalizeFirstLetter(formatted);
};
