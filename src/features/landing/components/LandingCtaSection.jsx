import React from "react";
import { Link } from "react-router-dom";

const LandingCtaSection = ({ onNewsClick }) => {
  return (
    <section id="lien-he" className="pb-7 pt-12 md:pb-8 md:pt-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="signature-gradient relative overflow-hidden rounded-[2.5rem] p-8 text-center text-white shadow-2xl shadow-primary/20 sm:p-10 lg:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="mb-4 max-w-2xl font-headline text-[2rem] font-extrabold leading-tight tracking-tight lg:text-5xl">
              Sẵn sàng số hóa công tác y tế học đường?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base text-white/85 lg:text-lg">
              Bắt đầu vận hành EduHealth tại Trường Tiểu học Trần Cao Vân để thông tin sức khỏe học sinh
              được cập nhật nhất quán, minh bạch và kịp thời.
            </p>
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <Link
                to="/login"
                className="rounded-2xl bg-white px-10 py-4 font-bold text-primary shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-surface-container-lowest hover:shadow-2xl"
              >
                Đăng nhập hệ thống
              </Link>
              <button
                type="button"
                onClick={onNewsClick}
                className="rounded-2xl border border-white/45 bg-white/5 px-9 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-white/12 hover:shadow-lg hover:shadow-black/10"
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
