import React from 'react';

const SectionCard = ({
  title,
  subtitle,
  actions,
  children,
  className,
  headerClassName,
  titleClassName,
  subtitleClassName,
  actionsClassName,
}) => {
  return (
    <section className={className || 'rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--fd-shadow-card)]'}>
      {(title || actions) && (
        <div className={headerClassName || 'mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between'}>
          <div>
            {title ? <h2 className={titleClassName || 'font-headline text-[1.02rem] font-semibold text-on-surface'}>{title}</h2> : null}
            {subtitle ? <p className={subtitleClassName || 'mt-0.5 text-xs text-on-surface-variant'}>{subtitle}</p> : null}
          </div>
          {actions ? <div className={actionsClassName || 'flex items-center gap-2'}>{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
};

export default SectionCard;
