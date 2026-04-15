import React from 'react';

const NurseModulePageHeader = ({
  title,
  description,
  actions,
  children,
  className = '',
}) => {
  return (
    <header className={`nurse-banner-soft rounded-2xl px-4 py-3.5 shadow-[0_1px_4px_rgba(15,23,42,0.045)] sm:px-5 ${className}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-[1.5rem] font-extrabold leading-tight tracking-[-0.015em] text-on-surface sm:text-[1.66rem]">{title}</h1>
          {description ? <p className="mt-1 text-sm text-on-surface-variant">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>

      {children ? <div className="mt-3">{children}</div> : null}
    </header>
  );
};

export default NurseModulePageHeader;
