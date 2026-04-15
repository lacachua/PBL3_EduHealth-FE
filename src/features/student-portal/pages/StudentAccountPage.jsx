import React, { useCallback, useEffect, useState } from 'react';
import { mapApiFieldErrors, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import StudentAccountInfoCard from '../components/account/StudentAccountInfoCard';
import StudentAccountPasswordCard from '../components/account/StudentAccountPasswordCard';
import StudentAccountProfileCard from '../components/account/StudentAccountProfileCard';
import { StudentErrorState, StudentLoadingState } from '../components/common/StudentAsyncState';
import StudentFeedbackToast from '../components/common/StudentFeedbackToast';
import { studentPortalService } from '../services/studentPortalService';

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
    nextErrors.fullName = 'Vui long nhap ho va ten.';
  }

  const phoneValue = String(values.phone || '').trim();
  if (phoneValue && !PHONE_PATTERN.test(phoneValue)) {
    nextErrors.phone = 'So dien thoai khong hop le.';
  }

  return nextErrors;
};

const validatePasswordForm = (values) => {
  const nextErrors = {};

  if (!String(values.oldPassword || '').trim()) {
    nextErrors.oldPassword = 'Vui long nhap mat khau hien tai.';
  }

  const newPassword = String(values.newPassword || '').trim();
  const confirmPassword = String(values.confirmPassword || '').trim();

  if (!newPassword) {
    nextErrors.newPassword = 'Vui long nhap mat khau moi.';
  } else if (newPassword.length < 8) {
    nextErrors.newPassword = 'Mat khau moi phai co it nhat 8 ky tu.';
  } else if (newPassword === values.oldPassword) {
    nextErrors.newPassword = 'Mat khau moi phai khac mat khau hien tai.';
  }

  if (!confirmPassword) {
    nextErrors.confirmPassword = 'Vui long xac nhan mat khau moi.';
  } else if (newPassword !== confirmPassword) {
    nextErrors.confirmPassword = 'Xac nhan mat khau chua khop.';
  }

  return nextErrors;
};

const StudentAccountPage = () => {
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
      setError(normalizeApiMessage(apiError, 'Khong the tai thong tin tai khoan.'));
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
      setFeedback({ type: 'success', message: response?.message || 'Cap nhat thong tin thanh cong.' });
    } catch (apiError) {
      setProfileErrors((prev) => ({
        ...prev,
        ...mapApiFieldErrors(apiError),
      }));
      setFeedback({ type: 'error', message: normalizeApiMessage(apiError, 'Khong the cap nhat thong tin.') });
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
      setFeedback({ type: 'success', message: response?.message || 'Cap nhat anh dai dien thanh cong.' });
    } catch (apiError) {
      setFeedback({ type: 'error', message: normalizeApiMessage(apiError, 'Khong the cap nhat anh dai dien.') });
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
      setFeedback({ type: 'success', message: response?.message || 'Doi mat khau thanh cong.' });
    } catch (apiError) {
      const mappedFieldErrors = mapApiFieldErrors(apiError);
      setPasswordErrors((prev) => ({
        ...prev,
        ...mappedFieldErrors,
      }));
      setPasswordSubmitError(normalizeApiMessage(apiError, 'Khong the doi mat khau.'));
      setFeedback({ type: 'error', message: normalizeApiMessage(apiError, 'Khong the doi mat khau.') });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (loading && !accountData) {
    return <StudentLoadingState label="Dang tai thong tin tai khoan..." />;
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
            <section className="student-module-surface rounded-3xl p-4 text-sm text-on-surface-variant">
              Tinh nang doi mat khau tam thoi chua kha dung cho tai khoan nay.
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