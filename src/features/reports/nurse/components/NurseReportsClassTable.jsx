import React, { useEffect, useMemo } from 'react';
import DataTable from '../../../../shared/components/admin/DataTable';
import EmptyState from '../../../../shared/components/admin/EmptyState';
import Pagination from '../../../../shared/components/admin/Pagination';
import SearchInput from '../../../../shared/components/admin/SearchInput';
import SectionCard from '../../../../shared/components/admin/SectionCard';
import StatusBadge from '../../../../shared/components/admin/StatusBadge';

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
      className="nurse-card-soft rounded-xl p-0"
      headerClassName="mb-0 flex flex-col gap-2 px-4 pt-3.5 md:flex-row md:items-center md:justify-between"
      titleClassName="text-[15px] font-bold text-on-surface"
      subtitleClassName="mt-0.5 text-[11px] text-on-surface-variant leading-4"
      actions={(
        <button
          type="button"
          onClick={() => onExport(filteredRows)}
          disabled={exporting || !filteredRows.length}
          className="nurse-focus-ring nurse-btn-primary inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[17px]">file_download</span>
          Xuất Excel
        </button>
      )}
    >
      <div className="space-y-2.5 p-4 pt-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
            <SearchInput
              value={searchValue}
              onChange={onSearchValueChange}
              placeholder="Tìm theo lớp hoặc khối"
              className="md:max-w-[360px]"
            />
            <select
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              className="nurse-input nurse-focus-ring h-11 rounded-lg px-3 text-sm md:w-[200px]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs font-semibold text-on-surface-variant">
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
              containerClassName="overflow-x-auto rounded-xl border border-outline-variant bg-surface"
              tableClassName="w-full table-fixed divide-y divide-outline-variant text-[12px]"
              headClassName="nurse-table-head-strong text-left"
              bodyClassName="divide-y divide-outline-variant bg-surface"
              rowClassName="nurse-interactive transition-[background-color] duration-150 hover:bg-surface-container-low"
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
