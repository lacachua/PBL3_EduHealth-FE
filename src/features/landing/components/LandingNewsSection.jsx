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
      className="app-focus-ring app-btn-secondary px-5"
    >
      Xem tất cả bản tin
    </button>
  );

  return (
    <section id="ban-tin-y-te" className="bg-[#f2f7f3] py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Bản tin y tế học đường"
          description="Cập nhật thông tin y tế cần thiết để nhà trường và phụ huynh phối hợp chăm sóc học sinh."
          action={action}
          align="center"
        />

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3 lg:gap-4.5">
          {newsItems.map((item) => (
            <article key={item.title} className="flex h-full flex-col rounded-2xl border border-outline-variant/75 bg-white p-5 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.38)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_18px_30px_-18px_rgba(15,23,42,0.5)]">
              <p className="mb-3 inline-flex w-fit items-center rounded-full border border-primary/18 bg-primary-soft/60 px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.04em] text-primary">{item.date}</p>
              <h3 className="mb-3 font-headline text-[1.24rem] font-bold leading-snug text-on-surface">{item.title}</h3>
              <p className="flex-1 text-[14px] leading-relaxed text-on-surface-muted">{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingNewsSection;
