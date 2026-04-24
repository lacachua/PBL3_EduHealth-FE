import React from 'react';
import DataTable from '../../../shared/components/core/DataTable';
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
      headerClassName: 'w-[25%] min-w-[220px]',
      cellClassName: 'min-w-[220px]',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-on-surface">{withFallback(row.fullName, '--')}</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">{withFallback(row.dateOfBirthLabel, '--')}</p>
        </div>
      ),
    },
    {
      key: 'className',
      header: 'Lớp',
      headerClassName: 'w-[15%] min-w-[120px]',
      cellClassName: 'text-on-surface',
      render: (row) => <span>{withFallback(row.className || row.classId)}</span>,
    },
    {
      key: 'guardian',
      header: 'Liên hệ người giám hộ',
      headerClassName: 'w-[25%] min-w-[220px]',
      cellClassName: 'min-w-[220px]',
      render: (row) => (
        <div>
          <p className="text-sm text-on-surface">{withFallback(row.guardian, '--')}</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">{withFallback(row.email, 'Chưa có email')}</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">{withFallback(row.phoneNumber, 'Chưa có số điện thoại')}</p>
        </div>
      ),
    },
    {
      key: 'health',
      header: 'Sức khỏe',
      headerClassName: 'w-[20%] min-w-[190px]',
      cellClassName: 'min-w-[190px]',
      render: (row) => renderHealthSummary(row),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'w-[15%] min-w-[120px]',
      cellClassName: 'min-w-[120px]',
      render: (row) => (
        <span className={`${STUDENT_BADGE_BASE_CLASS} ${STUDENT_STATUS_BADGE_CLASS_MAP[row.status] || 'border-outline-variant bg-surface-container-low text-on-surface-variant'}`}>
          {row.statusLabel}
        </span>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} onRowClick={onViewDetail} tableClassName="min-w-[860px] w-full text-left text-sm" />;
};

export default StudentTable;
