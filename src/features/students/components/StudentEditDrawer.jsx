import React, { useMemo, useState } from 'react';
import RightDrawer from '../../../shared/components/core/RightDrawer';
import EditableField from '../../../shared/components/form/EditableField';
import ReadonlyField from '../../../shared/components/form/ReadonlyField';
import { validateStudentBasicForm } from '../schemas/studentManagementSchema';

const toDateInputValue = (value) => {
  if (!value) return '';
  return String(value).split('T')[0];
};

const getLocalDateValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createInitialValues = (student) => ({
  fullName: student?.fullName || '',
  dateOfBirth: toDateInputValue(student?.dateOfBirth),
  gender: String(student?.gender || '').toUpperCase(),
  classId: student?.classId ? String(student.classId) : '',
  email: student?.email || '',
  phoneNumber: student?.phoneNumber || '',
});

const StudentEditDrawerContent = ({
  student,
  classes = [],
  classesLoading = false,
  classesError = '',
  submitting = false,
  apiErrors = {},
  onClose,
  onSubmit,
}) => {
  const initialValues = useMemo(() => createInitialValues(student), [student]);
  const [editedValues, setEditedValues] = useState({});
  const [errors, setErrors] = useState({});
  const [dirtyFields, setDirtyFields] = useState({});

  const form = useMemo(() => {
    const next = { ...initialValues };
    Object.keys(dirtyFields).forEach((field) => {
      if (dirtyFields[field]) {
        next[field] = editedValues[field];
      }
    });
    return next;
  }, [dirtyFields, editedValues, initialValues]);

  const mergedErrors = useMemo(
    () => ({ ...apiErrors, ...errors }),
    [apiErrors, errors],
  );

  const hasChanges = useMemo(
    () => Object.keys(initialValues).some((key) => form[key] !== initialValues[key]),
    [form, initialValues],
  );

  const updateField = (field, value) => {
    setEditedValues((current) => ({ ...current, [field]: value }));
    setDirtyFields((current) => ({ ...current, [field]: true }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async () => {
    const nextErrors = validateStudentBasicForm(form);
    const today = getLocalDateValue();
    if (form.dateOfBirth && form.dateOfBirth >= today) {
      nextErrors.dateOfBirth = 'Ngày sinh phải nhỏ hơn ngày hiện tại';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      await onSubmit(form);
    } catch {
      // API errors are rendered from apiErrors supplied by the mutation hook.
    }
  };

  const classOptions = [
    { label: classesLoading ? 'Đang tải danh sách lớp...' : 'Chọn lớp', value: '' },
    ...classes.map((item) => ({
      label: item.label || item.className || item.name || String(item.value || item.classId || item.id),
      value: String(item.value || item.classId || item.id),
    })),
  ];

  const footer = (
    <div className="flex justify-end gap-2.5">
      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        className="app-focus-ring rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-55"
      >
        Hủy
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || classesLoading || !hasChanges}
        className="app-focus-ring rounded-md bg-primary px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {submitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
      </button>
    </div>
  );

  return (
    <RightDrawer
      open
      onClose={onClose}
      title="Chỉnh sửa tài khoản học sinh"
      subtitle="Cập nhật thông tin cơ bản và lớp học của học sinh"
      footer={footer}
    >
      <div className="space-y-4">
        {apiErrors.general ? (
          <div className="rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
            {apiErrors.general}
          </div>
        ) : null}

        <section className="rounded-lg border border-outline-variant bg-surface-container-low p-3.5">
          <h3 className="font-headline text-base font-semibold text-on-surface">
            {student?.fullName || 'Học sinh'}
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            {student?.className || 'Chưa có lớp'} · {student?.statusLabel || student?.status || 'Chưa cập nhật'}
          </p>
        </section>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <ReadonlyField
            label="Mã học sinh"
            value={student?.id || student?.apiId || '--'}
            showReadonlyBadge={false}
          />
          <ReadonlyField
            label="Trạng thái tài khoản"
            value={student?.statusLabel || student?.status || '--'}
            showReadonlyBadge={false}
          />

          <EditableField
            label="Họ và tên"
            value={form.fullName}
            onChange={(value) => updateField('fullName', value)}
            placeholder="Nhập họ và tên"
            error={mergedErrors.fullName}
          />
          <EditableField
            label="Ngày sinh"
            type="date"
            value={form.dateOfBirth}
            onChange={(value) => updateField('dateOfBirth', value)}
            error={mergedErrors.dateOfBirth}
          />
          <EditableField
            label="Giới tính"
            type="select"
            value={form.gender}
            onChange={(value) => updateField('gender', value)}
            options={[
              { label: 'Chọn giới tính', value: '' },
              { label: 'Nam', value: 'MALE' },
              { label: 'Nữ', value: 'FEMALE' },
              { label: 'Khác', value: 'OTHER' },
            ]}
            error={mergedErrors.gender}
          />
          <EditableField
            label="Lớp"
            type="select"
            value={form.classId}
            onChange={(value) => updateField('classId', value)}
            options={classOptions}
            error={mergedErrors.classId || classesError}
          />
          <EditableField
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => updateField('email', value)}
            placeholder="Nhập email"
            error={mergedErrors.email}
          />
          <EditableField
            label="Số điện thoại"
            value={form.phoneNumber}
            onChange={(value) => updateField('phoneNumber', value)}
            placeholder="Nhập số điện thoại"
            error={mergedErrors.phoneNumber || mergedErrors.phone}
          />
        </div>
      </div>
    </RightDrawer>
  );
};

const StudentEditDrawer = ({ open, student, ...props }) => {
  if (!open || !student) return null;

  return (
    <StudentEditDrawerContent
      key={student.apiId || student.id}
      student={student}
      {...props}
    />
  );
};

export default StudentEditDrawer;
