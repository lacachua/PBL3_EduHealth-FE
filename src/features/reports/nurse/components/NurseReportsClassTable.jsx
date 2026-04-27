import { useEffect, useMemo } from 'react';
import DataTable from '../../../../shared/components/core/DataTable';
import EmptyState from '../../../../shared/components/core/EmptyState';
import Pagination from '../../../../shared/components/core/Pagination';
import SectionCard from '../../../../shared/components/core/SectionCard';
import StatusBadge from '../../../../shared/components/core/StatusBadge';

const NurseReportsClassTable = ({
  rows,
  page,
  pageSize,
  onPageChange,
  onExport,
  exporting,
  exportingFormat = '',
}) => {
  const totalItems = Array.isArray(rows) ? rows.length : 0;
  const safePageSize = Math.max(1, Number(pageSize) || 6);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    if (safePage !== page) {
      onPageChange(safePage);
    }
  }, [onPageChange, page, safePage]);

  const pagedRows = useMemo(() => {
    const safeRows = Array.isArray(rows) ? rows : [];
    const start = (safePage - 1) * safePageSize;
    return safeRows.slice(start, start + safePageSize);
  }, [rows, safePage, safePageSize]);

  const columns = useMemo(() => ([
    {
      key: 'className',
      header: 'Lớp học',
      headerClassName: 'w-[112px]',
      render: (row) => <p className="text-sm font-semibold text-on-surface">{row.className}</p>,
    },
    {
      key: 'gradeLabel',
      header: 'Khối',
      headerClassName: 'w-[88px]',
      cellClassName: 'text-sm text-on-surface-variant',
      render: (row) => row.gradeLabel,
    },
    {
      key: 'studentCount',
      header: 'Sĩ số',
      headerClassName: 'w-[76px] text-right',
      cellClassName: 'text-right font-semibold text-on-surface',
      render: (row) => row.studentCount,
    },
    {
      key: 'examinationCount',
      header: 'Lượt khám',
      headerClassName: 'w-[96px] text-right',
      cellClassName: 'text-right text-sm font-semibold text-on-surface',
      render: (row) => row.examinationCount,
    },
    {
      key: 'trackingCount',
      header: 'Theo dõi',
      headerClassName: 'w-[92px] text-right',
      cellClassName: 'text-right text-sm text-on-surface-variant',
      render: (row) => row.trackingCount,
    },
    {
      key: 'medicineDispenseCount',
      header: 'Thuốc cấp',
      headerClassName: 'w-[100px] text-right',
      cellClassName: 'text-right text-sm text-on-surface-variant',
      render: (row) => row.medicineDispenseCount,
    },
    {
      key: 'vaccinationRateLabel',
      header: 'Tiêm chủng',
      headerClassName: 'w-[100px] text-right',
      cellClassName: 'text-right text-sm font-semibold text-on-surface',
      render: (row) => row.vaccinationRateLabel,
    },
    {
      key: 'statusLabel',
      header: 'Trạng thái',
      headerClassName: 'w-[126px]',
      render: (row) => <StatusBadge tone={row.statusTone}>{row.statusLabel}</StatusBadge>,
    },
  ]), []);

  return (
    <SectionCard
      title="Theo dõi theo lớp học"
      className="app-card-shell rounded-xl p-0"
      headerClassName="mb-0 flex flex-col gap-2 px-4 pt-3.5 md:flex-row md:items-center md:justify-between"
      titleClassName="app-section-title"
      subtitleClassName="app-meta-text mt-0.5"
      actions={(
        <button
          type="button"
          onClick={() => onExport('xlsx')}
          disabled={exporting || !totalItems}
          className="app-focus-ring inline-flex items-center gap-1.5 rounded-xl border border-outline-variant bg-primary px-2.5 py-2 text-xs font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className={`material-symbols-outlined text-[17px] ${exportingFormat === 'xlsx' ? 'animate-spin' : ''}`}>
            {exportingFormat === 'xlsx' ? 'progress_activity' : 'file_download'}
          </span>
          Excel
        </button>
      )}
    >
      <div className="space-y-2.5 p-4 pt-3">
        {!totalItems ? (
          <EmptyState
            title="Không có dữ liệu lớp học"
            description="Bộ lọc hiện tại chưa có bản ghi phù hợp."
          />
        ) : (
          <>
            <DataTable
              dense
              columns={columns}
              rows={pagedRows}
              getRowKey={(row) => row.id}
              headCellPaddingClassName="px-2.5 py-2"
              bodyCellPaddingClassName="px-2.5 py-2"
              containerClassName="overflow-x-auto rounded-xl border border-outline-variant bg-surface shadow-[0_10px_22px_-18px_rgba(15,23,42,0.5)]"
              tableClassName="w-full table-fixed divide-y divide-outline-variant text-[13px]"
              headClassName="app-table-head text-left"
              bodyClassName="divide-y divide-outline-variant bg-surface"
              rowClassName="app-interactive transition-[background-color] duration-150 hover:bg-surface-container-low"
            />

            <div className="flex flex-col gap-2 text-[12px] font-semibold text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
              <span>Hiển thị {pagedRows.length}/{totalItems} lớp</span>
              <span>Trang {safePage}/{totalPages}</span>
            </div>

            <Pagination
              compact
              page={safePage}
              pageSize={safePageSize}
              totalItems={totalItems}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </SectionCard>
  );
};

export default NurseReportsClassTable;
