import Pagination from '../../../../shared/components/core/Pagination';
import { MOVEMENT_TYPE_OPTIONS } from '../../constants/nurseMedicineConstants';
import { useState } from 'react';

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
  const [localFilters, setLocalFilters] = useState(filters);
  const [dateError, setDateError] = useState('');

  const handleFilterChange = (key, value) => {
    const nextFilters = { ...localFilters, [key]: value };
    setLocalFilters(nextFilters);

    if (nextFilters.fromDate && nextFilters.toDate && nextFilters.fromDate > nextFilters.toDate) {
      setDateError('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
      return;
    }

    if (nextFilters.fromDate && new Date(nextFilters.fromDate).getFullYear() < 1000) {
      setDateError('Ngày bắt đầu không hợp lệ.');
      return;
    }

    if (nextFilters.toDate && new Date(nextFilters.toDate).getFullYear() < 1000) {
      setDateError('Ngày kết thúc không hợp lệ.');
      return;
    }

    setDateError('');
    onFiltersChange(nextFilters);
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2" data-row-click-stop="true">
        <select
          value={localFilters.type}
          onChange={(event) => handleFilterChange('type', event.target.value)}
          className="app-focus-ring app-input rounded-lg px-3 py-2 text-xs"
          aria-label="Lọc loại biến động"
        >
          {MOVEMENT_TYPE_OPTIONS.map((option) => (
            <option key={option.value || 'all'} value={option.value}>{option.label}</option>
          ))}
        </select>

        <input
          type="date"
          value={localFilters.fromDate}
          onChange={(event) => handleFilterChange('fromDate', event.target.value)}
          className="app-focus-ring app-input rounded-lg px-3 py-2 text-xs"
          aria-label="Từ ngày"
        />

        <input
          type="date"
          value={localFilters.toDate}
          onChange={(event) => handleFilterChange('toDate', event.target.value)}
          className="app-focus-ring app-input rounded-lg px-3 py-2 text-xs"
          aria-label="Đến ngày"
        />
      </div>

      {dateError ? <p className="text-xs font-medium text-danger">{dateError}</p> : null}

      {loading ? <p className="text-sm text-on-surface-variant">Đang tải lịch sử biến động...</p> : null}
      {!loading && error ? <p className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p> : null}

      {!loading && !error && !dateError ? (
        <div className="space-y-3">
          {!rows.length ? (
            <p className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-5 text-center text-sm text-on-surface-variant">
              Chưa có biến động kho.
            </p>
          ) : (
            rows.map((item) => (
              <article key={item.movementId} className="rounded-xl border border-outline-variant bg-surface p-3 transition hover:bg-surface-container-low">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.typeBadgeClass}`}>
                        {item.typeLabel}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">Mã: {item.movementId}</span>
                      <span className="text-[10px] text-on-surface-muted">• {item.createdAtLabel}</span>
                    </div>
                    
                    <p className="text-sm text-on-surface">
                      <span className="font-medium text-on-surface-variant">Thực hiện bởi:</span> {item.createdByName || 'Hệ thống'}
                    </p>
                    
                    {(item.batchNumber || item.expiryDateLabel) && (
                      <p className="text-sm text-on-surface-variant">
                        Số lô: {item.batchNumber || '---'} • Hạn dùng: {item.expiryDateLabel || '---'}
                      </p>
                    )}
                    
                    <p className="text-sm text-on-surface">
                      <span className="font-medium text-on-surface-variant">Ghi chú:</span> {item.reasonLabel}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-bold ${item.quantityClassName}`}>{item.quantityLabel}</p>
                    <p className="mt-0.5 text-[11px] text-on-surface-variant">
                      Tồn kho: {item.stockBefore} → {item.stockAfter}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}

      {!loading && !error && !dateError && totalItems > pageSize ? (
        <Pagination page={page} pageSize={pageSize} totalItems={totalItems} onPageChange={onPageChange} compact />
      ) : null}
    </section>
  );
};

export default MedicineMovementTable;
