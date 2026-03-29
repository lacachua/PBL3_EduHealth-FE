import React from 'react';

const ErrorState = ({ message = 'Không thể tải dữ liệu.', onRetry }) => (
  <div className="rounded-lg border border-danger/25 bg-danger-soft px-4 py-4">
    <p className="text-sm font-semibold text-danger">Lỗi tải dữ liệu</p>
    <p className="mt-1 text-xs text-danger/90">{message}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 inline-flex items-center rounded-md border border-danger/25 bg-surface px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger-soft"
      >
        Thử lại
      </button>
    ) : null}
  </div>
);

export default ErrorState;
