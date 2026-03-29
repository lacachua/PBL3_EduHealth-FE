import React from 'react';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import LoadingSpinner from './LoadingSpinner';

const AdminAsyncState = ({
  status,
  error,
  onRetry,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  containerClassName = 'px-4 py-6 md:px-5',
  children,
}) => {
  if (status === 'loading') {
    return (
      <div className={containerClassName}>
        <LoadingSpinner label={loadingLabel} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={containerClassName}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className={containerClassName}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  if (status === 'success') {
    return children || null;
  }

  return null;
};

export default AdminAsyncState;