import React from 'react';

const roleToneClass = {
  admin: 'bg-emerald-100 text-emerald-800',
  nurse: 'bg-blue-100 text-blue-800',
  student: 'bg-amber-100 text-amber-800',
  system: 'bg-slate-200 text-slate-800',
};

const actionToneClass = {
  create: 'text-emerald-600',
  update: 'text-blue-600',
  delete: 'text-red-600',
  export: 'text-purple-600',
  sync: 'text-orange-600',
};

const formatDateParts = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { dateLabel: value, timeLabel: '' };
  const dateLabel = date.toLocaleDateString('vi-VN');
  const timeLabel = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return { dateLabel, timeLabel };
};

const SystemLogsTable = ({ rows, onSelect }) => {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-[#f8fafc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
          <tr>
            <th className="px-5 py-3.5 whitespace-nowrap">Thời gian</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Người dùng</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Vai trò</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Hành động</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Đối tượng</th>
            <th className="px-5 py-3.5">Chi tiết</th>
            <th className="px-5 py-3.5 text-center whitespace-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => {
            const { dateLabel, timeLabel } = formatDateParts(row.occurredAt);
            const roleClass = roleToneClass[row.actorRole] || 'bg-slate-100 text-slate-600';
            const actionClass = actionToneClass[row.actionCategory] || 'text-slate-600';

            return (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className="font-medium text-slate-800 text-[13px]">{dateLabel}</div>
                  <div className="text-[11px] text-slate-500">{timeLabel}</div>
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className="font-medium text-slate-800 text-[13px]">{row.actorName || '--'}</div>
                  {row.actorUsername && (
                    <div className="text-[11px] text-slate-500">@{row.actorUsername}</div>
                  )}
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <span className={`inline-flex rounded border border-transparent px-2.5 py-0.5 text-[10px] font-semibold ${roleClass}`}>
                    {row.roleLabel || '--'}
                  </span>
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className={`font-semibold text-[13px] ${actionClass}`}>{row.actionLabel || '--'}</div>
                  <div className="text-[11px] text-slate-500">{row.moduleLabel || '--'}</div>
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className="font-medium text-slate-800 text-[13px]">{row.targetName || row.targetTypeLabel || '--'}</div>
                  <div className="text-[11px] text-slate-500">{row.targetTypeLabel || '--'}</div>
                </td>
                <td className="px-5 py-3.5 align-middle max-w-[220px] 2xl:max-w-[320px] truncate text-[13px] text-slate-600" title={row.message}>
                  {row.message}
                </td>
                <td className="px-5 py-3.5 align-middle text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onSelect?.(row)}
                    className="inline-flex items-center text-xs font-semibold text-emerald-700 transition hover:text-emerald-900 hover:underline underline-offset-2"
                  >
                    Xem
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SystemLogsTable;
