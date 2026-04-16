import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/admin/AdminAsyncState';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import DataTable from '../../../shared/components/admin/DataTable';
import EmptyState from '../../../shared/components/admin/EmptyState';
import Pagination from '../../../shared/components/admin/Pagination';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { DATA_MODULES } from '../../../app/config/dataMode';
import {
  resolveNurseStudentRouteId,
  resolveNurseStudentRouteIdFromRow,
} from '../../students/adapters/nurseStudentIdentifierAdapter';
import { adaptStudentHealthProfileResponse } from '../../students/adapters/studentManagementAdapter';
import { useStudentManagement } from '../../students/hooks/useStudentManagement';
import { getNurseStudentHealthProfileApi } from '../services/healthProfilesApi';

const DEFAULT_FILTERS = {
  keyword: '',
  classValue: 'all',
  profileStatus: 'all',
  alertState: 'all',
};

const PROFILE_STATUS_OPTIONS = [
  { value: 'all', label: 'Trạng thái hồ sơ' },
  { value: 'recent', label: 'Đã cập nhật gần đây' },
  { value: 'needs-review', label: 'Cần rà soát' },
  { value: 'incomplete', label: 'Thiếu dữ liệu' },
];

const ALERT_STATE_OPTIONS = [
  { value: 'all', label: 'Mức cảnh báo' },
  { value: 'with-alerts', label: 'Có cảnh báo y tế' },
  { value: 'without-alerts', label: 'Không có cảnh báo' },
];

const PROFILE_STATUS_META = {
  recent: {
    label: 'Đã cập nhật gần đây',
    className: 'bg-success-soft text-success',
  },
  updated: {
    label: 'Đã cập nhật',
    className: 'bg-surface-container-low text-on-surface-variant',
  },
  'needs-review': {
    label: 'Cần rà soát',
    className: 'bg-warning-soft text-warning',
  },
  incomplete: {
    label: 'Thiếu dữ liệu',
    className: 'bg-danger-soft text-danger',
  },
};

const ALERT_BADGE_CLASS_MAP = {
  'Dị ứng': 'bg-danger-soft text-danger',
  'Cận thị': 'bg-info-soft text-info',
  'Bệnh nền': 'bg-warning-soft text-warning',
  'Dinh dưỡng': 'bg-warning-soft text-warning',
};

const toDateLabel = (value) => {
  if (!value) return '--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('vi-VN');
};

const toDaysSince = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  const deltaMs = Date.now() - parsed.getTime();
  if (deltaMs < 0) return 0;
  return Math.floor(deltaMs / (1000 * 60 * 60 * 24));
};

const hasNumericValue = (value) => value !== null && value !== undefined && value !== '';

const resolveClassLabel = (classId, className) => {
  return className
    || classId
    || '--';
};

const createFallbackHealthProfile = ({ row }) => {
  return {
    currentHeight: row.currentHeight ?? row.heightCm ?? '',
    currentWeight: row.currentWeight ?? row.weightKg ?? '',
    heightCm: row.currentHeight ?? row.heightCm ?? '',
    weightKg: row.currentWeight ?? row.weightKg ?? '',
    bloodType: '',
    eyeStatus: '',
    chronicNote: '',
    generalHealthNote: '',
    allergies: '',
    allergyItems: [],
    updatedBy: '',
    healthProfileUpdatedAt: row.updatedAt || null,
  };
};

const normalizeHealthProfile = ({ envelope, row }) => {
  const mapped = adaptStudentHealthProfileResponse(envelope);
  return mapped || createFallbackHealthProfile({ row });
};

const inferAlerts = ({ row, profile }) => {
  const alerts = [];

  const allergies = String(profile?.allergies || '').trim();
  const eyeStatus = String(profile?.eyeStatus || '').toLowerCase();
  const chronicNote = String(profile?.chronicNote || '').toLowerCase();
  const generalHealthNote = String(profile?.generalHealthNote || '').toLowerCase();
  const historyNote = String(row.medicalHistoryNotes || '').toLowerCase();

  if (allergies) alerts.push('Dị ứng');
  if (/cận|kinh|myopia|thị lực/.test(eyeStatus + historyNote)) alerts.push('Cận thị');
  if (/bệnh nền|mãn tính|hen|tim|tiểu đường|chronic/.test(chronicNote + historyNote)) alerts.push('Bệnh nền');
  if (/dinh dưỡng|suy dinh dưỡng|thừa cân|béo phì|vitamin/.test(generalHealthNote + historyNote)) alerts.push('Dinh dưỡng');

  return [...new Set(alerts)];
};

