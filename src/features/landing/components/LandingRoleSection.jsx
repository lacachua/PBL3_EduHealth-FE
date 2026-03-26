import React from "react";
import SectionHeader from "./SectionHeader";

const roleItems = [
  {
    tag: "Y tá trường học",
    title: "Nghiệp vụ y tế rõ ràng",
    description:
      "Số hóa quy trình khám bệnh, cấp thuốc và cập nhật hồ sơ ngay tại phòng y tế, giảm áp lực giấy tờ.",
    imageAlt: "Y tá trường học đang làm việc tại phòng y tế",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-0ZpDIj4YOK_BH4TwPTfgXaNXAo8u9r3e9OeetlAi8FLM6YeCoOyxwKF5eBMe3nOFNKpq1oaC97gy5dvBcQxR6D0dW4gKCBE7ERDj-OGrnFKZJuJ1uYLstUSZwa8iiEaQkIAceTTRznwzrCNYifrgP2fOz-ULCuXMMzh1AEkY78-CSf6iJIe2lpnCuwsmqsF7MrUyg8nFbm80-Z41nvPEQz7zRGnTRpVstdZv17-xGB26cOWW0WcScBqXH92agGysEuCQfMAotAs",
  },
  {
    tag: "Phụ huynh học sinh",
    title: "Cập nhật thông tin kịp thời",
    description:
      "Nhận thông báo khi học sinh được khám bệnh, cấp thuốc hoặc đến lịch tiêm chủng để phối hợp cùng nhà trường.",
    imageAlt: "Phụ huynh xem thông tin sức khỏe học sinh trên điện thoại",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCS7l7kk92c3VzupRrTiMDOCBsJckDV3GOgp6QS_OS3XxrNimo_eL_GMaN5GsbXb186mdPFs-hjr1o_pK7bhT347TZOhsnJZC5W0rKgu6_TBNfQMDB8XidS-BIdhr5YJE4Nzl635kX0KAAVbs2WrYw5VBSVwXww7gNe6rZyLWqRFBD0jCq1EaeOrunvyjKT28qaGibzq-VLLIme4JHKJSqRMFEioGxhUeOaweCsLhksiNPq9hX-TTJmLUAJUB8m3BN__GKZdj0gKRo",
  },
  {
    tag: "Ban giám hiệu/Quản trị viên",
    title: "Quản trị tổng thể sức khỏe học đường",
    description:
      "Theo dõi báo cáo tổng hợp theo thời gian, đánh giá tình hình sức khỏe học sinh và điều phối công tác y tế.",
    imageAlt: "Ban giám hiệu xem báo cáo sức khỏe học đường trên hệ thống",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-W5XC3-2MJKmfb-lOR-ZB801FjiVNA_Dc82x-ZgTAo8xsNaxaVv0SYCGZwo88OMgRxSBlDhDuQ61TjAkkvHj28CcrHLPOaEz3X7g85Bvk8AXkjYM7rFl4W7ax1pr2aTtds6g3yPQLOaTT5p1SAe2bWmdQoV4Vm6Arx-e4EGuG0nVuBr93hkM9c_Jf82usUToNXYK7mbXEcvIzr7JBPHsnZrYtE24TQd4UjQ2Yh8TnuY8ToJ-b46rU-qPfF2toRb5xfVO8-up-ncA",
  },
];

const LandingRoleSection = () => {
  return (
    <section id="giai-phap" className="bg-surface py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Giải pháp theo nhóm người dùng"
          description="EduHealth kết nối nhà trường, y tế và phụ huynh trong một quy trình phối hợp thống nhất."
          align="center"
        />

        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {roleItems.map((role) => (
            <article key={role.tag} className="group flex h-full flex-col rounded-3xl bg-surface-container-lowest p-3 shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10">
              <div className="mb-5 aspect-[4/3] overflow-hidden rounded-[1.4rem] shadow-sm transition-shadow duration-300 group-hover:shadow-md group-hover:shadow-slate-900/10">
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={role.imageAlt}
                  src={role.imageSrc}
                />
              </div>
              <span className="mb-3 inline-block w-fit rounded-full bg-secondary-container/30 px-3 py-1 text-xs font-bold text-on-secondary-container">
                {role.tag}
              </span>
              <h3 className="mb-2 font-headline text-xl font-bold leading-snug md:text-[1.35rem]">{role.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-on-surface-variant">{role.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingRoleSection;
