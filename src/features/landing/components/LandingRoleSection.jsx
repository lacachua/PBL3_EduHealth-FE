import React from "react";
import SectionHeader from "./SectionHeader";
import nurseVisual from "../../../assets/images/landing/nurse.png";
import studentVisual from "../../../assets/images/landing/student.png";
import adminVisual from "../../../assets/images/landing/admin.png";

const roleItems = [
  {
    tag: "Y tá trường học",
    title: "Quản lý nghiệp vụ y tế",
    description:
      "Cập nhật hồ sơ sức khỏe, ghi nhận khám bệnh, cấp phát thuốc và theo dõi tiêm chủng.",
    imageAlt: "Minh họa màn hình nghiệp vụ y tế học đường cho y tá trường",
    imageSrc: nurseVisual,
  },
  {
    tag: "Học sinh",
    title: "Theo dõi sức khỏe của bản thân",
    description:
      "Xem thông tin sức khỏe, lịch sử khám bệnh, lịch sử dùng thuốc và trạng thái tiêm chủng.",
    imageAlt: "Minh họa màn hình phụ huynh theo dõi hồ sơ sức khỏe",
    imageSrc: studentVisual,
  },
  {
    tag: "Quản trị viên",
    title: "Quản lý hệ thống",
    description:
      "Quản lý tài khoản, phân quyền người dùng và theo dõi dữ liệu tổng quan của hệ thống.",
    imageAlt: "Minh họa dashboard quản trị hệ thống sức khỏe học đường",
    imageSrc: adminVisual,
  },
];

const LandingRoleSection = () => {
  return (
    <section id="giai-phap" className="scroll-mt-[5.5rem] bg-[#f8fbf8] py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Giải pháp theo nhóm người dùng"
          description="Hệ thống phân quyền theo từng vai trò, giúp người dùng truy cập đúng chức năng cần thiết."
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
