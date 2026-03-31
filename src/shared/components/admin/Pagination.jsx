import React from 'react';

const Pagination = ({ page, pageSize, totalItems, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
      <span>
        Trang <span className="font-semibold text-slate-700">{page}</span>/{totalPages} • Tổng <span className="font-semibold text-slate-700">{totalItems}</span> bản ghi
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        
        <div className="hidden sm:flex items-center gap-1 mx-1">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[28px] rounded px-2 py-1.5 font-medium transition-colors ${
                p === page
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default Pagination;
