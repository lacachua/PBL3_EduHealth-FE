import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { requestPasswordOtp } from '../services/authApi';
import AuthShell from '../components/AuthShell';
import AuthCard from '../components/AuthCard';
import AuthPageHeader from '../components/AuthPageHeader';
import AuthInput from '../components/AuthInput';
import AuthBackLink from '../components/AuthBackLink';
import AuthStatusMessage from '../components/AuthStatusMessage';
import { authCopy } from '../constants/authCopy';
import { AUTH_PANEL_CONFIG } from '../constants/authFlowConfig';
import { validateEmail, validateRequired } from '../schemas/authSchema';

const FORGOT_COPY = authCopy.forgotPassword;

const ForgotPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(location.state?.identifier || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const resetFeedback = () => {
    if (fieldError) setFieldError('');
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldError('');
    setSubmitError('');

    const normalizedIdentifier = identifier.trim();

    if (!validateRequired(normalizedIdentifier)) {
      setFieldError(FORGOT_COPY.invalidEmail);
      return;
    }

    if (!validateEmail(normalizedIdentifier)) {
      setFieldError(FORGOT_COPY.invalidEmail);
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordOtp({ identifier: normalizedIdentifier });
      navigate('/verify-otp', { state: { identifier: normalizedIdentifier } });
    } catch (error) {
      const normalizedMessage = normalizeApiMessage(error, 'Khong the gui ma xac thuc. Vui long thu lai.');
      setSubmitError(normalizedMessage);
      if (/khong ton tai/i.test(normalizedMessage)) {
        setFieldError(FORGOT_COPY.notFoundEmail);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell panel={AUTH_PANEL_CONFIG.forgotPassword}>
      <AuthCard>
        <AuthPageHeader
          title={FORGOT_COPY.title}
          subtitle={FORGOT_COPY.description}
          centered
        />

        <form className="space-y-3" onSubmit={handleSubmit}>
          <AuthInput
            id="identifier"
            label={FORGOT_COPY.identifierLabel}
            icon="mail"
            name="identifier"
            value={identifier}
            onChange={(event) => {
              setIdentifier(event.target.value);
              resetFeedback();
            }}
            placeholder={FORGOT_COPY.identifierPlaceholder}
            autoComplete="email"
            required
            error={fieldError}
          />

          <AuthStatusMessage message={submitError} type="error" />

          <button
            className="auth-primary-button flex h-14 w-full items-center justify-center gap-2 rounded-[14px] text-[16px] font-semibold text-white transition-all hover:brightness-[1.03] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? FORGOT_COPY.submitting : FORGOT_COPY.submit}
            <span className="material-symbols-outlined text-[21px]">arrow_forward</span>
          </button>
        </form>

        <div className="mt-4 border-t border-auth-border/70 pt-3.5">
          <AuthBackLink to="/login">{FORGOT_COPY.backToLogin}</AuthBackLink>
        </div>
      </AuthCard>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
