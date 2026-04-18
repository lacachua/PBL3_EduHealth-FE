import React, { useEffect, useState } from 'react';

const urgencyToneClassMap = {
  danger: 'border border-danger/25 bg-danger-soft text-danger',
  warning: 'border border-warning/30 bg-warning-soft text-warning',
};

const analysisDotClassMap = {
  danger: 'bg-danger',
  warning: 'bg-warning',
  neutral: 'bg-on-surface-muted',
};

const vaccinationToneClassMap = {
  success: 'border border-success/25 bg-success-soft text-success',
  warning: 'border border-warning/30 bg-warning-soft text-warning',
  danger: 'border border-danger/25 bg-danger-soft text-danger',
};

const DrawerDistributionItem = ({ label, value, tone }) => {
  const toneClass = tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : 'text-danger';

  return (
    <div className="rounded-xl border border-outline-variant/60 bg-surface p-3">
      <div className="text-[10px] font-bold uppercase text-on-surface-muted">{label}</div>
      <div className={`text-xl font-black ${toneClass}`}>{value}</div>
    </div>
  );
};

const resolveRecipientCount = (target, stats) => {
  if (target === 'students') return Number(stats.students || 0);
  return Number(stats.students || 0);
};

const AdminReportDetailDrawer = ({
  isOpen,
  detail,
  directiveNote,
  onDirectiveChange,
  onClose,
  onSaveDirective,
  onSendNotification,
  saving = false,
  writeActionsDisabled = false,
  notificationActionsDisabled = false,
  directiveDisabledMessage = 'Chức năng ghi chú đang ở chế độ demo mock-only và tạm khóa thao tác ghi chờ BE chính thức.',
  notificationDisabledMessage = 'Chức năng gửi thông báo từ màn báo cáo tạm thời chưa mở API nên đang bị khóa.',
}) => {
  const [notificationDraft, setNotificationDraft] = useState('');
  const [recipientTarget, setRecipientTarget] = useState('students');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [sendResultMessage, setSendResultMessage] = useState('');

  useEffect(() => {
    if (!detail) return;
    setNotificationDraft('');
    setRecipientTarget('students');
    setIsConfirmOpen(false);
    setSendingNotification(false);
    setSendResultMessage('');
  }, [detail]);

  if (!detail) {
    return null;
  }

  const recipientStats = detail.recipientStats || {
    students: detail.studentCount || 0,
  };

  const recipientCount = resolveRecipientCount(recipientTarget, recipientStats);
  const disableDirectiveWrites = Boolean(writeActionsDisabled);
  const disableNotificationWrites = Boolean(notificationActionsDisabled);

  const canPreviewSend = !disableNotificationWrites && Boolean(notificationDraft.trim());

  const handleConfirmSend = async () => {
    if (!canPreviewSend) return;

    setSendingNotification(true);
    try {
      if (onSendNotification) {
        await onSendNotification({
          classId: detail.classId,
          className: detail.className,
          target: recipientTarget,
          recipientCount,
          content: notificationDraft.trim(),
        });
      }
      setSendResultMessage('Đã gửi thông báo thành công.');
      setIsConfirmOpen(false);
    } finally {
      setSendingNotification(false);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[95] bg-on-surface/20 transition ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside className={`report-detail-drawer fixed inset-y-0 right-0 z-[100] flex w-full max-w-[450px] flex-col overflow-y-auto border-l border-outline-variant bg-surface-container-lowest shadow-[-10px_0_40px_rgba(0,0,0,0.1)] ${isOpen ? 'open' : ''}`}>
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-outline-variant bg-surface-container-lowest p-8">
          <div>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${urgencyToneClassMap[detail.urgencyTone] || urgencyToneClassMap.warning}`}>
              {detail.urgencyLabel}
            </span>
            <h3 className="mt-2 text-2xl font-black text-on-surface">Chi tiết Lớp {detail.className}</h3>
            <p className="text-sm text-on-surface-variant">Giáo viên chủ nhiệm: {detail.teacherName}</p>
          </div>

          <button type="button" onClick={onClose} className="rounded-xl p-2 text-on-surface-muted transition hover:bg-surface hover:text-on-surface" aria-label="Đóng chi tiết lớp">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-8 p-8">
          <section className="grid grid-cols-2 gap-3">
            <DrawerDistributionItem label="Lớp" value={detail.className} tone="success" />
            <DrawerDistributionItem label="Sĩ số" value={detail.studentCount || detail.distribution.stable + detail.distribution.followUp + detail.distribution.highRisk} tone="success" />
          </section>

          <section>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-on-surface-muted">Trạng thái sức khỏe theo lớp</h4>
            <div className="flex h-4 w-full overflow-hidden rounded-full bg-surface-container-high shadow-inner">
              <div className="h-full bg-success" style={{ width: `${detail.distribution.stablePct}%` }} title="Ổn định" />
              <div className="h-full bg-warning" style={{ width: `${detail.distribution.followUpPct}%` }} title="Theo dõi" />
              <div className="h-full bg-danger" style={{ width: `${detail.distribution.highRiskPct}%` }} title="Nguy cơ" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <DrawerDistributionItem label="Ổn định" value={detail.distribution.stable} tone="success" />
              <DrawerDistributionItem label="Theo dõi" value={detail.distribution.followUp} tone="warning" />
              <DrawerDistributionItem label="Nguy cơ" value={detail.distribution.highRisk} tone="danger" />
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/60 bg-surface p-5">
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-on-surface-muted">Tình trạng tiêm chủng</h4>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-on-surface">Tỷ lệ hoàn thành</p>
              <p className="text-base font-black text-on-surface">{detail.vaccination.completionRate}%</p>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-warning" style={{ width: `${detail.vaccination.completionRate}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-on-surface-variant">
              <p>Đã hoàn thành: {detail.vaccination.completed}</p>
              <p>Chưa hoàn thành: {detail.vaccination.pending}</p>
            </div>
            <p className={`mt-3 inline-flex rounded-lg px-2.5 py-1 text-[11px] font-bold ${vaccinationToneClassMap[detail.vaccination.statusTone] || vaccinationToneClassMap.warning}`}>
              {detail.vaccination.statusLabel}
            </p>
          </section>

          <section className="rounded-2xl border border-outline-variant/60 bg-surface p-5">
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-on-surface-muted">Vấn đề sức khỏe nổi bật</h4>
            <ul className="space-y-2">
              {(detail.highlightedIssues || []).map((issue) => (
                <li key={issue} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning" />
                  <p className="text-sm text-on-surface">{issue}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-danger/20 bg-danger-soft/40 p-6">
            <div className="mb-4 flex items-center gap-2 text-danger">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <h4 className="text-xs font-black uppercase tracking-widest">Phân tích vấn đề sức khỏe</h4>
            </div>

            <ul className="space-y-4">
              {detail.riskAnalysis.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${analysisDotClassMap[item.tone] || analysisDotClassMap.neutral}`} />
                  <div>
                    <p className="text-sm font-bold text-on-surface">{item.title}</p>
                    <p className="text-xs text-on-surface-variant">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="mb-3 text-xs font-black uppercase tracking-widest text-on-surface-muted">Ghi chú nội bộ</h4>
            {disableDirectiveWrites ? (
              <p className="mb-3 rounded-xl border border-warning/30 bg-warning-soft px-3 py-2 text-xs font-semibold text-warning">
                {directiveDisabledMessage}
              </p>
            ) : null}
            {detail.recommendation ? (
              <p className="mb-3 rounded-xl border border-outline-variant/60 bg-surface px-3 py-2 text-xs text-on-surface-variant">
                {detail.recommendation}
              </p>
            ) : null}
            <textarea
              className="h-32 w-full rounded-2xl border border-outline-variant bg-surface p-4 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
              placeholder="Nhập ghi chú chỉ đạo hoặc đề xuất xử lý..."
              value={directiveNote}
              disabled={disableDirectiveWrites}
              onChange={(event) => onDirectiveChange(event.target.value)}
            />
            <button
              type="button"
              onClick={onSaveDirective}
              disabled={saving || disableDirectiveWrites}
              className="mt-3 w-full rounded-xl border border-outline-variant bg-surface py-2.5 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high disabled:opacity-60"
            >
              {disableDirectiveWrites ? 'Tạm khóa lưu' : saving ? 'Đang lưu...' : 'Lưu ghi chú nội bộ'}
            </button>
          </section>

          <section className="rounded-2xl border border-outline-variant/60 bg-surface p-5">
            <h4 className="mb-3 text-xs font-black uppercase tracking-widest text-on-surface-muted">Nội dung thông báo gửi ra ngoài</h4>
            {disableNotificationWrites ? (
              <p className="mb-3 rounded-xl border border-warning/30 bg-warning-soft px-3 py-2 text-xs font-semibold text-warning">
                {notificationDisabledMessage}
              </p>
            ) : null}

            <div className="mb-3 rounded-xl border border-outline-variant/70 bg-surface-container-low p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-on-surface-muted">Người nhận</p>
              <div className="mt-2 space-y-1 text-sm text-on-surface">
                <p>Lớp: <span className="font-semibold">{detail.className}</span></p>
                <p>Số account học sinh: <span className="font-semibold">{recipientStats.students}</span></p>
              </div>

              <div className="mt-3 inline-flex rounded-full border border-secondary bg-secondary-container px-3 py-1.5 text-xs font-semibold text-secondary">
                Người nhận: Học sinh
              </div>
            </div>

            <textarea
              className="h-28 w-full rounded-2xl border border-outline-variant bg-surface p-4 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
              placeholder="Nhập nội dung thông báo gửi đến học sinh..."
              value={notificationDraft}
              disabled={disableNotificationWrites}
              onChange={(event) => setNotificationDraft(event.target.value)}
            />

            {sendResultMessage ? <p className="mt-2 text-xs font-semibold text-success">{sendResultMessage}</p> : null}

            <button
              type="button"
              disabled={!canPreviewSend}
              onClick={() => setIsConfirmOpen(true)}
              className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-on-primary transition hover:bg-primary-hover disabled:opacity-60"
            >
              {disableNotificationWrites ? 'Tạm khóa gửi' : 'Xem trước & gửi thông báo'}
            </button>
          </section>
        </div>
      </aside>

      {isConfirmOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-on-surface/35 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-2xl">
            <h4 className="text-base font-bold text-on-surface">Xác nhận gửi thông báo</h4>
            <p className="mt-1 text-sm text-on-surface-variant">Vui lòng kiểm tra thông tin trước khi gửi hàng loạt.</p>

            <div className="mt-4 space-y-2 rounded-xl border border-outline-variant/70 bg-surface p-3 text-sm">
              <p>Lớp nhận thông báo: <span className="font-semibold">{detail.className}</span></p>
              <p>Nhóm nhận: <span className="font-semibold">Học sinh</span></p>
              <p>Số lượng người nhận: <span className="font-semibold">{recipientCount}</span></p>
            </div>

            <div className="mt-3 rounded-xl border border-outline-variant/70 bg-surface p-3">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-on-surface-muted">Nội dung preview</p>
              <p className="whitespace-pre-wrap text-sm text-on-surface">{notificationDraft.trim()}</p>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-xl border border-outline-variant bg-surface px-3 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={sendingNotification}
                onClick={handleConfirmSend}
                className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-60"
              >
                {sendingNotification ? 'Đang gửi...' : 'Xác nhận gửi'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AdminReportDetailDrawer;
