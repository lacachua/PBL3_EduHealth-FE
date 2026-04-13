import React, { useEffect } from 'react';

const optionCardClass = 'rounded-lg border border-outline-variant bg-surface-container-lowest p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-container-low';

const AccountTypeSelectorModal = ({
  open,
  onClose,
  onSelectNurse,
  onSelectStudent,
}) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-on-surface/32" aria-label="Đóng" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-[0_16px_34px_rgba(15,23,42,0.16)] md:p-5">
        <div className="flex items-start justify-between gap-3 border-b border-outline-variant pb-3">
          <div>
            <h3 className="font-headline text-lg font-semibold text-on-surface">Chọn loại bản ghi cần tạo</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Tài khoản nhân viên và hồ sơ học sinh được xử lý ở hai module riêng.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface-variant transition hover:bg-surface-container-low"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <section className={optionCardClass}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
              <span className="material-symbols-outlined text-[18px]">medical_services</span>
            </span>
            <h4 className="mt-3 text-sm font-semibold text-on-surface">Tài khoản nhân viên y tế</h4>
            <p className="mt-1 text-sm text-on-surface-variant">Tạo tài khoản đăng nhập cho nhân viên y tế của trường.</p>
            <button
              type="button"
              onClick={onSelectNurse}
              className="mt-3 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
            >
              Tiếp tục
            </button>
          </section>

          <section className={optionCardClass}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-info-soft text-info">
              <span className="material-symbols-outlined text-[18px]">school</span>
            </span>
            <h4 className="mt-3 text-sm font-semibold text-on-surface">Hồ sơ học sinh</h4>
            <p className="mt-1 text-sm text-on-surface-variant">Hồ sơ học sinh và dữ liệu sức khỏe được quản lý ở phân hệ học sinh.</p>
            <button
              type="button"
              onClick={onSelectStudent}
              className="mt-3 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
            >
              Đi đến Quản lý học sinh
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelectorModal;
