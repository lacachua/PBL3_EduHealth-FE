
const PageHeader = ({ title, description, actions }) => {
  return (
    <header className="app-card-shell app-page-hero">
      <div className="flex h-full flex-col gap-2.5 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="app-page-title">{title}</h1>
          {description ? <p className="app-body-text mt-0.5 max-w-3xl">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
};

export default PageHeader;
