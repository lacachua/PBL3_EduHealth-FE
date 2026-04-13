import React from 'react';

const SystemLogEmptyState = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center border-t border-outline-variant px-4 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high">
        <span className="material-symbols-outlined text-2xl text-on-surface-muted">search_off</span>
      </div>
      <h3 className="text-sm font-medium text-on-surface">Không tìm thấy dữ liệu phù hợp</h3>
      <p className="mt-1 max-w-[250px] text-xs text-on-surface-variant">
        Thử thay đổi bộ lọc hoặc thời gian để xem các nhật ký khác.
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
          Xoá bộ lọc
        </button>
      )}
    </div>
  );
};

export default SystemLogEmptyState;
