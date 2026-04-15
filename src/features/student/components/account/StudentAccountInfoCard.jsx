import React from 'react';

const labelClassName = 'text-xs font-bold uppercase tracking-[0.12em] text-on-surface-muted';
const editableInputClassName = 'student-focus-ring nurse-input mt-1 h-10 w-full rounded-lg px-3 text-sm';
const readonlyInputClassName =
  'mt-1 h-10 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm font-medium text-on-surface-variant opacity-90';
const fieldCardClassName = 'rounded-xl border border-outline-variant bg-surface px-3 py-2.5';
const fieldErrorClassName = 'mt-1 text-xs font-medium text-danger';

const toReadableText = (value, fallback = 'Chưa cập nhật') => {
  const normalized = String(value || '').trim();
  return normalized || fallback;
};

const StudentAccountInfoCard = ({
  profile,
  formValues,
  formErrors,
  isSaving,
  canEditProfile,
  onFieldChange,
  onCancel,
  onSave,
}) => {
  const renderReadonlyField = (id, label, value) => {
    return (
      <div className={fieldCardClassName}>
        <label htmlFor={id} className={labelClassName}>{label}</label>
        <input id={id} value={toReadableText(value)} readOnly disabled className={readonlyInputClassName} />
      </div>
    );
  };

  return (
    <section className="student-module-surface h-full rounded-3xl p-5">
      <header className="mb-4 rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,#dbf6f1_0%,#edf9ff_100%)] px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/14 text-primary">
            <span className="material-symbols-outlined text-[19px]">person</span>
          </span>
          <h3 className="text-base font-bold text-on-surface">Thông tin cá nhân</h3>
        </div>
      </header>

      <div className="space-y-4">
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-muted">Thông tin tài khoản</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {renderReadonlyField('accountUsername', 'Tên đăng nhập', profile.username)}
            {renderReadonlyField('accountRole', 'Vai trò', profile.roleLabel)}
            {renderReadonlyField('accountStatus', 'Trạng thái', profile.statusLabel)}
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-muted">Thông tin cá nhân</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className={fieldCardClassName}>
              <label htmlFor="profileFullName" className={labelClassName}>Họ và tên</label>
              <input
                id="profileFullName"
                type="text"
                value={canEditProfile ? formValues.fullName : toReadableText(profile.fullName)}
                onChange={(event) => onFieldChange('fullName', event.target.value)}
                className={canEditProfile ? editableInputClassName : readonlyInputClassName}
                readOnly={!canEditProfile}
                disabled={!canEditProfile}
              />
              {formErrors.fullName ? <p className={fieldErrorClassName}>{formErrors.fullName}</p> : null}
            </div>

            {renderReadonlyField('profileEmail', 'Email', profile.email)}

            <div className={fieldCardClassName}>
              <label htmlFor="profilePhone" className={labelClassName}>Số điện thoại tài khoản</label>
              <input
                id="profilePhone"
                type="tel"
                value={canEditProfile ? formValues.phone : toReadableText(profile.phone)}
                onChange={(event) => onFieldChange('phone', event.target.value)}
                className={canEditProfile ? editableInputClassName : readonlyInputClassName}
                readOnly={!canEditProfile}
                disabled={!canEditProfile}
              />
              {formErrors.phone ? <p className={fieldErrorClassName}>{formErrors.phone}</p> : null}
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-muted">Thông tin học sinh</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {renderReadonlyField('studentCode', 'Mã học sinh', profile.studentCode)}
            {renderReadonlyField('studentClass', 'Lớp', profile.className)}
            {renderReadonlyField('studentGender', 'Giới tính', profile.gender)}
            {renderReadonlyField('studentDob', 'Ngày sinh', profile.dateOfBirth)}
            {renderReadonlyField('studentGuardian', 'Người giám hộ', profile.guardian)}
            {renderReadonlyField('studentGuardianPhone', 'Số điện thoại người giám hộ', profile.guardianPhone)}
            {renderReadonlyField('studentHeight', 'Chiều cao hiện tại', profile.currentHeight)}
            {renderReadonlyField('studentWeight', 'Cân nặng hiện tại', profile.currentWeight)}

            <div className="md:col-span-2 rounded-xl border border-outline-variant bg-surface px-3 py-2.5">
              <label htmlFor="studentMedicalNotes" className={labelClassName}>Ghi chú y tế</label>
              <textarea
                id="studentMedicalNotes"
                rows={3}
                value={toReadableText(profile.medicalHistoryNotes)}
                readOnly
                disabled
                className="mt-1 w-full resize-none rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm font-medium leading-relaxed text-on-surface-variant opacity-90"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving || !canEditProfile}
          className="student-focus-ring student-interactive rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm font-semibold text-on-surface disabled:cursor-not-allowed disabled:opacity-70"
        >
          Hủy
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !canEditProfile}
          className="student-focus-ring student-interactive rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </section>
  );
};

export default StudentAccountInfoCard;
