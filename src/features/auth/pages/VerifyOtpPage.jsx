import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { resendPasswordOtp, verifyPasswordOtp } from '../services/authApi';
import AuthShell from '../components/AuthShell';
import AuthCard from '../components/AuthCard';
import AuthPageHeader from '../components/AuthPageHeader';
import AuthBackLink from '../components/AuthBackLink';
import AuthSupportText from '../components/AuthSupportText';
import { authCopy } from '../constants/authCopy';

const VERIFY_COPY = authCopy.verifyOtp;
const OTP_LENGTH = 6;
const INITIAL_OTP = Array.from({ length: OTP_LENGTH }, () => '');

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(INITIAL_OTP);
  const [validationError, setValidationError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [resendError, setResendError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const identifier = location.state?.identifier || '';
  const normalizedIdentifier = identifier.trim();

  const clearFeedback = () => {
    if (validationError) setValidationError('');
    if (submitError) setSubmitError('');
    if (resendError) setResendError('');
  };

  const handleChange = (element, index) => {
    if (!/^\d?$/.test(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    clearFeedback();

    if (element.value !== '' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSubmitError('');

    if (!normalizedIdentifier) {
      setSubmitError('Phiên xác thực không hợp lệ. Vui lòng quay lại bước khôi phục mật khẩu.');
      return;
    }

    const otpCode = otp.join('');
    if (otpCode.length !== OTP_LENGTH) {
      setValidationError(VERIFY_COPY.invalidCode);
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

    setIsResending(true);
    try {
      await resendPasswordOtp({ identifier: normalizedIdentifier });
      setOtp(INITIAL_OTP);
      inputRefs.current[0]?.focus();
      clearFeedback();
    } catch (error) {
      setResendError(normalizeApiMessage(error, 'Gửi lại OTP thất bại. Vui lòng thử lại.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell contentClassName="max-w-[30rem]">
      <AuthCard>
        <AuthPageHeader icon="shield_person" title={VERIFY_COPY.title} description={VERIFY_COPY.description} />

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-6 gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                className="h-12 w-full rounded-xl border border-outline-variant/30 bg-surface text-center text-xl font-bold text-on-surface outline-none transition-all focus:border-primary/35 focus:ring-2 focus:ring-primary/15"
                maxLength="1"
                required
                type="tel"
                inputMode="numeric"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          {validationError && <p className="text-sm text-error">{validationError}</p>}
          {submitError && <p className="text-sm text-error">{submitError}</p>}
          {resendError && <p className="text-sm text-error">{resendError}</p>}

          <button
            className="signature-gradient flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-on-primary shadow-md shadow-primary/15 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting || !normalizedIdentifier}
          >
            {isSubmitting ? VERIFY_COPY.submitting : VERIFY_COPY.submit}
            <span className="material-symbols-outlined text-lg">verified_user</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
            <span>{VERIFY_COPY.resendPrompt}</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || !normalizedIdentifier}
              className="font-semibold text-primary transition-colors hover:text-primary-container disabled:opacity-60"
            >
              {isResending ? 'Đang gửi...' : VERIFY_COPY.resendAction}
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-col items-center gap-2.5 border-t border-outline-variant/20 pt-3.5">
          <AuthBackLink to="/login">Quay lại đăng nhập</AuthBackLink>
          <AuthSupportText prompt={VERIFY_COPY.supportPrompt} action={VERIFY_COPY.supportAction} />
        </div>
      </AuthCard>
    </AuthShell>
  );
};

export default VerifyOtpPage;
