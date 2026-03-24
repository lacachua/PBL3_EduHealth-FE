import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/authApi';
import { useAuth } from '../../../app/providers/useAuth';
import { AuthFooter, AuthSecurityBadges, AuthTopNav } from '../components/AuthChrome';
import AuthTextField from '../components/AuthTextField';
import { authCopy } from '../constants/authCopy';

const LOGIN_COPY = authCopy.login;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    remember: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRememberChange = (event) => {
    const { checked } = event.target;
    setFormData((prev) => ({ ...prev, remember: checked }));
  };

  const resolveRolePath = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'nurse') return '/nurse/dashboard';
    if (role === 'parent') return '/parent/dashboard';
    return '/';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        identifier: formData.identifier,
        password: formData.password,
      };
      const response = await loginApi(payload);
      const responseUser = response?.user ?? null;
      const responseToken = response?.accessToken ?? response?.token;

      if (!responseUser || !responseToken) {
        throw new Error('Phản hồi đăng nhập không hợp lệ');
      }

      login({ user: responseUser, accessToken: responseToken, remember: formData.remember });

      const fromPath = location.state?.from?.pathname;
      navigate(fromPath || resolveRolePath(responseUser.role), { replace: true });
    } catch (error) {
      const serverError = error?.response?.data?.message;
      setErrorMessage(serverError || LOGIN_COPY.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
      <AuthTopNav variant="full" />

      <main className="flex-grow flex items-center justify-center pt-20 px-4 relative overflow-hidden bg-surface-container-low">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-fixed rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-container rounded-full blur-[150px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 soft-ambient-shadow border border-outline-variant/10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container/10 text-primary mb-6">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
              </div>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">{LOGIN_COPY.title}</h1>
              <p className="text-on-surface-variant text-sm font-light">{LOGIN_COPY.description}</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <AuthTextField
                id="identifier"
                label={LOGIN_COPY.identifierLabel}
                icon="person"
                name="identifier"
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder="name@school.edu"
                required
                labelClassName="tracking-widest mb-2"
              />

              <AuthTextField
                id="password"
                label={LOGIN_COPY.passwordLabel}
                icon="lock"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type="password"
                placeholder="••••••••"
                required
                enablePasswordToggle
                labelClassName="tracking-widest mb-2"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={handleRememberChange}
                  />
                  <span className="ml-3 text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{LOGIN_COPY.remember}</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-container transition-colors">{LOGIN_COPY.forgotPassword}</Link>
              </div>

              {errorMessage && <p className="text-error text-sm" role="alert">{errorMessage}</p>}

              <button className="w-full signature-gradient text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit" disabled={isSubmitting}>
                {isSubmitting ? LOGIN_COPY.submitting : LOGIN_COPY.submit}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-outline-variant/20 text-center">
              <p className="text-sm text-on-surface-variant">
                {LOGIN_COPY.createAccountPrompt}
                <a className="font-bold text-primary hover:underline ml-1" href="#">{LOGIN_COPY.createAccountAction}</a>
              </p>
            </div>
          </div>

          <AuthSecurityBadges />
        </div>
      </main>

      <AuthFooter variant="full" brandText="EduHealth" />
    </div>
  );
};

export default LoginPage;
