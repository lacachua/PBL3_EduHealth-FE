import React from 'react';

const ModulePlaceholderPage = ({ title, description, moduleName, introTitle }) => {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-[#D1FAE5] bg-[#F0FDF4] p-3.5 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-[1.25rem] font-extrabold tracking-tight text-[#166534]">{introTitle || title}</h1>
            <p className="mt-0.5 text-sm text-[#64748B]">{description}</p>
          </div>
          <span className="inline-flex items-center rounded-full border border-[#D1FAE5] bg-white px-2 py-0.5 text-[10px] font-medium text-[#15803D]">
            Đang phát triển
          </span>
        </div>
      </div>

      <div className="app-card-shell rounded-2xl border border-dashed px-6 py-9 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D1FAE5] bg-[#F0FDF4] text-[#15803D]">
            <span className="material-symbols-outlined text-2xl">construction</span>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15803D]">{moduleName}</p>
          <h3 className="mt-2 text-lg font-bold text-[#0F172A]">Module này sẽ được hoàn thiện sau.</h3>

          <div className="mt-4 space-y-1.5 text-sm leading-relaxed text-[#64748B]">
            <p>Chức năng đang được chuẩn hóa theo API và nghiệp vụ của hệ thống EduHealth.</p>
            <p>Hiện tại hệ thống đang ưu tiên xây dựng khung giao diện và luồng nền tảng cho role Y tá.</p>
            <p>Khung layout đã sẵn sàng để tích hợp dữ liệu và thao tác ở giai đoạn tiếp theo.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulePlaceholderPage;
