import React from 'react';
import RightDrawer from '../../../shared/components/core/RightDrawer';
import StatusBadge from '../../../shared/components/core/StatusBadge';

const DetailRow = ({ label, value, children, isMultiline = false }) => (
  <div className="grid grid-cols-1 gap-1.5 border-b border-outline-variant py-2.5 last:border-b-0 sm:grid-cols-[148px_1fr] sm:gap-3">
    <p className="text-xs font-semibold text-on-surface-variant">{label}</p>
    <div className={`text-sm text-on-surface ${isMultiline ? 'leading-6' : ''}`}>
      {children || (value || '--')}
    </div>
  </div>
);

const CatalogDetailDrawer = ({ open, item, loading, error, onClose }) => (
  <RightDrawer
    open={open}
    onClose={onClose}
    title="Chi tiết danh mục"
    subtitle={item ? `${item.name || 'Bản ghi danh mục'} (${item.code || item.id || '--'})` : 'Đang tải dữ liệu'}
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
      <div className="space-y-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5">
        <DetailRow label="Mã danh mục" value={item.code} />
        <DetailRow label="Tên danh mục" value={item.name} />
        <DetailRow label="Mô tả" value={item.description} isMultiline />
        <DetailRow label="Trạng thái">
          <div>
            <StatusBadge tone={item.statusTone}>{item.statusLabel}</StatusBadge>
          </div>
        </DetailRow>
        <DetailRow label="Ngày tạo" value={item.createdAt} />
        <DetailRow label="Cập nhật gần nhất" value={item.updatedAt} />
      </div>
    ) : null}
  </RightDrawer>
);

export default CatalogDetailDrawer;
