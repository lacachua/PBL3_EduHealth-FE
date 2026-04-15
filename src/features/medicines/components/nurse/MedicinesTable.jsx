import React from 'react';

const MedicinesTable = ({ rows, loading, error, onRetry, onView }) => {
  if (loading) {
    return <p className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-4 text-sm text-[#64748B]">Đang tải danh mục thuốc...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
        <p>{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg border border-[#FCA5A5] px-2.5 py-1 text-xs font-semibold text-[#B91C1C]"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white [scrollbar-width:thin]">
      <table className="min-w-[1120px] w-full text-left text-sm">
        <thead className="nurse-table-head-strong text-[11px] uppercase tracking-[0.08em]">
          <tr>
            <th className="px-4 py-3">Mã thuốc</th>
            <th className="px-4 py-3">Tên thuốc</th>
            <th className="px-4 py-3">Hoạt chất</th>
            <th className="px-4 py-3">Đơn vị</th>
            <th className="px-4 py-3">Quy cách</th>
            <th className="px-4 py-3 text-right">Tồn kho</th>
            <th className="px-4 py-3">Hạn gần nhất</th>
            <th className="px-4 py-3 text-right">Mức cảnh báo</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3">Cảnh báo</th>
            <th className="px-4 py-3 text-right">Chi tiết</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#E2E8F0]">
          {!rows.length ? (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-[#64748B]" colSpan={11}>
                Không tìm thấy thuốc theo bộ lọc hiện tại.
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr
                key={item.id}
                className="group cursor-pointer hover:bg-[#F8FAFC]"
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
                <td className="px-4 py-3 font-mono text-xs text-[#475569]">{item.id}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onView(item);
                    }}
                    className="nurse-focus-ring text-left text-sm font-semibold text-[#0F172A] transition group-hover:text-[#166534] hover:text-[#166534]"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-[#334155]" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {item.activeIngredient || '--'}
                </td>
                <td className="px-4 py-3 text-[#334155]">{item.unitLabel}</td>
                <td className="px-4 py-3 text-[#334155]" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {item.packaging || '--'}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-[#0F172A]">{item.currentStock}</td>
                <td className="px-4 py-3 text-[#334155]">{item.nearestExpiryDateLabel}</td>
                <td className="px-4 py-3 text-right text-[#334155]">{item.warningThreshold}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${item.statusBadgeClass}`}>
                    {item.statusLabel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${item.alertBadgeClass}`}>
                    {item.alertLabel}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onView(item)}
                      className="nurse-focus-ring rounded-lg border border-[#D1FAE5] bg-[#ECFDF3] px-2.5 py-1.5 text-xs font-semibold text-[#166534]"
                    >
                      Mở chi tiết
                    </button>
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
