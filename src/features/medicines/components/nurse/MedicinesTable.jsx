import React from 'react';

const MedicinesTable = ({ rows, loading, error, onRetry, onView }) => {
  if (loading) {
    return <p className="app-panel-shell px-3 py-4 text-sm text-on-surface-variant">Đang tải danh mục thuốc...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
        <p>{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="app-focus-ring mt-2 rounded-lg border border-danger/35 bg-surface px-2.5 py-1 text-xs font-semibold text-danger"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-outline-variant bg-surface [scrollbar-width:thin]">
      <table className="min-w-[840px] w-full text-left text-sm">
        <thead className="app-table-head text-[11px] uppercase tracking-[0.08em]">
          <tr>
            <th className="w-[12%] px-4 py-3">Mã thuốc</th>
            <th className="w-[30%] px-4 py-3">Thuốc & Hoạt chất</th>
            <th className="w-[14%] px-4 py-3">Quy cách</th>
            <th className="w-[12%] px-4 py-3 text-right">Tồn kho</th>
            <th className="w-[14%] px-4 py-3">Hạn gần nhất</th>
            <th className="w-[14%] px-4 py-3">Mức cảnh báo</th>
            <th className="w-[14%] px-4 py-3">Trạng thái</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant">
          {!rows.length ? (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-on-surface-variant" colSpan={7}>
                Không tìm thấy thuốc theo bộ lọc hiện tại.
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr
                key={item.id}
                className="group app-interactive cursor-pointer hover:bg-surface-container-low"
                onClick={() => onView(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onView(item);
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{item.id}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onView(item);
                    }}
                    className="app-focus-ring text-left text-sm font-semibold text-on-surface transition group-hover:text-primary hover:text-primary"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.name}
                  </button>
                  <p className="mt-0.5 text-xs text-on-surface-variant line-clamp-1" title={item.activeIngredient}>{item.activeIngredient || '--'}</p>
                </td>
                <td className="px-4 py-3 text-on-surface text-xs" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {item.packaging || '--'}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold text-on-surface">{item.currentStock}</span>
                  <span className="ml-1 text-xs text-on-surface-variant">{item.unitLabel}</span>
                </td>
                <td className="px-4 py-3 text-xs text-on-surface">{item.nearestExpiryDateLabel}</td>
                <td className="px-4 py-3 text-xs text-on-surface">{item.warningThreshold} {item.unitLabel}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.statusBadgeClass}`}>
                      {item.statusLabel}
                    </span>
                    {item.alertBadgeClass && !item.alertBadgeClass.includes('transparent') ? (
                      <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.alertBadgeClass}`}>
                        {item.alertLabel}
                      </span>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MedicinesTable;
