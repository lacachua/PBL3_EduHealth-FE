import React, { useEffect, useRef, useState } from 'react';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { currentUserRepository } from '../repositories/currentUserRepository';

const variantClassMap = {
  admin: {
    card: 'h-full rounded-xl border border-outline-variant bg-surface p-4 shadow-sm flex flex-col',
    avatarFrame: 'group relative inline-flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-outline-variant bg-surface-bright text-on-surface shadow-sm md:h-28 md:w-28',
    avatarInitials: 'text-[1.5rem] font-bold tracking-[0.01em]',
    avatarOverlayButton: 'absolute bottom-0 right-0 inline-flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant bg-surface-bright text-primary shadow-sm transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-55',
    name: 'mt-3 text-[1.05rem] font-bold leading-6 text-on-surface',
    role: 'mt-1 text-sm font-semibold text-on-surface-variant',
    email: 'mt-1 text-xs text-on-surface-muted truncate',
    avatarActionRow: 'mt-3 flex items-center justify-center gap-2',
    avatarSaveButton: 'inline-flex h-7 items-center justify-center rounded-md bg-primary px-2.5 text-[11px] font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60',
    avatarCancelButton: 'inline-flex h-7 items-center justify-center rounded-md border border-outline-variant bg-surface-bright px-2.5 text-[11px] font-semibold text-on-surface-variant transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60',
    errorText: 'mt-2 text-center text-xs font-medium text-danger',
  },
  nurse: {
    card: 'app-panel-shell h-full p-6 flex flex-col',
    avatarFrame: 'group relative inline-flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-outline-variant bg-surface-bright text-on-surface shadow-sm md:h-32 md:w-32',
    avatarInitials: 'text-[1.5rem] font-bold tracking-[0.01em]',
    avatarOverlayButton: 'app-focus-ring absolute bottom-0 right-0 inline-flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant bg-surface-bright text-primary shadow-sm transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-55',
    name: 'mt-4 text-[1.1rem] font-bold leading-6 text-on-surface',
    role: 'mt-1 text-sm font-semibold text-on-surface-variant',
    email: 'mt-1 text-xs text-on-surface-muted truncate',
    avatarActionRow: 'mt-3 flex items-center justify-center gap-2',
    avatarSaveButton: 'app-btn-primary app-focus-ring inline-flex h-7 items-center justify-center rounded-md px-2.5 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-60',
    avatarCancelButton: 'app-btn-secondary app-focus-ring inline-flex h-7 items-center justify-center rounded-md px-2.5 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-60',
    errorText: 'mt-2 text-center text-xs font-medium text-danger',
  },
};

const resolveInitials = (fullName) => {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
};

const toDisplayText = (value) => {
  const text = String(value || '').trim();
  return text || '--';
};

const MAX_AVATAR_FILE_SIZE_BYTES = 3 * 1024 * 1024;

