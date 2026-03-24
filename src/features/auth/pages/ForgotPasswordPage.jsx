import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthBrand, AuthFooter } from '../components/AuthChrome';
import AuthTextField from '../components/AuthTextField';
import { authCopy } from '../constants/authCopy';

const FORGOT_COPY = authCopy.forgotPassword;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      navigate('/verify-otp', { state: { identifier } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-fixed/10 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md z-10">
          <div className="flex justify-center mb-8">
            <AuthBrand icon="medical_services" iconClassName="text-4xl" textClassName="text-2xl font-extrabold" />
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-10 shadow-[0_32px_64px_-12px_rgba(25,28,30,0.04)] border border-outline-variant/20">
            <div className="text-center mb-8">
              <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-3">{FORGOT_COPY.title}</h1>
              <p className="text-on-surface-variant text-sm leading-relaxed">{FORGOT_COPY.description}</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <AuthTextField
                id="identifier"
                label={FORGOT_COPY.identifierLabel}
                icon="person"
                name="identifier"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="example@eduhealth.vn"
                required
                inputClassName="rounded-lg focus:ring-primary/20"
              />

              <button className="w-full py-4 px-6 signature-gradient text-on-primary font-headline font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="submit" disabled={isSubmitting}>
                {isSubmitting ? FORGOT_COPY.submitting : FORGOT_COPY.submit}
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-surface-container-high flex flex-col items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-container transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                {FORGOT_COPY.backToLogin}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span>{FORGOT_COPY.supportPrompt}</span>
                <a className="text-primary font-semibold hover:underline" href="#">{FORGOT_COPY.supportAction}</a>
              </div>
            </div>
          </div>

          <div className="mt-12 opacity-40 grayscale contrast-125 flex justify-center">
            <img
              alt="Decorative wellness illustration"
              className="h-24 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdS6b2TFVzIsPQm2ZGp-8m-vfIAeDljnEUd8xDHHQjRzIsLs4h5cdyYPCUDfotf718IZ856jcRpzr_BdMNbPLFOoWsuUMj-Dx3xrKN4R_4HXohzgGEH7uUnFj025BIOdCgrwqTz8bGRwX6_bA0cnVonxWnC7p6SLYTLixdlDVaprMgodyyFPx-NDUxx4zjJTfSaGXriVSEmrfOp1YcBOoE-xhkdx3PA4vFQQhHxglTVxOLL7IoPC2kaBcNcSZAVar_jlEi5GRnx0c"
            />
          </div>
        </div>
      </main>

      <AuthFooter variant="compact" />
    </div>
  );
};

export default ForgotPasswordPage;
