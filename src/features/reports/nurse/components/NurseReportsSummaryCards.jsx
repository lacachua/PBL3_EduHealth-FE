const renderProgress = (value = 0) => {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="mt-2.5">
      <div className="h-2 rounded-full bg-outline-variant/70">
        <div
          className="h-full rounded-full bg-info transition-[width,background-color] duration-300"
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
        return (
          <article key={card.id} className="app-kpi-card rounded-xl">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="app-kpi-label">{card.title}</p>
                <p className={`app-kpi-value ${card.valueClassName || 'text-on-surface'}`}>
                  {card.value}
                </p>
              </div>
              <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${card.chipClassName || 'border-outline-variant bg-surface-container-low text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-[17px]">{card.icon || 'analytics'}</span>
              </span>
            </div>

            <p className="mt-1.5 text-[12px] leading-[1.2rem] text-on-surface-variant">{card.hint || '--'}</p>

            {typeof card.progress === 'number' ? renderProgress(card.progress) : null}
          </article>
        );
      })}
    </section>
  );
};

export default NurseReportsSummaryCards;
