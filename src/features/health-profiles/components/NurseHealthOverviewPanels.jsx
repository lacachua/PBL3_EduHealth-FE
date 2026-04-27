import SectionCard from '../../../shared/components/core/SectionCard';
import { formatDate } from '../../../shared/utils/dateFormat';

const sectionCardClass = 'app-card-shell rounded-xl p-4';
const sectionHeaderClass = 'app-section-header -mx-4 -mt-4 mb-3 flex flex-col gap-1.5 rounded-t-xl px-4 py-2.5 md:flex-row md:items-start md:justify-between';
const sectionTitleClass = 'font-headline text-[0.97rem] font-bold text-on-surface';
const sectionSubtitleClass = 'mt-0.5 text-[11px] text-on-surface-variant';
const historyCardClass = 'rounded-lg border border-outline-variant bg-surface-container-lowest p-3';

const alertChipClassMap = {
  allergy: 'bg-danger-soft text-danger',
  vision: 'bg-info-soft text-info',
  chronic: 'bg-surface-container-low text-on-surface-variant',
  nutrition: 'bg-warning-soft text-warning',
};

const getAlertChipClass = (variant) => alertChipClassMap[variant] || 'bg-success-soft text-success';

const vaccinationStatusMeta = (status) => {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'DONE') {
    return { label: 'Đã tiêm', className: 'bg-success-soft text-success' };
  }
  if (normalized === 'POSTPONED') {
    return { label: 'Hoãn tiêm', className: 'bg-warning-soft text-warning' };
  }
  if (normalized === 'CONTRAINDICATED') {
    return { label: 'Chống chỉ định', className: 'bg-danger-soft text-danger' };
  }
  if (normalized === 'ABSENT') {
    return { label: 'Vắng mặt', className: 'bg-surface-container-low text-on-surface-variant' };
  }
  return { label: 'Chờ tiêm', className: 'bg-info-soft text-info' };
};

const NurseHealthOverviewPanels = ({
  alerts,
  vaccinations,
  emergencyContacts,
  healthHistory,
  examinationHistory,
}) => {
  const periodicItems = healthHistory.items.length
    ? healthHistory.items
    : examinationHistory;

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <SectionCard
          title="Cảnh báo sức khỏe"
          subtitle="Tổng hợp các vấn đề cần theo dõi cho học sinh trong năm học hiện tại"
          className={sectionCardClass}
          headerClassName={sectionHeaderClass}
          titleClassName={sectionTitleClass}
          subtitleClassName={sectionSubtitleClass}
        >
          {alerts.length ? (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <article key={alert.key} className={historyCardClass}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[18px] text-success">{alert.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{alert.title}</p>
                        <p className="mt-0.5 text-xs text-on-surface-variant">{alert.description || '--'}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${getAlertChipClass(alert.variant)}`}>
                      Cần theo dõi
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">Chưa có dữ liệu cảnh báo sức khỏe.</p>
          )}
        </SectionCard>

        <SectionCard
          title="Khám sức khỏe định kỳ"
          subtitle="Lịch sử khám, chẩn đoán và xử trí gần nhất"
          className={sectionCardClass}
          headerClassName={sectionHeaderClass}
          titleClassName={sectionTitleClass}
          subtitleClassName={sectionSubtitleClass}
        >
          {periodicItems.length ? (
            <div className="space-y-2">
              {periodicItems.slice(0, 5).map((item) => (
                <article key={item.id} className={historyCardClass}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-on-surface">{item.diagnosis || item.diseaseName || 'Khám định kỳ'}</p>
                    <span className="text-[11px] text-on-surface-variant">{item.visitDateLabel || formatDate(item.visitDate)}</span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Triệu chứng</p>
                  <p className="text-sm text-on-surface">{item.symptoms || '--'}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Điều trị</p>
                  <p className="text-sm text-on-surface">{item.treatment || '--'}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Phụ trách</p>
                  <p className="text-sm text-on-surface">{item.nurseName || '--'}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">Chưa có dữ liệu khám sức khỏe định kỳ.</p>
          )}
        </SectionCard>
      </div>

      <div className="space-y-3">
        <SectionCard
          title="Tiêm chủng gần đây"
          subtitle="Cập nhật các mũi tiêm gần nhất của học sinh"
          className={sectionCardClass}
          headerClassName={sectionHeaderClass}
          titleClassName={sectionTitleClass}
          subtitleClassName={sectionSubtitleClass}
        >
          {vaccinations.length ? (
            <div className="space-y-2">
              {vaccinations.slice(0, 4).map((record) => (
                <article key={record.id} className={historyCardClass}>
                  {(() => {
                    const statusMeta = vaccinationStatusMeta(record.status);
                    return (
                      <>
                        <p className="text-sm font-semibold text-on-surface">{record.vaccineName}</p>
                        <p className="mt-0.5 text-[11px] text-on-surface-variant">{formatDate(record.administeredAt)}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusMeta.className}`}>
                            {statusMeta.label}
                          </span>
                          {(record.campaignName || record.doseNumber) && (
                            <span className="text-[11px] font-medium text-on-surface-variant">
                              • {[record.doseNumber && `Mũi ${record.doseNumber}`, record.campaignName].filter(Boolean).join(' - ')}
                            </span>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">Chưa có dữ liệu tiêm chủng gần đây.</p>
          )}
        </SectionCard>

        <SectionCard
          title="Liên hệ khẩn cấp"
          subtitle="Thông tin người giám hộ ưu tiên khi cần can thiệp y tế"
          className={sectionCardClass}
          headerClassName={sectionHeaderClass}
          titleClassName={sectionTitleClass}
          subtitleClassName={sectionSubtitleClass}
        >
          {emergencyContacts.length ? (
            <div className="space-y-2">
              {emergencyContacts.map((contact) => (
                <article key={contact.id} className={historyCardClass}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-on-surface">{contact.fullName}</p>
                    {contact.primary ? (
                      <span className="inline-flex items-center rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success">
                        Ưu tiên
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-on-surface-variant">{contact.relation}</p>
                  <p className="mt-1 text-sm font-semibold text-success">{contact.phone}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">Chưa có dữ liệu liên hệ khẩn cấp.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default NurseHealthOverviewPanels;
