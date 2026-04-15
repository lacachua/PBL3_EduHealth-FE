import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from '../../../../shared/components/admin/DataTable';
import EmptyState from '../../../../shared/components/admin/EmptyState';
import ErrorState from '../../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../../shared/components/admin/LoadingSpinner';

const NurseDashboardRecentExaminationsTable = ({ recentExaminations, loading, onRetry }) => {
  const navigate = useNavigate();
  const rows = Array.isArray(recentExaminations?.items) ? recentExaminations.items : [];
  const displayRows = rows.slice(0, 6);

  const columns = useMemo(() => ([
    {
      key: 'visitDateLabel',
      header: 'Thời gian',
      headerClassName: 'w-[118px]',
      render: (row) => (
        <div>
          <p className="text-[11px] font-semibold text-on-surface">{row.visitDateLabel}</p>
          <p className="text-[10px] text-on-surface-variant">{row.visitTimeLabel}</p>
        </div>
      ),
    },
    {
      key: 'studentName',
      header: 'Học sinh',
      headerClassName: 'w-[220px]',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-on-surface">{row.studentName}</p>
          <p className="truncate text-[10px] text-on-surface-variant">{row.studentCode}</p>
        </div>
      ),
    },
    {
      key: 'className',
      header: 'Lớp',
      headerClassName: 'w-[90px]',
      cellClassName: 'text-[11px] text-on-surface-variant',
      render: (row) => row.className,
    },
    {
      key: 'diagnosis',
      header: 'Chẩn đoán',
      cellClassName: 'text-[11px] text-on-surface-variant',
      render: (row) => <p className="line-clamp-1">{row.diagnosis}</p>,
    },
  ]), []);

  return (
    <section className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-[0_1px_4px_rgba(15,23,42,0.045)]">
      <div className="nurse-section-header-strong flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-base font-bold text-on-surface">Danh sách khám gần đây</h2>
          <p className="mt-0.5 text-xs text-on-surface-variant">Hiển thị 6 lượt gần nhất. Chọn một dòng để mở chi tiết phiếu khám.</p>
        </div>
        <Link
          to={recentExaminations?.to || '/nurse/examinations'}
          className="nurse-focus-ring rounded-lg border border-outline-variant bg-surface px-2.5 py-1 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low"
        >
          Mở danh sách khám
        </Link>
      </div>

      {loading && !displayRows.length ? <LoadingSpinner label="Đang tải danh sách khám gần đây..." /> : null}

      {recentExaminations?.status === 'error' ? (
        <div className="px-4 py-3 sm:px-5">
          <ErrorState
            message={recentExaminations.error || 'Không thể tải danh sách khám gần đây.'}
            onRetry={onRetry}
          />
        </div>
      ) : null}

      {!loading && recentExaminations?.status !== 'error' && !displayRows.length ? (
        <div className="px-4 py-4 sm:px-5">
          <EmptyState
            title="Chưa có lượt khám gần đây"
            description="Danh sách sẽ hiển thị ngay khi có phiếu khám mới."
          />
        </div>
      ) : null}

      {displayRows.length ? (
        <DataTable
          dense
          columns={columns}
          rows={displayRows}
          getRowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/nurse/examinations/${row.id}`)}
          headCellPaddingClassName="px-2.5 py-1.5"
          bodyCellPaddingClassName="px-2.5 py-2"
          containerClassName="flex-1 overflow-x-auto"
          tableClassName="w-full table-fixed divide-y divide-outline-variant text-[12px]"
          headClassName="nurse-table-head-strong text-left"
          bodyClassName="divide-y divide-outline-variant bg-surface"
          rowClassName="nurse-interactive transition-[background-color] duration-150 hover:bg-surface-container-low focus-within:bg-surface-container-low"
        />
      ) : null}
    </section>
  );
};

export default NurseDashboardRecentExaminationsTable;
