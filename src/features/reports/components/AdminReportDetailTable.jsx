import React from 'react';

const riskPillClassMap = {
  danger: 'border border-danger/25 bg-danger-soft text-danger',
  warning: 'border border-warning/30 bg-warning-soft text-warning',
  success: 'border border-success/20 bg-success-soft text-success',
};

const riskAccentClassMap = {
  danger: 'bg-danger',
  warning: 'bg-warning',
  success: 'bg-success',
};

const rowHoverClassMap = {
  danger: 'hover:bg-danger-soft/25',
  warning: 'hover:bg-warning-soft/25',
  default: 'hover:bg-surface',
};

const riskLabelMap = {
  success: 'Ổn định',
  warning: 'Trung bình',
  danger: 'Rất cao',
};

const AdminReportDetailTable = ({ rows, onAnalyzeClass }) => {
  return (
    <section className="overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant/60 bg-surface px-6 py-4">
        <h4 className="text-base font-bold text-on-surface">Tổng hợp sức khỏe theo lớp</h4>
        <div className="text-xs font-medium text-on-surface-muted">Sắp xếp theo mức độ rủi ro</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface">
            <tr>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">Lớp</th>
              <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">Sĩ số</th>
              <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-success">Ổn định</th>
              <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-warning">Theo dõi</th>
              <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-danger">Nguy cơ cao</th>
              <th className="px-6 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">Mức độ rủi ro</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/60">
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`cursor-pointer transition-colors ${rowHoverClassMap[row.rowTone] || rowHoverClassMap.default}`}
                onClick={() => onAnalyzeClass(row.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onAnalyzeClass(row.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <td className="relative px-6 py-3.5 font-bold text-on-surface">
                  <span className={`absolute left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded ${riskAccentClassMap[row.riskTone] || riskAccentClassMap.success}`} />
                  {row.className}
                </td>
                <td className="px-4 py-3.5 text-center text-sm text-on-surface-variant">{row.classSize}</td>
                <td className="px-4 py-3.5 text-center text-sm font-semibold text-success">{row.stable}</td>
                <td className="px-4 py-3.5 text-center text-sm font-semibold text-warning">{row.followUp}</td>
                <td className="px-4 py-3.5 text-center text-sm font-semibold text-danger">{row.highRisk}</td>
                <td className="px-6 py-3.5 text-center">
                  <span className={`inline-flex whitespace-nowrap rounded-lg px-2.5 py-1 text-[10px] font-bold ${riskPillClassMap[row.riskTone]}`}>
                    {riskLabelMap[row.riskTone] || row.riskLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminReportDetailTable;
