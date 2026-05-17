import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import DataTable from '../../../shared/components/core/DataTable';
import EmptyState from '../../../shared/components/core/EmptyState';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { DATA_MODULES } from '../../../app/config/dataMode';
import {
  resolveNurseStudentRouteId,
  resolveNurseStudentRouteIdFromRow,
} from '../../students/adapters/nurseStudentIdentifierAdapter';
import { useStudentManagement } from '../../students/hooks/useStudentManagement';
import { useClassOptions } from '../../students/hooks/useClassOptions';

/* ──────────────────────────────────────────────────────────────
 * Filter defaults & option sets
 * ────────────────────────────────────────────────────────────── */

const DEFAULT_FILTERS = {
  keyword: '',
  classValue: 'all',
};

/* ──────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────── */

const hasNumericValue = (value) =>
  value !== null && value !== undefined && value !== '';

/**
 * Format a numeric measurement to max 1 decimal place.
 * Strips trailing ".0". Returns "—" for missing/invalid values.
 *
 * Examples:
 *   129.06233 → "129.1"
 *   32.000    → "32"
 *   null      → "—"
 */
const formatMeasure = (value) => {
  if (!hasNumericValue(value)) return '—';
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(1).replace(/\.0$/, '');
};

const resolveClassLabel = (classId, className) =>
  className || classId || '—';

/* ──────────────────────────────────────────────────────────────
 * Page component
 * ────────────────────────────────────────────────────────────── */

const NurseHealthProfilesPage = () => {
  const navigate = useNavigate();
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
  const [feedback, setFeedback] = useState(null);

  const showFeedback = useCallback((message, type = 'error') => {
    setFeedback({ message, type });
    window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), 2600);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(feedbackTimerRef.current);
  }, []);

  /* ── Filter handlers ─────────────────────────────────────── */

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

  /* ── Row mapping (list-level data only, no N+1) ──────────── */

  const rowsWithContext = useMemo(() => {
    return tableData.rows.map((row) => {
      const studentId = resolveNurseStudentRouteIdFromRow(row);
      const classNameDisplay = resolveClassLabel(row.classId, row.className);

      return {
        ...row,
        _studentId: studentId,
        classNameDisplay,
        classFilterValue: String(row.classId || classNameDisplay),
      };
    });
  }, [tableData.rows]);

  const classOptions = useMemo(() => {
    const options = globalClasses.map((c) => ({
      value: String(c.classId),
      label: c.className || `-- (ID: ${c.classId})`,
    }));
    return [{ value: 'all', label: 'Tất cả lớp' }, ...options];
  }, [globalClasses]);

  /* ── Client-side filtering ───────────────────────────────── */

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

      return true;
    });
  }, [activeFilters.classValue, activeFilters.keyword, rowsWithContext]);

  const effectiveStatus = status === 'success' && !filteredRows.length ? 'empty' : status;

  /* ── KPI stats (page-level — computed from current page rows) */

  const stats = useMemo(() => {
    return {
      incomplete: filteredRows.filter((row) => !hasNumericValue(row.currentHeight) || !hasNumericValue(row.currentWeight)).length,
    };
  }, [filteredRows]);

  /* ── Navigation ──────────────────────────────────────────── */

  const navigateToHealthProfile = useCallback((candidateStudentId) => {
    const studentId = resolveNurseStudentRouteId(candidateStudentId);
    if (!studentId) {
      showFeedback('Không thể mở hồ sơ vì thiếu mã học sinh hợp lệ.', 'error');
      return false;
    }

    try {
      navigate(`/nurse/health-profiles/${studentId}`);
      return true;
    } catch {
      showFeedback('Không thể điều hướng đến hồ sơ sức khỏe. Vui lòng thử lại.', 'error');
      return false;
    }
  }, [navigate, showFeedback]);

  const openDetail = useCallback((studentId) => {
    navigateToHealthProfile(studentId);
  }, [navigateToHealthProfile]);

  /* ── Table columns ───────────────────────────────────────── */

  const tableColumns = useMemo(() => ([
    {
      key: 'student',
      header: 'Học sinh',
      headerClassName: 'w-[42%] min-w-[320px]',
      render: (row) => (
        <p className="truncate text-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
          {row.fullName || '—'}
        </p>
      ),
    },
    {
      key: 'classNameDisplay',
      header: 'Lớp',
      headerClassName: 'w-[18%] min-w-[120px]',
      cellClassName: 'text-sm text-on-surface',
    },
    {
      key: 'height',
      header: 'Chiều cao',
      headerClassName: 'w-[20%] min-w-[160px]',
      cellClassName: 'text-sm text-on-surface',
      render: (row) => {
        const v = formatMeasure(row.currentHeight);
        return v === '—'
          ? <span className="text-on-surface-muted">—</span>
          : <span>{v} cm</span>;
      },
    },
    {
      key: 'weight',
      header: 'Cân nặng',
      headerClassName: 'w-[20%] min-w-[160px]',
      cellClassName: 'text-sm text-on-surface',
      render: (row) => {
        const v = formatMeasure(row.currentWeight);
        return v === '—'
          ? <span className="text-on-surface-muted">—</span>
          : <span>{v} kg</span>;
      },
    },
  ]), []);

  /* ── Render ──────────────────────────────────────────────── */

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
        description="Danh sách hồ sơ sức khỏe, trạng thái cập nhật và điều hướng chi tiết từng học sinh."
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
                    placeholder="Tìm theo họ tên hoặc mã HS"
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
                <p className="app-kpi-label">Tổng hồ sơ</p>
                <p className="app-kpi-value">{tableData.totalItems}</p>
              </article>
              <article className="app-kpi-card">
                <p className="app-kpi-label">Thiếu chỉ số trang này</p>
                <p className="app-kpi-value text-warning">{stats.incomplete}</p>
              </article>
            </section>
          </div>
        )}
        summary={null}
        status={effectiveStatus}
        error={error}
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
              description="Hãy thử thay đổi từ khóa hoặc bộ lọc để xem kết quả khác."
            />
          </div>
        )}
        pagination={{
          page: tableData.page,
          pageSize: tableData.pageSize,
          totalItems: tableData.totalItems,
          onPageChange,
        }}
      />
    </div>
  );
};

export default NurseHealthProfilesPage;
