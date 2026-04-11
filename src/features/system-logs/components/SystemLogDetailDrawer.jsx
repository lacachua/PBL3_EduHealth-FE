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

const prettyMetadataLabel = (key = '') => {
  const dictionary = {
    createdBy: 'Người khởi tạo',
    reason: 'Lý do',
    source: 'Nguồn dữ liệu',
    previousStatus: 'Trạng thái trước',
    currentStatus: 'Trạng thái sau',
    vaccineName: 'Tên vắc xin',
    examinationCode: 'Mã phiếu khám',
    quantityIn: 'Số lượng nhập',
    syncBatch: 'Lô đồng bộ',
  };

  return dictionary[key] || key;
};

const renderMetadataValue = (value) => {
  if (value === null || value === undefined || value === '') return '--';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const SystemLogDetailDrawer = ({ log, open, onClose }) => {
  if (!log) return null;

  const metadataEntries = log.metadata && typeof log.metadata === 'object'
    ? Object.entries(log.metadata)
    : [];
  const statusClassName = log.statusTone === 'success'
    ? 'bg-emerald-100 text-emerald-800'
    : log.statusTone === 'warning'
      ? 'bg-amber-100 text-amber-800'
      : log.statusTone === 'info'
        ? 'bg-sky-100 text-sky-800'
        : log.statusTone === 'neutral'
          ? 'bg-slate-100 text-slate-700'
          : 'bg-red-100 text-red-800';

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title="Chi tiết nhật ký"
      subtitle={`Mã nhật ký: ${log.id}`}
      widthClass="max-w-[640px]"
    >
      <div className="p-6 text-slate-700 flex flex-col gap-8">

        <section>
          <SectionHeader title="Trạng thái hệ thống" />
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${statusClassName}`}>
            {log.statusLabel}
          </span>
        </section>

        <section>
          <SectionHeader title="Thông tin cơ bản" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <MinimalRow label="Thời gian" value={formatFullDateTime(log.createdAt)} />
            <MinimalRow 
              label="Người thực hiện" 
              value={log.actorName} 
              subtext={log.actorUsername ? `@${log.actorUsername}` : null}
            />
            <MinimalRow label="Vai trò" value={log.roleLabel} />
            <MinimalRow label="Hành động" value={log.actionLabel} />
          </div>
        </section>

        <section>
          <SectionHeader title="Nghiệp vụ thực hiện" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <MinimalRow label="Phân hệ / Module" value={log.moduleLabel} />
            <MinimalRow 
              label="Đối tượng" 
              value={log.targetLabel || log.targetTypeLabel} 
              subtext={log.targetTypeLabel} 
            />
            <MinimalRow label="Mã đối tượng" value={log.targetId} />
          </div>
        </section>

        <section>
          <SectionHeader title="Nội dung chi tiết" />
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
            <p className="text-sm leading-loose text-slate-700 whitespace-pre-wrap">
              {log.description}
            </p>

            {metadataEntries.length ? (
              <div className="mt-4 space-y-2 border-t border-slate-200 pt-3">
                {metadataEntries.map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-3">
                    <p className="w-[160px] text-xs font-semibold text-slate-500">{prettyMetadataLabel(key)}</p>
                    <p className="text-xs text-slate-700">{renderMetadataValue(value)}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

      </div>
    </RightDrawer>
  );
};

export default SystemLogDetailDrawer;
