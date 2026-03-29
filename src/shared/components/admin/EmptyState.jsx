import React from 'react';

const EmptyState = ({ title = 'Chưa có dữ liệu', description = 'Dữ liệu sẽ hiển thị sau khi hệ thống đồng bộ.' }) => (
  <div className="rounded-lg border border-dashed border-outline-variant bg-surface px-4 py-6 text-center">
    <p className="text-sm font-semibold text-on-surface">{title}</p>
    <p className="mt-1 text-xs text-on-surface-variant">{description}</p>
  </div>
);

export default EmptyState;
