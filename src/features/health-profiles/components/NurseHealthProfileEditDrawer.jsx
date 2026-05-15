import React, { useMemo, useState } from 'react';
import EntityAvatar from '../../../shared/components/core/EntityAvatar';
import RightDrawer from '../../../shared/components/core/RightDrawer';
import EditableField from '../../../shared/components/form/EditableField';
import ReadonlyField from '../../../shared/components/form/ReadonlyField';
import StatusBadge from '../../../shared/components/core/StatusBadge';
import InlineError from '../../../shared/components/form/InlineError';
import { validateStudentHealthForm } from '../../students/schemas/studentManagementSchema';

const editableInputClass = 'w-full rounded-lg border border-[var(--color-field-editable-border)] bg-[var(--color-field-editable-bg)] px-3 py-2 text-sm text-on-surface outline-none transition placeholder:text-[var(--color-field-placeholder)] hover:border-outline focus:border-[var(--color-field-focus)] focus:ring-2 focus:ring-[var(--color-field-focus)]/20';

const bloodTypeOptions = [
  { value: '', label: 'Chưa cập nhật' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'AB', label: 'AB' },
  { value: 'O', label: 'O' },
];

const parseAllergyId = (value) => {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  }

  const normalized = String(value || '').trim();
  if (!normalized) {
    return null;
  }

  const digits = normalized.replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  const parsed = Number(digits);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const toEditableAllergies = (profile, fallbackAllergyItems = []) => {
  const source = Array.isArray(profile?.allergyItems) && profile.allergyItems.length
    ? profile.allergyItems
    : Array.isArray(fallbackAllergyItems)
      ? fallbackAllergyItems
      : [];

  return source
    .map((item, index) => ({
      id: item?.id || `allergy-${index + 1}`,
      allergyId: item?.allergyId || parseAllergyId(item?.allergyTypeId) || '',
      note: item?.note || '',
      label: item?.allergyTypeName || item?.label || '',
    }))
    .filter((item) => item.allergyId || item.note || item.label);
};

const roundForInput = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  return n.toFixed(1).replace(/\.0$/, '');
};

const createInitial = (profile, fallbackAllergyItems = []) => ({
  heightCm: roundForInput(profile?.heightCm),
  weightKg: roundForInput(profile?.weightKg),
  bloodType: profile?.bloodType === 'UNKNOWN' ? '' : (profile?.bloodType || ''),
  eyeStatus: profile?.eyeStatus || '',
  chronicNote: profile?.chronicNote || '',
  generalHealthNote: profile?.generalHealthNote || '',
  allergies: toEditableAllergies(profile, fallbackAllergyItems),
});

const normalizeAllergiesForSubmit = (rows = []) => {
  return rows
    .map((item) => {
      const allergyId = parseAllergyId(item?.allergyId);
      if (!allergyId) {
        return null;
      }

      const note = String(item?.note || '').trim();
      return {
        allergyId,
        note: note || null,
      };
    })
    .filter(Boolean);
};

const normalizeForCompare = (form) => {
  const allergies = normalizeAllergiesForSubmit(form.allergies);
  return JSON.stringify({
    heightCm: String(form.heightCm ?? ''),
    weightKg: String(form.weightKg ?? ''),
    bloodType: String(form.bloodType ?? '').trim().toUpperCase(),
    eyeStatus: String(form.eyeStatus ?? '').trim(),
    chronicNote: String(form.chronicNote ?? '').trim(),
    generalHealthNote: String(form.generalHealthNote ?? '').trim(),
    allergies,
  });
};

const validateAllergyRows = (rows = []) => {
  const errors = {};
  const seen = new Set();

  rows.forEach((item) => {
    const rawId = String(item?.allergyId || '').trim();
    const note = String(item?.note || '').trim();

    if (!rawId && !note) {
      return;
    }

    const parsed = parseAllergyId(rawId);
    if (!parsed) {
      errors.allergies = 'Mỗi dòng dị ứng cần mã dị ứng dạng số nguyên dương.';
      return;
    }

    if (seen.has(parsed)) {
      errors.allergies = 'Danh sách dị ứng đang có mã trùng lặp.';
      return;
    }

    seen.add(parsed);
  });

  return errors;
};

