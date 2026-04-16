import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { resendPasswordOtp, verifyPasswordOtp } from '../services/authApi';
import AuthShell from '../components/AuthShell';
import AuthCard from '../components/AuthCard';
import AuthPageHeader from '../components/AuthPageHeader';
import AuthBackLink from '../components/AuthBackLink';
import AuthStatusMessage from '../components/AuthStatusMessage';
import OTPInput from '../components/OTPInput';
import { authCopy } from '../constants/authCopy';
import { AUTH_PANEL_CONFIG } from '../constants/authFlowConfig';
import { maskEmail } from '../adapters/authAdapter';
import { validateOtpCode } from '../schemas/authSchema';

const VERIFY_COPY = authCopy.verifyOtp;
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [resendError, setResendError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(RESEND_SECONDS);
  const identifier = location.state?.identifier || '';
  const normalizedIdentifier = identifier.trim();
  const maskedIdentifier = maskEmail(normalizedIdentifier);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  const clearFeedback = () => {
    if (otpError) setOtpError('');
    if (submitError) setSubmitError('');
    if (resendError) setResendError('');
  };

  const handleOtpChange = (value) => {
    setOtpCode(value);
    clearFeedback();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');
    setSubmitError('');

    if (!normalizedIdentifier) {
      setSubmitError(VERIFY_COPY.missingIdentifier);
      return;
    }

    if (!validateOtpCode(otpCode, OTP_LENGTH)) {
      setOtpError(VERIFY_COPY.invalidCode);
      return;
    }

    setIsSubmitting(true);
    try {
      const verificationResult = await verifyPasswordOtp({ identifier: normalizedIdentifier, otp: otpCode });
      const resetToken = verificationResult?.resetToken || verificationResult?.token || null;

      navigate('/change-password', {
        state: {
          identifier: normalizedIdentifier,
          otp: otpCode,
          resetToken,
        },
      });
    } catch (error) {
      setSubmitError(normalizeApiMessage(error, 'Xác nhận OTP thất bại. Vui lòng thử lại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setResendError('');

    if (!normalizedIdentifier) {
      setResendError('Không tìm thấy thông tin tài khoản để gửi lại OTP.');
      return;
    }

    if (resendCountdown > 0) {
      return;
    }

    setIsResending(true);
    try {
      await resendPasswordOtp({ identifier: normalizedIdentifier });
      setOtpCode('');
      setResendCountdown(RESEND_SECONDS);
      clearFeedback();
    } catch (error) {
      setResendError(normalizeApiMessage(error, 'Gửi lại OTP thất bại. Vui lòng thử lại.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell panel={AUTH_PANEL_CONFIG.verifyOtp}>
      <AuthCard>
        <AuthPageHeader
          title={VERIFY_COPY.title}
          subtitle={VERIFY_COPY.description}
          centered
        />

        <form className="space-y-3" onSubmit={handleSubmit}>
          {maskedIdentifier ? (
            <p className="text-[15px] text-auth-text-body">
              {VERIFY_COPY.sentToLabel}:{' '}
              <span className="font-semibold text-auth-text-strong">{maskedIdentifier}</span>
            </p>
          ) : null}

          <div className="space-y-1.5">
            <p className={`text-[15px] font-semibold ${otpError ? 'text-auth-error' : 'text-auth-text-body'}`}>
              {VERIFY_COPY.otpLabel}
            </p>
            <OTPInput
              value={otpCode}
              onChange={handleOtpChange}
              length={OTP_LENGTH}
              disabled={isSubmitting || !normalizedIdentifier}
              hasError={Boolean(otpError)}
            />
          </div>

          <AuthStatusMessage message={otpError} type="error" />
          <AuthStatusMessage message={submitError} type="error" />
          <AuthStatusMessage message={resendError} type="error" />

          <button
            className="auth-primary-button app-focus-ring flex h-14 w-full items-center justify-center gap-2 rounded-[14px] text-[16px] font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting || !normalizedIdentifier}
          >
            {isSubmitting ? VERIFY_COPY.submitting : VERIFY_COPY.submit}
            <span className="material-symbols-outlined text-[21px]">verified_user</span>
          </button>

          <div className="pt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-auth-text-muted">
            <span>{VERIFY_COPY.resendPrompt}</span>
            {resendCountdown > 0 ? (
              <span className="font-semibold text-auth-text-strong/95">
                {VERIFY_COPY.resendCountdownPrefix} {resendCountdown} {VERIFY_COPY.resendCountdownSuffix}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending || !normalizedIdentifier}
                className="font-semibold text-auth-primary transition-colors hover:text-auth-primary-hover disabled:opacity-60"
              >
                {isResending ? VERIFY_COPY.resendLoading : VERIFY_COPY.resendAction}
              </button>
            )}

            <span className="text-auth-text-muted/70">•</span>
            <Link to="/forgot-password" state={{ identifier: normalizedIdentifier }} className="font-semibold text-auth-text-strong transition-colors hover:text-auth-primary">
              {VERIFY_COPY.editEmailAction}
            </Link>
          </div>
        </form>

        <div className="mt-4 border-t border-auth-border/70 pt-3.5">
          <AuthBackLink to="/login">Quay lại đăng nhập</AuthBackLink>
        </div>
      </AuthCard>
    </AuthShell>
  );
};

export default VerifyOtpPage;
