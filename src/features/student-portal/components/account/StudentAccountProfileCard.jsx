import React, { useRef } from 'react';

const toReadableText = (value, fallback = 'Chưa cập nhật') => {
  const normalized = String(value || '').trim();
  return normalized || fallback;
};

const MAX_AVATAR_FILE_SIZE_BYTES = 3 * 1024 * 1024;

const StudentAccountProfileCard = ({
  profile,
  pendingAvatarPreviewUrl,
  avatarError,
  isUploadingAvatar,
  canUploadAvatar,
  onAvatarSelect,
  onAvatarSave,
  onAvatarCancel,
}) => {
  const fileInputRef = useRef(null);

  const triggerAvatarPicker = () => {
    if (!canUploadAvatar || isUploadingAvatar) {
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    if (!selectedFile) {
      return;
    }

    if (!String(selectedFile.type || '').startsWith('image/')) {
      if (onAvatarSelect) {
        onAvatarSelect(null, 'Chỉ hỗ trợ file ảnh.');
      }
      event.target.value = '';
      return;
    }

    if (selectedFile.size > MAX_AVATAR_FILE_SIZE_BYTES) {
      if (onAvatarSelect) {
        onAvatarSelect(null, 'Dung lượng ảnh vượt quá giới hạn 3MB.');
      }
      event.target.value = '';
      return;
    }

    if (onAvatarSelect) {
      onAvatarSelect(selectedFile, '');
    }
  };

  const displayAvatarUrl = pendingAvatarPreviewUrl || profile.avatar;
  const hasPendingAvatar = Boolean(pendingAvatarPreviewUrl);

  return (
    <section className="app-panel-shell h-full rounded-3xl p-5">
      <div className="student-hero-gradient relative overflow-hidden rounded-2xl border border-primary/25 p-4 md:p-5">
        <span aria-hidden="true" className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
        <span aria-hidden="true" className="pointer-events-none absolute -right-8 bottom-2 h-28 w-28 rounded-full bg-info/18 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative shrink-0">
            <div className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-sm">
              {displayAvatarUrl ? (
                <img src={displayAvatarUrl} alt="Ảnh đại diện" className="h-full w-full object-cover" />
              ) : (
                <div className="inline-flex h-full w-full items-center justify-center bg-primary-soft text-3xl font-bold text-primary">
                  {toReadableText(profile.fullName, 'S').charAt(0).toUpperCase()}
                </div>
              )}

              {canUploadAvatar ? (
                <button
                  type="button"
                  onClick={triggerAvatarPicker}
                  disabled={isUploadingAvatar}
                  className="app-focus-ring app-interactive absolute inset-0 flex items-center justify-center bg-slate-900/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-3xl text-white">
                    {isUploadingAvatar ? 'hourglass_top' : 'photo_camera'}
                  </span>
                </button>
              ) : null}
            </div>

            {canUploadAvatar ? (
              <button
                type="button"
                onClick={triggerAvatarPicker}
                disabled={isUploadingAvatar}
                className="app-focus-ring app-interactive absolute -bottom-1.5 -right-1.5 rounded-full border border-outline-variant bg-surface p-2 text-primary shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                aria-label="Đổi ảnh đại diện"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            ) : null}

            {canUploadAvatar ? (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            ) : null}
          </div>

          <div className="mt-4 min-w-0 w-full">
            <p className="truncate text-lg font-bold text-on-surface">{toReadableText(profile.fullName)}</p>
            <p className="mt-0.5 truncate text-sm text-on-surface-variant">
              {toReadableText(profile.className)} • Mã HS: {toReadableText(profile.studentCode)}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center rounded-full border border-success/35 bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                {toReadableText(profile.roleLabel)}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${profile.isActive
                  ? 'border-success/35 bg-success-soft text-success'
                  : 'border-danger/35 bg-danger-soft text-danger'
                  }`}
              >
                <span className={`h-2 w-2 rounded-full ${profile.isActive ? 'bg-success' : 'bg-danger'}`} />
                <span>{toReadableText(profile.statusLabel)}</span>
              </span>
            </div>

            {hasPendingAvatar ? (
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-7 items-center justify-center rounded-md bg-primary px-2.5 text-[11px] font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isUploadingAvatar}
                  onClick={onAvatarSave}
                >
                  {isUploadingAvatar ? 'Đang lưu...' : 'Lưu ảnh'}
                </button>

                <button
                  type="button"
                  className="inline-flex h-7 items-center justify-center rounded-md border border-outline-variant bg-surface-bright px-2.5 text-[11px] font-semibold text-on-surface-variant transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isUploadingAvatar}
                  onClick={onAvatarCancel}
                >
                  Hủy ảnh
                </button>
              </div>
            ) : null}

            {avatarError ? (
              <p className="mt-2 text-center text-xs font-medium text-danger">{avatarError}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentAccountProfileCard;