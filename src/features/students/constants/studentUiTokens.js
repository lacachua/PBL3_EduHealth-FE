export const STUDENT_BASE_CLASS = {
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

export const STUDENT_STATUS_BADGE_CLASS_MAP = {
  ACTIVE: 'border-[var(--color-status-active-soft)] bg-[var(--color-status-active-soft)] text-[var(--color-status-active-text)]',
  PENDING_APPROVAL: 'border-warning/25 bg-warning-soft text-warning',
  TEMP_SUSPENDED: 'border-warning/25 bg-warning-soft text-warning',
  TRANSFERRED: 'border-outline-variant bg-surface-container-low text-on-surface-variant',
  LOCKED: 'border-[var(--color-status-locked-soft)] bg-[var(--color-status-locked-soft)] text-[var(--color-status-locked-text)]',
};

export const STUDENT_BADGE_BASE_CLASS = 'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold leading-4';

export const STUDENT_HEALTH_BADGE_CLASS_MAP = {
  warning: 'border-[var(--color-health-warning-soft)] bg-[var(--color-health-warning-soft)] text-[var(--color-health-warning-text)]',
  missing: 'border-[var(--color-health-missing-soft)] bg-[var(--color-health-missing-soft)] text-[var(--color-health-missing-text)]',
  stable: 'border-success/25 bg-success-soft text-success',
};
