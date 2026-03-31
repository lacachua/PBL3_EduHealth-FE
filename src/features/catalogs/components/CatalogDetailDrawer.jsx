import React from 'react';
import RightDrawer from '../../../shared/components/admin/RightDrawer';
import StatusBadge from '../../../shared/components/admin/StatusBadge';

const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-outline-variant py-2.5 last:border-b-0">
    <p className="text-xs font-semibold uppercase tracking-[0.04em] text-on-surface-variant">{label}</p>
    <p className="text-sm text-on-surface">{value || '--'}</p>
  </div>
);

const CatalogDetailDrawer = ({ open, item, loading, error, onClose }) => (
  <RightDrawer
    open={open}
    onClose={onClose}
    title="Chi tiết danh mục"
    subtitle={item ? `Mã: ${item.code || item.id}` : 'Đang tải dữ liệu'}
    widthClass="max-w-[620px]"
    footer={(
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-outline-variant px-3.5 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface"
        >
          Đóng
        </button>
      </div>
    )}
  >
    {loading ? <p className="text-sm text-on-surface-variant">Đang tải chi tiết danh mục...</p> : null}
    {error ? <p className="rounded-lg border border-warning/25 bg-warning-soft px-3 py-2 text-sm text-warning">{error}</p> : null}

    {!loading && item ? (
      <div className="space-y-1">
        <DetailRow label="Mã danh mục" value={item.code} />
        <DetailRow label="Tên danh mục" value={item.name} />
        <DetailRow label="Mô tả" value={item.description} />
        <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-outline-variant py-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.04em] text-on-surface-variant">Trạng thái</p>
          <div>
            <StatusBadge tone={item.statusTone}>{item.statusLabel}</StatusBadge>
          </div>
        </div>
        <DetailRow label="Ngày tạo" value={item.createdAt} />
        <DetailRow label="Cập nhật gần nhất" value={item.updatedAt} />
        <DetailRow label="Metadata" value={item.metadata ? JSON.stringify(item.metadata) : '--'} />
      </div>
    ) : null}
  </RightDrawer>
);

export default CatalogDetailDrawer;
