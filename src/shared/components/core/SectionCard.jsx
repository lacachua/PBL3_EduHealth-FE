
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
    <section className={className || 'app-card-shell rounded-xl p-4'}>
      {(title || actions) && (
        <div className={headerClassName || 'mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between'}>
          <div>
            {title ? <h2 className={titleClassName || 'app-section-title'}>{title}</h2> : null}
            {subtitle ? <p className={subtitleClassName || 'app-meta-text mt-0.5'}>{subtitle}</p> : null}
          </div>
          {actions ? <div className={actionsClassName || 'flex items-center gap-2'}>{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
};

export default SectionCard;
