import React from 'react';

const MedicinesEmptyState = () => (
  <div className="rounded-lg border border-dashed border-outline-variant bg-surface px-4 py-7 text-center">
    <span className="material-symbols-outlined text-[28px] text-on-surface-variant/70">medication</span>
    <p className="mt-2 text-sm font-semibold text-on-surface">Không tìm thấy thuốc phù hợp</p>
    <p className="mt-1 text-xs text-on-surface-variant">Dữ liệu thuốc sẽ hiển thị khi có bản ghi phù hợp với bộ lọc hiện tại.</p>
  </div>
);

export default MedicinesEmptyState;
