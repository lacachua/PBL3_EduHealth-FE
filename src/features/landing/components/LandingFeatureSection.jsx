import React from "react";
import SectionHeader from "./SectionHeader";

const topRowItems = [
  {
    id: "health-profiles",
    title: "Hồ sơ học sinh",
    description: "Tổng hợp hồ sơ sức khỏe theo lớp và theo năm học, truy vết lịch sử đầy đủ.",
    icon: "patient_list",
  },
  {
    id: "examinations",
    title: "Khám bệnh & cấp thuốc",
    description: "Chuẩn hóa quy trình xử lý tại phòng y tế, ghi nhận điều trị và cấp phát thuốc.",
    icon: "stethoscope",
    highlighted: true,
  },
];

const bottomRowItems = [
  {
    id: "inventory",
    title: "Kho thuốc",
    description: "Theo dõi tồn kho, hạn dùng và tình trạng vật tư thiết yếu theo quy định.",
    icon: "inventory_2",
  },
  {
    id: "vaccinations",
    title: "Tiêm chủng",
    description: "Quản lý lịch tiêm, biểu mẫu đồng ý và theo dõi hoàn thành theo lớp.",
    icon: "vaccines",
  },
  {
    id: "reports",
    title: "Báo cáo sức khỏe học đường",
    description: "Cung cấp thống kê tổng hợp cho ban giám hiệu và bộ phận quản trị.",
    icon: "bar_chart",
  },
];

const FeatureCard = ({ title, description, icon, highlighted = false }) => {
  const cardClassName = highlighted
    ? "flex h-full flex-col rounded-[1.75rem] border border-primary/28 bg-[linear-gradient(135deg,#2f8d68_0%,#267257_100%)] p-5 text-white shadow-[0_14px_30px_-18px_rgba(26,91,67,0.7)] ring-1 ring-white/18 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_34px_-20px_rgba(26,91,67,0.75)] lg:p-6"
    : "flex h-full flex-col rounded-[1.75rem] border border-outline-variant/75 bg-white p-5 text-on-surface shadow-[0_10px_22px_-16px_rgba(15,23,42,0.36)] ring-1 ring-black/[0.02] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_18px_28px_-18px_rgba(15,23,42,0.48)] lg:p-6";

  const iconClassName = highlighted
    ? "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/24 bg-white/18"
    : "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary";

  const textClassName = highlighted ? "text-white/90" : "text-on-surface-muted";

  return (
    <article className={cardClassName}>
      <div className={iconClassName}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="mb-2 font-headline text-[1.36rem] font-bold leading-snug">{title}</h3>
      <p className={`${textClassName} flex-1 text-[14px] leading-relaxed`}>{description}</p>
    </article>
  );
};

const LandingFeatureSection = () => {
  return (
    <section id="tinh-nang" className="bg-[#f2f7f3] py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Khối nghiệp vụ cốt lõi"
          description="Các phân hệ vận hành công tác sức khỏe học đường theo quy trình thống nhất và dễ kiểm soát."
          align="center"
          eyebrow="Nghiệp vụ hệ thống"
        />

        <div className="space-y-3.5 md:space-y-4.5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
            {topRowItems.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                highlighted={feature.highlighted}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {bottomRowItems.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFeatureSection;
