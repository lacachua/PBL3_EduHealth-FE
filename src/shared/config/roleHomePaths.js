export const ROLE_HOME_PATHS = {
  ADMIN: '/admin/dashboard',
  NURSE: '/nurse/dashboard',
  PARENT: '/parent/dashboard',
};

export const resolveRoleHomePath = (role, fallback = '/') => {
  if (!role) return fallback;

  const normalizedRole = String(role).toUpperCase();
  return ROLE_HOME_PATHS[normalizedRole] || fallback;
};
