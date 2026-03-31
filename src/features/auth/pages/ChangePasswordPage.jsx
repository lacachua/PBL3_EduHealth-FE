import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { resetPassword } from '../services/authApi';
import AuthShell from '../components/AuthShell';
import AuthCard from '../components/AuthCard';
import AuthPageHeader from '../components/AuthPageHeader';
import PasswordField from '../components/PasswordField';
import AuthBackLink from '../components/AuthBackLink';
import PasswordChecklist from '../components/PasswordChecklist';
import AuthStatusMessage from '../components/AuthStatusMessage';
import { authCopy } from '../constants/authCopy';
import { AUTH_PANEL_CONFIG } from '../constants/authFlowConfig';
import { getPasswordChecks } from '../schemas/authSchema';

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
  const [fieldErrors, setFieldErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRulesCheck = useMemo(
    () => getPasswordChecks(formData.newPassword),
    [formData.newPassword]
  );

  const isPasswordValid = Object.values(passwordRulesCheck).every(Boolean);
  const shouldShowRuleError = touched.newPassword && formData.newPassword.length > 0;

  const passwordRules = useMemo(
    () => [
      {
        key: 'min-length',
        label: CHANGE_COPY.rules[0],
        met: passwordRulesCheck.minLength,
        showError: shouldShowRuleError && !passwordRulesCheck.minLength,
      },
      {
        key: 'upper',
        label: CHANGE_COPY.rules[1],
        met: passwordRulesCheck.hasUppercase,
        showError: shouldShowRuleError && !passwordRulesCheck.hasUppercase,
      },
      {
        key: 'number',
        label: CHANGE_COPY.rules[2],
        met: passwordRulesCheck.hasNumber,
        showError: shouldShowRuleError && !passwordRulesCheck.hasNumber,
      },
      {
        key: 'special',
        label: CHANGE_COPY.rules[3],
        met: passwordRulesCheck.hasSpecial,
        showError: shouldShowRuleError && !passwordRulesCheck.hasSpecial,
      },
    ],
    [passwordRulesCheck, shouldShowRuleError]
  );

  const clearFeedback = () => {
    if (fieldErrors.newPassword || fieldErrors.confirmPassword) {
      setFieldErrors({ newPassword: '', confirmPassword: '' });
    }
    if (submitError) setSubmitError('');
    if (submitSuccess) setSubmitSuccess('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFeedback();
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setTouched({ newPassword: true, confirmPassword: true });

    const nextErrors = {
      newPassword: '',
      confirmPassword: '',
    };

    if (!isPasswordValid) {
      nextErrors.newPassword = CHANGE_COPY.invalidPassword;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword = CHANGE_COPY.mismatchedPassword;
    }

    if (nextErrors.newPassword || nextErrors.confirmPassword) {
      setFieldErrors(nextErrors);
      return;
    }

    if (!identifier || (!otp && !resetToken)) {
      setSubmitError(CHANGE_COPY.invalidSession);
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
      setSubmitSuccess(CHANGE_COPY.successMessage);
      setFormData({ newPassword: '', confirmPassword: '' });
      setTouched({ newPassword: false, confirmPassword: false });
      setFieldErrors({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      setSubmitError(normalizeApiMessage(error, 'Không thể cập nhật mật khẩu. Vui lòng thử lại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell panel={AUTH_PANEL_CONFIG.changePassword}>
      <AuthCard>
        <AuthPageHeader
          title={CHANGE_COPY.title}
          subtitle={CHANGE_COPY.description}
          centered
        />

        <form className="space-y-3" onSubmit={handleSubmit}>
          <PasswordField
            id="new-password"
            label={CHANGE_COPY.newPasswordLabel}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            placeholder={CHANGE_COPY.newPasswordPlaceholder}
            error={fieldErrors.newPassword}
          />

          <div className="rounded-lg bg-auth-surface-soft/45 px-3.5 py-2.5">
            <PasswordChecklist rules={passwordRules} />
          </div>

          <PasswordField
            id="confirm-password"
            label={CHANGE_COPY.confirmPasswordLabel}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            placeholder={CHANGE_COPY.confirmPasswordPlaceholder}
            error={fieldErrors.confirmPassword}
          />

          <AuthStatusMessage message={submitError} type="error" />
          <AuthStatusMessage message={submitSuccess} type="success" />

          <button
            className="auth-primary-button flex h-14 w-full items-center justify-center gap-2 rounded-[14px] text-[16px] font-semibold text-white transition-all hover:brightness-[1.03] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? CHANGE_COPY.submitting : CHANGE_COPY.submit}
            <span className="material-symbols-outlined text-[21px]">arrow_forward</span>
          </button>

          <div className="border-t border-auth-border/70 pt-3.5">
            <AuthBackLink to="/login">{CHANGE_COPY.backToLogin}</AuthBackLink>
          </div>
        </form>
      </AuthCard>
    </AuthShell>
  );
};

export default ChangePasswordPage;
