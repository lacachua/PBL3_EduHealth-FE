import { useMemo, useState } from 'react';
import {
  UPDATE_STUDENT_VACCINATION_INITIAL_VALUES,
  validateUpdateStudentVaccinationValues,
} from '../schemas/vaccinationSchema';
import { VACCINATION_STATUS_OPTIONS } from '../constants/vaccinationConstants';
import NurseModalShell from '../../../shared/components/nurse/NurseModalShell';

const toDateInputValue = (value) => {
  if (!value) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().slice(0, 10);
};

const UpdateStudentVaccinationModal = ({
  open,
  context,
  submitting,
  submitError,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(() => ({
    ...UPDATE_STUDENT_VACCINATION_INITIAL_VALUES,
    status: context?.status || 'PENDING',
    vaccinatedAt: toDateInputValue(context?.vaccinatedAtIso || context?.vaccinatedAt),
    lotNumber: context?.lotNumber || '',
    note: context?.note || '',
  }));
  const [fieldErrors, setFieldErrors] = useState({});

  const shouldShowDoneFields = values.status === 'DONE';
  const todayStr = useMemo(() => {
    const today = new Date();
    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');
  }, []);

  const selectedStatusLabel = useMemo(() => {
    return VACCINATION_STATUS_OPTIONS.find((option) => option.value === values.status)?.label || 'Trạng thái';
  }, [values.status]);

  if (!open || !context) {
    return null;
  }

  const updateField = (field, fieldValue) => {
    setValues((prev) => ({
      ...prev,
      [field]: fieldValue,
    }));

    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateUpdateStudentVaccinationValues(values);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    await onSubmit(values);
  };

  return (
    <NurseModalShell
      open={open}
      onClose={onClose}
      title="Cập nhật kết quả tiêm"
      subtitle="Ghi nhận theo đúng bản ghi học sinh trong đợt tiêm hiện tại."
      error={submitError}
      onSubmit={handleSubmit}
      submitting={submitting}
      submitLabel="Lưu kết quả"
      maxWidthClass="max-w-[880px]"
      submitButtonClassName="app-btn-primary app-focus-ring rounded-xl px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
    >
      <div className="space-y-4">
        <section className="grid gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-3 md:grid-cols-2">
          <div>
            <p className="app-overline text-on-surface-variant">Học sinh</p>
            <p className="mt-1 text-sm font-semibold text-on-surface">{context.student?.fullName || '--'}</p>
          </div>

          <div>
            <p className="app-overline text-on-surface-variant">Mã học sinh</p>
            <p className="mt-1 text-sm font-semibold text-on-surface">{context.student?.studentCode || '--'}</p>
          </div>

          <div>
            <p className="app-overline text-on-surface-variant">Lớp</p>
            <p className="mt-1 text-sm font-semibold text-on-surface">{context.student?.className || '--'}</p>
          </div>

          <div>
            <p className="app-overline text-on-surface-variant">Đợt tiêm</p>
            <p className="mt-1 text-sm font-semibold text-on-surface">{context.campaignName || '--'}</p>
          </div>

          <div>
            <p className="app-overline text-on-surface-variant">Vaccine</p>
            <p className="mt-1 text-sm font-semibold text-on-surface">{context.vaccineName || '--'}</p>
          </div>

          <div>
            <p className="app-overline text-on-surface-variant">Ngày dự kiến</p>
            <p className="mt-1 text-sm font-semibold text-on-surface">{context.scheduledDateLabel || '--'}</p>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-on-surface">Trạng thái tiêm</span>
            <select
              value={values.status}
              onChange={(event) => updateField('status', event.target.value)}
              className="app-input rounded-xl px-3 py-2.5 text-sm"
            >
              {VACCINATION_STATUS_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {fieldErrors.status ? <span className="text-xs text-danger">{fieldErrors.status}</span> : null}
          </label>

          <div className="flex items-end">
            <span className="inline-flex rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
              Trạng thái đang chọn: {selectedStatusLabel}
            </span>
          </div>

          {shouldShowDoneFields ? (
            <>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-on-surface">Ngày tiêm thực tế</span>
                <input
                  type="date"
                  max={todayStr}
                  value={values.vaccinatedAt}
                  onChange={(event) => updateField('vaccinatedAt', event.target.value)}
                  className="app-input rounded-xl px-3 py-2.5 text-sm"
                />
                {fieldErrors.vaccinatedAt ? <span className="text-xs text-danger">{fieldErrors.vaccinatedAt}</span> : null}
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-on-surface">Số lô (Lot Number)</span>
                <input
                  type="text"
                  value={values.lotNumber}
                  onChange={(event) => updateField('lotNumber', event.target.value)}
                  className="app-input rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Ví dụ: LOT-2026-09"
                />
                {fieldErrors.lotNumber ? <span className="text-xs text-danger">{fieldErrors.lotNumber}</span> : null}
              </label>
            </>
          ) : null}
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-on-surface">Ghi chú</span>
          <textarea
            value={values.note}
            onChange={(event) => updateField('note', event.target.value)}
            className="app-input rounded-xl px-3 py-2.5 text-sm"
            rows={3}
            placeholder="Nhập ghi chú nếu có"
          />
          {fieldErrors.note ? <span className="text-xs text-danger">{fieldErrors.note}</span> : null}
        </label>

      </div>
    </NurseModalShell>
  );
};

export default UpdateStudentVaccinationModal;
