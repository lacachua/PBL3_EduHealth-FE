import React from 'react';

const ExportActions = ({ exporting, onExport }) => {
  return (
    <div className="flex items-center gap-2">
      <button type="button" disabled={exporting} onClick={() => onExport('xlsx')} className="rounded-xl border border-outline-variant bg-surface px-3 py-2 text-sm font-semibold text-on-surface-variant disabled:opacity-50">
        Xuất Excel
      </button>
      <button type="button" disabled={exporting} onClick={() => onExport('pdf')} className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
        Xuất PDF
      </button>
    </div>
  );
};

export default ExportActions;
