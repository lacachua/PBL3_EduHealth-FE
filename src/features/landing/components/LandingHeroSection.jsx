import React from "react";
import { Link } from "react-router-dom";
import heroProductVisual from "../../../assets/images/landing/hero-product-visual.svg";

const LandingHeroSection = ({ onNewsClick }) => {
  return (
    <header className="relative overflow-hidden pb-10 pt-24 md:pb-12 md:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(780px_340px_at_10%_-4%,rgba(60,144,112,0.14),transparent_70%),radial-gradient(680px_280px_at_96%_0%,rgba(95,154,197,0.14),transparent_66%),linear-gradient(180deg,#f5faf7_0%,#f8fbf8_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/65 to-transparent" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-white/78 px-3 py-1 text-[11px] font-bold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Hệ thống sức khỏe học đường • Trường Tiểu học Trần Cao Vân</span>
          </div>

          <h1 className="mb-4 font-headline text-[clamp(2rem,1.56rem+1.95vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-on-surface">
            Chăm sóc sức khỏe học sinh mỗi ngày
            <br />
            tại Trường Tiểu học Trần Cao Vân
          </h1>

          <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-on-surface-muted lg:text-[1rem]">
            Quản lý hồ sơ sức khỏe, lịch tiêm, cấp phát thuốc và phối hợp phụ huynh
            trên một hệ thống thống nhất, dễ theo dõi cho nhà trường.
          </p>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <Link
              to="/login"
              className="app-focus-ring signature-gradient flex w-full items-center justify-center space-x-2 rounded-xl px-8 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-primary/24 transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/30 sm:w-auto"
            >
              <span>Đăng nhập hệ thống</span>
              <span className="material-symbols-outlined">login</span>
            </Link>

            <button
              type="button"
              onClick={onNewsClick}
              className="app-focus-ring app-btn-secondary w-full px-8 sm:w-auto"
            >
              Xem bản tin y tế
            </button>
          </div>

          <p className="mt-3 text-[12px] font-medium text-on-surface-muted">
            Tập trung vận hành thực tế cho nhà trường, bộ phận y tế và phụ huynh.
          </p>
        </div>

        <div className="group relative z-10">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/75 bg-white/55 shadow-[0_24px_54px_-32px_rgba(15,23,42,0.42)] transition-transform duration-700 ease-out group-hover:rotate-0 group-hover:shadow-[0_30px_58px_-30px_rgba(0,107,44,0.32)] lg:rotate-[1.5deg]">
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-tr from-white/14 via-transparent to-primary/14" />

            <img
              className="h-[432px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              alt="Minh họa giao diện sản phẩm EduHealth cho nghiệp vụ sức khỏe học đường"
              src={heroProductVisual}
            />

            <div className="absolute left-4 top-4 z-[2] inline-flex items-center gap-1 rounded-full border border-white/45 bg-black/25 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              <span className="material-symbols-outlined text-[15px]">monitoring</span>
              Bảng điều phối trực tuyến
            </div>

            <div className="absolute right-4 top-4 z-[2] rounded-xl border border-white/45 bg-white/18 px-2.5 py-1.5 text-right text-[11px] font-semibold text-white backdrop-blur-sm">
              <p className="leading-tight">Hồ sơ mới</p>
              <p className="text-[14px] font-bold leading-tight">+32 hôm nay</p>
            </div>

            <div className="bg-glass absolute bottom-4 left-4 right-4 z-[2] rounded-2xl border border-white/35 p-4 shadow-md shadow-slate-900/8 backdrop-blur-xl transition-[box-shadow,background-color,transform] duration-500 group-hover:shadow-lg group-hover:shadow-slate-900/12">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-white">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    medical_services
                  </span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-on-surface">Nhật ký vận hành gần nhất</p>
                  <p className="text-[12px] text-on-surface-variant">
                    Hoàn tất cập nhật khám sức khỏe định kỳ cho lớp 4A.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeroSection;
