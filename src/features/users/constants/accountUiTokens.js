export const ACCOUNT_UI_COLORS = {
  primary700: '#2F6E62',
  primary600: '#3D8375',
  primary500: '#56A08F',
  primary100: '#E4F2EE',
  primary50: '#F3F8F6',
  appBg: '#F4F7F5',
  sectionBg: '#EEF3F0',
  cardBg: '#FBFCFB',
  subtleSurface: '#F7FAF8',
  border: '#D8E3DE',
  heading: '#1F2A27',
  body: '#42534D',
  muted: '#6E7F78',
  successBg: '#EAF6EF',
  successText: '#2E7D57',
  dangerBg: '#FBEDEC',
  dangerText: '#B85C57',
  warningBg: '#FFF5E8',
  warningText: '#B07A2A',
  infoBg: '#EDF5F8',
  infoText: '#47728E',
};

export const ACCOUNT_ROLE_BADGE_CLASS_MAP = {
  ADMIN: 'border-[var(--color-role-admin-soft)] bg-[var(--color-role-admin-soft)] text-[var(--color-role-admin-text)]',
  NURSE: 'border-[var(--color-role-nurse-soft)] bg-[var(--color-role-nurse-soft)] text-[var(--color-role-nurse-text)]',
  STUDENT: 'border-[var(--color-role-student-soft)] bg-[var(--color-role-student-soft)] text-[var(--color-role-student-text)]',
};

export const ACCOUNT_STATUS_BADGE_CLASS_MAP = {
  ACTIVE: 'border-[var(--color-status-active-soft)] bg-[var(--color-status-active-soft)] text-[var(--color-status-active-text)]',
  LOCKED: 'border-[var(--color-status-locked-soft)] bg-[var(--color-status-locked-soft)] text-[var(--color-status-locked-text)]',
};

export const ACCOUNT_BASE_CLASS = {
  app: 'admin-page-bg',
  section: 'border border-outline-variant bg-surface-container-lowest',
  subtlePanel: 'border border-outline-variant bg-surface-container-low',
  headingText: 'text-on-surface',
  bodyText: 'text-on-surface-variant',
  mutedText: 'text-on-surface-muted',
  border: 'border-outline-variant',
  focusRing: 'focus:border-[var(--color-field-focus)] focus:ring-2 focus:ring-[var(--color-field-focus)]/20',
  primaryButton: 'bg-primary text-white hover:bg-[var(--color-primary-hover)]',
  secondaryButton: 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low',
};

export const ACCOUNT_TOAST_CLASS_MAP = {
  success: 'border-success/30 bg-success-soft text-success',
  error: 'border-danger/30 bg-danger-soft text-danger',
};
