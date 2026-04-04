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
    <section className={className || 'rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)]'}>
      {(title || actions) && (
        <div className={headerClassName || 'mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between'}>
          <div>
            {title ? <h2 className={titleClassName || 'font-headline text-lg font-semibold text-on-surface'}>{title}</h2> : null}
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
