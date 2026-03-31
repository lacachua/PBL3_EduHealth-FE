import React from 'react';
import RightDrawer from '../../../shared/components/admin/RightDrawer';

const formatFullDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN', { hour12: false });
};

const MinimalRow = ({ label, value, subtext }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-slate-800">{value || '--'}</span>
      {subtext && <span className="text-xs text-slate-500 mt-0.5">{subtext}</span>}
    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="mb-4 flex items-center">
    <h4 className="text-sm font-bold text-slate-700">{title}</h4>
    <div className="ml-4 flex-1 border-t border-slate-100"></div>
  </div>
);

const SystemLogDetailDrawer = ({ log, open, onClose }) => {
  if (!log) return null;

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title="Chi tiết nhật ký"
      subtitle={`ID: ${log.id}`}
      widthClass="max-w-[640px]"
    >
      <div className="p-6 text-slate-700 flex flex-col gap-8">
        
        {/* Status */}
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Trạng thái hệ thống:</p>
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${log.statusTone === 'success' ? 'bg-emerald-100 text-emerald-800' : log.statusTone === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
            {log.statusLabel}
          </span>
        </div>

        {/* Basic Info */}
        <section>
          <SectionHeader title="Thông tin cơ bản" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <MinimalRow label="Thời gian" value={formatFullDateTime(log.occurredAt)} />
            <MinimalRow 
              label="Người thực hiện" 
              value={log.actorName} 
              subtext={log.actorUsername ? `@${log.actorUsername}` : null}
            />
            <MinimalRow label="Vai trò" value={log.roleLabel} />
            <MinimalRow label="Hành động" value={log.actionLabel} />
          </div>
        </section>

        {/* Business Operation */}
        <section>
          <SectionHeader title="Nghiệp vụ thực hiện" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <MinimalRow label="Phân hệ / Module" value={log.moduleLabel} />
            <MinimalRow 
              label="Đối tượng" 
              value={log.targetName || log.targetTypeLabel} 
              subtext={log.targetName ? log.targetTypeLabel : null} 
            />
          </div>
        </section>

        {/* Detailed Content */}
        <section>
          <SectionHeader title="Nội dung chi tiết" />
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
            <p className="text-sm leading-loose text-slate-700 whitespace-pre-wrap">
              {log.detail || log.message}
            </p>
          </div>
        </section>

      </div>
    </RightDrawer>
  );
};

export default SystemLogDetailDrawer;
