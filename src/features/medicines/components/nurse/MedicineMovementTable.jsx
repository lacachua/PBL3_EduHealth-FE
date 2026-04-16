import React from 'react';
import Pagination from '../../../../shared/components/admin/Pagination';
import { MOVEMENT_TYPE_OPTIONS } from '../../constants/nurseMedicineConstants';

const MedicineMovementTable = ({
  rows,
  loading,
  error,
  page,
  pageSize,
  totalItems,
  onPageChange,
  filters,
  onFiltersChange,
}) => {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2">
        <select
          value={filters.type}
          onChange={(event) => onFiltersChange({ ...filters, type: event.target.value })}
          className="app-focus-ring app-input rounded-lg px-3 py-2 text-xs"
          aria-label="Lọc loại biến động"
        >
          {MOVEMENT_TYPE_OPTIONS.map((option) => (
            <option key={option.value || 'all'} value={option.value}>{option.label}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.fromDate}
          onChange={(event) => onFiltersChange({ ...filters, fromDate: event.target.value })}
          className="app-focus-ring app-input rounded-lg px-3 py-2 text-xs"
          aria-label="Từ ngày"
        />

        <input
          type="date"
          value={filters.toDate}
          onChange={(event) => onFiltersChange({ ...filters, toDate: event.target.value })}
          className="app-focus-ring app-input rounded-lg px-3 py-2 text-xs"
          aria-label="Đến ngày"
        />
      </div>

      {loading ? <p className="text-sm text-on-surface-variant">Đang tải lịch sử biến động...</p> : null}
      {error ? <p className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p> : null}

      {!loading ? (
        <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="app-table-head text-[11px] uppercase tracking-[0.08em]">
              <tr>
                <th className="px-3 py-2.5">Mã biến động</th>
                <th className="px-3 py-2.5">Loại</th>
                <th className="px-3 py-2.5 text-right">Số lượng</th>
                <th className="px-3 py-2.5 text-right">Tồn trước/sau</th>
                <th className="px-3 py-2.5">Số lô / Hạn dùng</th>
                <th className="px-3 py-2.5">Lý do</th>
                <th className="px-3 py-2.5">Thực hiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {!rows.length ? (
                <tr>
                  <td className="px-3 py-5 text-center text-sm text-on-surface-variant" colSpan={7}>
                    Chưa có biến động kho.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.movementId} className="app-interactive hover:bg-surface-container-low">
                    <td className="px-3 py-2.5 font-mono text-xs text-on-surface-variant">{item.movementId}</td>
                    <td className="px-3 py-2.5 text-on-surface">
                      <span className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-semibold ${item.typeBadgeClass}`}>
                        {item.typeLabel}
                      </span>
                    </td>
                    <td className={`px-3 py-2.5 text-right font-semibold ${item.quantityClassName}`}>{item.quantityLabel}</td>
                    <td className="px-3 py-2.5 text-right text-on-surface">{item.stockBefore} / {item.stockAfter}</td>
                    <td className="px-3 py-2.5 text-on-surface-variant">
                      <p className="leading-tight">{item.batchNumber || '--'}</p>
                      <p className="mt-0.5 text-xs text-on-surface-muted">{item.expiryDateLabel}</p>
                    </td>
                    <td className="px-3 py-2.5 text-on-surface-variant">{item.reasonLabel || '--'}</td>
                    <td className="px-3 py-2.5 text-on-surface-variant">
                      <p className="leading-tight text-on-surface">{item.createdByName}</p>
                      <p className="mt-0.5 text-xs text-on-surface-muted">{item.createdAtLabel}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {totalItems > pageSize ? (
        <Pagination page={page} pageSize={pageSize} totalItems={totalItems} onPageChange={onPageChange} compact />
      ) : null}
    </section>
  );
};

export default MedicineMovementTable;
