import EntityAvatar from '../../../shared/components/core/EntityAvatar';
import SectionAlert from '../../../shared/components/form/SectionAlert';

const metaItemClass = 'inline-flex items-center gap-1.5 text-[12px] text-on-surface-variant';

const statusClassMap = {
  success: 'bg-success-soft text-success border-success/30',
  info: 'bg-info-soft text-info border-info/30',
  warning: 'bg-warning-soft text-warning border-warning/30',
  danger: 'bg-danger-soft text-danger border-danger/30',
  default: 'bg-surface-container-low text-on-surface-variant border-outline-variant',
};

const NurseHealthProfileHeader = ({ header, syncMessage, onEditHealthProfile }) => {
  const statusTone = header.statusTone || 'success';
  const statusClass = statusClassMap[statusTone] || statusClassMap.default;

  return (
    <section className="app-card-shell mb-6 space-y-4 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <EntityAvatar
            name={header.fullName}
            imageUrl={header.avatarUrl}
            sizeClass="h-20 w-20 sm:h-24 sm:w-24"
            textClass="text-lg"
            borderClass="border border-success/20"
            backgroundClass="bg-success-soft text-success"
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-headline text-[1.5rem] font-bold leading-tight tracking-[-0.015em] text-on-surface sm:text-[1.7rem]">{header.fullName}</h2>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                {header.statusLabel || 'Hoạt động'}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className={metaItemClass}>
                <span className="material-symbols-outlined text-[15px]">school</span>
                Lớp: {header.className}
              </span>
              <span className={metaItemClass}>
                <span className="material-symbols-outlined text-[15px]">badge</span>
                Mã HS: {header.studentCode}
              </span>
              <span className={metaItemClass}>
                <span className="material-symbols-outlined text-[15px]">cake</span>
                {header.ageLabel} ({header.dateOfBirthLabel})
              </span>
              <span className={metaItemClass}>
                <span className="material-symbols-outlined text-[15px]">wc</span>
                {header.genderLabel}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEditHealthProfile}
          className="app-focus-ring app-btn-primary inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[17px]">edit_square</span>
          Cập nhật hồ sơ sức khỏe
        </button>
      </div>

      {syncMessage ? <SectionAlert message={syncMessage} tone="warning" /> : null}
    </section>
  );
};

export default NurseHealthProfileHeader;
