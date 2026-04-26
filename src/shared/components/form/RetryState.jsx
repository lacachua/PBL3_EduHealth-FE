import React from 'react';

const RetryState = ({ title, description, onRetry, retryLabel = 'Thử lại' }) => (
  <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5 text-center">
    <h4 className="text-base font-semibold text-on-surface">{title}</h4>
    <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-3 rounded-md border border-outline-variant bg-surface-container-low px-3 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container"
    >
      {retryLabel}
    </button>
  </div>
);

export default RetryState;
