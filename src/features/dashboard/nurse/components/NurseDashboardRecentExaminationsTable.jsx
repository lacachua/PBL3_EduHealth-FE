import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from '../../../../shared/components/core/DataTable';
import EmptyState from '../../../../shared/components/core/EmptyState';
import ErrorState from '../../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../../shared/components/core/LoadingSpinner';

const NurseDashboardRecentExaminationsTable = ({ recentExaminations, loading, onRetry }) => {
  const navigate = useNavigate();
  const rows = Array.isArray(recentExaminations?.items) ? recentExaminations.items : [];
  const displayRows = rows.slice(0, 6);

  const columns = useMemo(() => ([
    {
      key: 'visitDateLabel',
      header: 'Thời gian',
      headerClassName: 'w-[18%] min-w-[100px]',
      render: (row) => (
        <div>
          <p className="text-[12px] font-semibold text-on-surface">{row.visitDateLabel}</p>
          <p className="text-[11px] text-on-surface-variant">{row.visitTimeLabel}</p>
        </div>
      ),
    },
    {
      key: 'studentName',
      header: 'Học sinh',
      headerClassName: 'w-[28%] min-w-[200px]',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-on-surface">{row.studentName}</p>
          <p className="truncate text-[11px] text-on-surface-variant">{row.studentCode}</p>
        </div>
      ),
    },

    {
      key: 'diagnosis',
      header: 'Chẩn đoán',
      headerClassName: 'w-[54%] min-w-[220px]',
      cellClassName: 'text-[12px] text-on-surface-variant',
      render: (row) => <p className="line-clamp-1">{row.diagnosis}</p>,
    },
  ]), []);

  return (
    <section className="app-panel-shell flex h-full min-h-[320px] flex-col space-y-3 p-4 md:p-5 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.52)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="app-overline mb-1">Xử lý hồ sơ trong ngày</p>
          <h2 className="text-lg font-bold text-on-surface">Danh sách khám gần đây</h2>
          <p className="app-meta-text mt-0.5">Hiển thị 6 lượt gần nhất. Chọn một dòng để mở chi tiết phiếu khám.</p>
        </div>
        <Link
          to={recentExaminations?.to || '/nurse/examinations'}
          className="app-focus-ring app-btn-secondary px-2.5 h-9 inline-flex items-center justify-center rounded-lg text-sm font-semibold shrink-0"
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
          tableClassName="min-w-[500px] w-full text-left text-sm"
        />
      ) : null}
    </section>
  );
};

export default NurseDashboardRecentExaminationsTable;
