import React, { useEffect, useRef, useState } from 'react';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import PageHeader from '../../../shared/components/admin/PageHeader';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import AccountProfilePanel from '../components/AccountProfilePanel';
import CurrentUserInfoCard from '../components/CurrentUserInfoCard';
import ChangePasswordCard from '../components/ChangePasswordCard';
import { useCurrentUserProfile } from '../hooks/useCurrentUserProfile';

const feedbackClassMap = {
  success: 'border-success/35 bg-success-soft text-success',
  error: 'border-danger/35 bg-danger-soft text-danger',
};

const variantClassMap = {
  admin: {
    wrapper: 'space-y-4',
    loadingCard: 'rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant',
    errorCard: 'rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger',
    retryButton: 'mt-2 inline-flex items-center rounded-lg border border-danger/35 bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger-soft/50',
    topGrid: 'grid gap-6 lg:gap-7 xl:grid-cols-[minmax(320px,360px)_minmax(0,1fr)] xl:items-stretch',
    passwordRow: 'mt-1',
  },
  nurse: {
    wrapper: 'space-y-4',
    loadingCard: 'rounded-2xl border border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant',
    errorCard: 'rounded-2xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger',
    retryButton: 'mt-2 inline-flex items-center rounded-lg border border-danger/35 bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger-soft/50',
    topGrid: 'grid gap-6 lg:gap-7 xl:grid-cols-[minmax(320px,360px)_minmax(0,1fr)] xl:items-stretch',
    passwordRow: 'mt-1',
  },
};

const headerContentMap = {
  admin: {
    title: 'Cài đặt',
    description: 'Quản lý thông tin tài khoản quản trị đang đăng nhập',
  },
  nurse: {
    title: 'Tài khoản cá nhân',
    description: 'Quản lý thông tin tài khoản đang đăng nhập',
  },
};

const CurrentUserAccountPage = ({ variant = 'admin' }) => {
  const classes = variantClassMap[variant] || variantClassMap.admin;
  const headerContent = headerContentMap[variant] || headerContentMap.admin;
  const { currentUser, loading, error, fetchCurrentUser } = useCurrentUserProfile();

  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, []);

  const showFeedback = (nextFeedback) => {
    setFeedback(nextFeedback);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 2600);
  };

  return (
    <div className={classes.wrapper}>
      {variant === 'nurse' ? (
        <NurseModulePageHeader
          title={headerContent.title}
          description={headerContent.description}
          className="rounded-xl"
        />
      ) : (
        <PageHeader
          title={headerContent.title}
          description={headerContent.description}
        />
      )}

      {loading && !currentUser ? (
        <section className={classes.loadingCard}>Đang tải thông tin tài khoản...</section>
      ) : null}

      {error ? (
        <section className={classes.errorCard}>
          {error}
          <div>
            <button type="button" className={classes.retryButton} onClick={fetchCurrentUser}>
              Tải lại
            </button>
          </div>
        </section>
      ) : null}

      {currentUser ? (
        <>
          <section className={classes.topGrid}>
            <div className="h-full">
              <AccountProfilePanel
                variant={variant}
                currentUser={currentUser}
                onFeedback={showFeedback}
                onProfileSaved={fetchCurrentUser}
              />
            </div>

            <div className="h-full">
              <CurrentUserInfoCard
                variant={variant}
                currentUser={currentUser}
                onFeedback={showFeedback}
                onProfileSaved={fetchCurrentUser}
              />
            </div>
          </section>

          <section className={classes.passwordRow}>
            <ChangePasswordCard variant={variant} onFeedback={showFeedback} />
          </section>
        </>
      ) : null}

      <AdminFeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        classMap={feedbackClassMap}
        fallbackClassName={feedbackClassMap.success}
      />
    </div>
  );
};

export default CurrentUserAccountPage;
