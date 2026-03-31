import React from 'react';

const ExportActions = ({ onExport, exporting = false }) => {
  return (
    <div className="flex">
      <button
        type="button"
        disabled={exporting}
        onClick={() => onExport('pdf')}
        className="inline-flex items-center gap-2 rounded-l-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
        PDF
      </button>
      <button
        type="button"
        disabled={exporting}
        onClick={() => onExport('xlsx')}
        className="inline-flex items-center gap-2 rounded-r-xl border border-secondary bg-secondary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-[18px]">download</span>
        Xuất Excel
      </button>
    </div>
  );
};

export default ExportActions;
