import React from 'react';
import DataTable from '../../../shared/components/core/DataTable';
import {
  STUDENT_BADGE_BASE_CLASS,
  STUDENT_STATUS_BADGE_CLASS_MAP,
} from '../constants/studentUiTokens';
import StudentActionsMenu from './StudentActionsMenu';

const withFallback = (value, fallback = 'Chưa cập nhật') => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  return value;
};

const StudentTable = ({ rows, onViewDetail, onEdit, onToggleStatus, onResetPassword }) => {
  const columns = [
    {
      key: 'student',
      header: 'Học sinh',
      headerClassName: 'w-[32%] min-w-[240px]',
      cellClassName: 'min-w-[240px]',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-on-surface">{withFallback(row.fullName)}</p>
        </div>
      ),
    },
    {
      key: 'className',
      header: 'Lớp',
      headerClassName: 'w-[16%] min-w-[120px]',
      cellClassName: 'text-on-surface',
      render: (row) => <span>{withFallback(row.className || row.classId)}</span>,
    },
    {
      key: 'guardian',
      header: 'Người giám hộ',
      headerClassName: 'w-[28%] min-w-[220px]',
      cellClassName: 'min-w-[220px]',
      render: (row) => (
        <div>
          <p className="text-sm text-on-surface">{withFallback(row.guardian)}</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">{withFallback(row.phoneNumber)}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái tài khoản',
      headerClassName: 'w-[16%] min-w-[150px]',
      cellClassName: 'min-w-[150px]',
      render: (row) => (
        row.statusLabel ? (
          <span className={`${STUDENT_BADGE_BASE_CLASS} ${STUDENT_STATUS_BADGE_CLASS_MAP[row.status] || 'border-outline-variant bg-surface-container-low text-on-surface-variant'}`}>
            {row.statusLabel}
          </span>
        ) : (
          <span className="text-sm text-on-surface-variant">Chưa cập nhật</span>
        )
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'w-[8%] min-w-[80px] text-right',
      cellClassName: 'min-w-[80px] text-right',
      render: (row) => (
        <div className="flex justify-end">
          <StudentActionsMenu
            row={row}
            onView={() => onViewDetail(row)}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onResetPassword={onResetPassword}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      onRowClick={onViewDetail}
      tableClassName="min-w-[820px] w-full text-left text-sm"
    />
  );
};

export default StudentTable;
