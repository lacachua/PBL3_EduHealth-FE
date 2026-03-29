import React, { useMemo, useState } from 'react';
import EntityAvatar from '../../../shared/components/admin/EntityAvatar';
import RightDrawer from '../../../shared/components/admin/RightDrawer';
import EditableField from '../../../shared/components/form/EditableField';
import ReadonlyField from '../../../shared/components/form/ReadonlyField';
import StatusBadge from '../../../shared/components/admin/StatusBadge';
import { STUDENT_CREATE_CLASS_OPTIONS, STUDENT_CREATE_GENDER_OPTIONS } from '../constants/studentCreateOptions';
import { validateStudentBasicForm } from '../schemas/studentManagementSchema';

const createInitial = (student) => ({
  fullName: student?.fullName || '',
  dateOfBirth: student?.dateOfBirth && student.dateOfBirth !== '--' ? student.dateOfBirth : '',
  gender: student?.gender && student.gender !== '--' ? student.gender : 'MALE',
  classId: student?.classId && student.classId !== '--' ? student.classId : '',
  email: student?.email && student.email !== '--' ? student.email : '',
  phoneNumber: student?.phoneNumber && student.phoneNumber !== '--' ? student.phoneNumber : '',
});

const StudentEditDrawer = ({
  open,
  student,
  submitting,
  apiErrors = {},
  onClose,
  onSubmit,
  onResetPassword,
  onToggleStatus,
}) => {
  const [form, setForm] = useState(() => createInitial(student));
  const [errors, setErrors] = useState({});

  const mergedErrors = useMemo(() => ({ ...apiErrors, ...errors }), [apiErrors, errors]);

  const hasChanges = useMemo(() => {
    if (!student) {
      return false;
    }

    return form.fullName !== (student.fullName || '')
      || form.dateOfBirth !== (student.dateOfBirth && student.dateOfBirth !== '--' ? student.dateOfBirth : '')
      || form.gender !== (student.gender && student.gender !== '--' ? student.gender : 'MALE')
      || form.classId !== (student.classId && student.classId !== '--' ? student.classId : '')
      || form.email !== (student.email && student.email !== '--' ? student.email : '')
      || form.phoneNumber !== (student.phoneNumber && student.phoneNumber !== '--' ? student.phoneNumber : '');
  }, [form, student]);

  const readonlyValues = useMemo(() => ({
    id: student?.id || student?.studentId || '--',
    studentCode: student?.studentCode || '--',
    username: student?.username || '--',
    createdAt: student?.createdAt || '--',
    updatedAt: student?.updatedAt || '--',
  }), [student]);

  const readonlyGrid = [
    { key: 'id', label: 'ID' },
    { key: 'studentCode', label: 'Mã học sinh' },
    { key: 'username', label: 'Tên đăng nhập' },
    { key: 'createdAt', label: 'Ngày tạo' },
    { key: 'updatedAt', label: 'Ngày cập nhật' },
  ];

  const avatarSrc = student?.avatarUrl || student?.photoUrl || student?.profileImageUrl || '';

  const footer = (
    <div className="flex justify-end gap-2.5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
      >
        Hủy
      </button>
      <button
        type="button"
        disabled={submitting || !hasChanges}
        onClick={async () => {
          const nextErrors = validateStudentBasicForm(form);
          setErrors(nextErrors);
          if (Object.keys(nextErrors).length) {
            return;
          }
          await onSubmit(form);
          onClose();
        }}
        className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {submitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
      </button>
    </div>
  );

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title="Chỉnh sửa học sinh"
      subtitle="Cập nhật thông tin hành chính học sinh"
      footer={footer}
    >
      <div className="space-y-4">
        <p className="text-xs text-on-surface-variant">Các ô nền dịu là thông tin chỉ đọc. Các ô nền nổi bật là thông tin có thể chỉnh sửa.</p>

        <section className="rounded-lg border border-outline-variant bg-surface-container-low p-3.5">
          <div className="flex items-start gap-3">
            <EntityAvatar name={student?.fullName} imageUrl={avatarSrc} sizeClass="h-11 w-11" />
            <div>
              <h3 className="font-headline text-lg font-semibold text-on-surface">{student?.fullName || '--'}</h3>
              <p className="mt-0.5 text-sm text-on-surface-variant">
                {student?.studentCode || '--'} • {student?.className || student?.classId || '--'}
              </p>
              {student?.statusLabel ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge tone={student.statusTone}>{student.statusLabel}</StatusBadge>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {readonlyGrid.map((item) => (
            <ReadonlyField
              key={item.key}
              label={item.label}
              value={readonlyValues[item.key]}
              showReadonlyBadge={false}
            />
          ))}

          <EditableField
            label="Họ tên"
            value={form.fullName}
            onChange={(value) => setForm((prev) => ({ ...prev, fullName: value }))}
            placeholder="Ví dụ: Trần Văn An"
            error={mergedErrors.fullName}
          />
          <EditableField
            label="Ngày sinh"
            type="date"
            value={form.dateOfBirth}
            onChange={(value) => setForm((prev) => ({ ...prev, dateOfBirth: value }))}
            error={mergedErrors.dateOfBirth}
          />
          <EditableField
            label="Giới tính"
            type="select"
            options={STUDENT_CREATE_GENDER_OPTIONS}
            value={form.gender}
            onChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}
            error={mergedErrors.gender}
          />
          <EditableField
            label="Lớp"
            type="select"
            options={[{ value: '', label: 'Chọn lớp' }, ...STUDENT_CREATE_CLASS_OPTIONS]}
            value={form.classId}
            onChange={(value) => setForm((prev) => ({ ...prev, classId: value }))}
            error={mergedErrors.classId}
          />
          <EditableField
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            placeholder="Ví dụ: hs01@school.local"
            error={mergedErrors.email}
          />
          <EditableField
            label="Số điện thoại"
            value={form.phoneNumber}
            onChange={(value) => setForm((prev) => ({ ...prev, phoneNumber: value }))}
            placeholder="Ví dụ: 0905123456"
            error={mergedErrors.phoneNumber}
          />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-outline-variant pt-3">
          <button
            type="button"
            onClick={onResetPassword}
            className="rounded-md border border-warning/30 bg-warning-soft px-3 py-1.5 text-sm font-semibold text-warning transition hover:bg-warning-soft/80"
          >
            Reset mật khẩu
          </button>
          <button
            type="button"
            onClick={onToggleStatus}
            className="rounded-md border border-danger/30 bg-danger-soft px-3 py-1.5 text-sm font-semibold text-danger transition hover:bg-danger-soft/80"
          >
            Ẩn hồ sơ / ngưng hoạt động
          </button>
        </div>
      </div>
    </RightDrawer>
  );
};

export default StudentEditDrawer;
