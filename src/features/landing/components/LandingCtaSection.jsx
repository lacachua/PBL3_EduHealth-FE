import React from "react";
import { Link } from "react-router-dom";

const LandingCtaSection = ({ onNewsClick }) => {
  return (
    <section id="lien-he" className="scroll-mt-[5.5rem] pb-6 pt-10 md:pb-8 md:pt-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/28 bg-[linear-gradient(135deg,#2b7d60_0%,#23684c_100%)] p-7 text-center text-white shadow-xl shadow-primary/22 sm:p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="mb-3 inline-flex items-center rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-[0.05em] text-white/95">
              TRUY CẬP HỆ THỐNG
            </span>
            <h2 className="mb-3 max-w-2xl font-headline text-[1.85rem] font-extrabold leading-tight tracking-tight lg:text-[2.75rem]">
              Sẵn sàng quản lý y tế học đường hiệu quả hơn?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-base text-white/85 lg:text-lg">
              Đăng nhập hệ thống để cập nhật hồ sơ sức khỏe, theo dõi hoạt động y tế và phối hợp thông tin giữa nhà trường với phụ huynh.
            </p>
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <Link
                to="/login"
                className="app-focus-ring inline-flex min-h-[2.8rem] items-center justify-center rounded-2xl border border-white bg-white px-9 py-3 text-[15px] font-bold text-primary shadow-xl transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-surface-container-lowest hover:shadow-2xl"
              >
                Đăng nhập hệ thống
              </Link>
              <button
                type="button"
                onClick={onNewsClick}
                className="app-focus-ring inline-flex min-h-[2.8rem] items-center justify-center rounded-2xl border border-white/45 bg-white/5 px-8 py-3 text-[15px] font-semibold text-white transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-white/12 hover:shadow-lg hover:shadow-black/10"
              >
                Xem bản tin y tế
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCtaSection;
