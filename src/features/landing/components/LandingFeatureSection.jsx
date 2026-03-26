import React from "react";
import SectionHeader from "./SectionHeader";

const topRowItems = [
  {
    id: "health-profiles",
    title: "Hồ sơ học sinh",
    description: "Theo dõi thông tin sức khỏe theo lớp và cập nhật xuyên suốt năm học.",
    icon: "patient_list",
  },
  {
    id: "examinations",
    title: "Khám bệnh & cấp thuốc",
    description: "Hỗ trợ xử lý nhanh tại phòng y tế và cấp thuốc đúng quy trình nhà trường.",
    icon: "stethoscope",
    highlighted: true,
  },
];

const bottomRowItems = [
  {
    id: "inventory",
    title: "Kho thuốc",
    description: "Kiểm soát tồn kho, hạn dùng và cảnh báo bổ sung kịp thời.",
    icon: "inventory_2",
  },
  {
    id: "vaccinations",
    title: "Tiêm chủng",
    description: "Quản lý lịch tiêm và nhắc thông tin đến phụ huynh đúng thời điểm.",
    icon: "vaccines",
  },
  {
    id: "reports",
    title: "Báo cáo sức khỏe học đường",
    description: "Tổng hợp dữ liệu theo lớp và toàn trường để theo dõi nhanh.",
    icon: "bar_chart",
  },
];

const FeatureCard = ({ title, description, icon, highlighted = false }) => {
  const cardClassName = highlighted
    ? "flex h-full flex-col rounded-[1.75rem] bg-primary p-6 text-white shadow-lg shadow-primary/20 ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 lg:p-7"
    : "flex h-full flex-col rounded-[1.75rem] bg-surface-container-lowest p-6 text-on-surface shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10 lg:p-7";

  const iconClassName = highlighted
    ? "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20"
    : "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary";

  const textClassName = highlighted ? "text-white/90" : "text-on-surface-variant";

  return (
    <article className={cardClassName}>
      <div className={iconClassName}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="mb-2 font-headline text-2xl font-bold leading-snug">{title}</h3>
      <p className={`${textClassName} flex-1 text-sm leading-relaxed`}>{description}</p>
    </article>
  );
};

const LandingFeatureSection = () => {
  return (
    <section id="tinh-nang" className="bg-surface-container-low py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Tính năng cốt lõi"
          description="Các phân hệ trọng tâm giúp nhà trường vận hành công tác y tế học đường rõ ràng và hiệu quả."
          align="center"
        />

        <div className="space-y-4 md:space-y-5">
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
