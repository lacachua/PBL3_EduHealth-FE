import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/core/AsyncState';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import DataTable from '../../../shared/components/core/DataTable';
import EmptyState from '../../../shared/components/core/EmptyState';
import Pagination from '../../../shared/components/core/Pagination';
import RightDrawer from '../../../shared/components/core/RightDrawer';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { DATA_MODULES } from '../../../app/config/dataMode';
import {
  resolveNurseStudentRouteId,
  resolveNurseStudentRouteIdFromRow,
} from '../adapters/nurseStudentIdentifierAdapter';
import {
  adaptStudentDetailResponse,
  adaptStudentHealthProfileResponse,
} from '../adapters/studentManagementAdapter';
import { useStudentManagement } from '../hooks/useStudentManagement';
import {
  getNurseStudentDetailApi,
  getNurseStudentHealthProfileApi,
} from '../../health-profiles/services/healthProfilesApi';

const DEFAULT_FILTERS = {
  keyword: '',
  classValue: 'all',
  gender: 'all',
  healthStatus: 'all',
};

const HEALTH_STATUS_OPTIONS = [
  { value: 'all', label: 'Trạng thái sức khỏe' },
  { value: 'normal', label: 'Bình thường' },
  { value: 'tracking', label: 'Cần theo dõi' },
  { value: 'alert', label: 'Cảnh báo' },
];

const GENDER_OPTIONS = [
  { value: 'all', label: 'Giới tính' },
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
];

const HEALTH_STATUS_META = {
  normal: { label: 'Bình thường', tone: 'success' },
  tracking: { label: 'Cần theo dõi', tone: 'warning' },
  alert: { label: 'Cảnh báo', tone: 'danger' },
};

