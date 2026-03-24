import React from 'react';
import { Link } from 'react-router-dom';
import { AuthBrand, AuthFooter } from '../components/AuthChrome';
import AuthTextField from '../components/AuthTextField';
import { authCopy } from '../constants/authCopy';

const CHANGE_COPY = authCopy.changePassword;

const ChangePasswordPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-secondary-container/10 rounded-full blur-[100px]"></div>

        <div className="w-full max-w-md z-10">
          <div className="flex justify-center mb-8">
            <AuthBrand icon="health_and_safety" iconClassName="text-3xl" textClassName="text-2xl font-bold" />
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-12px_rgba(25,28,30,0.04)] p-8 md:p-10 border border-outline-variant/10">
            <div className="mb-8">
              <h1 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2 text-center">{CHANGE_COPY.title}</h1>
              <p className="text-on-surface-variant text-sm text-center">{CHANGE_COPY.description}</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <AuthTextField
                  id="new-password"
                  label={CHANGE_COPY.newPasswordLabel}
                  icon="lock"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  enablePasswordToggle
                  inputClassName="py-3.5 rounded-lg ring-1 ring-outline-variant/20 focus:bg-surface-container-lowest placeholder:text-outline/50"
                  labelClassName="normal-case tracking-normal text-sm px-1 mb-2"
                />

                <div className="grid grid-cols-2 gap-2 mt-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-[11px] font-medium text-on-surface-variant">{CHANGE_COPY.rules[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-outline">circle</span>
                    <span className="text-[11px] font-medium text-on-surface-variant">{CHANGE_COPY.rules[1]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-outline">circle</span>
                    <span className="text-[11px] font-medium text-on-surface-variant">{CHANGE_COPY.rules[2]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-outline">circle</span>
                    <span className="text-[11px] font-medium text-on-surface-variant">{CHANGE_COPY.rules[3]}</span>
                  </div>
                </div>
              </div>

              <AuthTextField
                id="confirm-password"
                label={CHANGE_COPY.confirmPasswordLabel}
                icon="verified_user"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                enablePasswordToggle
                inputClassName="py-3.5 rounded-lg ring-1 ring-outline-variant/20 focus:bg-surface-container-lowest placeholder:text-outline/50"
                labelClassName="normal-case tracking-normal text-sm px-1 mb-2"
              />

              <button className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-4" type="submit">
                {CHANGE_COPY.submit}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-container transition-colors inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                {CHANGE_COPY.backToLogin}
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-on-surface-variant leading-relaxed max-w-[280px] mx-auto">
            {CHANGE_COPY.supportDescription} <span className="text-primary font-semibold">{CHANGE_COPY.supportAction}</span>.
          </p>
        </div>
      </main>

      <AuthFooter variant="full" brandText="EduHealth" />
    </div>
  );
};

export default ChangePasswordPage;
