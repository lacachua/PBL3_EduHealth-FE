const MessagingHeader = ({ title = 'Tin nhắn', description, actions, tone = 'default' }) => {
  const shellClass = tone === 'nurse' ? 'app-banner-soft app-page-hero' : 'app-card-shell app-page-hero';
  const titleClass = tone === 'nurse' ? 'app-page-title app-page-title-nurse' : 'app-page-title';

  return (
    <header className={shellClass}>
      <div className="flex h-full flex-col gap-2.5 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className={titleClass}>{title}</h1>
          {description ? <p className="app-body-text mt-0.5 max-w-3xl">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
};

export default MessagingHeader;
