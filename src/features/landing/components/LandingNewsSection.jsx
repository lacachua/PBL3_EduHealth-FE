import React from "react";
import SectionHeader from "./SectionHeader";

const newsItems = [
  {
    title: "Thông báo lịch khám sức khỏe học kỳ II",
    summary:
      "Phòng y tế nhà trường thông báo lịch khám sức khỏe tổng quát cho học sinh khối 1 đến khối 5 trong tháng này.",
    date: "Cập nhật: 26/03/2026",
  },
  {
    title: "Hướng dẫn theo dõi sức khỏe tại nhà cho học sinh tiểu học",
    summary:
      "Nhà trường gửi đến phụ huynh các khuyến nghị về dinh dưỡng, vận động và theo dõi triệu chứng theo mùa.",
    date: "Cập nhật: 23/03/2026",
  },
  {
    title: "Lịch tiêm nhắc cho học sinh lớp 3/2 và lớp 4A",
    summary:
      "Danh sách học sinh đến lịch tiêm nhắc đã được cập nhật trên hệ thống để phụ huynh phối hợp cùng nhà trường.",
    date: "Cập nhật: 20/03/2026",
  },
];

const LandingNewsSection = () => {
  const action = (
    <button
      type="button"
      className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface hover:shadow-md"
    >
      Xem tất cả bản tin
    </button>
  );

  return (
    <section id="ban-tin-y-te" className="bg-surface-container-low py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Bản tin y tế học đường"
          description="Cập nhật thông tin y tế cần thiết để nhà trường và phụ huynh phối hợp chăm sóc học sinh."
          action={action}
          align="center"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {newsItems.map((item) => (
            <article key={item.title} className="flex h-full flex-col rounded-2xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">{item.date}</p>
              <h3 className="mb-3 font-headline text-xl font-bold leading-snug text-on-surface">{item.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-on-surface-variant">{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingNewsSection;
