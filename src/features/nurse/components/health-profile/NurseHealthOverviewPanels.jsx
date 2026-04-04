import React from 'react';
import SectionCard from '../../../../shared/components/admin/SectionCard';

const progressBarClass = 'h-2 overflow-hidden rounded-full bg-[#E2E8F0]';
const sectionCardClass = 'nurse-card-soft rounded-xl p-4';
const sectionHeaderClass = 'nurse-section-header-strong -mx-4 -mt-4 mb-3 flex flex-col gap-1.5 rounded-t-xl px-4 py-2.5 md:flex-row md:items-start md:justify-between';
const sectionTitleClass = 'font-headline text-[0.97rem] font-bold text-[#166534]';
const sectionSubtitleClass = 'mt-0.5 text-[11px] text-[#166534]/80';
const alertChipClassMap = {
  allergy: 'bg-[#FEE2E2] text-[#DC2626]',
  vision: 'bg-[#DBEAFE] text-[#2563EB]',
  chronic: 'bg-[#F3E8FF] text-[#9333EA]',
  nutrition: 'bg-[#FFEDD5] text-[#EA580C]',
};

const getAlertChipClass = (variant) => alertChipClassMap[variant] || 'bg-[#DCFCE7] text-[#166534]';

const toDateLabel = (value) => {
  if (!value) return '--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('vi-VN');
};

const NurseHealthOverviewPanels = ({
  alerts,
  vaccinations,
  emergencyContacts,
  growth,
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
                <article key={alert.key} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#15803D]">{alert.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{alert.title}</p>
                        <p className="mt-0.5 text-xs text-[#64748B]">{alert.description || '--'}</p>
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
            <p className="text-sm text-[#64748B]">Chưa ghi nhận cảnh báo sức khỏe đáng chú ý.</p>
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
                <article key={item.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#0F172A]">{item.diagnosis || item.diseaseName || 'Khám định kỳ'}</p>
                    <span className="text-[11px] text-[#64748B]">{item.visitDateLabel || toDateLabel(item.visitDate)}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#64748B]">{item.symptoms || '--'}</p>
                  <p className="mt-1 text-xs text-[#64748B]">Điều trị: {item.treatment || '--'}</p>
                  <p className="mt-1 text-[11px] text-[#64748B]">Phụ trách: {item.nurseName || '--'}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">Chưa có bản ghi khám sức khỏe định kỳ.</p>
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
                <article key={record.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="text-sm font-semibold text-[#0F172A]">{record.vaccineName}</p>
                  <p className="mt-0.5 text-[11px] text-[#64748B]">{toDateLabel(record.administeredAt)} • {record.location || '--'}</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#166534]">
                      Đã tiêm
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">Chưa có dữ liệu tiêm chủng gần đây.</p>
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
                <article key={contact.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#0F172A]">{contact.fullName}</p>
                    {contact.primary ? (
                      <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#15803D]">
                        Ưu tiên
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-[#64748B]">{contact.relation}</p>
                  <p className="mt-1 text-sm font-semibold text-[#15803D]">{contact.phone}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">Chưa có liên hệ khẩn cấp.</p>
          )}
        </SectionCard>

        <SectionCard
          title="Chỉ số tăng trưởng"
          subtitle="Đối chiếu cân nặng và chiều cao theo lứa tuổi"
          className={sectionCardClass}
          headerClassName={sectionHeaderClass}
          titleClassName={sectionTitleClass}
          subtitleClassName={sectionSubtitleClass}
        >
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-[11px] text-[#64748B]">
                <span>Cân nặng / tuổi</span>
                <span className="font-semibold text-[#15803D]">{growth.weightForAgePercent}%</span>
              </div>
              <div className={progressBarClass}>
                <div className="h-full bg-[#15803D]" style={{ width: `${Math.min(100, Math.max(0, growth.weightForAgePercent))}%` }} />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-[11px] text-[#64748B]">
                <span>Chiều cao / tuổi</span>
                <span className="font-semibold text-[#15803D]">{growth.heightForAgePercent}%</span>
              </div>
              <div className={progressBarClass}>
                <div className="h-full bg-[#15803D]" style={{ width: `${Math.min(100, Math.max(0, growth.heightForAgePercent))}%` }} />
              </div>
            </div>

            <p className="text-[11px] text-[#64748B]">{growth.note}</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default NurseHealthOverviewPanels;
