import React, { useEffect, useMemo } from 'react';
import DataTable from '../../../../shared/components/core/DataTable';
import EmptyState from '../../../../shared/components/core/EmptyState';
import Pagination from '../../../../shared/components/core/Pagination';
import SectionCard from '../../../../shared/components/core/SectionCard';
import StatusBadge from '../../../../shared/components/core/StatusBadge';

const contains = (source, keyword) => {
  return String(source || '').toLowerCase().includes(keyword);
};

const NurseReportsClassTable = ({
  rows,
  searchValue,
  onSearchValueChange,
  statusFilter,
  statusOptions,
  page,
  pageSize,
  onPageChange,
  onStatusFilterChange,
  onExport,
  exporting,
}) => {
  const normalizedKeyword = String(searchValue || '').trim().toLowerCase();

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesStatus = statusFilter === 'all' || row.statusKey === statusFilter;
      if (!matchesStatus) {
        return false;
      }

      if (!normalizedKeyword) {
        return true;
      }

      return [
        row.className,
        row.gradeLabel,
        row.statusLabel,
      ].some((candidate) => contains(candidate, normalizedKeyword));
    });
  }, [normalizedKeyword, rows, statusFilter]);

  const totalItems = filteredRows.length;
  const safePageSize = Math.max(1, Number(pageSize) || 6);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    if (safePage !== page) {
      onPageChange(safePage);
    }
  }, [onPageChange, page, safePage]);

  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * safePageSize;
    return filteredRows.slice(start, start + safePageSize);
  }, [filteredRows, safePage, safePageSize]);

  const columns = useMemo(() => ([
    {
      key: 'className',
      header: 'Lớp học',
      headerClassName: 'w-[110px]',
      render: (row) => <p className="text-sm font-semibold text-on-surface">{row.className}</p>,
    },
    {
      key: 'gradeLabel',
      header: 'Khối',
      headerClassName: 'w-[92px]',
      cellClassName: 'text-sm text-on-surface-variant',
      render: (row) => row.gradeLabel,
    },
    {
      key: 'studentCount',
      header: 'Sĩ số',
      headerClassName: 'w-[80px] text-right',
      cellClassName: 'text-right font-semibold text-on-surface',
      render: (row) => row.studentCount,
    },
    {
      key: 'examinationCount',
      header: 'Lượt khám',
      headerClassName: 'w-[92px] text-right',
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
      header: 'Cấp thuốc',
      headerClassName: 'w-[92px] text-right',
      cellClassName: 'text-right text-sm text-on-surface-variant',
      render: (row) => row.medicineDispenseCount,
    },
    {
      key: 'vaccinationRateLabel',
      header: 'Tiêm chủng',
      headerClassName: 'w-[106px] text-right',
      cellClassName: 'text-right text-sm font-semibold text-on-surface',
      render: (row) => row.vaccinationRateLabel,
    },
    {
      key: 'statusLabel',
      header: 'Trạng thái',
      headerClassName: 'w-[116px]',
      render: (row) => <StatusBadge tone={row.statusTone}>{row.statusLabel}</StatusBadge>,
    },
  ]), []);

  return (
    <SectionCard
      title="Theo dõi theo lớp học"
      subtitle="Tra cứu nhanh theo lớp, trạng thái và xuất báo cáo Excel"
      className="app-card-shell rounded-xl p-0"
      headerClassName="mb-0 flex flex-col gap-2 px-4 pt-3.5 md:flex-row md:items-center md:justify-between"
      titleClassName="app-section-title"
      subtitleClassName="app-meta-text mt-0.5"
      actions={(
        <button
          type="button"
          onClick={() => onExport(filteredRows)}
          disabled={exporting || !filteredRows.length}
          className="app-focus-ring app-btn-primary px-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[17px]">file_download</span>
          Xuất Excel
        </button>
      )}
    >
      <div className="space-y-2.5 p-4 pt-3">
        <p className="app-overline">Bảng dữ liệu chốt báo cáo</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
            <label className="relative w-full md:max-w-[360px]">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-muted/80">search</span>
              <input
                type="search"
                value={searchValue}
                onChange={(event) => onSearchValueChange(event.target.value)}
                placeholder="Tìm theo lớp hoặc khối"
                className="app-focus-ring app-input h-10 w-full rounded-xl pl-9 pr-3"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              className="app-input app-focus-ring h-10 rounded-xl px-3 md:w-[210px]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-[12px] font-semibold text-on-surface-variant">
            Hiển thị {pagedRows.length}/{totalItems} lớp
          </p>
        </div>

        {!filteredRows.length ? (
          <EmptyState
            title="Không có lớp phù hợp"
            description="Hãy thử thay đổi từ khóa hoặc bộ lọc trạng thái."
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
