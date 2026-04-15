import React from 'react';
import EntityAvatar from '../../../shared/components/admin/EntityAvatar';
import SectionAlert from '../../../shared/components/form/SectionAlert';

const metaItemClass = 'inline-flex items-center gap-1.5 text-[12px] text-[#64748B]';

const statusClassMap = {
  success: 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]',
  info: 'bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]',
  warning: 'bg-[#FFEDD5] text-[#EA580C] border-[#FDBA74]',
  danger: 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]',
  default: 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]',
};

const NurseHealthProfileHeader = ({ header, syncMessage, onEditHealthProfile }) => {
  const statusTone = header.statusTone || 'success';
  const statusClass = statusClassMap[statusTone] || statusClassMap.default;

  return (
    <section className="nurse-card-soft space-y-4 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <EntityAvatar
            name={header.fullName}
            imageUrl={header.avatarUrl}
            sizeClass="h-20 w-20 sm:h-24 sm:w-24"
            textClass="text-lg"
            borderClass="border border-[#D1FAE5]"
            backgroundClass="bg-[#DCFCE7] text-[#166534]"
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-headline text-[1.5rem] font-bold leading-tight tracking-[-0.015em] text-[#0F172A] sm:text-[1.7rem]">{header.fullName}</h2>
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
          className="nurse-focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#15803D] px-4 text-sm font-semibold text-white transition-[background-color,box-shadow,transform] duration-180 ease-out hover:bg-[#166534] hover:shadow-[0_4px_10px_rgba(21,128,61,0.2)] hover:-translate-y-px"
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