const deriveProfileRecordStatus = ({ row, profile, alerts }) => {
  const updatedAt = profile?.healthProfileUpdatedAt || profile?.updatedAt || row.updatedAt || null;
  const daysSinceUpdated = toDaysSince(updatedAt);
  const hasHeight = hasNumericValue(profile?.heightCm ?? row.currentHeight);
  const hasWeight = hasNumericValue(profile?.weightKg ?? row.currentWeight);
  const hasBloodType = Boolean(String(profile?.bloodType || '').trim());

  const isIncomplete = !(hasHeight && hasWeight && hasBloodType);
  const hasAlerts = alerts.length > 0;
  const isRecent = !isIncomplete && daysSinceUpdated !== null && daysSinceUpdated <= 30;
  const needsReview = isIncomplete || hasAlerts || daysSinceUpdated === null || daysSinceUpdated > 60;

  let statusKey = 'updated';
  if (isIncomplete) {
    statusKey = 'incomplete';
  } else if (needsReview) {
    statusKey = 'needs-review';
  } else if (isRecent) {
    statusKey = 'recent';
  }

  return {
    updatedAt,
    updatedAtLabel: toDateLabel(updatedAt),
    daysSinceUpdated,
    isIncomplete,
    hasAlerts,
    needsReview,
    statusKey,
  };
};

