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

const toSafeNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const Pagination = ({ page, pageSize, totalItems, onPageChange, compact = false }) => {
  const safePageSize = Math.max(1, toSafeNumber(pageSize, 1));
  const safeTotalItems = Math.max(0, toSafeNumber(totalItems, 0));
  const totalPages = Math.max(1, Math.ceil(safeTotalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, toSafeNumber(page, 1)), totalPages);
  const pageTokens = buildPageTokens(currentPage, totalPages);

  const emitPageChange = (nextPage) => {
    if (typeof onPageChange !== 'function') return;
    const targetPage = Math.min(Math.max(1, nextPage), totalPages);
    if (targetPage === currentPage) return;
    onPageChange(targetPage);
  };

  const rootClassName = compact
    ? 'flex flex-col items-center justify-between gap-2 text-xs text-on-surface-variant sm:flex-row'
    : 'mt-3 flex flex-col items-center justify-between gap-3 text-xs text-on-surface-variant sm:flex-row';

  const buttonClassName = compact
    ? 'rounded-md border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 text-[12px] font-semibold text-on-surface-variant transition-[background-color,border-color,color,box-shadow] duration-150 ease-out hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 text-[12px] font-semibold text-on-surface-variant transition-[background-color,border-color,color,box-shadow] duration-150 ease-out hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-40';

  const pageButtonClassName = compact
    ? 'min-w-[26px] rounded-md px-1.5 py-1 text-[12px] font-semibold transition-[background-color,border-color,color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-primary/15'
    : 'min-w-[30px] rounded-md px-2 py-1.5 text-[12px] font-semibold transition-[background-color,border-color,color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-primary/15';

  return (
    <div className={rootClassName}>
      <span>
        Trang <span className="font-semibold text-on-surface">{currentPage}</span>/{totalPages} • Tổng <span className="font-semibold text-on-surface">{safeTotalItems}</span> bản ghi
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => emitPageChange(currentPage - 1)}
          className={buttonClassName}
        >
          Trước
        </button>

        <div className="hidden sm:flex items-center gap-1 mx-1">
          {pageTokens.map((token) => {
            if (typeof token !== 'number') {
              return (
                <span key={token} className="px-1 text-[12px] text-on-surface-muted">
                  ...
                </span>
              );
            }

            const isActive = token === currentPage;
            return (
              <button
                key={token}
                type="button"
                onClick={() => emitPageChange(token)}
                className={`${pageButtonClassName} ${isActive
                    ? 'border border-primary/25 bg-primary-soft text-primary'
                    : 'border border-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
              >
                {token}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => emitPageChange(currentPage + 1)}
          className={buttonClassName}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default Pagination;