const NurseHealthProfileEditDrawer = ({
  open,
  student,
  profile,
  allergyItems = [],
  allergyTypeOptions = [],
  submitting,
  apiErrors = {},
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(() => createInitial(profile, allergyItems));
  const [errors, setErrors] = useState({});

  const mergedErrors = useMemo(() => ({ ...apiErrors, ...errors }), [apiErrors, errors]);

  const hasChanges = useMemo(() => {
    const initial = createInitial(profile, allergyItems);
    return normalizeForCompare(form) !== normalizeForCompare(initial);
  }, [allergyItems, form, profile]);

  const avatarSrc = student?.avatarUrl || student?.photoUrl || student?.profileImageUrl || '';

  const setAllergyRow = (index, next) => {
    setForm((prev) => ({
      ...prev,
      allergies: prev.allergies.map((item, idx) => (idx === index ? { ...item, ...next } : item)),
    }));
  };

  const addAllergyRow = () => {
    setForm((prev) => ({
      ...prev,
      allergies: [...prev.allergies, { id: `new-${Date.now()}`, allergyId: '', note: '', label: '' }],
    }));
  };

  const removeAllergyRow = (index) => {
    setForm((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, idx) => idx !== index),
    }));
  };

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
          const nextErrors = {
            ...validateStudentHealthForm(form),
            ...validateAllergyRows(form.allergies),
          };

          setErrors(nextErrors);
          if (Object.keys(nextErrors).length) {
            return;
          }

          await onSubmit({
            ...form,
            allergies: normalizeAllergiesForSubmit(form.allergies),
          });
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
        <p className="text-xs text-on-surface-variant">Cập nhật thông tin sức khỏe cơ bản của học sinh.</p>
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
            value={form.bloodType}
            options={bloodTypeOptions}
            onChange={(value) => setForm((prev) => ({ ...prev, bloodType: value }))}
            error={mergedErrors.bloodType}
          />
          <EditableField
            label="Tình trạng mắt"
            type="textarea"
            value={form.eyeStatus}
            onChange={(value) => setForm((prev) => ({ ...prev, eyeStatus: value }))}
            error={mergedErrors.eyeStatus}
          />
          <EditableField
            label="Ghi chú bệnh nền"
            type="textarea"
            value={form.chronicNote}
            onChange={(value) => setForm((prev) => ({ ...prev, chronicNote: value }))}
            error={mergedErrors.chronicNote}
          />
          <EditableField
            label="Ghi chú sức khỏe chung"
            type="textarea"
            value={form.generalHealthNote}
            onChange={(value) => setForm((prev) => ({ ...prev, generalHealthNote: value }))}
            error={mergedErrors.generalHealthNote}
          />
        </div>

        <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-3.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-on-surface">Dị ứng</h4>
            <button
              type="button"
              onClick={addAllergyRow}
              className="rounded-md border border-outline-variant bg-surface-container-low px-2.5 py-1 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container"
            >
              + Thêm dòng
            </button>
          </div>

          <p className="mt-1 text-xs text-on-surface-muted">Chọn loại dị ứng và nhập ghi chú nếu cần.</p>

          <div className="mt-3 space-y-2">
            {form.allergies.length ? form.allergies.map((item, index) => (
              <div key={item.id || `row-${index}`} className="grid grid-cols-1 gap-2 rounded-lg border border-outline-variant bg-surface-container-low p-2.5 md:grid-cols-[160px_1fr_auto]">
                <select
                  value={item.allergyId}
                  onChange={(event) => setAllergyRow(index, { allergyId: event.target.value })}
                  className={editableInputClass}
                >
                  <option value="">Chọn dị ứng</option>
                  {allergyTypeOptions.map((option) => (
                    <option key={option.allergyId} value={option.allergyId}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={item.note}
                  onChange={(event) => setAllergyRow(index, { note: event.target.value })}
                  placeholder="Ghi chú"
                  className={editableInputClass}
                />
                <button
                  type="button"
                  onClick={() => removeAllergyRow(index)}
                  className="rounded-md border border-outline-variant bg-surface-container-low px-2.5 py-1 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container"
                >
                  Xóa
                </button>
              </div>
            )) : (
              <p className="rounded-lg border border-dashed border-outline-variant bg-surface-container-low px-3 py-2 text-xs text-on-surface-muted">
                Chưa có dị ứng. Có thể thêm mới nếu cần cập nhật.
              </p>
            )}
          </div>

          <InlineError message={mergedErrors.allergies} />
        </section>
      </div>
    </RightDrawer>
  );
};

export default NurseHealthProfileEditDrawer;
