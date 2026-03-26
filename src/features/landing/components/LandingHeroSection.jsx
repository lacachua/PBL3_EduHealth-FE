import React from "react";
import { Link } from "react-router-dom";

const LandingHeroSection = ({ onNewsClick }) => {
  return (
    <header className="relative overflow-hidden pb-14 pt-28 md:pb-16 md:pt-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-secondary-container/20 px-3 py-1 text-xs font-bold text-on-secondary-container">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span>Y tế học đường - Trường Tiểu học Trần Cao Vân</span>
          </div>

          <h1 className="mb-6 font-headline text-5xl font-extrabold leading-[1.08] tracking-tight text-on-surface lg:text-7xl">
            Hệ thống quản lý sức khỏe học đường
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-relaxed text-on-surface-variant lg:text-[1.05rem]">
            EduHealth hỗ trợ Trường Tiểu học Trần Cao Vân số hóa hồ sơ sức khỏe học sinh,
            quản lý khám bệnh, cấp thuốc, tiêm chủng và kết nối thông tin sức khỏe giữa nhà trường
            với phụ huynh một cách rõ ràng, kịp thời.
          </p>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              to="/login"
              className="signature-gradient flex w-full items-center justify-center space-x-2 rounded-xl px-8 py-4 font-bold text-white shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30 sm:w-auto"
            >
              <span>Đăng nhập hệ thống</span>
              <span className="material-symbols-outlined">login</span>
            </Link>

            <button
              type="button"
              onClick={onNewsClick}
              className="w-full rounded-xl bg-surface-container-lowest px-8 py-4 font-semibold text-on-surface outline outline-1 outline-variant/20 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-surface-container-low hover:shadow-md sm:w-auto"
            >
              Xem bản tin y tế
            </button>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/10 transition-transform duration-700 ease-out group-hover:rotate-0 group-hover:shadow-[0_30px_70px_-25px_rgba(0,107,44,0.35)] lg:rotate-2">
            <img
              className="h-[500px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              alt="Phòng y tế trường tiểu học với y tá đang cập nhật hồ sơ sức khỏe học sinh"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCaI6utZwlwd6VMhTcOatyCdFmcPCDDKPDE00fFB_pVJEWdbnMzbDM5Hfc0EC0Po0Mr70toq68ILRQ_AZU26LxoWxEpsibc_szdu4n_ztq9PzQWLSdA93F6NdphwAmXbFSzivQPmdhB4CnfChbtiqj2BXj4DDlULU7J7o6OmKiw-ddHlEJImbKDxECYU0DmMRzyfYiTid_OcRBbtgu873mSt8iRMUVue7Rmqlqhea-KPY67_KY_qLxUUy4E0SYlNQ_GamAd1AfUCs"
            />

            <div className="bg-glass absolute bottom-6 left-6 right-6 rounded-2xl border border-white/30 p-6 shadow-lg shadow-slate-900/10 backdrop-blur-xl transition-all duration-500 group-hover:shadow-xl group-hover:shadow-slate-900/15">
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
                  <p className="text-sm font-bold text-on-surface">Cập nhật hồ sơ mới</p>
                  <p className="text-xs text-on-surface-variant">
                    Vừa hoàn thành khám sức khỏe định kỳ cho học sinh lớp 4A
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
