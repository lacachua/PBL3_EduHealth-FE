import React from 'react';

const iconToneClassMap = {
  slate: 'bg-surface-container-high text-on-surface-variant',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
};

const noteToneClassMap = {
  neutral: 'text-on-surface-variant',
  success: 'text-success',
  'success-soft': 'border border-success/15 bg-success-soft text-success',
  'warning-soft': 'border border-warning/20 bg-warning-soft text-warning',
  'danger-soft': 'animate-pulse border border-danger/20 bg-danger-soft text-danger',
};

const valueToneClassMap = {
  default: 'text-on-surface',
  danger: 'text-danger',
};

const AdminReportSummaryCardItem = ({ card }) => {
  const iconToneClass = iconToneClassMap[card.iconTone] || iconToneClassMap.slate;
  const noteToneClass = noteToneClassMap[card.noteTone] || noteToneClassMap.neutral;
  const valueToneClass = valueToneClassMap[card.valueTone || 'default'];
  const hasNote = Boolean(card.note);

  return (
    <article className="group rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm transition-all hover:border-secondary/20">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconToneClass}`}>
          <span
            className="material-symbols-outlined"
            style={card.iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {card.icon}
          </span>
        </div>
        {hasNote ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${noteToneClass}`}>{card.note}</span> : null}
      </div>

      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-muted">{card.label}</p>

      {card.progress ? (
        <div className="flex items-center gap-3">
          <h3 className={`text-3xl font-black ${valueToneClass}`}>{card.value}</h3>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full rounded-full bg-secondary" style={{ width: `${card.progress}%` }} />
          </div>
        </div>
      ) : (
        <h3 className={`text-3xl font-black ${valueToneClass}`}>{card.value}</h3>
      )}
    </article>
  );
};

export default AdminReportSummaryCardItem;
