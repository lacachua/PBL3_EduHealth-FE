import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/admin/AdminAsyncState';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import ActionDropdown from '../../../shared/components/admin/ActionDropdown';
import DataTable from '../../../shared/components/admin/DataTable';
import EmptyState from '../../../shared/components/admin/EmptyState';
import Pagination from '../../../shared/components/admin/Pagination';
import RightDrawer from '../../../shared/components/admin/RightDrawer';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { runtimeConfig } from '../../../shared/config/runtimeConfig';
import {
  resolveNurseStudentRouteId,
  resolveNurseStudentRouteIdFromRow,
} from '../adapters/nurseStudentIdentifierAdapter';
import {
  adaptStudentDetailResponse,
  adaptStudentHealthProfileResponse,
} from '../../students/adapters/studentManagementAdapter';
import { useStudentManagement } from '../../students/hooks/useStudentManagement';
import { getStudentManagementDetailApi } from '../../students/services/studentManagementApi';
import {
  getNurseStudentHealthProfileMockEnvelope,
  NURSE_STUDENT_CLASS_FALLBACK_OPTIONS,
  NURSE_STUDENT_CLASS_LABEL_MAP,
} from '../mocks/nurseStudentsMock';
import { getNurseStudentHealthProfileApi } from '../services/nurseStudentsApi';

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
  normal: 'bg-[#DCFCE7] text-[#166534]',
  tracking: 'bg-[#FEF3C7] text-[#B45309]',
  alert: 'bg-[#FEE2E2] text-[#DC2626]',
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

