export const ACCOUNT_ROLE_BADGE_CLASS_MAP = {
  ADMIN: 'border-info/35 bg-info-soft text-info',
  NURSE: 'border-success/35 bg-success-soft text-success',
  STUDENT: 'border-primary/35 bg-primary-soft text-primary',
};

export const ACCOUNT_STATUS_BADGE_CLASS_MAP = {
  ACTIVE: 'border-success/35 bg-success-soft text-success',
  LOCKED: 'border-danger/35 bg-danger-soft text-danger',
};

export const ACCOUNT_BASE_CLASS = {
  app: 'app-page-bg',
  section: 'border border-[var(--card-border)] bg-[var(--card-bg)]',
  subtlePanel: 'border border-outline-variant bg-[var(--table-header-bg)]',
  headingText: 'text-on-surface',
  bodyText: 'text-on-surface-variant',
  mutedText: 'text-on-surface-muted',
  border: 'border-outline-variant',
  focusRing: 'app-focus-ring focus:border-[var(--field-focus)] focus:ring-2 focus:ring-primary/20',
  primaryButton: 'app-focus-ring app-btn-primary',
  secondaryButton: 'app-focus-ring app-btn-secondary',
};

export const ACCOUNT_TOAST_CLASS_MAP = {
  success: 'border-success/30 bg-success-soft text-success',
  error: 'border-danger/30 bg-danger-soft text-danger',
};
