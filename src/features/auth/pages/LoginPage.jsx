import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/authApi';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { useAuth } from '../../../app/providers/useAuth';
import AuthShell from '../components/AuthShell';
import AuthCard from '../components/AuthCard';
import AuthPageHeader from '../components/AuthPageHeader';
import AuthTextField from '../components/AuthTextField';
import AuthSupportText from '../components/AuthSupportText';
import { authCopy } from '../constants/authCopy';

const LOGIN_COPY = authCopy.login;
const ROLE_PATHS = {
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
  const [errorMessage, setErrorMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError('');
    if (errorMessage) setErrorMessage('');
  };

  const handleRememberChange = (event) => {
    const { checked } = event.target;
    setFormData((prev) => ({ ...prev, remember: checked }));
  };

  const resolveRolePath = (role) => {
    return ROLE_PATHS[role] || '/';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');
    setErrorMessage('');

    if (!formData.identifier.trim() || !formData.password) {
      setValidationError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
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
      setErrorMessage(normalizeApiMessage(error, LOGIN_COPY.genericError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell contentClassName="max-w-[30rem]">
      <AuthCard>
        <AuthPageHeader
          icon="health_and_safety"
          title={LOGIN_COPY.title}
          description={LOGIN_COPY.description}
        />

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <AuthTextField
            id="identifier"
            label={LOGIN_COPY.identifierLabel}
            icon="person"
            name="identifier"
            value={formData.identifier}
            onChange={handleInputChange}
            placeholder="name@school.edu"
            required
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
          />

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-on-surface-variant transition-colors hover:text-on-surface">
              <input
                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20"
                type="checkbox"
                checked={formData.remember}
                onChange={handleRememberChange}
              />
              {LOGIN_COPY.remember}
            </label>
            <Link to="/forgot-password" className="font-semibold text-primary transition-colors hover:text-primary-container">
              {LOGIN_COPY.forgotPassword}
            </Link>
          </div>

          {validationError && <p className="text-sm text-error" role="alert">{validationError}</p>}
          {errorMessage && <p className="text-sm text-error" role="alert">{errorMessage}</p>}

          <button
            className="signature-gradient flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-on-primary shadow-md shadow-primary/15 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? LOGIN_COPY.submitting : LOGIN_COPY.submit}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        <div className="mt-4 border-t border-outline-variant/20 pt-3.5">
          <AuthSupportText prompt={LOGIN_COPY.supportPrompt} action={LOGIN_COPY.supportAction} />
        </div>
      </AuthCard>
    </AuthShell>
  );
};

export default LoginPage;
