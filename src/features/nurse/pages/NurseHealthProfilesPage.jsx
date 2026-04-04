import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/admin/AdminAsyncState';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import ActionDropdown from '../../../shared/components/admin/ActionDropdown';
import DataTable from '../../../shared/components/admin/DataTable';
import EmptyState from '../../../shared/components/admin/EmptyState';
import Pagination from '../../../shared/components/admin/Pagination';
import { runtimeConfig } from '../../../shared/config/runtimeConfig';
import {
  resolveNurseStudentRouteId,
  resolveNurseStudentRouteIdFromRow,
} from '../adapters/nurseStudentIdentifierAdapter';
import { adaptStudentHealthProfileResponse } from '../../students/adapters/studentManagementAdapter';
import { useStudentManagement } from '../../students/hooks/useStudentManagement';
import {
  getNurseStudentHealthProfileMockEnvelope,
  NURSE_STUDENT_CLASS_FALLBACK_OPTIONS,
  NURSE_STUDENT_CLASS_LABEL_MAP,
} from '../mocks/nurseStudentsMock';
import { getNurseStudentHealthProfileApi } from '../services/nurseStudentsApi';

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
    className: 'bg-[#DCFCE7] text-[#166534]',
  },
  updated: {
    label: 'Đã cập nhật',
    className: 'bg-[#F1F5F9] text-[#334155]',
  },
  'needs-review': {
    label: 'Cần rà soát',
    className: 'bg-[#FEF3C7] text-[#B45309]',
  },
  incomplete: {
    label: 'Thiếu dữ liệu',
    className: 'bg-[#FEE2E2] text-[#DC2626]',
  },
};

const ALERT_BADGE_CLASS_MAP = {
  'Dị ứng': 'bg-[#FEE2E2] text-[#DC2626]',
  'Cận thị': 'bg-[#DBEAFE] text-[#2563EB]',
  'Bệnh nền': 'bg-[#F3E8FF] text-[#9333EA]',
  'Dinh dưỡng': 'bg-[#FFEDD5] text-[#EA580C]',
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
  return NURSE_STUDENT_CLASS_LABEL_MAP[classId]
    || NURSE_STUDENT_CLASS_LABEL_MAP[className]
    || className
    || '--';
};

const createFallbackHealthProfile = ({ row, index }) => {
  const envelope = getNurseStudentHealthProfileMockEnvelope({ row, index });
  const mapped = adaptStudentHealthProfileResponse(envelope);

  if (mapped) {
    return mapped;
  }

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
    updatedBy: '',
    healthProfileUpdatedAt: row.updatedAt || null,
  };
};

