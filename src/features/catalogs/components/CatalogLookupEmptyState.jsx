import React from 'react';

const CatalogLookupEmptyState = () => (
  <div className="rounded-lg border border-dashed border-outline-variant bg-surface px-4 py-7 text-center">
    <span className="material-symbols-outlined text-[28px] text-on-surface-variant/70">dataset</span>
    <p className="mt-2 text-sm font-semibold text-on-surface">Không tìm thấy dữ liệu phù hợp</p>
    <p className="mt-1 text-xs text-on-surface-variant">Chưa có dữ liệu phù hợp với bộ lọc hiện tại.</p>
  </div>
);

export default CatalogLookupEmptyState;
