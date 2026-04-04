import React from 'react';

const buildPageTokens = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const tokens = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    tokens.push('ellipsis-left');
  }

  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    tokens.push(pageNumber);
  }

  if (end < totalPages - 1) {
    tokens.push('ellipsis-right');
  }

  tokens.push(totalPages);
  return tokens;
};

const Pagination = ({ page, pageSize, totalItems, onPageChange, compact = false }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageTokens = buildPageTokens(page, totalPages);

  const rootClassName = compact
    ? 'flex flex-col items-center justify-between gap-2 text-[11px] text-slate-500 sm:flex-row'
    : 'mt-3 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row';

  const buttonClassName = compact
    ? 'nurse-focus-ring rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 transition-[background-color,border-color,color,box-shadow] duration-150 ease-out hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
    : 'nurse-focus-ring rounded border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-600 transition-[background-color,border-color,color,box-shadow] duration-150 ease-out hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40';

  const pageButtonClassName = compact
    ? 'nurse-focus-ring min-w-[24px] rounded px-1.5 py-1 text-[11px] font-medium transition-[background-color,border-color,color,box-shadow] duration-150 ease-out'
    : 'nurse-focus-ring min-w-[28px] rounded px-2 py-1.5 font-medium transition-[background-color,border-color,color,box-shadow] duration-150 ease-out';

  return (
    <div className={rootClassName}>
      <span>
        Trang <span className="font-semibold text-slate-700">{page}</span>/{totalPages} • Tổng <span className="font-semibold text-slate-700">{totalItems}</span> bản ghi
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={buttonClassName}
        >
          Trước
        </button>

        <div className="hidden sm:flex items-center gap-1 mx-1">
          {pageTokens.map((token) => {
            if (typeof token !== 'number') {
              return (
                <span key={token} className="px-1 text-[11px] text-slate-400">
                  ...
                </span>
              );
            }

            const isActive = token === page;
            return (
              <button
                key={token}
                type="button"
                onClick={() => onPageChange(token)}
                className={`${pageButtonClassName} ${
                  isActive
                    ? 'border border-[#D1FAE5] bg-[#DCFCE7] text-[#166534]'
                    : 'border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {token}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={buttonClassName}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default Pagination;
