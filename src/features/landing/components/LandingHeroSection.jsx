import React from "react";
import { Link } from "react-router-dom";
import heroProductVisual from "../../../assets/images/landing/hero-product-visual.svg";

const LandingHeroSection = ({ onNewsClick }) => {
  return (
    <header className="relative overflow-hidden bg-[#f8fbf8] pb-10 pt-24 md:pb-12 md:pt-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center space-x-2 rounded-full bg-secondary-container/20 px-3 py-1 text-xs font-bold text-on-secondary-container">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span>Hệ thống sức khỏe học đường • Trường Tiểu học Trần Cao Vân</span>
          </div>

          <h1 className="mb-4 font-headline text-4xl font-bold leading-[1.12] tracking-tight text-primary-container lg:text-6xl">
            Chăm sóc sức khỏe học sinh mỗi ngày
            <br />
            tại Trường Tiểu học Trần Cao Vân
          </h1>

          <p className="mb-6 max-w-xl text-base leading-relaxed text-on-surface-variant lg:text-[1.02rem]">
            Quản lý hồ sơ sức khỏe, lịch tiêm, cấp phát thuốc và phối hợp phụ huynh
            trên một hệ thống thống nhất, dễ theo dõi cho nhà trường.
          </p>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <Link
              to="/login"
              className="signature-gradient flex w-full items-center justify-center space-x-2 rounded-xl px-8 py-3.5 font-bold text-white shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30 sm:w-auto"
            >
              <span>Đăng nhập hệ thống</span>
              <span className="material-symbols-outlined">login</span>
            </Link>

            <button
              type="button"
              onClick={onNewsClick}
              className="w-full rounded-xl bg-surface-container-lowest px-8 py-3.5 font-semibold text-on-surface outline outline-1 outline-variant/20 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-surface-container-low hover:shadow-md sm:w-auto"
            >
              Xem bản tin y tế
            </button>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-900/8 transition-transform duration-700 ease-out group-hover:rotate-0 group-hover:shadow-[0_26px_56px_-28px_rgba(0,107,44,0.3)] lg:rotate-2">
            <img
              className="h-[430px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              alt="Minh họa giao diện sản phẩm EduHealth cho nghiệp vụ sức khỏe học đường"
              src={heroProductVisual}
            />

            <div className="bg-glass absolute bottom-4 left-4 right-4 rounded-2xl border border-white/35 p-4 shadow-md shadow-slate-900/8 backdrop-blur-xl transition-all duration-500 group-hover:shadow-lg group-hover:shadow-slate-900/12">
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
                  <p className="text-sm font-bold text-on-surface">Nhật ký vận hành gần nhất</p>
                  <p className="text-xs text-on-surface-variant">
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
