import React from 'react';

const ExportActions = ({
  onExport,
  exporting = false,
  disabled = false,
  disabledMessage = 'Chức năng xuất báo cáo đang được hoàn thiện',
}) => {
  const isDisabled = exporting || disabled;

  return (
    <div className="flex" title={disabled ? disabledMessage : undefined}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onExport('pdf')}
        className="inline-flex items-center gap-2 rounded-l-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
        PDF
      </button>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onExport('xlsx')}
        className="inline-flex items-center gap-2 rounded-r-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-[18px]">download</span>
        Xuất Excel
      </button>
      {disabled ? <span className="sr-only">{disabledMessage}</span> : null}
    </div>
  );
};

export default ExportActions;