const normalizeHealthProfile = ({ envelope, row, index }) => {
  const mapped = adaptStudentHealthProfileResponse(envelope);
  return mapped || createFallbackHealthProfile({ row, index });
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
  } = useStudentManagement();

  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
  const [profileByStudentId, setProfileByStudentId] = useState({});
  const [useMockContext, setUseMockContext] = useState(Boolean(runtimeConfig.enableMockAdminDashboard));
  const [feedback, setFeedback] = useState(null);

  const showFeedback = useCallback((message, type = 'error') => {
    setFeedback({ message, type });
    window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), 2600);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(feedbackTimerRef.current);
  }, []);

  const loadStudentHealthProfile = useCallback(async (row, index) => {
    const studentId = resolveNurseStudentRouteIdFromRow(row);
    if (!studentId || requestedIdsRef.current.has(studentId)) {
      return;
    }

    requestedIdsRef.current.add(studentId);

    if (runtimeConfig.enableMockAdminDashboard) {
      const fallbackProfile = createFallbackHealthProfile({ row, index });
      setProfileByStudentId((prev) => ({ ...prev, [studentId]: fallbackProfile }));
      return;
    }

    try {
      const envelope = await getNurseStudentHealthProfileApi(studentId);
      const mappedProfile = normalizeHealthProfile({ envelope, row, index });
      setProfileByStudentId((prev) => ({ ...prev, [studentId]: mappedProfile }));
    } catch {
      const fallbackProfile = createFallbackHealthProfile({ row, index });
      setProfileByStudentId((prev) => ({ ...prev, [studentId]: fallbackProfile }));
      setUseMockContext(true);
    }
  }, []);

  useEffect(() => {
    tableData.rows.forEach((row, index) => {
      loadStudentHealthProfile(row, index);
    });
  }, [loadStudentHealthProfile, tableData.rows]);

  const handleApplyFilters = (event) => {
    event.preventDefault();

    const classId = Number.isFinite(Number(draftFilters.classValue))
      ? draftFilters.classValue
      : 'all';

    onFiltersChange({
      keyword: draftFilters.keyword,
      classId,
      status: 'all',
      gender: 'all',
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
      gender: 'all',
    });
  };

  const rowsWithContext = useMemo(() => {
    return tableData.rows.map((row, index) => {
      const studentId = resolveNurseStudentRouteIdFromRow(row);
      const profile = profileByStudentId[studentId] || (useMockContext ? createFallbackHealthProfile({ row, index }) : null);
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
  }, [profileByStudentId, tableData.rows, useMockContext]);

  const classOptions = useMemo(() => {
    if (useMockContext) {
      return NURSE_STUDENT_CLASS_FALLBACK_OPTIONS;
    }

    const map = new Map();
    rowsWithContext.forEach((row) => {
      const key = String(row.classFilterValue);
      if (key && !map.has(key)) {
        map.set(key, row.classNameDisplay || '--');
      }
    });

    const dynamicOptions = Array.from(map.entries()).map(([value, label]) => ({ value, label }));
    return [{ value: 'all', label: 'Tất cả lớp' }, ...dynamicOptions];
  }, [rowsWithContext, useMockContext]);

  const filteredRows = useMemo(() => {
    return rowsWithContext.filter((row) => {
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
  }, [activeFilters.alertState, activeFilters.classValue, activeFilters.profileStatus, rowsWithContext]);

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
      cellClassName: 'whitespace-nowrap text-[12px] font-bold text-[#15803D]',
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
          className="nurse-focus-ring nurse-interactive w-full rounded-md text-left"
        >
          <p className="truncate text-[14px] font-bold leading-5 text-[#0F172A] hover:text-[#15803D]">{row.fullName || '--'}</p>
          <p className="truncate text-[11px] text-[#64748B]">Lớp {row.classNameDisplay}</p>
        </button>
      ),
    },
    {
      key: 'updatedAtDisplay',
      header: 'Cập nhật gần nhất',
      headerClassName: 'w-[162px]',
      cellClassName: 'whitespace-nowrap text-[12px] text-[#64748B]',
      render: (row) => (
        <div>
          <p>{row.updatedAtDisplay}</p>
          {row.updatedAtDaysAgo !== null ? (
            <p className="text-[10px] text-[#94A3B8]">{row.updatedAtDaysAgo} ngày trước</p>
          ) : (
            <p className="text-[10px] text-[#94A3B8]">Chưa có mốc cập nhật</p>
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
          return <span className="text-[12px] text-[#94A3B8]">Không có</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {row.alerts.slice(0, 3).map((tag) => (
              <span
                key={`${row._studentId}-${tag}`}
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${ALERT_BADGE_CLASS_MAP[tag] || 'bg-[#DCFCE7] text-[#166534]'}`}
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
      headerClassName: 'w-[96px] min-w-[96px] whitespace-nowrap text-center',
      cellClassName: 'min-w-[96px] text-center',
      render: (row) => (
        <div className="flex justify-center" onClick={(event) => event.stopPropagation()}>
          <ActionDropdown
            menuWidth={210}
            items={[
              {
                id: 'open-profile',
                label: 'Mở hồ sơ sức khỏe',
                icon: 'visibility',
                onClick: () => openDetail(row._studentId),
              },
              {
                id: 'review-history',
                label: 'Xem lịch sử khám',
                icon: 'history',
                onClick: () => navigateToHealthProfile(row._studentId, {
                  source: 'nurse-health-profiles',
                  initialTab: 'health-history',
                }),
              },
              {
                id: 'update-profile',
                label: 'Cập nhật hồ sơ',
                icon: 'edit_square',
                onClick: () => navigateToHealthProfile(row._studentId, {
                  source: 'nurse-health-profiles',
                  openHealthEdit: true,
                }),
              },
            ]}
          />
        </div>
      ),
    },
  ]), [navigateToHealthProfile, openDetail]);

  return (
    <div className="space-y-3.5 text-[#0F172A]">
      <AdminFeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        closeAriaLabel="Đóng thông báo"
        closeLabel="Đóng"
        fallbackClassName="border-[#15803D]/25 bg-[#DCFCE7] text-[#166534]"
        classMap={{
          error: 'border-[#DC2626]/25 bg-[#FEE2E2] text-[#B91C1C]',
          success: 'border-[#15803D]/25 bg-[#DCFCE7] text-[#166534]',
        }}
      />

      <section className="nurse-banner-soft rounded-2xl px-4 py-3.5 shadow-[0_1px_4px_rgba(15,23,42,0.03)] sm:px-5">
        <h1 className="font-headline text-[1.46rem] font-bold leading-tight tracking-[-0.015em] text-[#14532D] sm:text-[1.62rem]">Hồ sơ sức khỏe học sinh</h1>
        <p className="mt-1 text-sm text-[#64748B]">Theo dõi tiến độ cập nhật hồ sơ, cảnh báo y tế và ưu tiên rà soát sức khỏe học đường.</p>
      </section>

      <section className="nurse-card-soft rounded-2xl px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleApplyFilters} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <label className="relative w-full sm:max-w-[320px]">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#64748B]/80">search</span>
              <input
                type="search"
                value={draftFilters.keyword}
                onChange={(event) => setDraftFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                placeholder="Tìm theo mã học sinh hoặc họ tên"
                className="nurse-focus-ring nurse-input h-9 w-full rounded-lg pl-9 pr-3 text-sm"
              />
            </label>

            <select
              value={draftFilters.classValue}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, classValue: event.target.value }))}
              className="nurse-focus-ring nurse-input h-9 w-full rounded-lg px-2.5 text-sm sm:w-[140px]"
            >
              {classOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <select
              value={draftFilters.profileStatus}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, profileStatus: event.target.value }))}
              className="nurse-focus-ring nurse-input h-9 w-full rounded-lg px-2.5 text-sm sm:w-[168px]"
            >
              {PROFILE_STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <select
              value={draftFilters.alertState}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, alertState: event.target.value }))}
              className="nurse-focus-ring nurse-input h-9 w-full rounded-lg px-2.5 text-sm sm:w-[170px]"
            >
              {ALERT_STATE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <button type="submit" className="nurse-focus-ring nurse-btn-primary inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold">
              Lọc
            </button>

            <button type="button" onClick={handleResetFilters} className="nurse-focus-ring nurse-btn-secondary inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold">
              Đặt lại
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate('/nurse/students')}
            className="nurse-focus-ring nurse-btn-secondary inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[17px]">group</span>
            Danh sách học sinh
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Hồ sơ cập nhật gần đây</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#166534]">{stats.recentlyUpdated}</p>
        </article>
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Hồ sơ cần rà soát</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#B45309]">{stats.needsReview}</p>
        </article>
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Hồ sơ có cảnh báo y tế</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#DC2626]">{stats.withAlerts}</p>
        </article>
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Hồ sơ thiếu dữ liệu</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#DC2626]">{stats.incomplete}</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
        <div className="nurse-table-summary-strong px-3 py-2 text-[11px] sm:px-4">
          Đang hiển thị <span className="font-semibold text-[#0F172A]">{filteredRows.length}</span> hồ sơ trên trang này • Tổng <span className="font-semibold text-[#0F172A]">{tableData.totalItems}</span> học sinh
        </div>

        <AdminAsyncState
          status={status}
          error={error}
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
                tableClassName="min-w-[920px] w-full table-fixed divide-y divide-[#E2E8F0] text-[13px]"
                headClassName="nurse-table-head-strong text-left"
                bodyClassName="divide-y divide-[#E2E8F0] bg-white"
                rowClassName="transition-[background-color] duration-150 hover:bg-[#F0FDF4]"
              />

              <div className="border-t border-[#E2E8F0] px-3 py-2 sm:px-4">
                <Pagination
                  compact
                  page={tableData.page}
                  pageSize={tableData.pageSize}
                  totalItems={tableData.totalItems}
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

      {useMockContext ? (
        <div className="rounded-xl border border-[#D1FAE5] bg-[#F0FDF4] px-3.5 py-2.5 text-xs text-[#166534]">
          Một phần dữ liệu đang sử dụng nguồn dự phòng để đảm bảo luồng theo dõi hồ sơ không bị gián đoạn.
        </div>
      ) : null}
    </div>
  );
};

export default NurseHealthProfilesPage;
