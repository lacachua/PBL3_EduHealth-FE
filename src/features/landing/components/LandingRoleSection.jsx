import React from "react";
import SectionHeader from "./SectionHeader";
import nurseVisual from "../../../assets/images/landing/role-nurse-visual.svg";
import parentVisual from "../../../assets/images/landing/role-parent-visual.svg";
import adminVisual from "../../../assets/images/landing/role-admin-visual.svg";

const roleItems = [
  {
    tag: "Y tá trường học",
    title: "Nghiệp vụ y tế rõ ràng",
    description:
      "Số hóa quy trình khám bệnh, cấp thuốc và cập nhật hồ sơ ngay tại phòng y tế, giảm áp lực giấy tờ.",
    imageAlt: "Minh họa màn hình nghiệp vụ y tế học đường cho y tá trường",
    imageSrc: nurseVisual,
  },
  {
    tag: "Phụ huynh học sinh",
    title: "Cập nhật thông tin kịp thời",
    description:
      "Nhận thông báo khi học sinh được khám bệnh, cấp thuốc hoặc đến lịch tiêm chủng để phối hợp cùng nhà trường.",
    imageAlt: "Minh họa màn hình phụ huynh theo dõi hồ sơ sức khỏe học sinh",
    imageSrc: parentVisual,
  },
  {
    tag: "Ban giám hiệu/Quản trị viên",
    title: "Quản trị tổng thể sức khỏe học đường",
    description:
      "Theo dõi báo cáo tổng hợp theo thời gian, đánh giá tình hình sức khỏe học sinh và điều phối công tác y tế.",
    imageAlt: "Minh họa dashboard quản trị tổng thể sức khỏe học đường",
    imageSrc: adminVisual,
  },
];

const LandingRoleSection = () => {
  return (
    <section id="giai-phap" className="bg-[#f8fbf8] py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Giải pháp theo nhóm người dùng"
          description="EduHealth kết nối nhà trường, y tế và phụ huynh trong một quy trình phối hợp thống nhất."
          align="center"
          eyebrow="Theo vai trò"
        />

        <div className="grid grid-cols-1 items-stretch gap-3.5 md:grid-cols-2 lg:grid-cols-3 lg:gap-4.5">
          {roleItems.map((role) => (
            <article key={role.tag} className="group flex h-full flex-col rounded-3xl border border-outline-variant/75 bg-white p-3.5 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.42)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_22px_30px_-20px_rgba(15,23,42,0.55)]">
              <div className="mb-4 aspect-[4/3] overflow-hidden rounded-[1.4rem] border border-outline-variant/40 shadow-sm transition-shadow duration-300 group-hover:shadow-md group-hover:shadow-slate-900/10">
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={role.imageAlt}
                  src={role.imageSrc}
                />
              </div>
              <span className="mb-2 inline-block w-fit rounded-full border border-primary/18 bg-primary-soft/70 px-3 py-1 text-[11px] font-bold text-primary">
                {role.tag}
              </span>
              <h3 className="mb-2 font-headline text-[1.3rem] font-bold leading-snug md:text-[1.38rem]">{role.title}</h3>
              <p className="flex-1 text-[14px] leading-relaxed text-on-surface-muted">{role.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingRoleSection;
