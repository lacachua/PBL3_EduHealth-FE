import React from 'react';

const PageHeader = ({ title, description, actions }) => {
  return (
    <header className="app-card-shell rounded-xl px-4 py-3.5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="app-page-title">{title}</h1>
          {description ? <p className="app-body-text mt-1">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
};

export default PageHeader;