const HEALTH_STATUS_CLASS_MAP = {
  normal: 'bg-success-soft text-success',
  tracking: 'bg-warning-soft text-warning',
  alert: 'bg-danger-soft text-danger',
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

const toGenderLabel = (value) => {
  if (value === 'MALE') return 'Nam';
  if (value === 'FEMALE') return 'Nữ';
  if (value === 'OTHER') return 'Khác';
  return '--';
};

const resolveClassLabel = (classId, className) => {
  return className
    || classId
    || '--';
};

const createApiFallbackHealthProfile = ({ row }) => {
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

const createFallbackHealthProfile = ({ row }) => {
  return createApiFallbackHealthProfile({ row });
};

const normalizeHealthProfile = ({ envelope, row }) => {
  const mapped = adaptStudentHealthProfileResponse(envelope);
  if (mapped) {
    return mapped;
  }

  return createFallbackHealthProfile({ row });
};

const inferAlerts = ({ row, detail, profile }) => {
  const alerts = [];

  const allergies = String(profile?.allergies || '').trim();
  const eyeStatus = String(profile?.eyeStatus || '').toLowerCase();
  const chronicNote = String(profile?.chronicNote || '').toLowerCase();
  const generalHealthNote = String(profile?.generalHealthNote || '').toLowerCase();
  const historyNote = String(detail?.medicalHistoryNotes || row.medicalHistoryNotes || '').toLowerCase();

  if (allergies) alerts.push('Dị ứng');
  if (/cận|kinh|myopia|thị lực/.test(eyeStatus + historyNote)) alerts.push('Cận thị');
  if (/bệnh nền|mãn tính|hen|tim|tiểu đường|chronic/.test(chronicNote + historyNote)) alerts.push('Bệnh nền');
  if (/dinh dưỡng|suy dinh dưỡng|thừa cân|béo phì|vitamin/.test(generalHealthNote + historyNote)) alerts.push('Dinh dưỡng');

  return [...new Set(alerts)];
};

const inferHealthStatus = ({ alerts, row, profile }) => {
  const hasHeight = row.currentHeight !== null && row.currentHeight !== undefined && row.currentHeight !== '';
  const hasWeight = row.currentWeight !== null && row.currentWeight !== undefined && row.currentWeight !== '';
  const hasCriticalAlert = alerts.includes('Dị ứng') || alerts.includes('Bệnh nền');
  const hasTrackingAlert = alerts.includes('Cận thị') || alerts.includes('Dinh dưỡng');
  const hasGeneralNote = Boolean(profile?.generalHealthNote || row.medicalHistoryNotes);

  if (hasCriticalAlert) return 'alert';
  if (hasTrackingAlert || !hasHeight || !hasWeight || hasGeneralNote) return 'tracking';
  return 'normal';
};

const NurseStudentsPage = () => {
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
  const [detailByStudentId, setDetailByStudentId] = useState({});
  const [profileByStudentId, setProfileByStudentId] = useState({});
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = useCallback((message, type = 'success') => {
    setFeedback({ message, type });
    window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), 2600);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(feedbackTimerRef.current);
  }, []);

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

  const navigateToExaminationByStudent = useCallback((student) => {
    const studentId = resolveNurseStudentRouteId(student?._studentId, student?.studentId, student?.apiId);
    if (!studentId) {
      showFeedback('Không thể tạo phiếu khám vì dữ liệu học sinh chưa hợp lệ.', 'error');
      return false;
    }

    try {
      navigate('/nurse/examinations', {
        state: {
          source: 'nurse-students',
          openCreateExamination: true,
          studentUserId: studentId,
          studentName: student?.fullName,
        },
      });
      return true;
    } catch {
      showFeedback('Không thể mở trang khám bệnh. Vui lòng thử lại.', 'error');
      return false;
    }
  }, [navigate, showFeedback]);

  const loadStudentContext = useCallback(async (row) => {
    const studentId = resolveNurseStudentRouteIdFromRow(row);
    if (!studentId || requestedIdsRef.current.has(studentId)) {
      return;
    }

    requestedIdsRef.current.add(studentId);

    const [detailResult, profileResult] = await Promise.allSettled([
      getNurseStudentDetailApi(studentId),
      getNurseStudentHealthProfileApi(studentId),
    ]);

    if (detailResult.status === 'fulfilled') {
      const mappedDetail = adaptStudentDetailResponse(detailResult.value);
      if (mappedDetail) {
        setDetailByStudentId((prev) => ({ ...prev, [studentId]: mappedDetail }));
      }
    }

    if (profileResult.status === 'fulfilled') {
      const mappedProfile = normalizeHealthProfile({ envelope: profileResult.value, row });
      setProfileByStudentId((prev) => ({ ...prev, [studentId]: mappedProfile }));
      return;
    }

    const fallbackProfile = createFallbackHealthProfile({ row });
    setProfileByStudentId((prev) => ({ ...prev, [studentId]: fallbackProfile }));
  }, []);

  useEffect(() => {
    tableData.rows.forEach((row) => {
      loadStudentContext(row);
    });
  }, [loadStudentContext, tableData.rows]);

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
    return tableData.rows.map((row) => {
      const studentId = resolveNurseStudentRouteIdFromRow(row);
      const detail = detailByStudentId[studentId] || null;
      const profile = profileByStudentId[studentId] || null;

      const classNameDisplay = resolveClassLabel(row.classId, row.className);
      const alerts = inferAlerts({ row, detail, profile });
      const healthStatusKey = inferHealthStatus({ alerts, row, profile });
      const studentCodeDisplay = profile?.studentCode
        || detail?.studentCode
        || row.studentCode
        || (studentId ? `HS${studentId}` : '--');

      return {
        ...row,
        _studentId: studentId,
        studentCodeDisplay,
        classNameDisplay,
        classFilterValue: String(row.classId || classNameDisplay),
        genderKey: detail?.gender || row.gender || 'UNKNOWN',
        genderDisplay: detail?.genderLabel || row.genderLabel || toGenderLabel(detail?.gender || row.gender),
        dateOfBirthDisplay: toDateLabel(detail?.dateOfBirth || row.dateOfBirth),
        profile,
        detail,
        alerts,
        healthStatusKey,
      };
    });
  }, [detailByStudentId, profileByStudentId, tableData.rows]);

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
    return rowsWithContext.filter((row) => {
      if (activeFilters.classValue !== 'all' && String(row.classFilterValue) !== String(activeFilters.classValue)) {
        return false;
      }

      if (activeFilters.gender !== 'all' && row.genderKey !== activeFilters.gender) {
        return false;
      }

      if (activeFilters.healthStatus !== 'all' && row.healthStatusKey !== activeFilters.healthStatus) {
        return false;
      }

      return true;
    });
  }, [activeFilters.classValue, activeFilters.gender, activeFilters.healthStatus, rowsWithContext]);

  const stats = useMemo(() => {
    const counts = {
      normal: 0,
      tracking: 0,
      alert: 0,
    };

    filteredRows.forEach((row) => {
      counts[row.healthStatusKey] = (counts[row.healthStatusKey] || 0) + 1;
    });

    return {
      total: filteredRows.length,
      normal: counts.normal,
      tracking: counts.tracking,
      alert: counts.alert,
    };
  }, [filteredRows]);

  const selectedRow = useMemo(
    () => rowsWithContext.find((row) => row._studentId === selectedStudentId) || null,
    [rowsWithContext, selectedStudentId]
  );

  const openStudentProfile = useCallback((studentId) => {
    if (!studentId) {
      showFeedback('Không thể mở hồ sơ vì thiếu mã học sinh hợp lệ.', 'error');
      return;
    }

    setSelectedStudentId(studentId);
    setDrawerOpen(true);
  }, [showFeedback]);

  const tableColumns = useMemo(() => {
    return [
      {
        key: 'studentCode',
        header: 'Mã học sinh',
        headerClassName: 'w-[10%] min-w-[100px]',
        cellClassName: 'whitespace-nowrap text-[12px] font-bold text-success',
        render: (row) => row.studentCodeDisplay,
      },
      {
        key: 'fullName',
        header: 'Họ tên',
        headerClassName: 'w-[24%] min-w-[200px]',
        cellClassName: 'min-w-0',
        render: (row) => (
          <button
            type="button"
            onClick={() => openStudentProfile(row._studentId)}
            className="w-full text-left"
          >
            <p className="truncate text-[14px] font-extrabold leading-5 text-on-surface transition-colors duration-150 hover:text-primary">{row.fullName || '--'}</p>
            <p className="truncate text-[11px] text-on-surface-muted">{row.dateOfBirthDisplay}</p>
          </button>
        ),
      },
      {
        key: 'classNameDisplay',
        header: 'Lớp',
        headerClassName: 'w-[8%] min-w-[70px]',
        cellClassName: 'whitespace-nowrap text-[12px] font-semibold text-on-surface',
      },
      {
        key: 'genderDisplay',
        header: 'Giới tính',
        headerClassName: 'w-[8%] min-w-[80px]',
        cellClassName: 'whitespace-nowrap text-[12px] text-on-surface-muted',
      },
      {
        key: 'healthStatusKey',
        header: 'Trạng thái sức khỏe',
        headerClassName: 'w-[14%] min-w-[140px]',
        cellClassName: 'whitespace-nowrap',
        render: (row) => {
          const meta = HEALTH_STATUS_META[row.healthStatusKey] || HEALTH_STATUS_META.normal;
          const className = HEALTH_STATUS_CLASS_MAP[row.healthStatusKey] || HEALTH_STATUS_CLASS_MAP.normal;
          return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}>{meta.label}</span>;
        },
      },
      {
        key: 'alerts',
        header: 'Cảnh báo y tế',
        headerClassName: 'w-[16%] min-w-[160px]',
        cellClassName: 'min-w-0',
        render: (row) => {
          if (!row.alerts.length) {
            return <span className="text-[12px] text-on-surface-muted">—</span>;
          }

          const visibleAlerts = row.alerts.slice(0, 2);
          const remaining = row.alerts.length - visibleAlerts.length;

          return (
            <div className="flex flex-wrap gap-1">
              {visibleAlerts.map((tag) => (
                <span
                  key={`${row._studentId}-${tag}`}
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${ALERT_BADGE_CLASS_MAP[tag] || 'bg-success-soft text-success'}`}
                >
                  {tag}
                </span>
              ))}
              {remaining > 0 ? (
                <span className="inline-flex rounded-full bg-surface-container-low px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant">+{remaining}</span>
              ) : null}
            </div>
          );
        },
      },
      {
        key: 'actions',
        header: 'Thao tác',
        headerClassName: 'w-[10%] min-w-[100px] whitespace-nowrap text-right',
        cellClassName: 'min-w-[100px] text-right',
        render: (row) => (
          <div className="flex justify-end gap-1.5" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => navigateToExaminationByStudent(row)}
              className="app-focus-ring app-row-action app-row-action-primary"
            >
              Tạo phiếu
            </button>
          </div>
        ),
      },
    ];
  }, [navigateToExaminationByStudent, navigateToHealthProfile, openStudentProfile]);

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
        title="Danh sách học sinh"
        description="Tra cứu nhanh hồ sơ sức khỏe học sinh và điều phối thao tác khám bệnh tại phòng y tế."
        actions={(
          <button
            type="button"
            onClick={() => {
              navigate('/nurse/examinations', {
                state: {
                  source: 'nurse-students',
                  openCreateExamination: true,
                },
              });
            }}
            className="app-focus-ring app-btn-primary inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">medical_information</span>
            Tạo phiếu khám mới
          </button>
        )}
      />

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
            value={draftFilters.gender}
            onChange={(event) => setDraftFilters((prev) => ({ ...prev, gender: event.target.value }))}
            className="app-focus-ring app-input h-10 w-full rounded-lg px-2.5 text-sm xl:w-[116px] xl:shrink-0"
          >
            {GENDER_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>

          <select
            value={draftFilters.healthStatus}
            onChange={(event) => setDraftFilters((prev) => ({ ...prev, healthStatus: event.target.value }))}
            className="app-focus-ring app-input h-10 w-full rounded-lg px-2.5 text-sm xl:w-[172px] xl:shrink-0"
          >
            {HEALTH_STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>

          <div className="flex shrink-0 flex-wrap items-center gap-2 xl:ml-auto xl:flex-nowrap">
            <button
              type="submit"
              className="app-focus-ring app-btn-primary inline-flex h-9 min-w-[72px] items-center justify-center rounded-lg px-3 text-sm font-semibold"
            >
              Lọc
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              className="app-focus-ring app-btn-secondary inline-flex h-9 min-w-[84px] items-center justify-center rounded-lg px-3 text-sm font-semibold"
            >
              Đặt lại
            </button>
          </div>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="app-kpi-card">
          <p className="app-kpi-label">Tổng học sinh</p>
          <p className="app-kpi-value">{stats.total}</p>
        </article>
        <article className="app-kpi-card">
          <p className="app-kpi-label">Bình thường</p>
          <p className="app-kpi-value text-success">{stats.normal}</p>
        </article>
        <article className="app-kpi-card">
          <p className="app-kpi-label">Cần theo dõi</p>
          <p className="app-kpi-value text-warning">{stats.tracking}</p>
        </article>
        <article className="app-kpi-card">
          <p className="app-kpi-label">Cảnh báo</p>
          <p className="app-kpi-value text-danger">{stats.alert}</p>
        </article>
      </section>

      <section className="app-panel-shell space-y-3 p-4 md:p-5">
        <h2 className="text-lg font-bold text-on-surface">Danh sách học sinh</h2>
        <div className="app-table-summary rounded-xl px-3 py-2 text-[11px]">
          Hiển thị <span className="font-semibold text-on-surface">{filteredRows.length}</span> bản ghi trên trang này • Tổng <span className="font-semibold text-on-surface">{tableData.totalItems}</span> học sinh
        </div>

        <AdminAsyncState
          status={status}
          error={error}
          onRetry={fetchList}
          loadingLabel="Đang tải danh sách học sinh..."
          emptyTitle="Không có học sinh"
          emptyDescription="Danh sách học sinh sẽ hiển thị sau khi hệ thống đồng bộ dữ liệu."
        >
          {filteredRows.length ? (
            <>
              <DataTable
                dense
                columns={tableColumns}
                rows={filteredRows}
                getRowKey={(row) => row._studentId || row.studentCode || row.fullName}
                tableClassName="min-w-[860px] w-full text-left text-sm"
              />

              <div className="pt-2">
                <Pagination
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
                title="Không có học sinh phù hợp bộ lọc"
                description="Hãy thử thay đổi lớp, giới tính hoặc trạng thái sức khỏe để tìm kết quả phù hợp."
              />
            </div>
          )}
        </AdminAsyncState>
      </section>

      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Hồ sơ sức khỏe học sinh"
        subtitle={selectedRow ? `Theo dõi chi tiết hồ sơ của ${selectedRow.fullName}` : ''}
        widthClass="max-w-[560px]"
      >
        {selectedRow ? (
          <div className="space-y-3">
            <section className="rounded-lg border border-success/25 bg-success-soft p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-on-surface">{selectedRow.fullName}</h3>
                  <p className="mt-0.5 text-sm text-on-surface-variant">{selectedRow.studentCodeDisplay} • Lớp {selectedRow.classNameDisplay}</p>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${HEALTH_STATUS_CLASS_MAP[selectedRow.healthStatusKey] || HEALTH_STATUS_CLASS_MAP.normal}`}>
                  {HEALTH_STATUS_META[selectedRow.healthStatusKey]?.label || 'Bình thường'}
                </span>
              </div>
            </section>

            <section className="rounded-lg border border-outline-variant bg-surface p-3 text-sm text-on-surface">
              <div className="grid grid-cols-[128px_1fr] gap-y-2">
                <p className="text-on-surface-variant">Mã học sinh</p>
                <p className="font-semibold">{selectedRow.studentCodeDisplay}</p>

                <p className="text-on-surface-variant">Ngày sinh</p>
                <p>{selectedRow.dateOfBirthDisplay}</p>

                <p className="text-on-surface-variant">Giới tính</p>
                <p>{selectedRow.genderDisplay}</p>

                <p className="text-on-surface-variant">Chiều cao / Cân nặng</p>
                <p>{(selectedRow.profile?.heightCm || selectedRow.currentHeight || '--')} cm / {(selectedRow.profile?.weightKg || selectedRow.currentWeight || '--')} kg</p>

                <p className="text-on-surface-variant">Nhóm máu</p>
                <p>{selectedRow.profile?.bloodType || '--'}</p>

                <p className="text-on-surface-variant">Tình trạng mắt</p>
                <p>{selectedRow.profile?.eyeStatus || '--'}</p>

                <p className="text-on-surface-variant">Bệnh nền</p>
                <p>{selectedRow.profile?.chronicNote || '--'}</p>

                <p className="text-on-surface-variant">Cảnh báo y tế</p>
                <div className="flex flex-wrap gap-1">
                  {selectedRow.alerts.length
                    ? selectedRow.alerts.map((tag) => (
                      <span key={`drawer-${selectedRow._studentId}-${tag}`} className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${ALERT_BADGE_CLASS_MAP[tag] || 'bg-success-soft text-success'}`}>
                        {tag}
                      </span>
                    ))
                    : <span className="text-on-surface-muted">—</span>}
                </div>

                <p className="text-on-surface-variant">Cập nhật gần nhất</p>
                <p>{toDateLabel(selectedRow.profile?.healthProfileUpdatedAt || selectedRow.updatedAt)}</p>
              </div>
            </section>

            <div className="flex flex-wrap gap-2 border-t border-outline-variant pt-3">
              <button
                type="button"
                onClick={() => {
                  navigateToHealthProfile(selectedRow._studentId, {
                    source: 'nurse-students',
                    studentId: selectedRow._studentId,
                    studentName: selectedRow.fullName,
                  });
                }}
                className="app-focus-ring app-btn-secondary rounded-md px-3 py-1.5 text-sm font-semibold"
              >
                Mở hồ sơ sức khỏe
              </button>

              <button
                type="button"
                onClick={async () => {
                  const studentId = resolveNurseStudentRouteId(selectedRow?._studentId);
                  if (!studentId) {
                    showFeedback('Không thể đồng bộ vì thiếu mã học sinh hợp lệ.', 'error');
                    return;
                  }

                  try {
                    const envelope = await getNurseStudentHealthProfileApi(studentId);
                    const mappedProfile = normalizeHealthProfile({ envelope, row: selectedRow });
                    setProfileByStudentId((prev) => ({ ...prev, [studentId]: mappedProfile }));
                    showFeedback('Đã đồng bộ hồ sơ sức khỏe mới nhất.', 'success');
                  } catch (apiError) {
                    showFeedback(normalizeApiMessage(apiError), 'error');
                  }
                }}
                className="app-focus-ring app-btn-secondary rounded-md px-3 py-1.5 text-sm font-semibold"
              >
                Đồng bộ dữ liệu
              </button>
            </div>
          </div>
        ) : null}
      </RightDrawer>
    </div>
  );
};

export default NurseStudentsPage;