const NurseHealthProfilesPage = () => {
  const navigate = useNavigate();
  const requestedIdsRef = useRef(new Set());
  const feedbackTimerRef = useRef(null);

  const {
    onFiltersChange,
    onPageChange,
    fetchList,
    tableData,
    status,
    error,
  } = useStudentManagement({ moduleKey: DATA_MODULES.NURSE_STUDENTS });

  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
  const [profileByStudentId, setProfileByStudentId] = useState({});
  const [hasProfileSyncGap, setHasProfileSyncGap] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const sourceRows = tableData.rows;

  const showFeedback = useCallback((message, type = 'error') => {
    setFeedback({ message, type });
    window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), 2600);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(feedbackTimerRef.current);
  }, []);

  const loadStudentHealthProfile = useCallback(async (row) => {
    const studentId = resolveNurseStudentRouteIdFromRow(row);
    if (!studentId || requestedIdsRef.current.has(studentId)) {
      return;
    }

    requestedIdsRef.current.add(studentId);

    try {
      const envelope = await getNurseStudentHealthProfileApi(studentId);
      const mappedProfile = normalizeHealthProfile({ envelope, row });
      setProfileByStudentId((prev) => ({ ...prev, [studentId]: mappedProfile }));
    } catch {
      const fallbackProfile = createFallbackHealthProfile({ row });
      setProfileByStudentId((prev) => ({ ...prev, [studentId]: fallbackProfile }));
      setHasProfileSyncGap(true);
    }
  }, []);

  useEffect(() => {
    sourceRows.forEach((row, index) => {
      loadStudentHealthProfile(row, index);
    });
  }, [loadStudentHealthProfile, sourceRows]);

  const handleApplyFilters = (event) => {
    event.preventDefault();

    const classId = Number.isFinite(Number(draftFilters.classValue))
      ? draftFilters.classValue
      : 'all';

    onFiltersChange({
      keyword: draftFilters.keyword,
      classId,
      status: 'all',
    });

    setActiveFilters(draftFilters);
  };

  const handleResetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setActiveFilters(DEFAULT_FILTERS);

    onFiltersChange({
      keyword: '',
      classId: 'all',
      status: 'all',
    });
  };

  const rowsWithContext = useMemo(() => {
    return sourceRows.map((row) => {
      const studentId = resolveNurseStudentRouteIdFromRow(row);
      const profile = profileByStudentId[studentId]
        || null;
      const classNameDisplay = resolveClassLabel(row.classId, row.className);
      const alerts = inferAlerts({ row, profile });
      const profileStatus = deriveProfileRecordStatus({ row, profile, alerts });

      return {
        ...row,
        _studentId: studentId,
        classNameDisplay,
        classFilterValue: String(row.classId || classNameDisplay),
        profile,
        alerts,
        profileStatusKey: profileStatus.statusKey,
        profileNeedsReview: profileStatus.needsReview,
        profileIncomplete: profileStatus.isIncomplete,
        hasMedicalAlerts: profileStatus.hasAlerts,
        updatedAtDisplay: profileStatus.updatedAtLabel,
        updatedAtDaysAgo: profileStatus.daysSinceUpdated,
      };
    });
  }, [profileByStudentId, sourceRows]);

  const classOptions = useMemo(() => {
    const map = new Map();
    rowsWithContext.forEach((row) => {
      const key = String(row.classFilterValue);
      if (key && !map.has(key)) {
        map.set(key, row.classNameDisplay || '--');
      }
    });

    const dynamicOptions = Array.from(map.entries()).map(([value, label]) => ({ value, label }));
    return [{ value: 'all', label: 'Tất cả lớp' }, ...dynamicOptions];
  }, [rowsWithContext]);

  const filteredRows = useMemo(() => {
    const keyword = String(activeFilters.keyword || '').trim().toLowerCase();

    return rowsWithContext.filter((row) => {
      if (keyword) {
        const text = `${row.studentCode || ''} ${row.fullName || ''}`.toLowerCase();
        if (!text.includes(keyword)) {
          return false;
        }
      }

      if (activeFilters.classValue !== 'all' && String(row.classFilterValue) !== String(activeFilters.classValue)) {
        return false;
      }

      if (activeFilters.profileStatus !== 'all' && row.profileStatusKey !== activeFilters.profileStatus) {
        return false;
      }

      if (activeFilters.alertState === 'with-alerts' && !row.hasMedicalAlerts) {
        return false;
      }

      if (activeFilters.alertState === 'without-alerts' && row.hasMedicalAlerts) {
        return false;
      }

      return true;
    });
  }, [activeFilters.alertState, activeFilters.classValue, activeFilters.keyword, activeFilters.profileStatus, rowsWithContext]);

  const effectiveStatus = status === 'success' && !filteredRows.length ? 'empty' : status;

  const effectiveError = error;

  const effectiveMeta = {
    page: tableData.page,
    pageSize: tableData.pageSize,
    totalItems: tableData.totalItems,
  };

  const stats = useMemo(() => {
    return {
      total: filteredRows.length,
      recentlyUpdated: filteredRows.filter((row) => row.profileStatusKey === 'recent').length,
      needsReview: filteredRows.filter((row) => row.profileNeedsReview).length,
      withAlerts: filteredRows.filter((row) => row.hasMedicalAlerts).length,
      incomplete: filteredRows.filter((row) => row.profileIncomplete).length,
    };
  }, [filteredRows]);

  const navigateToHealthProfile = useCallback((candidateStudentId, state = null) => {
    const studentId = resolveNurseStudentRouteId(candidateStudentId);
    if (!studentId) {
      showFeedback('Không thể mở hồ sơ vì thiếu mã học sinh hợp lệ.', 'error');
      return false;
    }

    try {
      navigate(`/nurse/health-profiles/${studentId}`, state ? { state } : undefined);
      return true;
    } catch {
      showFeedback('Không thể điều hướng đến hồ sơ sức khỏe. Vui lòng thử lại.', 'error');
      return false;
    }
  }, [navigate, showFeedback]);

  const openDetail = useCallback((studentId) => {
    navigateToHealthProfile(studentId);
  }, [navigateToHealthProfile]);

  const tableColumns = useMemo(() => ([
    {
      key: 'studentCode',
      header: 'Mã học sinh',
      headerClassName: 'w-[120px]',
        cellClassName: 'whitespace-nowrap text-[12px] font-bold text-primary',
      render: (row) => row.studentCode || (row._studentId ? `HS${row._studentId}` : '--'),
    },
    {
      key: 'fullName',
      header: 'Học sinh',
      headerClassName: 'w-[240px]',
      cellClassName: 'min-w-0',
      render: (row) => (
        <button
          type="button"
          onClick={() => openDetail(row._studentId)}
          className="app-focus-ring app-interactive w-full rounded-md text-left"
        >
            <p className="truncate text-[14px] font-bold leading-5 text-on-surface hover:text-primary">{row.fullName || '--'}</p>
            <p className="truncate text-[11px] text-on-surface-variant">Lớp {row.classNameDisplay}</p>
        </button>
      ),
    },
    {
      key: 'updatedAtDisplay',
      header: 'Cập nhật gần nhất',
      headerClassName: 'w-[162px]',
        cellClassName: 'whitespace-nowrap text-[12px] text-on-surface-variant',
      render: (row) => (
        <div>
          <p>{row.updatedAtDisplay}</p>
          {row.updatedAtDaysAgo !== null ? (
              <p className="text-[10px] text-on-surface-muted">{row.updatedAtDaysAgo} ngày trước</p>
          ) : (
              <p className="text-[10px] text-on-surface-muted">Chưa có mốc cập nhật</p>
          )}
        </div>
      ),
    },
    {
      key: 'profileStatusKey',
      header: 'Trạng thái hồ sơ',
      headerClassName: 'w-[156px]',
      cellClassName: 'whitespace-nowrap',
      render: (row) => {
        const meta = PROFILE_STATUS_META[row.profileStatusKey] || PROFILE_STATUS_META.updated;
        return (
          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}>
            {meta.label}
          </span>
        );
      },
    },
    {
      key: 'alerts',
      header: 'Cảnh báo y tế',
      headerClassName: 'w-[220px]',
      cellClassName: 'min-w-0',
      render: (row) => {
        if (!row.alerts.length) {
            return <span className="text-[12px] text-on-surface-muted">Không có</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {row.alerts.slice(0, 3).map((tag) => (
              <span
                key={`${row._studentId}-${tag}`}
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${ALERT_BADGE_CLASS_MAP[tag] || 'bg-success-soft text-success'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'w-[196px] min-w-[196px] whitespace-nowrap text-right',
      cellClassName: 'min-w-[196px] text-right',
      render: (row) => (
        <div className="flex justify-end gap-1.5" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigateToHealthProfile(row._studentId, {
                source: 'nurse-health-profiles',
                initialTab: 'health-history',
              });
            }}
            className="app-focus-ring app-row-action"
          >
            Lịch sử
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigateToHealthProfile(row._studentId, {
                source: 'nurse-health-profiles',
                openHealthEdit: true,
              });
            }}
            className="app-focus-ring app-row-action app-row-action-primary"
          >
            Cập nhật
          </button>
        </div>
      ),
    },
  ]), [navigateToHealthProfile, openDetail]);

  return (
    <div className="space-y-3.5 text-on-surface">
      <AdminFeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        closeAriaLabel="Đóng thông báo"
        closeLabel="Đóng"
        fallbackClassName="border-success/25 bg-success-soft text-success"
        classMap={{
          error: 'border-danger/25 bg-danger-soft text-danger',
          success: 'border-success/25 bg-success-soft text-success',
        }}
      />

      <NurseModulePageHeader
        title="Hồ sơ sức khỏe học sinh"
        description="Theo dõi tiến độ cập nhật hồ sơ, cảnh báo y tế và ưu tiên rà soát sức khỏe học đường."
      />

      <section className="app-panel-shell px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleApplyFilters} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <label className="relative w-full sm:max-w-[320px]">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-muted/80">search</span>
              <input
                type="search"
                value={draftFilters.keyword}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                placeholder="Tìm theo mã học sinh hoặc họ tên"
                className="app-focus-ring app-input h-9 w-full rounded-lg pl-9 pr-3 text-sm"
              />
            </label>

            <select
              value={draftFilters.classValue}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, classValue: event.target.value }))}
              className="app-focus-ring app-input h-9 w-full rounded-lg px-2.5 text-sm sm:w-[140px]"
            >
              {classOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <select
              value={draftFilters.profileStatus}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, profileStatus: event.target.value }))}
              className="app-focus-ring app-input h-9 w-full rounded-lg px-2.5 text-sm sm:w-[168px]"
            >
              {PROFILE_STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <select
              value={draftFilters.alertState}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, alertState: event.target.value }))}
              className="app-focus-ring app-input h-9 w-full rounded-lg px-2.5 text-sm sm:w-[170px]"
            >
              {ALERT_STATE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <button type="submit" className="app-focus-ring app-btn-primary inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold">
              Lọc
            </button>

            <button type="button" onClick={handleResetFilters} className="app-focus-ring app-btn-secondary inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold">
              Đặt lại
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate('/nurse/students')}
            className="app-focus-ring app-btn-secondary inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[17px]">group</span>
            Danh sách học sinh
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="app-kpi-card">
          <p className="app-kpi-label">Hồ sơ cập nhật gần đây</p>
          <p className="app-kpi-value text-success">{stats.recentlyUpdated}</p>
        </article>
        <article className="app-kpi-card">
          <p className="app-kpi-label">Hồ sơ cần rà soát</p>
          <p className="app-kpi-value text-warning">{stats.needsReview}</p>
        </article>
        <article className="app-kpi-card">
          <p className="app-kpi-label">Hồ sơ có cảnh báo y tế</p>
          <p className="app-kpi-value text-danger">{stats.withAlerts}</p>
        </article>
        <article className="app-kpi-card">
          <p className="app-kpi-label">Hồ sơ thiếu dữ liệu</p>
          <p className="app-kpi-value text-danger">{stats.incomplete}</p>
        </article>
      </section>

      <section className="app-panel-shell overflow-hidden">
        <div className="app-table-summary px-3 py-2 text-[11px] sm:px-4">
          Đang hiển thị <span className="font-semibold text-on-surface">{filteredRows.length}</span> hồ sơ trên trang này • Tổng <span className="font-semibold text-on-surface">{effectiveMeta.totalItems}</span> học sinh
        </div>

        <AdminAsyncState
          status={effectiveStatus}
          error={effectiveError}
          onRetry={fetchList}
          loadingLabel="Đang tải danh sách hồ sơ sức khỏe..."
          emptyTitle="Không có hồ sơ sức khỏe"
          emptyDescription="Danh sách hồ sơ sẽ hiển thị sau khi hệ thống đồng bộ dữ liệu học sinh."
        >
          {filteredRows.length ? (
            <>
              <DataTable
                dense
                columns={tableColumns}
                rows={filteredRows}
                getRowKey={(row) => row._studentId || row.studentCode || row.fullName}
                onRowClick={(row) => openDetail(row._studentId)}
                containerClassName="overflow-x-auto overflow-y-visible"
                tableClassName="min-w-[960px] w-full table-fixed divide-y divide-outline-variant text-[13px]"
                headClassName="app-table-head text-left"
                bodyClassName="divide-y divide-outline-variant bg-surface"
                rowClassName="app-interactive transition-[background-color] duration-150 hover:bg-surface-container-low"
              />

              <div className="border-t border-outline-variant px-3 py-2 sm:px-4">
                <Pagination
                  compact
                  page={effectiveMeta.page}
                  pageSize={effectiveMeta.pageSize}
                  totalItems={effectiveMeta.totalItems}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          ) : (
            <div className="px-4 py-5 sm:px-5">
              <EmptyState
                title="Không tìm thấy hồ sơ phù hợp"
                description="Hãy thử thay đổi từ khóa hoặc bộ lọc trạng thái hồ sơ để xem kết quả khác."
              />
            </div>
          )}
        </AdminAsyncState>
      </section>

      {hasProfileSyncGap ? (
        <div className="rounded-xl border border-success/30 bg-success-soft px-3.5 py-2.5 text-xs text-success">
          Một phần hồ sơ chưa đồng bộ kịp thời từ máy chủ. Dữ liệu nền học sinh vẫn lấy từ API thật.
        </div>
      ) : null}
    </div>
  );
};

export default NurseHealthProfilesPage;
