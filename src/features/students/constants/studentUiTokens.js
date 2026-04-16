export const STUDENT_BASE_CLASS = {
  app: 'app-page-bg',
  section: 'border border-outline-variant bg-surface-container-lowest',
  subtlePanel: 'border border-outline-variant bg-surface-container-low',
  headingText: 'text-on-surface',
  bodyText: 'text-on-surface-variant',
  mutedText: 'text-on-surface-muted',
  border: 'border-outline-variant',
  focusRing: 'focus:border-[var(--field-focus)] focus:ring-2 focus:ring-primary/20',
  primaryButton: 'bg-primary text-white hover:bg-primary-hover',
  secondaryButton: 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low',
};

export const STUDENT_STATUS_BADGE_CLASS_MAP = {
  ACTIVE: 'border-success/25 bg-success-soft text-success',
  INACTIVE: 'border-danger/25 bg-danger-soft text-danger',
};

export const STUDENT_BADGE_BASE_CLASS = 'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold leading-4';

export const STUDENT_HEALTH_BADGE_CLASS_MAP = {
  warning: 'border-warning/25 bg-warning-soft text-warning',
  missing: 'border-outline-variant bg-surface-container-high text-on-surface-variant',
  stable: 'border-success/25 bg-success-soft text-success',
};
