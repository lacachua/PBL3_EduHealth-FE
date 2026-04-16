import React, { useMemo, useState } from 'react';
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
          <section className="grid gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748B]">Học sinh</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">{context.student?.fullName || '--'}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748B]">Mã học sinh</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">{context.student?.studentCode || '--'}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748B]">Lớp</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">{context.student?.className || '--'}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748B]">Đợt tiêm</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">{context.campaignName || '--'}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748B]">Vaccine</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">{context.vaccineName || '--'}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748B]">Ngày dự kiến</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">{context.scheduledDateLabel || '--'}</p>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#334155]">Trạng thái tiêm</span>
              <select
                value={values.status}
                onChange={(event) => updateField('status', event.target.value)}
                className="app-input rounded-xl px-3 py-2.5 text-sm"
              >
                {VACCINATION_STATUS_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {fieldErrors.status ? <span className="text-xs text-[#B91C1C]">{fieldErrors.status}</span> : null}
            </label>

            <div className="flex items-end">
              <span className="inline-flex rounded-full bg-[#ECFDF3] px-2.5 py-1 text-xs font-semibold text-[#166534]">
                Trạng thái đang chọn: {selectedStatusLabel}
              </span>
            </div>

            {shouldShowDoneFields ? (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-[#334155]">Ngày tiêm thực tế</span>
                  <input
                    type="date"
                    value={values.vaccinatedAt}
                    onChange={(event) => updateField('vaccinatedAt', event.target.value)}
                    className="app-input rounded-xl px-3 py-2.5 text-sm"
                  />
                  {fieldErrors.vaccinatedAt ? <span className="text-xs text-[#B91C1C]">{fieldErrors.vaccinatedAt}</span> : null}
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-[#334155]">Số lô (Lot Number)</span>
                  <input
                    type="text"
                    value={values.lotNumber}
                    onChange={(event) => updateField('lotNumber', event.target.value)}
                    className="app-input rounded-xl px-3 py-2.5 text-sm"
                    placeholder="Ví dụ: LOT-2026-09"
                  />
                  {fieldErrors.lotNumber ? <span className="text-xs text-[#B91C1C]">{fieldErrors.lotNumber}</span> : null}
                </label>
              </>
            ) : (
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#64748B] md:col-span-2">
                Trạng thái hiện tại không yêu cầu ngày tiêm và số lô. Hai trường này sẽ được reset theo contract khi lưu.
              </div>
            )}
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#334155]">Ghi chú</span>
            <textarea
              value={values.note}
              onChange={(event) => updateField('note', event.target.value)}
              className="app-input rounded-xl px-3 py-2.5 text-sm"
              rows={3}
              placeholder="Nhập ghi chú nếu có"
            />
            {fieldErrors.note ? <span className="text-xs text-[#B91C1C]">{fieldErrors.note}</span> : null}
          </label>

      </div>
    </NurseModalShell>
  );
};

export default UpdateStudentVaccinationModal;
