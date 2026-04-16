import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/authApi';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { useAuth } from '../../../app/providers/useAuth';
import { resolveRoleHomePath } from '../../../shared/config/roleHomePaths';
import AuthShell from '../components/AuthShell';
import AuthCard from '../components/AuthCard';
import AuthPageHeader from '../components/AuthPageHeader';
import AuthInput from '../components/AuthInput';
import PasswordField from '../components/PasswordField';
import AuthStatusMessage from '../components/AuthStatusMessage';
import { authCopy } from '../constants/authCopy';
import { AUTH_PANEL_CONFIG } from '../constants/authFlowConfig';
import { validateRequired } from '../schemas/authSchema';

const LOGIN_COPY = authCopy.login;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    remember: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    identifier: '',
    password: '',
  });
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError('');
  };

  const handleRememberChange = (event) => {
    const { checked } = event.target;
    setFormData((prev) => ({ ...prev, remember: checked }));
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    navigate(resolveRoleHomePath(user?.role, '/'), { replace: true });
  }, [isAuthenticated, navigate, user?.role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const nextErrors = {
      identifier: validateRequired(formData.identifier) ? '' : LOGIN_COPY.invalidIdentifier,
      password: validateRequired(formData.password) ? '' : LOGIN_COPY.invalidPassword,
    };

    if (nextErrors.identifier || nextErrors.password) {
      setFieldErrors(nextErrors);
      return;
    }

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
      navigate(fromPath || resolveRoleHomePath(responseUser.role, '/'), { replace: true });
    } catch (error) {
      setSubmitError(normalizeApiMessage(error, LOGIN_COPY.genericError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell panel={AUTH_PANEL_CONFIG.login}>
      <AuthCard>
        <AuthPageHeader
          title={LOGIN_COPY.title}
          subtitle={LOGIN_COPY.description}
          centered
        />

        <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5">
          <span className="auth-panel-chip">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            Đăng nhập an toàn theo vai trò
          </span>
          <span className="auth-panel-chip">
            <span className="material-symbols-outlined text-[14px]">domain</span>
            Dành cho tài khoản do nhà trường cấp
          </span>
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <AuthInput
            id="identifier"
            label={LOGIN_COPY.identifierLabel}
            icon="person"
            name="identifier"
            value={formData.identifier}
            onChange={handleInputChange}
            placeholder={LOGIN_COPY.identifierPlaceholder}
            autoComplete="username"
            required
            error={fieldErrors.identifier}
          />

          <PasswordField
            id="password"
            label={LOGIN_COPY.passwordLabel}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={LOGIN_COPY.passwordPlaceholder}
            autoComplete="current-password"
            required
            error={fieldErrors.password}
          />

          <div className="flex items-center justify-between gap-3 pt-0.5 text-[13px]">
            <label className="flex cursor-pointer items-center gap-2 text-auth-text-body transition-colors hover:text-auth-text-strong">
              <input
                className="h-4 w-4 rounded border-auth-border text-auth-primary focus:ring-auth-primary/20"
                type="checkbox"
                checked={formData.remember}
                onChange={handleRememberChange}
              />
              {LOGIN_COPY.remember}
            </label>
            <Link to="/forgot-password" className="font-semibold text-auth-primary transition-colors hover:text-auth-primary-hover">
              {LOGIN_COPY.forgotPassword}
            </Link>
          </div>

          <AuthStatusMessage message={submitError} type="error" />

          <button
            className="auth-primary-button app-focus-ring group flex h-[3.3rem] w-full items-center justify-center gap-2 rounded-[14px] text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? LOGIN_COPY.submitting : LOGIN_COPY.submit}
            <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-0.5">arrow_forward</span>
          </button>

          <p className="text-center text-[12px] font-medium text-auth-text-muted">
            Cần hỗ trợ truy cập? Vui lòng liên hệ bộ phận quản trị của trường.
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
};

export default LoginPage;
