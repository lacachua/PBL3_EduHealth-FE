export const ROLE_HOME_PATHS = {
  ADMIN: '/admin/dashboard',
  NURSE: '/nurse/dashboard',
  STUDENT: '/student/dashboard',
};

const LEGACY_ROLE_ALIASES = {
  PARENT: 'STUDENT',
};

export const resolveRoleHomePath = (role, fallback = '/') => {
  if (!role) return fallback;

  const normalizedRole = String(role).toUpperCase();
  const effectiveRole = LEGACY_ROLE_ALIASES[normalizedRole] || normalizedRole;
  return ROLE_HOME_PATHS[effectiveRole] || fallback;
};
