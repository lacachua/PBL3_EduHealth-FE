import React from 'react';

const Pagination = ({ page, pageSize, totalItems, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-on-surface-variant">
      <span>
        Trang {page}/{totalPages} • Tổng {totalItems} bản ghi
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded border border-outline-variant px-2 py-1 font-semibold disabled:opacity-40"
        >
          Trước
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded border border-outline-variant px-2 py-1 font-semibold disabled:opacity-40"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default Pagination;
