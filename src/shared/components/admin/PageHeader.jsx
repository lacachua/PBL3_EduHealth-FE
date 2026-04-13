import React from 'react';

const PageHeader = ({ title, description, actions }) => {
  return (
    <header className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3.5 shadow-[var(--fd-shadow-card)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-headline text-[1.42rem] font-bold leading-tight tracking-[-0.01em] text-on-surface md:text-[1.54rem]">{title}</h1>
          {description ? <p className="mt-1 text-[13px] font-medium text-on-surface-variant md:text-[14px]">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
};

export default PageHeader;
