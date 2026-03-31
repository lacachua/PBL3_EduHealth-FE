import React from 'react';

const SystemLogEmptyState = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-t border-border-soft">
      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <span className="material-symbols-outlined text-2xl text-supporting">search_off</span>
      </div>
      <h3 className="text-sm font-medium text-heading">Không tìm thấy dữ liệu phù hợp</h3>
      <p className="text-xs text-supporting mt-1 max-w-[250px]">
        Thử thay đổi bộ lọc hoặc thời gian để xem các nhật ký khác.
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
          Xoá bộ lọc
        </button>
      )}
    </div>
  );
};

export default SystemLogEmptyState;