const toGenderLabel = (value) => {
  if (value === 'MALE') return 'Nam';
  if (value === 'FEMALE') return 'Nữ';
  if (value === 'OTHER') return 'Khác';
  return '--';
};

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
  if (mapped) {
    return mapped;
  }

  return createFallbackHealthProfile({ row, index });
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
  } = useStudentManagement();

  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
  const [detailByStudentId, setDetailByStudentId] = useState({});
  const [profileByStudentId, setProfileByStudentId] = useState({});
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [useMockContext, setUseMockContext] = useState(Boolean(runtimeConfig.enableMockAdminDashboard));

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
          studentId,
          studentName: student?.fullName,
        },
      });
      return true;
    } catch {
      showFeedback('Không thể mở trang khám bệnh. Vui lòng thử lại.', 'error');
      return false;
    }
  }, [navigate, showFeedback]);

  const loadStudentContext = useCallback(async (row, index) => {
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

    const [detailResult, profileResult] = await Promise.allSettled([
      getStudentManagementDetailApi(studentId),
      getNurseStudentHealthProfileApi(studentId),
    ]);

    if (detailResult.status === 'fulfilled') {
      const mappedDetail = adaptStudentDetailResponse(detailResult.value);
      if (mappedDetail) {
        setDetailByStudentId((prev) => ({ ...prev, [studentId]: mappedDetail }));
      }
    }

    if (profileResult.status === 'fulfilled') {
      const mappedProfile = normalizeHealthProfile({ envelope: profileResult.value, row, index });
      setProfileByStudentId((prev) => ({ ...prev, [studentId]: mappedProfile }));
      return;
    }

    const fallbackProfile = createFallbackHealthProfile({ row, index });
    setProfileByStudentId((prev) => ({ ...prev, [studentId]: fallbackProfile }));

    if (detailResult.status === 'rejected' && profileResult.status === 'rejected') {
      setUseMockContext(true);
    }
  }, []);

  useEffect(() => {
    tableData.rows.forEach((row, index) => {
      loadStudentContext(row, index);
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
    return tableData.rows.map((row, index) => {
      const studentId = resolveNurseStudentRouteIdFromRow(row);
      const detail = detailByStudentId[studentId] || null;
      const profile = profileByStudentId[studentId] || (useMockContext ? createFallbackHealthProfile({ row, index }) : null);

      const classNameDisplay = resolveClassLabel(row.classId, row.className);
      const alerts = inferAlerts({ row, detail, profile });
      const healthStatusKey = inferHealthStatus({ alerts, row, profile });

      return {
        ...row,
        _studentId: studentId,
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
  }, [detailByStudentId, profileByStudentId, tableData.rows, useMockContext]);

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
        headerClassName: 'w-[98px]',
        cellClassName: 'whitespace-nowrap text-[12px] font-bold text-[#15803D]',
        render: (row) => row.studentCode || (row._studentId ? `HS${row._studentId}` : '--'),
      },
      {
        key: 'fullName',
        header: 'Họ tên',
        headerClassName: 'w-[220px]',
        cellClassName: 'min-w-0',
        render: (row) => (
          <button
            type="button"
            onClick={() => openStudentProfile(row._studentId)}
            className="w-full text-left"
          >
            <p className="truncate text-[14px] font-extrabold leading-5 text-[#0F172A] transition-colors duration-150 hover:text-[#15803D]">{row.fullName || '--'}</p>
            <p className="truncate text-[11px] text-[#64748B]">{row.dateOfBirthDisplay}</p>
          </button>
        ),
      },
      {
        key: 'classNameDisplay',
        header: 'Lớp',
        headerClassName: 'w-[70px]',
        cellClassName: 'whitespace-nowrap text-[12px] font-semibold text-[#0F172A]',
      },
      {
        key: 'genderDisplay',
        header: 'Giới tính',
        headerClassName: 'w-[86px]',
        cellClassName: 'whitespace-nowrap text-[12px] text-[#64748B]',
      },
      {
        key: 'healthStatusKey',
        header: 'Trạng thái sức khỏe',
        headerClassName: 'w-[150px]',
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
        headerClassName: 'w-[180px]',
        cellClassName: 'min-w-0',
        render: (row) => {
          if (!row.alerts.length) {
            return <span className="text-[12px] text-[#94A3B8]">—</span>;
          }

          const visibleAlerts = row.alerts.slice(0, 2);
          const remaining = row.alerts.length - visibleAlerts.length;

          return (
            <div className="flex flex-wrap gap-1">
              {visibleAlerts.map((tag) => (
                <span
                  key={`${row._studentId}-${tag}`}
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${ALERT_BADGE_CLASS_MAP[tag] || 'bg-[#DCFCE7] text-[#166534]'}`}
                >
                  {tag}
                </span>
              ))}
              {remaining > 0 ? (
                <span className="inline-flex rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-semibold text-[#64748B]">+{remaining}</span>
              ) : null}
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
          <div className="flex justify-center">
            <ActionDropdown
              menuWidth={190}
              items={[
                {
                  id: 'view-profile',
                  label: 'Xem hồ sơ',
                  icon: 'visibility',
                  onClick: () => openStudentProfile(row._studentId),
                },
                {
                  id: 'open-health-profile-detail',
                  label: 'Mở hồ sơ sức khỏe',
                  icon: 'quick_reference_all',
                  onClick: () => navigateToHealthProfile(row._studentId, {
                    source: 'nurse-students',
                    studentId: row._studentId,
                    studentName: row.fullName,
                  }),
                },
                {
                  id: 'create-examination',
                  label: 'Tạo phiếu khám',
                  icon: 'add_notes',
                  onClick: () => navigateToExaminationByStudent(row),
                },
              ]}
            />
          </div>
        ),
      },
    ];
  }, [navigateToExaminationByStudent, navigateToHealthProfile, openStudentProfile]);

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
        <h1 className="font-headline text-[1.52rem] font-extrabold leading-tight tracking-[-0.015em] text-[#14532D] sm:text-[1.66rem]">Danh sách học sinh</h1>
        <p className="mt-1 text-sm text-[#64748B]">Tra cứu nhanh hồ sơ sức khỏe học sinh và điều phối thao tác khám bệnh tại phòng y tế.</p>
      </section>

      <section className="nurse-card-soft rounded-2xl px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleApplyFilters} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <label className="relative w-full sm:max-w-[310px]">
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
              className="nurse-focus-ring nurse-input h-9 w-full rounded-lg px-2.5 text-sm sm:w-[118px]"
            >
              {classOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <select
              value={draftFilters.gender}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, gender: event.target.value }))}
              className="nurse-focus-ring nurse-input h-9 w-full rounded-lg px-2.5 text-sm sm:w-[110px]"
            >
              {GENDER_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <select
              value={draftFilters.healthStatus}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, healthStatus: event.target.value }))}
              className="nurse-focus-ring nurse-input h-9 w-full rounded-lg px-2.5 text-sm sm:w-[162px]"
            >
              {HEALTH_STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <button
              type="submit"
                className="nurse-focus-ring nurse-btn-primary inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold"
            >
              Lọc
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
                className="nurse-focus-ring nurse-btn-secondary inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold"
            >
              Đặt lại
            </button>
          </form>

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
            className="nurse-focus-ring nurse-btn-primary inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[17px]">medical_information</span>
            Tạo phiếu khám mới
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Tổng học sinh</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#0F172A]">{stats.total}</p>
        </article>
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Bình thường</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#166534]">{stats.normal}</p>
        </article>
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Cần theo dõi</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#B45309]">{stats.tracking}</p>
        </article>
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Cảnh báo</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#DC2626]">{stats.alert}</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
        <div className="nurse-table-summary-strong px-3 py-2 text-[11px] sm:px-4">
          Hiển thị <span className="font-semibold text-[#0F172A]">{filteredRows.length}</span> bản ghi trên trang này • Tổng <span className="font-semibold text-[#0F172A]">{tableData.totalItems}</span> học sinh
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
                containerClassName="overflow-x-auto overflow-y-visible"
                tableClassName="min-w-[980px] w-full table-fixed divide-y divide-[#E2E8F0] text-[13px]"
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
            <section className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">{selectedRow.fullName}</h3>
                  <p className="mt-0.5 text-sm text-[#64748B]">{selectedRow.studentCode || (selectedRow._studentId ? `HS${selectedRow._studentId}` : '--')} • Lớp {selectedRow.classNameDisplay}</p>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${HEALTH_STATUS_CLASS_MAP[selectedRow.healthStatusKey] || HEALTH_STATUS_CLASS_MAP.normal}`}>
                  {HEALTH_STATUS_META[selectedRow.healthStatusKey]?.label || 'Bình thường'}
                </span>
              </div>
            </section>

            <section className="rounded-lg border border-[#E2E8F0] bg-white p-3 text-sm text-[#0F172A]">
              <div className="grid grid-cols-[128px_1fr] gap-y-2">
                <p className="text-[#64748B]">Mã học sinh</p>
                <p className="font-semibold">{selectedRow.studentCode || (selectedRow._studentId ? `HS${selectedRow._studentId}` : '--')}</p>

                <p className="text-[#64748B]">Ngày sinh</p>
                <p>{selectedRow.dateOfBirthDisplay}</p>

                <p className="text-[#64748B]">Giới tính</p>
                <p>{selectedRow.genderDisplay}</p>

                <p className="text-[#64748B]">Chiều cao / Cân nặng</p>
                <p>{(selectedRow.profile?.heightCm || selectedRow.currentHeight || '--')} cm / {(selectedRow.profile?.weightKg || selectedRow.currentWeight || '--')} kg</p>

                <p className="text-[#64748B]">Nhóm máu</p>
                <p>{selectedRow.profile?.bloodType || '--'}</p>

                <p className="text-[#64748B]">Tình trạng mắt</p>
                <p>{selectedRow.profile?.eyeStatus || '--'}</p>

                <p className="text-[#64748B]">Bệnh nền</p>
                <p>{selectedRow.profile?.chronicNote || '--'}</p>

                <p className="text-[#64748B]">Cảnh báo y tế</p>
                <div className="flex flex-wrap gap-1">
                  {selectedRow.alerts.length
                    ? selectedRow.alerts.map((tag) => (
                      <span key={`drawer-${selectedRow._studentId}-${tag}`} className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${ALERT_BADGE_CLASS_MAP[tag] || 'bg-[#DCFCE7] text-[#166534]'}`}>
                        {tag}
                      </span>
                    ))
                    : <span className="text-[#94A3B8]">—</span>}
                </div>

                <p className="text-[#64748B]">Người cập nhật</p>
                <p>{selectedRow.profile?.updatedBy || '--'}</p>

                <p className="text-[#64748B]">Cập nhật gần nhất</p>
                <p>{toDateLabel(selectedRow.profile?.healthProfileUpdatedAt || selectedRow.updatedAt)}</p>
              </div>
            </section>

            <div className="flex flex-wrap gap-2 border-t border-[#E2E8F0] pt-3">
              <button
                type="button"
                onClick={() => navigateToExaminationByStudent(selectedRow)}
                className="nurse-focus-ring nurse-btn-primary rounded-md px-3 py-1.5 text-sm font-semibold"
              >
                Tạo phiếu khám mới
              </button>

              <button
                type="button"
                onClick={() => {
                  navigateToHealthProfile(selectedRow._studentId, {
                    source: 'nurse-students',
                    studentId: selectedRow._studentId,
                    studentName: selectedRow.fullName,
                  });
                }}
                className="nurse-focus-ring nurse-btn-secondary rounded-md px-3 py-1.5 text-sm font-semibold"
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
                    const mappedProfile = normalizeHealthProfile({ envelope, row: selectedRow, index: 0 });
                    setProfileByStudentId((prev) => ({ ...prev, [studentId]: mappedProfile }));
                    showFeedback('Đã đồng bộ hồ sơ sức khỏe mới nhất.', 'success');
                  } catch (apiError) {
                    showFeedback(normalizeApiMessage(apiError), 'error');
                  }
                }}
                className="nurse-focus-ring nurse-btn-secondary rounded-md px-3 py-1.5 text-sm font-semibold"
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
