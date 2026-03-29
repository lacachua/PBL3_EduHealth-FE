import React from 'react';
import EntityAvatar from '../../../shared/components/admin/EntityAvatar';
import RightDrawer from '../../../shared/components/admin/RightDrawer';
import StatusBadge from '../../../shared/components/admin/StatusBadge';
import RetryState from '../../../shared/components/form/RetryState';
import SectionAlert from '../../../shared/components/form/SectionAlert';

const infoRowClass = 'grid grid-cols-[140px_1fr] gap-x-3 gap-y-1.5 py-1.5 text-sm';

const InfoRow = ({ label, children }) => (
  <div className={infoRowClass}>
    <p className="text-on-surface-variant">{label}</p>
    <div className="text-on-surface">{children}</div>
  </div>
);

const getAllergyItems = (value) => {
  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const StudentDetailDrawer = ({
  open,
  student,
  healthProfile,
  loading,
  error,
  syncMessage,
  onClose,
  onRetry,
  onEditBasic,
  onEditHealth,
  onViewHistory,
  onResetPassword,
  onToggleStatus,
}) => {
  const avatarSrc = student?.avatarUrl || student?.photoUrl || student?.profileImageUrl || '';
  const allergyItems = getAllergyItems(healthProfile?.allergies);

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      widthClass="max-w-[620px]"
      title="Chi tiết học sinh"
      subtitle="Theo dõi hồ sơ hành chính, tài khoản và sức khỏe cơ bản"
    >
      {loading && !student ? (
        <p className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-3 text-sm text-on-surface-variant">
          Đang tải chi tiết học sinh...
        </p>
      ) : null}

      {!loading && error && !student ? (
        <RetryState
          title="Chưa thể tải dữ liệu mới"
          description="Không thể lấy chi tiết học sinh từ máy chủ."
          onRetry={onRetry}
        />
      ) : null}

      {student ? (
        <div className="space-y-3.5">
          {syncMessage ? <SectionAlert message={syncMessage} tone="warning" /> : null}
          {loading ? <SectionAlert message="Đang đồng bộ dữ liệu mới từ máy chủ..." tone="info" /> : null}

          <section className="rounded-lg border border-outline-variant bg-surface-container-low p-3.5">
            <div className="flex items-start gap-3">
              <EntityAvatar name={student.fullName} imageUrl={avatarSrc} />
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">{student.fullName || '--'}</h3>
                <p className="mt-0.5 text-sm text-on-surface-variant">
                  {student.studentCode || '--'} • {student.className || student.classId || '--'}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {student.statusLabel ? <StatusBadge tone={student.statusTone}>{student.statusLabel}</StatusBadge> : null}
                  <span className="rounded-md border border-[var(--color-role-student-soft)] bg-[var(--color-role-student-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-role-student-text)]">
                    Học sinh
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-3.5">
            <InfoRow label="Mã học sinh">{student.studentCode || '--'}</InfoRow>
            <InfoRow label="Họ tên">{student.fullName || '--'}</InfoRow>
            <InfoRow label="Ngày sinh">{student.dateOfBirth || '--'}</InfoRow>
            <InfoRow label="Giới tính">{student.genderLabel || '--'}</InfoRow>
            <InfoRow label="Lớp">{student.className || student.classId || '--'}</InfoRow>
            <InfoRow label="Tên đăng nhập">{student.username || '--'}</InfoRow>
            <InfoRow label="Email">{student.email || '--'}</InfoRow>
            <InfoRow label="Số điện thoại">{student.phoneNumber || '--'}</InfoRow>
            <InfoRow label="Trạng thái tài khoản">
              {student.statusLabel ? <StatusBadge tone={student.statusTone}>{student.statusLabel}</StatusBadge> : '--'}
            </InfoRow>
            <InfoRow label="Chiều cao">{healthProfile?.heightCm ? `${healthProfile.heightCm} cm` : '--'}</InfoRow>
            <InfoRow label="Cân nặng">{healthProfile?.weightKg ? `${healthProfile.weightKg} kg` : '--'}</InfoRow>
            <InfoRow label="Nhóm máu">{healthProfile?.bloodType || '--'}</InfoRow>
            <InfoRow label="Tình trạng mắt">{healthProfile?.eyeStatus || '--'}</InfoRow>
            <InfoRow label="Bệnh nền">{healthProfile?.chronicNote || '--'}</InfoRow>
            <InfoRow label="Ghi chú sức khỏe">{healthProfile?.generalHealthNote || '--'}</InfoRow>
            <InfoRow label="Dị ứng">
              {allergyItems.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {allergyItems.map((item) => (
                    <span key={item} className="rounded-md border border-[var(--color-health-warning-soft)] bg-[var(--color-health-warning-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-health-warning-text)]">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-on-surface-variant">Chưa ghi nhận dị ứng.</span>
              )}
            </InfoRow>
            <InfoRow label="Ngày tạo">{student.createdAt || '--'}</InfoRow>
            <InfoRow label="Ngày cập nhật">{student.updatedAt || '--'}</InfoRow>
            <InfoRow label="Cập nhật hồ sơ sức khỏe">{healthProfile?.healthProfileUpdatedAt || '--'}</InfoRow>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-outline-variant pt-3">
            <button type="button" className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]" onClick={onEditBasic}>
              Chỉnh sửa thông tin học sinh
            </button>
            <button type="button" className="rounded-md border border-info/30 bg-info-soft px-3 py-1.5 text-sm font-semibold text-info transition hover:bg-info-soft/80" onClick={onEditHealth}>
              Cập nhật hồ sơ sức khỏe
            </button>
            <button type="button" className="rounded-md border border-outline-variant bg-white px-3 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low" onClick={onViewHistory}>
              Xem lịch sử sức khỏe
            </button>
            <button type="button" className="rounded-md border border-warning/30 bg-warning-soft px-3 py-1.5 text-sm font-semibold text-warning transition hover:bg-warning-soft/80" onClick={onResetPassword}>
              Reset mật khẩu
            </button>
            <button type="button" className="rounded-md border border-danger/30 bg-danger-soft px-3 py-1.5 text-sm font-semibold text-danger transition hover:bg-danger-soft/80" onClick={onToggleStatus}>
              Ẩn hồ sơ / ngưng hoạt động
            </button>
          </div>
        </div>
      ) : null}
    </RightDrawer>
  );
};

export default StudentDetailDrawer;
