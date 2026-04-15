import React from 'react';

const BADGE_CLASS_MAP = {
  positive: 'border-success/25 bg-success-soft text-success',
  negative: 'border-danger/25 bg-danger-soft text-danger',
  neutral: 'border-outline-variant bg-surface text-on-surface-variant',
};

const renderProgress = (value = 0) => {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="mt-2.5">
      <div className="h-1.5 rounded-full bg-outline-variant/70">
        <div
          className="h-full rounded-full bg-info transition-all duration-300"
          style={{ width: `${safeValue}%` }}
          aria-label={`Tiến độ ${safeValue}%`}
        />
      </div>
    </div>
  );
};

const NurseReportsSummaryCards = ({ cards = [] }) => {
  if (!cards.length) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const badgeClassName = BADGE_CLASS_MAP[card.badgeTone] || BADGE_CLASS_MAP.neutral;

        return (
          <article key={card.id} className="nurse-card-soft rounded-xl px-3.5 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">{card.title}</p>
                <p className={`mt-0.5 text-[1.52rem] font-extrabold leading-tight ${card.valueClassName || 'text-on-surface'}`}>
                  {card.value}
                </p>
              </div>
              <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${card.chipClassName || 'border-outline-variant bg-surface-container-low text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-[17px]">{card.icon || 'analytics'}</span>
              </span>
            </div>

            <div className="mt-1.5 flex items-start justify-between gap-2">
              <p className="min-h-[28px] text-[11px] leading-[1.2rem] text-on-surface-variant">{card.hint || '--'}</p>
              {card.badge ? (
                <span className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badgeClassName}`}>
                  {card.badge}
                </span>
              ) : null}
            </div>

            {typeof card.progress === 'number' ? renderProgress(card.progress) : null}
          </article>
        );
      })}
    </section>
  );
};

export default NurseReportsSummaryCards;
