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
    ? "flex h-full flex-col rounded-[1.75rem] bg-primary p-5 text-white shadow-md shadow-primary/18 ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/25 lg:p-6"
    : "flex h-full flex-col rounded-[1.75rem] bg-surface-container-lowest p-5 text-on-surface shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-900/8 lg:p-6";

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
    <section id="tinh-nang" className="bg-[#f2f7f3] py-10 md:py-11">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Khối nghiệp vụ cốt lõi"
          description="Các phân hệ vận hành công tác sức khỏe học đường theo quy trình thống nhất và dễ kiểm soát."
          align="center"
          eyebrow="Nghiệp vụ hệ thống"
        />

        <div className="space-y-3 md:space-y-4">
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
