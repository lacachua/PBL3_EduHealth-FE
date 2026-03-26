import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { resetPassword } from '../services/authApi';
import AuthShell from '../components/AuthShell';
import AuthCard from '../components/AuthCard';
import AuthPageHeader from '../components/AuthPageHeader';
import AuthTextField from '../components/AuthTextField';
import AuthBackLink from '../components/AuthBackLink';
import AuthSupportText from '../components/AuthSupportText';
import PasswordRules from '../components/PasswordRules';
import { authCopy } from '../constants/authCopy';

const CHANGE_COPY = authCopy.changePassword;

const ChangePasswordPage = () => {
  const location = useLocation();
  const identifier = location.state?.identifier;
  const otp = location.state?.otp;
  const resetToken = location.state?.resetToken;
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRulesCheck = useMemo(() => ({
    minLength: formData.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.newPassword),
    hasNumber: /\d/.test(formData.newPassword),
    hasSpecial: /[^A-Za-z0-9]/.test(formData.newPassword),
  }), [formData.newPassword]);

  const isPasswordValid = Object.values(passwordRulesCheck).every(Boolean);
  const passwordRules = [
    { label: CHANGE_COPY.rules[0], met: passwordRulesCheck.minLength },
    { label: CHANGE_COPY.rules[1], met: passwordRulesCheck.hasUppercase },
    { label: CHANGE_COPY.rules[2], met: passwordRulesCheck.hasNumber },
    { label: CHANGE_COPY.rules[3], met: passwordRulesCheck.hasSpecial },
  ];

  const clearFeedback = () => {
    if (validationError) setValidationError('');
    if (submitError) setSubmitError('');
    if (submitSuccess) setSubmitSuccess('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFeedback();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');
    setSubmitError('');
    setSubmitSuccess('');

    if (!isPasswordValid) {
      setValidationError(CHANGE_COPY.invalidPassword);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError(CHANGE_COPY.mismatchedPassword);
      return;
    }

    if (!identifier || (!otp && !resetToken)) {
      setSubmitError('Phiên đặt lại mật khẩu không hợp lệ. Vui lòng thực hiện lại từ bước OTP.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({
        identifier,
        otp,
        resetToken,
        newPassword: formData.newPassword,
      });
      setSubmitSuccess('Cập nhật mật khẩu thành công. Bạn có thể đăng nhập lại.');
      setFormData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      setSubmitError(normalizeApiMessage(error, 'Không thể cập nhật mật khẩu. Vui lòng thử lại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell contentClassName="max-w-[31rem]">
      <AuthCard>
        <AuthPageHeader
          icon="lock_reset"
          title={CHANGE_COPY.title}
          description={CHANGE_COPY.description}
        />

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <AuthTextField
            id="new-password"
            label={CHANGE_COPY.newPasswordLabel}
            icon="lock"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            type="password"
            placeholder="••••••••"
            enablePasswordToggle
          />

          <PasswordRules rules={passwordRules} />

          <AuthTextField
            id="confirm-password"
            label={CHANGE_COPY.confirmPasswordLabel}
            icon="verified_user"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            placeholder="••••••••"
            enablePasswordToggle
          />

          {validationError && <p className="text-sm text-error">{validationError}</p>}
          {submitError && <p className="text-sm text-error">{submitError}</p>}
          {submitSuccess && <p className="text-sm text-primary">{submitSuccess}</p>}

          <button
            className="signature-gradient flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-on-primary shadow-md shadow-primary/15 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? CHANGE_COPY.submitting : CHANGE_COPY.submit}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-2.5 border-t border-outline-variant/20 pt-3.5">
          <AuthBackLink to="/login">{CHANGE_COPY.backToLogin}</AuthBackLink>
          <AuthSupportText prompt={CHANGE_COPY.supportPrompt} action={CHANGE_COPY.supportAction} />
        </div>
      </AuthCard>
    </AuthShell>
  );
};

export default ChangePasswordPage;
