import React, { useCallback, useEffect, useState } from 'react';
import { mapApiFieldErrors, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { validatePhoneNumber } from '../../../shared/utils/phoneValidation';
import { validateChangePasswordForm } from '../../../shared/utils/passwordValidation';
import { useAuth } from '../../../app/providers/useAuth';
import StudentAccountInfoCard from '../components/account/StudentAccountInfoCard';
import StudentAccountPasswordCard from '../components/account/StudentAccountPasswordCard';
import { StudentErrorState, StudentLoadingState } from '../components/common/StudentAsyncState';
import FeedbackToast from '../../../shared/components/core/FeedbackToast';
import StudentAccountProfileCard from '../components/account/StudentAccountProfileCard';
import { studentPortalService } from '../services/studentPortalService';
import '../styles/student-portal.css';

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
  const phoneError = validatePhoneNumber(phoneValue);
  if (phoneError) {
    nextErrors.phone = phoneError;
  }

  return nextErrors;
};

const validatePasswordForm = validateChangePasswordForm;

const StudentAccountPage = () => {
  const { updateUser } = useAuth();

  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [profileValues, setProfileValues] = useState(createProfileFormState(null));
  const [profileErrors, setProfileErrors] = useState({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const [pendingAvatarPreviewUrl, setPendingAvatarPreviewUrl] = useState('');
  const [avatarError, setAvatarError] = useState('');
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

      // Clear any pending avatar state when loading fresh data
      setPendingAvatarFile(null);
      setAvatarError('');
      setPendingAvatarPreviewUrl((prev) => {
        if (prev) {
          window.URL.revokeObjectURL(prev);
        }
        return '';
      });
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
    return () => {
      if (pendingAvatarPreviewUrl) {
        window.URL.revokeObjectURL(pendingAvatarPreviewUrl);
      }
    };
  }, [pendingAvatarPreviewUrl]);

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

  const handleAvatarSelect = (avatarFile, error) => {
    if (error) {
      setAvatarError(error);
      setPendingAvatarFile(null);
      setPendingAvatarPreviewUrl((prev) => {
        if (prev) {
          window.URL.revokeObjectURL(prev);
        }
        return '';
      });
      return;
    }

    if (!avatarFile) {
      return;
    }

    const previewUrl = window.URL.createObjectURL(avatarFile);
    setAvatarError('');
    setPendingAvatarFile(avatarFile);
    setPendingAvatarPreviewUrl((prev) => {
      if (prev) {
        window.URL.revokeObjectURL(prev);
      }
      return previewUrl;
    });
  };

  const handleAvatarSave = async () => {
    if (!pendingAvatarFile) {
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarError('');

    try {
      const response = await studentPortalService.uploadAccountAvatar(pendingAvatarFile);
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

      // Clear pending avatar state
      setPendingAvatarFile(null);
      setPendingAvatarPreviewUrl((prev) => {
        if (prev) {
          window.URL.revokeObjectURL(prev);
        }
        return '';
      });

      setFeedback({ type: 'success', message: response?.message || 'Cập nhật ảnh đại diện thành công.' });

      // Sync avatar to global auth context so header avatar updates immediately.
      const savedAvatar = response.data?.profile?.avatar || response.data?.avatar || '';
      if (savedAvatar && typeof updateUser === 'function') {
        updateUser({ avatar: savedAvatar, avatarUrl: savedAvatar });
      }
    } catch (apiError) {
      setAvatarError(normalizeApiMessage(apiError, 'Không thể cập nhật ảnh đại diện.'));
      setFeedback({ type: 'error', message: normalizeApiMessage(apiError, 'Không thể cập nhật ảnh đại diện.') });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarCancel = () => {
    setPendingAvatarFile(null);
    setAvatarError('');
    setPendingAvatarPreviewUrl((prev) => {
      if (prev) {
        window.URL.revokeObjectURL(prev);
      }
      return '';
    });
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
            pendingAvatarPreviewUrl={pendingAvatarPreviewUrl}
            avatarError={avatarError}
            isUploadingAvatar={isUploadingAvatar}
            canUploadAvatar={canUploadAvatar}
            onAvatarSelect={handleAvatarSelect}
            onAvatarSave={handleAvatarSave}
            onAvatarCancel={handleAvatarCancel}
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

      <FeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        classMap={{
          success: 'border-success/35 bg-success-soft text-success',
          error: 'border-danger/35 bg-danger-soft text-danger',
          info: 'border-info/35 bg-info-soft text-info',
        }}
      />
    </div>
  );
};

export default StudentAccountPage;