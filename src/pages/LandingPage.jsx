import React from 'react';
import { Link } from 'react-router-dom';
import LandingTopNav from '../features/landing/components/LandingTopNav';
import LandingFooter from '../features/landing/components/LandingFooter';

const LandingPage = () => {
  return (
    <div className="bg-surface font-body text-on-surface">
      <LandingTopNav />

      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Nền tảng y tế trường học 4.0</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-headline font-extrabold tracking-tight text-on-surface mb-6 leading-[1.1]">
              Hệ thống quản lý <br/><span className="text-primary">sức khỏe học đường</span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-10 max-w-xl">
              Quản lý hồ sơ sức khỏe, khám bệnh, và tiêm chủng cho học sinh một cách chuyên nghiệp, bảo mật và hiệu quả nhất cho môi trường giáo dục hiện đại.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/login" className="px-8 py-4 signature-gradient text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform w-full sm:w-auto">
                <span>Đăng nhập hệ thống</span>
                <span className="material-symbols-outlined">login</span>
              </Link>
              <button className="px-8 py-4 bg-surface-container-lowest text-on-surface font-semibold rounded-xl flex items-center justify-center space-x-2 hover:bg-surface-container-low transition-colors outline-variant/20 outline outline-1 w-full sm:w-auto">
                <span>Tìm hiểu giải pháp</span>
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
              <img 
                className="w-full h-[500px] object-cover" 
                alt="Modern bright school medical office with a professional nurse preparing digital health records on a tablet in a clean sanctuary environment" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCaI6utZwlwd6VMhTcOatyCdFmcPCDDKPDE00fFB_pVJEWdbnMzbDM5Hfc0EC0Po0Mr70toq68ILRQ_AZU26LxoWxEpsibc_szdu4n_ztq9PzQWLSdA93F6NdphwAmXbFSzivQPmdhB4CnfChbtiqj2BXj4DDlULU7J7o6OmKiw-ddHlEJImbKDxECYU0DmMRzyfYiTid_OcRBbtgu873mSt8iRMUVue7Rmqlqhea-KPY67_KY_qLxUUy4E0SYlNQ_GamAd1AfUCs"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-glass rounded-2xl border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Cập nhật hồ sơ mới</p>
                    <p className="text-xs text-on-surface-variant">Vừa hoàn thành khám định kỳ cho 45 học sinh lớp 12A</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-headline font-bold mb-4 tracking-tight">Tính năng cốt lõi</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl">patient_list</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-headline">Quản lý học sinh & Hồ sơ sức khỏe</h3>
                <p className="text-on-surface-variant max-w-md">Lưu trữ tập trung thông tin cá nhân, tiền sử bệnh lý và quá trình phát triển thể chất của từng học sinh trong suốt quá trình học tập.</p>
              </div>
              <img 
                className="absolute -right-20 -bottom-20 w-80 h-80 object-cover rounded-full opacity-10 group-hover:scale-110 transition-transform duration-700" 
                alt="Digital interface showing organized student health data and medical charts on a clean white background with soft green accents" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-gPxEG2taU7QIzNKxe-Q7ojFfDxawEC4XjImKfel9V336Nyo5dl4myHB2jFex74lbLyleA1-HUiQEjy9bO1Dwn721ofZziXxeCfQuJ4a_9j7j_aoG8PHt_wcQbMCa0xMGoDLESguWt15x5OoV63f_T-hnFr52CfLZ67lsiPLKpBVQy3CcT-A5Y5U2E3IxCgPW4YX20YiZVeFZbb6aXZe-9hHCt35yT2Kow5DP1ae1Pl8HxB-9UULoxBQkBKgBTKZJgb61EDHxZ7Q"
              />
            </div>
            <div className="bg-primary text-white p-8 rounded-[2rem] shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl">stethoscope</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-headline">Khám bệnh & Cấp thuốc</h3>
                <p className="text-on-primary/80">Quy trình thăm khám nhanh chóng, ghi nhận triệu chứng và xuất đơn thuốc điện tử tức thì.</p>
              </div>
              <div className="mt-8 flex items-center space-x-2">
                <span className="text-sm font-semibold">Khám ngay</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm flex flex-col group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">inventory_2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-headline">Kho thuốc thông minh</h3>
              <p className="text-on-surface-variant">Theo dõi số lượng, hạn sử dụng và tự động cảnh báo khi tồn kho thấp hoặc thuốc sắp hết hạn.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm flex flex-col group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">vaccines</span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-headline">Quản lý tiêm chủng</h3>
              <p className="text-on-surface-variant">Lịch trình tiêm chủng định kỳ, nhắc lịch cho phụ huynh và lưu trữ chứng nhận tiêm chủng điện tử.</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm flex flex-col group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">bar_chart</span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-headline">Báo cáo & Phân tích</h3>
              <p className="text-on-surface-variant">Hệ thống báo cáo tự động cho Sở/Phòng giáo dục và phân tích xu hướng sức khỏe học đường.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-headline font-extrabold tracking-tight mb-4">Giải pháp cho mọi <span className="text-primary">đối tượng</span></h2>
              <p className="text-on-surface-variant">Được thiết kế chuyên biệt để đáp ứng nhu cầu phối hợp chặt chẽ giữa nhà trường, y tế và gia đình.</p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-outline-variant/20 mx-10 mb-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="aspect-square rounded-3xl overflow-hidden mb-6 shadow-md">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Professional school nurse smiling while working with medical equipment in a bright modern school clinic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-0ZpDIj4YOK_BH4TwPTfgXaNXAo8u9r3e9OeetlAi8FLM6YeCoOyxwKF5eBMe3nOFNKpq1oaC97gy5dvBcQxR6D0dW4gKCBE7ERDj-OGrnFKZJuJ1uYLstUSZwa8iiEaQkIAceTTRznwzrCNYifrgP2fOz-ULCuXMMzh1AEkY78-CSf6iJIe2lpnCuwsmqsF7MrUyg8nFbm80-Z41nvPEQz7zRGnTRpVstdZv17-xGB26cOWW0WcScBqXH92agGysEuCQfMAotAs" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container text-xs font-bold mb-3">Y tá & Cán bộ y tế</div>
              <h3 className="text-2xl font-bold mb-3 font-headline">Nghiệp vụ chuyên môn</h3>
              <p className="text-on-surface-variant">Số hóa toàn bộ sổ sách, tập trung vào chăm sóc thay vì giấy tờ hành chính phức tạp.</p>
            </div>
            <div className="group">
              <div className="aspect-square rounded-3xl overflow-hidden mb-6 shadow-md">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Happy parent looking at a health report on a smartphone while sitting in a sunny living room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS7l7kk92c3VzupRrTiMDOCBsJckDV3GOgp6QS_OS3XxrNimo_eL_GMaN5GsbXb186mdPFs-hjr1o_pK7bhT347TZOhsnJZC5W0rKgu6_TBNfQMDB8XidS-BIdhr5YJE4Nzl635kX0KAAVbs2WrYw5VBSVwXww7gNe6rZyLWqRFBD0jCq1EaeOrunvyjKT28qaGibzq-VLLIme4JHKJSqRMFEioGxhUeOaweCsLhksiNPq9hX-TTJmLUAJUB8m3BN__GKZdj0gKRo" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container text-xs font-bold mb-3">Phụ huynh học sinh</div>
              <h3 className="text-2xl font-bold mb-3 font-headline">Theo dõi tức thì</h3>
              <p className="text-on-surface-variant">Nhận thông báo ngay khi con có vấn đề sức khỏe hoặc lịch tiêm chủng, cập nhật tình hình thể chất định kỳ.</p>
            </div>
            <div className="group">
              <div className="aspect-square rounded-3xl overflow-hidden mb-6 shadow-md">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="School administrator analyzing school-wide health data charts on a computer screen in a professional office" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-W5XC3-2MJKmfb-lOR-ZB801FjiVNA_Dc82x-ZgTAo8xsNaxaVv0SYCGZwo88OMgRxSBlDhDuQ61TjAkkvHj28CcrHLPOaEz3X7g85Bvk8AXkjYM7rFl4W7ax1pr2aTtds6g3yPQLOaTT5p1SAe2bWmdQoV4Vm6Arx-e4EGuG0nVuBr93hkM9c_Jf82usUToNXYK7mbXEcvIzr7JBPHsnZrYtE24TQd4UjQ2Yh8TnuY8ToJ-b46rU-qPfF2toRb5xfVO8-up-ncA" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container text-xs font-bold mb-3">Ban giám hiệu (Admin)</div>
              <h3 className="text-2xl font-bold mb-3 font-headline">Quản trị tổng thể</h3>
              <p className="text-on-surface-variant">Cái nhìn toàn cảnh về sức khỏe học đường toàn trường, quản lý nhân sự và kho dược hiệu quả.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="signature-gradient rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-headline font-extrabold mb-6 tracking-tight">Sẵn sàng nâng tầm y tế học đường?</h2>
              <p className="text-lg text-on-primary-container/80 mb-10 max-w-2xl mx-auto">
                Tham gia cùng hàng trăm trường học đang áp dụng công nghệ để kiến tạo môi trường học tập an toàn và khỏe mạnh cho học sinh.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-10 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-surface-container-lowest transition-colors shadow-xl">
                  Đăng ký tư vấn miễn phí
                </button>
                <button className="px-10 py-4 bg-transparent border-2 border-white/40 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors">
                  Xem bản Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
