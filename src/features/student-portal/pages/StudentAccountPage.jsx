import React, { useCallback, useEffect, useState } from 'react';
import { mapApiFieldErrors, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { useAuth } from '../../../app/providers/useAuth';
import StudentAccountInfoCard from '../components/account/StudentAccountInfoCard';
import StudentAccountPasswordCard from '../components/account/StudentAccountPasswordCard';
import StudentAccountProfileCard from '../components/account/StudentAccountProfileCard';
import { StudentErrorState, StudentLoadingState } from '../components/common/StudentAsyncState';
import StudentFeedbackToast from '../components/common/StudentFeedbackToast';
import { studentPortalService } from '../services/studentPortalService';
import '../styles/student-portal.css';

const PHONE_PATTERN = /^[0-9+\-\s]{9,15}$/;

const createProfileFormState = (profile) => ({
  fullName: profile?.fullName || '',
  phone: profile?.phone || '',
});

const createPasswordFormState = () => ({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const validateProfileForm = (values) => {
  const nextErrors = {};

  if (!String(values.fullName || '').trim()) {
    nextErrors.fullName = 'Vui lòng nhập họ và tên.';
  }

  const phoneValue = String(values.phone || '').trim();
  if (phoneValue && !PHONE_PATTERN.test(phoneValue)) {
    nextErrors.phone = 'Số điện thoại không hợp lệ.';
  }

  return nextErrors;
};

const validatePasswordForm = (values) => {
  const nextErrors = {};

  if (!String(values.oldPassword || '').trim()) {
    nextErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại.';
  }

  const newPassword = String(values.newPassword || '').trim();
  const confirmPassword = String(values.confirmPassword || '').trim();

  if (!newPassword) {
    nextErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
  } else if (newPassword.length < 8) {
    nextErrors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
  } else if (newPassword === values.oldPassword) {
    nextErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại.';
  }

  if (!confirmPassword) {
    nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
  } else if (newPassword !== confirmPassword) {
    nextErrors.confirmPassword = 'Xác nhận mật khẩu chưa khớp.';
  }

  return nextErrors;
};

const StudentAccountPage = () => {
  const { updateUser } = useAuth();

  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [profileValues, setProfileValues] = useState(createProfileFormState(null));
  const [profileErrors, setProfileErrors] = useState({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [passwordValues, setPasswordValues] = useState(createPasswordFormState());
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSubmitError, setPasswordSubmitError] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [feedback, setFeedback] = useState(null);

  const loadAccount = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await studentPortalService.getAccountViewModel();
      setAccountData(response.data);
      setProfileValues(createProfileFormState(response.data.profile));
    } catch (apiError) {
      setError(normalizeApiMessage(apiError, 'Không thể tải thông tin tài khoản.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setFeedback(null);
    }, 2600);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [feedback]);

  const onProfileFieldChange = (field, value) => {
    setProfileValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setProfileErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const resetProfileForm = () => {
    setProfileValues(createProfileFormState(accountData?.profile));
    setProfileErrors({});
  };

  const handleSaveProfile = async () => {
    const nextErrors = validateProfileForm(profileValues);
    setProfileErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSavingProfile(true);

    try {
      const response = await studentPortalService.updateAccountProfile(profileValues);
      setAccountData((prev) => ({
        ...prev,
        ...response.data,
        profile: {
          ...(prev?.profile || {}),
          ...(response.data?.profile || {}),
        },
        capabilities: {
          ...(prev?.capabilities || {}),
          ...(response.data?.capabilities || {}),
        },
      }));
      setProfileValues((prevValues) => ({
        fullName: String(response.data?.profile?.fullName || prevValues.fullName || ''),
        phone: String(response.data?.profile?.phone || prevValues.phone || ''),
      }));

      // Sync profile changes to global auth context so header updates immediately.
      if (typeof updateUser === 'function') {
        updateUser({
          fullName: response.data?.profile?.fullName || profileValues.fullName,
          phone: response.data?.profile?.phone || profileValues.phone,
        });
      }

      setFeedback({ type: 'success', message: response?.message || 'Cập nhật thông tin thành công.' });
    } catch (apiError) {
      setProfileErrors((prev) => ({
        ...prev,
        ...mapApiFieldErrors(apiError),
      }));
      setFeedback({ type: 'error', message: normalizeApiMessage(apiError, 'Không thể cập nhật thông tin.') });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarChange = async (avatarFile) => {
    if (!accountData?.capabilities?.canUploadAvatar) {
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const response = await studentPortalService.uploadAccountAvatar(avatarFile);
      setAccountData((prev) => ({
        ...prev,
        ...response.data,
        profile: {
          ...(prev?.profile || {}),
          ...(response.data?.profile || {}),
        },
        capabilities: {
          ...(prev?.capabilities || {}),
          ...(response.data?.capabilities || {}),
        },
      }));
      setFeedback({ type: 'success', message: response?.message || 'Cập nhật ảnh đại diện thành công.' });

      // Sync avatar to global auth context so header avatar updates immediately.
      const savedAvatar = response.data?.profile?.avatar || response.data?.avatar || '';
      if (savedAvatar && typeof updateUser === 'function') {
        updateUser({ avatar: savedAvatar, avatarUrl: savedAvatar });
      }
    } catch (apiError) {
      setFeedback({ type: 'error', message: normalizeApiMessage(apiError, 'Không thể cập nhật ảnh đại diện.') });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onPasswordFieldChange = (field, value) => {
    setPasswordValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setPasswordSubmitError('');
    setPasswordErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const resetPasswordForm = () => {
    setPasswordValues(createPasswordFormState());
    setPasswordErrors({});
    setPasswordSubmitError('');
    setPasswordVisibility({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
  };

  const handleSubmitPassword = async (event) => {
    event.preventDefault();

    const nextErrors = validatePasswordForm(passwordValues);
    setPasswordErrors(nextErrors);
    setPasswordSubmitError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmittingPassword(true);

    try {
      const response = await studentPortalService.changePassword(passwordValues);
      resetPasswordForm();
      setFeedback({ type: 'success', message: response?.message || 'Đổi mật khẩu thành công.' });
    } catch (apiError) {
      const mappedFieldErrors = mapApiFieldErrors(apiError);
      setPasswordErrors((prev) => ({
        ...prev,
        ...mappedFieldErrors,
      }));
      setPasswordSubmitError(normalizeApiMessage(apiError, 'Không thể đổi mật khẩu.'));
      setFeedback({ type: 'error', message: normalizeApiMessage(apiError, 'Không thể đổi mật khẩu.') });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (loading && !accountData) {
    return <StudentLoadingState label="Đang tải thông tin tài khoản..." />;
  }

  if (error && !accountData) {
    return <StudentErrorState message={error} onRetry={loadAccount} />;
  }

  if (!accountData) {
    return null;
  }

  const canEditProfile = Boolean(accountData?.capabilities?.canUpdateProfile);
  const canUploadAvatar = Boolean(accountData?.capabilities?.canUploadAvatar);
  const canChangePassword = Boolean(accountData?.capabilities?.canChangePassword ?? true);

  return (
    <div className="space-y-4 text-on-surface">
      <section className="grid gap-6 lg:gap-7 xl:grid-cols-[minmax(320px,360px)_minmax(0,1fr)] xl:items-start">
        <div className="space-y-4">
          <StudentAccountProfileCard
            profile={accountData.profile}
            isUploadingAvatar={isUploadingAvatar}
            canUploadAvatar={canUploadAvatar}
            onAvatarChange={handleAvatarChange}
          />

          {canChangePassword ? (
            <StudentAccountPasswordCard
              formValues={passwordValues}
              formErrors={passwordErrors}
              submitError={passwordSubmitError}
              visibility={passwordVisibility}
              isSubmitting={isSubmittingPassword}
              onFieldChange={onPasswordFieldChange}
              onToggleVisibility={togglePasswordVisibility}
              onSubmit={handleSubmitPassword}
              onReset={resetPasswordForm}
            />
          ) : (
            <section className="app-panel-shell rounded-3xl p-4 text-sm text-on-surface-variant">
              Tính năng đổi mật khẩu tạm thời chưa khả dụng cho tài khoản này.
            </section>
          )}
        </div>

        <div className="h-fit">
          <StudentAccountInfoCard
            profile={accountData.profile}
            formValues={profileValues}
            formErrors={profileErrors}
            isSaving={isSavingProfile}
            canEditProfile={canEditProfile}
            onFieldChange={onProfileFieldChange}
            onCancel={resetProfileForm}
            onSave={handleSaveProfile}
          />
        </div>
      </section>

      <StudentFeedbackToast feedback={feedback} onClose={() => setFeedback(null)} />
    </div>
  );
};

export default StudentAccountPage;