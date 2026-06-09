import React from 'react';
import EntityAvatar from '../../../shared/components/core/EntityAvatar';
import RightDrawer from '../../../shared/components/core/RightDrawer';
import StatusBadge from '../../../shared/components/core/StatusBadge';
import RetryState from '../../../shared/components/form/RetryState';
import SectionAlert from '../../../shared/components/form/SectionAlert';

const infoRowClass = 'grid grid-cols-[150px_1fr] gap-x-3 gap-y-1.5 py-1.5 text-sm';

const EMPTY_LABEL = 'Chưa cập nhật';

const hasValue = (value) => value !== null && value !== undefined && value !== '';
const displayValue = (value) => (hasValue(value) ? value : EMPTY_LABEL);
const hasField = (source, key) => Boolean(source?.fields?.[key]);

const InfoRow = ({ label, children }) => (
  <div className={infoRowClass}>
    <p className="text-on-surface-variant">{label}</p>
    <div className="text-on-surface">{children}</div>
  </div>
);

const DetailSection = ({ title, children }) => (
  <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-3.5">
    <h4 className="mb-2 text-sm font-semibold text-on-surface">{title}</h4>
    {children}
  </section>
);

const StudentDetailDrawer = ({
  open,
  student,
  healthProfile,
  loading,
  error,
  syncMessage,
  onClose,
  onRetry,
  onEdit,
  onToggleStatus,
  onResetPassword,
}) => {
  const avatarSrc = student?.imageUrl || '';
  const isLocked = student?.status === 'LOCKED' || student?.status === 'INACTIVE';
  const hasAccountEndpointId = Boolean(student?.userId);
  const actionButtonClass = 'app-focus-ring rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-55';

  const hasStudentInfoSection = [
    'fullName',
    'dateOfBirth',
    'gender',
    'className',
    'classId',
  ].some((key) => hasField(student, key));

  const hasGuardianSection = ['guardian', 'phone'].some((key) => hasField(student, key));
  const hasBasicHealthSection = ['currentHeight', 'currentWeight', 'medicalHistoryNotes'].some((key) => hasField(student, key));
  const hasAccountSection = ['user', 'username', 'email', 'status', 'isActive'].some((key) => hasField(student, key));
  const hasSystemSection = ['createdAt', 'updatedAt'].some((key) => hasField(student, key));
  const allergyItems = Array.isArray(healthProfile?.allergyItems) ? healthProfile.allergyItems : [];
  const hasAllergySection = Boolean(healthProfile?.fields?.allergies && allergyItems.length);

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      widthClass="max-w-[620px]"
      title="Chi tiết học sinh"
      subtitle="Thông tin hiển thị theo hồ sơ quản lý hiện có"
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
                <h3 className="font-headline text-lg font-semibold text-on-surface">{displayValue(student.fullName)}</h3>
                <p className="mt-0.5 text-sm text-on-surface-variant">{displayValue(student.className || student.classId)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {student.statusLabel ? <StatusBadge tone={student.statusTone}>{student.statusLabel}</StatusBadge> : null}
                  <span className="rounded-md border border-primary/25 bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                    Học sinh
                  </span>
                </div>
              </div>
            </div>
          </section>

          {hasStudentInfoSection ? (
            <DetailSection title="Thông tin học sinh">
              {hasField(student, 'fullName') ? <InfoRow label="Họ tên">{displayValue(student.fullName)}</InfoRow> : null}
              {hasField(student, 'dateOfBirth') ? <InfoRow label="Ngày sinh">{displayValue(student.dateOfBirthLabel)}</InfoRow> : null}
              {hasField(student, 'gender') ? <InfoRow label="Giới tính">{displayValue(student.genderLabel || student.gender)}</InfoRow> : null}
              {hasField(student, 'className') || hasField(student, 'classId') ? (
                <InfoRow label="Lớp">{displayValue(student.className || student.classId)}</InfoRow>
              ) : null}
            </DetailSection>
          ) : null}

          {hasGuardianSection ? (
            <DetailSection title="Liên hệ người giám hộ">
              {hasField(student, 'guardian') ? <InfoRow label="Người giám hộ">{displayValue(student.guardian)}</InfoRow> : null}
              {hasField(student, 'phone') ? <InfoRow label="Số điện thoại">{displayValue(student.phoneNumber)}</InfoRow> : null}
            </DetailSection>
          ) : null}

          {hasBasicHealthSection ? (
            <DetailSection title="Sức khỏe cơ bản">
              {hasField(student, 'currentHeight') ? <InfoRow label="Chiều cao">{student.currentHeightLabel ? `${student.currentHeightLabel} cm` : EMPTY_LABEL}</InfoRow> : null}
              {hasField(student, 'currentWeight') ? <InfoRow label="Cân nặng">{student.currentWeightLabel ? `${student.currentWeightLabel} kg` : EMPTY_LABEL}</InfoRow> : null}
              {hasField(student, 'medicalHistoryNotes') ? <InfoRow label="Ghi chú sức khỏe">{displayValue(student.medicalHistoryNotes)}</InfoRow> : null}
            </DetailSection>
          ) : null}

          {hasAllergySection ? (
            <DetailSection title="Dị ứng">
              <div className="flex flex-wrap gap-1.5">
                {allergyItems.map((item) => (
                  <span key={item.id || item.allergyTypeId || item.allergyTypeName} className="rounded-md border border-warning/25 bg-warning-soft px-2 py-0.5 text-[11px] font-semibold text-warning">
                    {displayValue(item.allergyTypeName)}
                  </span>
                ))}
              </div>
            </DetailSection>
          ) : null}

          {hasAccountSection ? (
            <DetailSection title="Tài khoản">
              {hasField(student, 'email') ? <InfoRow label="Email">{displayValue(student.email)}</InfoRow> : null}
              {hasField(student, 'username') ? <InfoRow label="Tên đăng nhập">{displayValue(student.username)}</InfoRow> : null}
              {hasField(student, 'status') || hasField(student, 'isActive') ? (
                <InfoRow label="Trạng thái">
                  {student.statusLabel ? <StatusBadge tone={student.statusTone}>{student.statusLabel}</StatusBadge> : EMPTY_LABEL}
                </InfoRow>
              ) : null}
            </DetailSection>
          ) : null}

          {hasSystemSection ? (
            <DetailSection title="Thông tin hệ thống">
              {hasField(student, 'createdAt') ? <InfoRow label="Ngày tạo">{displayValue(student.createdAtLabel)}</InfoRow> : null}
              {hasField(student, 'updatedAt') ? <InfoRow label="Ngày cập nhật">{displayValue(student.updatedAtLabel)}</InfoRow> : null}
            </DetailSection>
          ) : null}

          <div className="flex flex-wrap gap-2 border-t border-outline-variant pt-3">
            <button
              type="button"
              className="app-focus-ring rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
              onClick={() => onEdit?.(student)}
            >
              Chỉnh sửa
            </button>
            <button
              type="button"
              className={actionButtonClass}
              disabled={!hasAccountEndpointId}
              onClick={() => onToggleStatus?.(student)}
            >
              {isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
            </button>
            <button
              type="button"
              className="app-focus-ring rounded-md border border-warning/30 bg-warning-soft px-3 py-1.5 text-sm font-semibold text-warning transition hover:bg-warning-soft/80 disabled:cursor-not-allowed disabled:opacity-55"
              disabled={!hasAccountEndpointId}
              onClick={() => onResetPassword?.(student)}
            >
              Đặt lại mật khẩu
            </button>
          </div>
        </div>
      ) : null}
    </RightDrawer>
  );
};

export default StudentDetailDrawer;
