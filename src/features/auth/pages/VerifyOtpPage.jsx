import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthFooter, AuthTopNav } from '../components/AuthChrome';
import { authCopy } from '../constants/authCopy';

const VERIFY_COPY = authCopy.verifyOtp;

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/change-password');
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <AuthTopNav variant="simple" />

      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md z-10">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(25,28,30,0.04)] border border-outline-variant/20">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 bg-primary-container/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3 leading-tight">{VERIFY_COPY.title}</h1>
              <p className="text-on-surface-variant text-sm max-w-[280px] leading-relaxed">{VERIFY_COPY.description}</p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-6 gap-2 md:gap-3">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    className="w-full h-14 md:h-16 text-center text-2xl font-bold bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary transition-all duration-200 outline-none"
                    maxLength="1"
                    required
                    type="text"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>

              <div className="space-y-6">
                <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2" type="submit">
                  <span>{VERIFY_COPY.submit}</span>
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                </button>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-medium">{VERIFY_COPY.resendPrompt}</span>
                  <a className="text-sm text-primary font-bold hover:underline underline-offset-4 transition-all decoration-2" href="#">
                    {VERIFY_COPY.resendAction}
                  </a>
                </div>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-outline-variant/10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-semibold">
              <span className="material-symbols-outlined text-sm">lock</span>
              {VERIFY_COPY.securityCaption}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">help</span>
              {VERIFY_COPY.supportAction}
            </Link>
          </div>
        </div>
      </main>

      <AuthFooter variant="full" brandText="EduHealth" />
    </div>
  );
};

export default VerifyOtpPage;
