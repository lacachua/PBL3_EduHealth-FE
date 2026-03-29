import React from 'react';
import AdminAsyncState from './AdminAsyncState';
import Pagination from './Pagination';

const AdminManagementListSection = ({
  sectionClassName,
  panelClassName,
  borderClassName,
  filters,
  summary,
  status,
  error,
  onRetry,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  table,
  pagination,
}) => {
  return (
    <section className={sectionClassName}>
      <div className={panelClassName}>
        {filters}
        {summary ? <p className="mt-2 text-xs">{summary}</p> : null}
      </div>

      <AdminAsyncState
        status={status}
        error={error}
        onRetry={onRetry}
        loadingLabel={loadingLabel}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <>
          {table}
          {pagination ? (
            <div className={borderClassName}>
              <Pagination
                page={pagination.page}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalItems}
                onPageChange={pagination.onPageChange}
              />
            </div>
          ) : null}
        </>
      </AdminAsyncState>
    </section>
  );
};

export default AdminManagementListSection;