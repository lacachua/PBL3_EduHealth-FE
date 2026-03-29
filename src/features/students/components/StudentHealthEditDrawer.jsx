import React, { useMemo, useState } from 'react';
import EntityAvatar from '../../../shared/components/admin/EntityAvatar';
import RightDrawer from '../../../shared/components/admin/RightDrawer';
import EditableField from '../../../shared/components/form/EditableField';
import ReadonlyField from '../../../shared/components/form/ReadonlyField';
import StatusBadge from '../../../shared/components/admin/StatusBadge';
import { validateStudentHealthForm } from '../schemas/studentManagementSchema';

const BLOOD_TYPE_OPTIONS = [
  { value: '', label: 'Chưa cập nhật' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'AB', label: 'AB' },
  { value: 'O', label: 'O' },
];

const createInitial = (profile) => ({
  heightCm: profile?.heightCm ?? '',
  weightKg: profile?.weightKg ?? '',
  bloodType: profile?.bloodType || '',
  eyeStatus: profile?.eyeStatus || '',
  chronicNote: profile?.chronicNote || '',
  generalHealthNote: profile?.generalHealthNote || '',
  allergies: profile?.allergies || '',
});

const StudentHealthEditDrawer = ({ open, student, profile, submitting, apiErrors = {}, onClose, onSubmit }) => {
  const [form, setForm] = useState(() => createInitial(profile));
  const [errors, setErrors] = useState({});

  const mergedErrors = useMemo(() => ({ ...apiErrors, ...errors }), [apiErrors, errors]);

  const hasChanges = useMemo(() => {
    const initial = createInitial(profile);
    return Object.keys(initial).some((key) => String(form[key] ?? '') !== String(initial[key] ?? ''));
  }, [form, profile]);

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
          const nextErrors = validateStudentHealthForm(form);
          setErrors(nextErrors);
          if (Object.keys(nextErrors).length) {
            return;
          }
          await onSubmit(form);
          onClose();
        }}
        className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {submitting ? 'Đang xử lý...' : 'Lưu hồ sơ sức khỏe'}
      </button>
    </div>
  );

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title="Cập nhật hồ sơ sức khỏe"
      subtitle={`Học sinh: ${student?.fullName || '--'}`}
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
          <ReadonlyField label="Mã học sinh" value={student?.studentCode || '--'} showReadonlyBadge={false} />
          <ReadonlyField label="Họ tên" value={student?.fullName || '--'} showReadonlyBadge={false} />

          <EditableField
            label="Chiều cao (cm)"
            type="number"
            value={form.heightCm}
            onChange={(value) => setForm((prev) => ({ ...prev, heightCm: value }))}
            error={mergedErrors.heightCm}
          />
          <EditableField
            label="Cân nặng (kg)"
            type="number"
            value={form.weightKg}
            onChange={(value) => setForm((prev) => ({ ...prev, weightKg: value }))}
            error={mergedErrors.weightKg}
          />
          <EditableField
            label="Nhóm máu"
            type="select"
            options={BLOOD_TYPE_OPTIONS}
            value={form.bloodType}
            onChange={(value) => setForm((prev) => ({ ...prev, bloodType: value }))}
          />
          <EditableField
            label="Tình trạng mắt"
            value={form.eyeStatus}
            onChange={(value) => setForm((prev) => ({ ...prev, eyeStatus: value }))}
            placeholder="Ví dụ: Cận thị nhẹ"
          />
          <EditableField
            label="Ghi chú bệnh nền"
            type="textarea"
            value={form.chronicNote}
            onChange={(value) => setForm((prev) => ({ ...prev, chronicNote: value }))}
          />
          <EditableField
            label="Ghi chú sức khỏe chung"
            type="textarea"
            value={form.generalHealthNote}
            onChange={(value) => setForm((prev) => ({ ...prev, generalHealthNote: value }))}
          />
          <div className="md:col-span-2">
            <EditableField
              label="Dị ứng"
              type="textarea"
              value={form.allergies}
              onChange={(value) => setForm((prev) => ({ ...prev, allergies: value }))}
              placeholder="Nhập danh sách dị ứng, phân tách bằng dấu phẩy"
              helper="Ví dụ: Dị ứng sữa, Dị ứng hải sản"
            />
          </div>
        </div>
      </div>
    </RightDrawer>
  );
};

export default StudentHealthEditDrawer;
