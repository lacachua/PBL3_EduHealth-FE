import React from 'react';
import DataTable from '../../../shared/components/admin/DataTable';
import StudentActionsMenu from './StudentActionsMenu';
import {
  STUDENT_BADGE_BASE_CLASS,
  STUDENT_HEALTH_BADGE_CLASS_MAP,
  STUDENT_STATUS_BADGE_CLASS_MAP,
} from '../constants/studentUiTokens';

const withFallback = (value, fallback = 'Chưa cập nhật') => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  return value;
};

const StudentTable = ({ rows, onViewDetail }) => {
  const renderHealthSummary = (row) => {
    const metrics = [];
    if (row.heightCm !== null && row.heightCm !== undefined && row.heightCm !== '') {
      metrics.push(`${row.heightCm} cm`);
    }
    if (row.weightKg !== null && row.weightKg !== undefined && row.weightKg !== '') {
      metrics.push(`${row.weightKg} kg`);
    }

    const healthTone = row.hasHealthWarning
      ? 'warning'
      : row.hasMissingHealthData
        ? 'missing'
        : 'stable';
    const healthLabel = row.hasHealthWarning
      ? 'Cảnh báo'
      : row.hasMissingHealthData
        ? 'Chưa cập nhật'
        : 'Ổn định';

    return (
      <div className="space-y-1">
        <p className="text-xs text-on-surface-variant">{metrics.length ? metrics.join(' / ') : '--'}</p>
        <span className={`${STUDENT_BADGE_BASE_CLASS} ${STUDENT_HEALTH_BADGE_CLASS_MAP[healthTone]}`}>
          {healthLabel}
        </span>
      </div>
    );
  };

  const columns = [
    {
      key: 'student',
      header: 'Học sinh',
      cellClassName: 'min-w-[220px]',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-on-surface">{withFallback(row.fullName, '--')}</p>
          <p className="mt-0.5 text-xs text-on-surface-muted">{withFallback(row.dateOfBirth, '--')}</p>
        </div>
      ),
    },
    { key: 'studentCode', header: 'Mã học sinh', cellClassName: 'font-semibold text-on-surface' },
    {
      key: 'className',
      header: 'Lớp',
      cellClassName: 'text-on-surface',
      render: (row) => <span>{withFallback(row.className || row.classId)}</span>,
    },
    {
      key: 'account',
      header: 'Tài khoản',
      cellClassName: 'min-w-[220px]',
      render: (row) => (
        <div>
          <p className="text-sm text-on-surface">{withFallback(row.username, '--')}</p>
          <p className="mt-0.5 text-xs text-on-surface-muted">{withFallback(row.email, 'Chưa có email')}</p>
          <div className="mt-1">
            <span className={`${STUDENT_BADGE_BASE_CLASS} ${STUDENT_STATUS_BADGE_CLASS_MAP[row.status] || 'border-outline-variant bg-surface-container-low text-on-surface-variant'}`}>
              {row.statusLabel}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'health',
      header: 'Sức khỏe',
      cellClassName: 'min-w-[190px]',
      render: (row) => renderHealthSummary(row),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end">
          <StudentActionsMenu
            items={[
              { id: 'view-detail', label: 'Xem chi tiết', icon: 'visibility', onClick: () => onViewDetail(row) },
            ]}
          />
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />;
};

export default StudentTable;
