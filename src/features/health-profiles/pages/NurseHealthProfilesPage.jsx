import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import DataTable from '../../../shared/components/core/DataTable';
import EmptyState from '../../../shared/components/core/EmptyState';
import StatusBadge from '../../../shared/components/core/StatusBadge';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { DATA_MODULES } from '../../../app/config/dataMode';
import {
  resolveNurseStudentRouteId,
  resolveNurseStudentRouteIdFromRow,
} from '../../students/adapters/nurseStudentIdentifierAdapter';
import { adaptStudentHealthProfileResponse } from '../../students/adapters/studentManagementAdapter';
import { useStudentManagement } from '../../students/hooks/useStudentManagement';
import { useClassOptions } from '../../students/hooks/useClassOptions';
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
    className: 'neutral',
  },
  updated: {
    label: 'Đã cập nhật',
    className: 'neutral',
  },
  'needs-review': {
    label: 'Cần rà soát',
    className: 'warning',
  },
  incomplete: {
    label: 'Thiếu dữ liệu',
    className: 'danger',
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

  const { classes: globalClasses } = useClassOptions();

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
      const studentCodeDisplay = profile?.studentCode
        || row.studentCode
        || (studentId ? `HS${studentId}` : '--');

      return {
        ...row,
        _studentId: studentId,
        studentCodeDisplay,
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
    const options = globalClasses.map((c) => ({
      value: String(c.classId),
      label: c.className || `-- (ID: ${c.classId})`,
    }));
    return [{ value: 'all', label: 'Tất cả lớp' }, ...options];
  }, [globalClasses]);

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
      needsReview: filteredRows.filter((row) => row.profileNeedsReview).length,
      withAlerts: filteredRows.filter((row) => row.hasMedicalAlerts).length,
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
      key: 'student',
      header: 'Học sinh',
      headerClassName: 'w-[35%] min-w-[240px]',
      render: (row) => (
        <div className="w-full text-left">
          <p className="truncate text-sm font-bold text-on-surface group-hover:text-primary">{row.fullName || '--'}</p>
          <p className="mt-0.5 truncate text-[11px] text-on-surface-variant">
            {row.studentCodeDisplay} • Lớp {row.classNameDisplay}
          </p>
        </div>
      ),
    },
    {
      key: 'updatedAtDisplay',
      header: 'Cập nhật gần nhất',
      headerClassName: 'w-[20%] min-w-[150px]',
      cellClassName: 'text-xs text-on-surface-variant',
      render: (row) => (
        <div>
          <p className="font-medium">{row.updatedAtDisplay}</p>
          {row.updatedAtDaysAgo !== null ? (
            <p className="mt-0.5 text-[10px] text-on-surface-muted">{row.updatedAtDaysAgo} ngày trước</p>
          ) : (
            <p className="mt-0.5 text-[10px] text-on-surface-muted">Chưa có mốc cập nhật</p>
          )}
        </div>
      ),
    },
    {
      key: 'profileStatusKey',
      header: 'Trạng thái hồ sơ',
      headerClassName: 'w-[20%] min-w-[150px]',
      render: (row) => {
        const meta = PROFILE_STATUS_META[row.profileStatusKey] || PROFILE_STATUS_META.updated;
        return (
          <StatusBadge tone={meta.className}>
            {meta.label}
          </StatusBadge>
        );
      },
    },
    {
      key: 'alerts',
      header: 'Cảnh báo y tế',
      headerClassName: 'w-[25%] min-w-[180px]',
      render: (row) => {
        if (!row.alerts.length) {
          return <span className="text-xs text-on-surface-muted">Không có</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {row.alerts.slice(0, 3).map((tag) => (
              <StatusBadge
                key={`${row._studentId}-${tag}`}
                tone={tag === 'Dị ứng' ? 'danger' : tag === 'Cận thị' ? 'info' : 'warning'}
              >
                {tag}
              </StatusBadge>
            ))}
          </div>
        );
      },
    },
  ]), []);

  return (
    <div className="space-y-5 text-on-surface">
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
        actions={(
          <button
            type="button"
            onClick={() => navigate('/nurse/students')}
            className="app-focus-ring app-btn-secondary inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            Danh sách học sinh
          </button>
        )}
      />

      <AdminManagementListSection
        filters={(
          <div className="space-y-4">
            <section className="app-panel-shell px-4 py-3 sm:px-5">
              <form onSubmit={handleApplyFilters} className="flex flex-col gap-2.5 xl:flex-row xl:flex-nowrap xl:items-center">
                <label className="relative min-w-0 flex-1 xl:max-w-[320px]">
                  <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-muted/80">search</span>
                  <input
                    type="search"
                    value={draftFilters.keyword}
                    onChange={(event) => setDraftFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                    placeholder="Tìm theo mã học sinh hoặc họ tên"
                    className="app-focus-ring app-input h-10 w-full rounded-lg pl-9 pr-3 text-sm"
                  />
                </label>

                <select
                  value={draftFilters.classValue}
                  onChange={(event) => setDraftFilters((prev) => ({ ...prev, classValue: event.target.value }))}
                  className="app-focus-ring app-input h-10 w-full rounded-lg px-2.5 text-sm xl:w-[128px] xl:shrink-0"
                >
                  {classOptions.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>

                <select
                  value={draftFilters.profileStatus}
                  onChange={(event) => setDraftFilters((prev) => ({ ...prev, profileStatus: event.target.value }))}
                  className="app-focus-ring app-input h-10 w-full rounded-lg px-2.5 text-sm xl:w-[178px] xl:shrink-0"
                >
                  {PROFILE_STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>

                <select
                  value={draftFilters.alertState}
                  onChange={(event) => setDraftFilters((prev) => ({ ...prev, alertState: event.target.value }))}
                  className="app-focus-ring app-input h-10 w-full rounded-lg px-2.5 text-sm xl:w-[178px] xl:shrink-0"
                >
                  {ALERT_STATE_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>

                <div className="flex shrink-0 flex-wrap items-center gap-2 xl:ml-auto xl:flex-nowrap">
                  <button type="submit" className="app-focus-ring app-btn-primary inline-flex h-9 min-w-[72px] items-center justify-center rounded-lg px-3 text-sm font-semibold">
                    Lọc
                  </button>

                  <button type="button" onClick={handleResetFilters} className="app-focus-ring app-btn-secondary inline-flex h-9 min-w-[84px] items-center justify-center rounded-lg px-3 text-sm font-semibold">
                    Đặt lại
                  </button>
                </div>
              </form>
            </section>

            <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <article className="app-kpi-card">
                <p className="app-kpi-label">Hồ sơ cần rà soát</p>
                <p className="app-kpi-value text-warning">{stats.needsReview}</p>
              </article>
              <article className="app-kpi-card">
                <p className="app-kpi-label">Hồ sơ có cảnh báo y tế</p>
                <p className="app-kpi-value text-danger">{stats.withAlerts}</p>
              </article>
            </section>
          </div>
        )}
        summary={filteredRows.length > 0 ? `Hiển thị ${filteredRows.length} bản ghi/trang • Tổng ${tableData.totalItems} hồ sơ` : null}
        status={effectiveStatus}
        error={effectiveError}
        onRetry={fetchList}
        loadingLabel="Đang tải danh sách hồ sơ sức khỏe..."
        emptyTitle="Không có hồ sơ sức khỏe"
        emptyDescription="Danh sách hồ sơ sẽ hiển thị sau khi hệ thống đồng bộ dữ liệu học sinh."
        sectionClassName="space-y-3"
        table={filteredRows.length ? (
          <DataTable
            dense
            columns={tableColumns}
            rows={filteredRows}
            getRowKey={(row) => row._studentId || row.studentCode || row.fullName}
            onRowClick={(row) => openDetail(row._studentId)}
            tableClassName="min-w-[760px] w-full text-left text-sm"
          />
        ) : (
          <div className="px-4 py-5 sm:px-5">
            <EmptyState
              title="Không tìm thấy hồ sơ phù hợp"
              description="Hãy thử thay đổi từ khóa hoặc bộ lọc trạng thái hồ sơ để xem kết quả khác."
            />
          </div>
        )}
        pagination={{
          page: effectiveMeta.page,
          pageSize: effectiveMeta.pageSize,
          totalItems: effectiveMeta.totalItems,
          onPageChange,
        }}
      />

      {hasProfileSyncGap ? (
        <div className="rounded-xl border border-success/30 bg-success-soft px-3.5 py-2.5 text-xs text-success">
          Một phần hồ sơ chưa đồng bộ kịp thời từ máy chủ. Dữ liệu nền học sinh vẫn lấy từ API thật.
        </div>
      ) : null}
    </div>
  );
};

export default NurseHealthProfilesPage;
