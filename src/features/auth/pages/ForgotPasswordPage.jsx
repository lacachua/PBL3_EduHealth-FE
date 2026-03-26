import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { requestPasswordOtp } from '../services/authApi';
import AuthShell from '../components/AuthShell';
import AuthCard from '../components/AuthCard';
import AuthPageHeader from '../components/AuthPageHeader';
import AuthTextField from '../components/AuthTextField';
import AuthBackLink from '../components/AuthBackLink';
import AuthSupportText from '../components/AuthSupportText';
import { authCopy } from '../constants/authCopy';

const FORGOT_COPY = authCopy.forgotPassword;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');
    setSubmitError('');

    const normalizedIdentifier = identifier.trim();

    if (!normalizedIdentifier) {
      setValidationError('Vui lòng nhập email hoặc tên đăng nhập.');
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordOtp({ identifier: normalizedIdentifier });
      navigate('/verify-otp', { state: { identifier: normalizedIdentifier } });
    } catch (error) {
      setSubmitError(normalizeApiMessage(error, 'Không thể gửi mã OTP. Vui lòng thử lại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell contentClassName="max-w-[29rem]">
      <AuthCard>
        <AuthPageHeader
          icon="key"
          title={FORGOT_COPY.title}
          description={FORGOT_COPY.description}
        />

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <AuthTextField
            id="identifier"
            label={FORGOT_COPY.identifierLabel}
            icon="person"
            name="identifier"
            value={identifier}
            onChange={(event) => {
              setIdentifier(event.target.value);
              if (validationError) setValidationError('');
              if (submitError) setSubmitError('');
            }}
            placeholder="name@school.edu"
            required
          />

          {validationError && <p className="text-sm text-error">{validationError}</p>}
          {submitError && <p className="text-sm text-error">{submitError}</p>}

          <button
            className="signature-gradient flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-on-primary shadow-md shadow-primary/15 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? FORGOT_COPY.submitting : FORGOT_COPY.submit}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-2.5 border-t border-outline-variant/20 pt-3.5">
          <AuthBackLink to="/login">{FORGOT_COPY.backToLogin}</AuthBackLink>
          <AuthSupportText prompt={FORGOT_COPY.supportPrompt} action={FORGOT_COPY.supportAction} />
        </div>
      </AuthCard>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
