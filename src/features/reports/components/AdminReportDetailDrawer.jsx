import React from 'react';

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

const AdminReportDetailDrawer = ({
  isOpen,
  detail,
  onClose,
}) => {
  if (!detail) {
    return null;
  }

  const distribution = detail.distribution || {
    stable: 0,
    followUp: 0,
    highRisk: 0,
    stablePct: 0,
    followUpPct: 0,
    highRiskPct: 0,
  };

  const vaccination = detail.vaccination || {
    completionRate: 0,
    completed: 0,
    pending: 0,
    statusTone: 'warning',
    statusLabel: 'Chưa có dữ liệu',
  };

  const riskAnalysis = Array.isArray(detail.riskAnalysis) ? detail.riskAnalysis : [];
  const highlightedIssues = Array.isArray(detail.highlightedIssues) ? detail.highlightedIssues : [];
  const recommendation = typeof detail.recommendation === 'string' ? detail.recommendation.trim() : '';
  const studentCount = Number.isFinite(detail.studentCount)
    ? detail.studentCount
    : Number(distribution.stable || 0) + Number(distribution.followUp || 0) + Number(distribution.highRisk || 0);

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
            <DrawerDistributionItem label="Sĩ số" value={studentCount} tone="success" />
          </section>

          <section>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-on-surface-muted">Trạng thái sức khỏe theo lớp</h4>
            <div className="flex h-4 w-full overflow-hidden rounded-full bg-surface-container-high shadow-inner">
              <div className="h-full bg-success" style={{ width: `${distribution.stablePct}%` }} title="Ổn định" />
              <div className="h-full bg-warning" style={{ width: `${distribution.followUpPct}%` }} title="Theo dõi" />
              <div className="h-full bg-danger" style={{ width: `${distribution.highRiskPct}%` }} title="Nguy cơ" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <DrawerDistributionItem label="Ổn định" value={distribution.stable} tone="success" />
              <DrawerDistributionItem label="Theo dõi" value={distribution.followUp} tone="warning" />
              <DrawerDistributionItem label="Nguy cơ" value={distribution.highRisk} tone="danger" />
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/60 bg-surface p-5">
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-on-surface-muted">Tình trạng tiêm chủng</h4>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-on-surface">Tỷ lệ hoàn thành</p>
              <p className="text-base font-black text-on-surface">{vaccination.completionRate}%</p>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-warning" style={{ width: `${vaccination.completionRate}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-on-surface-variant">
              <p>Đã hoàn thành: {vaccination.completed}</p>
              <p>Chưa hoàn thành: {vaccination.pending}</p>
            </div>
            <p className={`mt-3 inline-flex rounded-lg px-2.5 py-1 text-[11px] font-bold ${vaccinationToneClassMap[vaccination.statusTone] || vaccinationToneClassMap.warning}`}>
              {vaccination.statusLabel}
            </p>
          </section>

          <section className="rounded-2xl border border-outline-variant/60 bg-surface p-5">
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-on-surface-muted">Vấn đề sức khỏe nổi bật</h4>
            {highlightedIssues.length ? (
              <ul className="space-y-2">
                {highlightedIssues.map((issue) => (
                  <li key={issue} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning" />
                    <p className="text-sm text-on-surface">{issue}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-on-surface-variant">Chưa ghi nhận vấn đề nổi bật.</p>
            )}
          </section>

          <section className="rounded-2xl border border-danger/20 bg-danger-soft/40 p-6">
            <div className="mb-4 flex items-center gap-2 text-danger">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <h4 className="text-xs font-black uppercase tracking-widest">Phân tích vấn đề sức khỏe</h4>
            </div>

            {riskAnalysis.length ? (
              <ul className="space-y-4">
                {riskAnalysis.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${analysisDotClassMap[item.tone] || analysisDotClassMap.neutral}`} />
                    <div>
                      <p className="text-sm font-bold text-on-surface">{item.title}</p>
                      <p className="text-xs text-on-surface-variant">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-on-surface-variant">Chưa có phân tích rủi ro cho lớp này.</p>
            )}
          </section>
          {recommendation ? (
            <section className="rounded-2xl border border-outline-variant/60 bg-surface p-5">
              <h4 className="mb-3 text-xs font-black uppercase tracking-widest text-on-surface-muted">Khuyến nghị</h4>
              <p className="whitespace-pre-wrap text-sm text-on-surface-variant">{recommendation}</p>
            </section>
          ) : null}
        </div>
      </aside>
    </>
  );
};

export default AdminReportDetailDrawer;
