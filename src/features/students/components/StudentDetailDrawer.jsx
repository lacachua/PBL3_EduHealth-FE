import React from 'react';
import EntityAvatar from '../../../shared/components/core/EntityAvatar';
import RightDrawer from '../../../shared/components/core/RightDrawer';
import StatusBadge from '../../../shared/components/core/StatusBadge';
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
                  <span className="rounded-md border border-primary/25 bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                    Học sinh
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-3.5">
            <InfoRow label="Mã học sinh">{student.studentCode || '--'}</InfoRow>
            <InfoRow label="Họ tên">{student.fullName || '--'}</InfoRow>
            <InfoRow label="Ngày sinh">{student.dateOfBirthLabel || '--'}</InfoRow>
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
                    <span key={item} className="rounded-md border border-warning/25 bg-warning-soft px-2 py-0.5 text-[11px] font-semibold text-warning">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-on-surface-variant">Chưa ghi nhận dị ứng.</span>
              )}
            </InfoRow>
            <InfoRow label="Ngày tạo">{student.createdAtLabel || '--'}</InfoRow>
            <InfoRow label="Ngày cập nhật">{student.updatedAtLabel || '--'}</InfoRow>
            <InfoRow label="Cập nhật hồ sơ sức khỏe">{healthProfile?.healthProfileUpdatedAtLabel || '--'}</InfoRow>
          </div>
        </div>
      ) : null}
    </RightDrawer>
  );
};

export default StudentDetailDrawer;
