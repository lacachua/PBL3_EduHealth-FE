import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/authApi';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { useAuth } from '../../../app/providers/useAuth';
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
const ROLE_PATHS = {
  ADMIN: '/admin/dashboard',
  NURSE: '/nurse/dashboard',
  PARENT: '/parent/dashboard',
  admin: '/admin/dashboard',
  nurse: '/nurse/dashboard',
  parent: '/parent/dashboard',
};

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

  const resolveRolePath = (role) => {
    if (!role) {
      return '/';
    }
    return ROLE_PATHS[role] || ROLE_PATHS[String(role).toUpperCase()] || ROLE_PATHS[String(role).toLowerCase()] || '/';
  };

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
      navigate(fromPath || resolveRolePath(responseUser.role), { replace: true });
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

        <form className="space-y-3" onSubmit={handleSubmit}>
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

          <div className="flex items-center justify-between gap-3 pt-1.5 text-sm">
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
            className="auth-primary-button group flex h-14 w-full items-center justify-center gap-2 rounded-[14px] text-[16px] font-semibold text-white transition-all hover:brightness-[1.03] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? LOGIN_COPY.submitting : LOGIN_COPY.submit}
            <span className="material-symbols-outlined text-[21px] transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
          </button>
        </form>
      </AuthCard>
    </AuthShell>
  );
};

export default LoginPage;