const AccountProfilePanel = ({
  variant = 'admin',
  currentUser,
  onFeedback,
  onProfileSaved,
}) => {
  const classes = variantClassMap[variant] || variantClassMap.admin;
  const isMockMode = resolveModuleDataSource(DATA_MODULES.CURRENT_USER_ACCOUNT) === 'mock';
  const fileInputRef = useRef(null);

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const [pendingAvatarPreviewUrl, setPendingAvatarPreviewUrl] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [isAvatarSubmitting, setIsAvatarSubmitting] = useState(false);
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);

  const initials = resolveInitials(currentUser?.fullName);
  const avatarSrc = pendingAvatarPreviewUrl || currentAvatarUrl;
  const profileEmail = toDisplayText(currentUser?.email);

  useEffect(() => {
    const nextAvatar = String(currentUser?.avatar || '').trim();
    setCurrentAvatarUrl(nextAvatar);

    setPendingAvatarFile(null);
    setAvatarError('');
    setIsAvatarSubmitting(false);
    setAvatarImageFailed(false);
    setPendingAvatarPreviewUrl((prev) => {
      if (prev) {
        window.URL.revokeObjectURL(prev);
      }
      return '';
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

  }, [currentUser]);

  useEffect(() => {
    return () => {
      if (pendingAvatarPreviewUrl) {
        window.URL.revokeObjectURL(pendingAvatarPreviewUrl);
      }
    };
  }, [pendingAvatarPreviewUrl]);

  const clearAvatarDraft = () => {
    setPendingAvatarFile(null);
    setAvatarError('');
    setAvatarImageFailed(false);
    setPendingAvatarPreviewUrl((prev) => {
      if (prev) {
        window.URL.revokeObjectURL(prev);
      }
      return '';
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openAvatarPicker = () => {
    if (isAvatarSubmitting) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleAvatarSelected = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    if (!String(selectedFile.type || '').startsWith('image/')) {
      setAvatarError('Chỉ hỗ trợ file ảnh.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (selectedFile.size > MAX_AVATAR_FILE_SIZE_BYTES) {
      setAvatarError('Dung lượng ảnh vượt quá giới hạn 3MB.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const candidatePreviewUrl = window.URL.createObjectURL(selectedFile);

    setAvatarError('');
    setAvatarImageFailed(false);
    setPendingAvatarFile(selectedFile);
    setPendingAvatarPreviewUrl((prev) => {
      if (prev) {
        window.URL.revokeObjectURL(prev);
      }
      return candidatePreviewUrl;
    });
  };

  const handleAvatarSave = async () => {
    if (!pendingAvatarFile) {
      return;
    }

    if (!isMockMode) {
      const message = 'Tính năng lưu ảnh đại diện đang chờ backend hỗ trợ ở chế độ live.';
      setAvatarError(message);
      if (onFeedback) {
        onFeedback({ type: 'info', message });
      }
      return;
    }

    setIsAvatarSubmitting(true);
    setAvatarError('');

    try {
      const payload = new FormData();
      payload.append('avatar', pendingAvatarFile);

      const response = await currentUserRepository.uploadCurrentUserAvatar(payload);

      const savedAvatarUrl = String(response?.data?.avatar || response?.data?.avatarUrl || '');
      if (savedAvatarUrl) {
        setCurrentAvatarUrl(savedAvatarUrl);
      }

      clearAvatarDraft();

      if (typeof onProfileSaved === 'function') {
        await onProfileSaved();
      }

      if (onFeedback) {
        onFeedback({ type: 'success', message: response?.message || 'Cập nhật ảnh đại diện thành công.' });
      }
    } catch (error) {
      const message = normalizeApiMessage(error, 'Không thể cập nhật ảnh đại diện.');
      setAvatarError(message);

      if (onFeedback) {
        onFeedback({ type: 'error', message });
      }
    } finally {
      setIsAvatarSubmitting(false);
    }
  };

  return (
    <section className={classes.card}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={openAvatarPicker}
            disabled={isAvatarSubmitting}
            className={classes.avatarFrame}
            aria-label="Chọn ảnh đại diện"
          >
            {avatarSrc && !avatarImageFailed ? (
              <img
                src={avatarSrc}
                alt="Ảnh đại diện"
                className="h-full w-full object-cover object-center"
                onError={() => setAvatarImageFailed(true)}
              />
            ) : (
              <span className={classes.avatarInitials}>{initials}</span>
            )}
          </button>

          <button
            type="button"
            className={classes.avatarOverlayButton}
            onClick={openAvatarPicker}
            disabled={isAvatarSubmitting}
            aria-label="Thay đổi ảnh đại diện"
          >
            <span className="material-symbols-outlined text-[13px]">photo_camera</span>
          </button>
        </div>

        <div className="min-w-0 w-full max-w-[240px]">
          <p className={classes.name}>{toDisplayText(currentUser?.fullName)}</p>
          <p className={classes.role}>{toDisplayText(currentUser?.roleLabel || currentUser?.role)}</p>
          {profileEmail !== '--' ? <p className={classes.email}>{profileEmail}</p> : null}

          {pendingAvatarFile ? (
            <div className={classes.avatarActionRow}>
              <button
                type="button"
                className={classes.avatarSaveButton}
                disabled={isAvatarSubmitting || !isMockMode}
                onClick={handleAvatarSave}
                title={isMockMode ? undefined : 'Chưa hỗ trợ lưu ảnh ở chế độ live'}
              >
                {isAvatarSubmitting ? 'Đang lưu...' : 'Lưu ảnh'}
              </button>

              <button
                type="button"
                className={classes.avatarCancelButton}
                disabled={isAvatarSubmitting}
                onClick={clearAvatarDraft}
              >
                Hủy ảnh
              </button>
            </div>
          ) : null}

          {pendingAvatarFile && !isMockMode ? (
            <p className={classes.errorText}>Lưu ảnh ở chế độ live đang chờ backend hỗ trợ.</p>
          ) : null}

          {avatarError ? <p className={classes.errorText}>{avatarError}</p> : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarSelected}
        />
      </div>
    </section>
  );
};

export default AccountProfilePanel;
