import AdminAsyncState from '../core/AsyncState';
import Pagination from '../core/Pagination';

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
    <section className={sectionClassName || 'app-panel-shell space-y-3 p-4 md:p-5'}>
      <div className={panelClassName}>
        {filters}
        {summary ? <div className="app-table-summary rounded-xl px-3 py-2 text-[11px] mt-3">{summary}</div> : null}
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
            <div className={borderClassName || 'pt-2'}>
              <Pagination
                page={pagination.page}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalItems}
                totalPages={pagination.totalPages}
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
