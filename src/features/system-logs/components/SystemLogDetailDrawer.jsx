import RightDrawer from '../../../shared/components/core/RightDrawer';

const formatFullDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN', { hour12: false });
};

const MinimalRow = ({ label, value, subtext }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted">{label}</p>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-on-surface">{value || '--'}</span>
      {subtext && <span className="mt-0.5 text-xs text-on-surface-variant">{subtext}</span>}
    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="mb-4 flex items-center">
    <h4 className="text-sm font-bold text-on-surface-variant">{title}</h4>
    <div className="ml-4 flex-1 border-t border-outline-variant/70"></div>
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

const SystemLogDetailDrawer = ({ log, open, loading, error, onClose }) => {
  if (!log && !loading) return null;

  const metadataEntries = log?.metadata && typeof log.metadata === 'object'
    ? Object.entries(log.metadata)
    : [];
  const statusClassName = log?.statusTone === 'success'
    ? 'border border-success/20 bg-success-soft text-success'
    : log?.statusTone === 'warning'
      ? 'border border-warning/25 bg-warning-soft text-warning'
      : log?.statusTone === 'info'
        ? 'border border-secondary/20 bg-secondary-container text-secondary'
        : log?.statusTone === 'neutral'
          ? 'border border-outline-variant bg-surface-container-high text-on-surface-variant'
          : 'border border-danger/20 bg-danger-soft text-danger';

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title="Chi tiết nhật ký"
      subtitle={log ? `Mã nhật ký: ${log.id}` : 'Đang tải...'}
      widthClass="max-w-[640px]"
    >
      <div className="flex flex-col gap-8 p-6 text-on-surface-variant">

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
              <p className="text-sm text-on-surface-variant">Đang tải chi tiết nhật ký...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-warning/25 bg-warning-soft px-4 py-3">
            <p className="text-sm text-warning">{error}</p>
          </div>
        )}

        {!loading && log && (
          <>
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
              <div className="rounded-xl border border-outline-variant/80 bg-surface-container-low p-5">
                <p className="whitespace-pre-wrap text-sm leading-loose text-on-surface-variant">
                  {log.description}
                </p>

                {metadataEntries.length ? (
                  <div className="mt-4 space-y-2 border-t border-outline-variant pt-3">
                    {metadataEntries.map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-3">
                        <p className="w-[160px] text-xs font-semibold text-on-surface-muted">{prettyMetadataLabel(key)}</p>
                        <p className="text-xs text-on-surface-variant">{renderMetadataValue(value)}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          </>
        )}

      </div>
    </RightDrawer>
  );
};

export default SystemLogDetailDrawer;
