import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import DataTable from '../../../shared/components/core/DataTable';
import EmptyState from '../../../shared/components/core/EmptyState';
import RightDrawer from '../../../shared/components/core/RightDrawer';
import StatusBadge from '../../../shared/components/core/StatusBadge';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { DATA_MODULES } from '../../../app/config/dataMode';
import {
  resolveNurseStudentRouteId,
  resolveNurseStudentRouteIdFromRow,
} from '../adapters/nurseStudentIdentifierAdapter';
import { useStudentManagement } from '../hooks/useStudentManagement';
import { useClassOptions } from '../hooks/useClassOptions';



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

const formatMeasure = (value, unit) => {
  const number = Number(value);
  if (!value || !Number.isFinite(number)) return '--';
  return `${number.toFixed(1).replace(/\.0$/, '')} ${unit}`;
};

const DEFAULT_FILTERS = {
  keyword: '',
  classValue: 'all',
};

const resolveClassLabel = (classId, className) => {
  return className
    || classId
    || '--';
};



const NurseStudentsPage = () => {
  const navigate = useNavigate();
  const feedbackTimerRef = useRef(null);
  const { classes: globalClasses, loading: classesLoading } = useClassOptions();

  const {
    onFiltersChange,
    onPageChange,
    fetchList,
    tableData,
    status,
    error,
    fetchStudentDetail,
    selectedStudent: detailStudent,
    selectedHealthProfile: detailProfile,
    basicDetailLoading,
    healthDetailLoading,
    basicDetailError,
    healthDetailError,
  } = useStudentManagement({ moduleKey: DATA_MODULES.NURSE_STUDENTS });

  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const isDataLoaded = detailStudent?.id === selectedStudentId;
    
    if (drawerOpen && selectedStudentId && !isDataLoaded && !basicDetailLoading) {
      void fetchStudentDetail(selectedStudentId);
    }
  }, [drawerOpen, selectedStudentId, detailStudent?.id, basicDetailLoading, fetchStudentDetail]);

  const kpiLabel = useMemo(() => {
    if (activeFilters.classValue === 'all') return 'Tổng học sinh';
    const classItem = globalClasses.find((c) => String(c.classId) === String(activeFilters.classValue));
    return classItem ? `Học sinh lớp ${classItem.className}` : 'Tổng kết quả';
  }, [activeFilters.classValue, globalClasses]);

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
    return tableData.rows.map((row) => {
      const studentId = resolveNurseStudentRouteIdFromRow(row);
      const classNameDisplay = resolveClassLabel(row.classId, row.className);

      return {
        ...row,
        _studentId: studentId,
        classNameDisplay,
        classFilterValue: String(row.classId || classNameDisplay),
        dateOfBirthDisplay: toDateLabel(row.dateOfBirth),
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

  const filteredRows = useMemo(() => {
    return rowsWithContext.filter((row) => {
      if (activeFilters.classValue !== 'all' && String(row.classFilterValue) !== String(activeFilters.classValue)) {
        return false;
      }

      return true;
    });
  }, [activeFilters.classValue, rowsWithContext]);

  const stats = useMemo(() => {
    return {
      total: filteredRows.length,
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
        key: 'student',
        header: 'Học sinh',
        headerClassName: 'w-auto min-w-[240px]',
        render: (row) => (
          <div className="w-full text-left">
            <p className="truncate text-sm font-bold text-on-surface transition-colors group-hover:text-primary">
              {row.fullName || '--'}
            </p>
          </div>
        ),
      },
      {
        key: 'classNameDisplay',
        header: 'Lớp',
        headerClassName: 'w-[90px] min-w-[90px]',
        cellClassName: 'text-xs font-medium text-on-surface',
      },
      {
        key: 'phone',
        header: 'Số điện thoại',
        headerClassName: 'w-[160px] min-w-[160px]',
        cellClassName: 'text-xs text-on-surface-variant',
      },
      {
        key: 'guardian',
        header: 'Người giám hộ',
        headerClassName: 'w-[200px] min-w-[200px]',
        render: (row) => (
          <p className="truncate text-xs text-on-surface-variant">
            {row.guardian || '--'}
          </p>
        ),
      },
      {
        key: 'status',
        header: 'Trạng thái',
        headerClassName: 'w-[140px] min-w-[140px]',
        render: (row) => (
          <StatusBadge tone={row.statusTone}>{row.statusLabel}</StatusBadge>
        ),
      },
      {
        key: 'actions',
        header: 'Thao tác',
        headerClassName: 'w-[130px] min-w-[130px] text-right',
        cellClassName: 'text-right',
        render: (row) => (
          <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => navigateToExaminationByStudent(row)}
              className="app-focus-ring inline-flex h-8 items-center justify-center whitespace-nowrap rounded-lg bg-primary-soft px-3 text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              Tạo phiếu
            </button>
          </div>
        ),
      },
    ];
  }, [navigateToExaminationByStudent]);

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
                    placeholder="Tìm theo họ tên, email hoặc số điện thoại"
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

            <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <article className="app-kpi-card">
                <p className="app-kpi-label">{kpiLabel}</p>
                <p className="app-kpi-value">{tableData.totalItems}</p>
              </article>
              <article className="app-kpi-card">
                <p className="app-kpi-label">Đang hiển thị</p>
                <p className="app-kpi-value text-primary">{filteredRows.length}</p>
              </article>
            </section>
          </div>
        )}
        status={status}
        error={error}
        onRetry={fetchList}
        loadingLabel="Đang tải danh sách học sinh..."
        emptyTitle="Không có học sinh"
        emptyDescription="Danh sách học sinh sẽ hiển thị sau khi hệ thống đồng bộ dữ liệu."
        sectionClassName="space-y-3"
        table={filteredRows.length ? (
          <DataTable
            dense
            columns={tableColumns}
            rows={filteredRows}
            getRowKey={(row) => row._studentId || row.userId || row.fullName}
            onRowClick={(row) => openStudentProfile(row._studentId)}
            tableClassName="min-w-[960px] w-full text-left text-sm"
          />
        ) : (
          <div className="px-4 py-5 sm:px-5">
            <EmptyState
              title="Không có học sinh phù hợp bộ lọc"
              description="Hãy thử thay đổi từ khóa hoặc lớp để tìm kết quả phù hợp."
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

      <RightDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedStudentId(null);
        }}
        title="Thông tin học sinh"
        subtitle={selectedRow ? `Chi tiết thông tin của học sinh ${selectedRow.fullName}` : ''}
        widthClass="max-w-[480px]"
      >
        {selectedRow ? (
          <div className="space-y-4">
            {basicDetailLoading ? (
              <div className="flex h-40 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-xs text-on-surface-variant">Đang tải chi tiết...</p>
                </div>
              </div>
            ) : (
              <section className="rounded-lg border border-outline-variant bg-surface p-3 text-sm text-on-surface">
                <div className="grid grid-cols-[140px_1fr] gap-y-2.5">
                  <p className="text-on-surface-variant">Họ tên</p>
                  <p className="font-semibold text-primary">{selectedRow.fullName}</p>

                  <p className="text-on-surface-variant">Lớp</p>
                  <p>{selectedRow.classNameDisplay}</p>

                  <p className="text-on-surface-variant">Ngày sinh</p>
                  <p>{selectedRow.dateOfBirthDisplay}</p>

                  <p className="text-on-surface-variant">Giới tính</p>
                  <p>{detailStudent?.genderLabel || '--'}</p>

                  <p className="text-on-surface-variant border-t border-outline-variant/30 pt-2">Chiều cao</p>
                  <p className="border-t border-outline-variant/30 pt-2 font-medium">
                    {formatMeasure(detailStudent?.currentHeight ?? selectedRow.currentHeight, 'cm')}
                  </p>

                  <p className="text-on-surface-variant">Cân nặng</p>
                  <p className="font-medium">
                    {formatMeasure(detailStudent?.currentWeight ?? selectedRow.currentWeight, 'kg')}
                  </p>

                  <p className="text-on-surface-variant border-t border-outline-variant/30 pt-2">Người giám hộ</p>
                  <p className="border-t border-outline-variant/30 pt-2">{detailStudent?.guardian || selectedRow.guardian || '--'}</p>

                  <p className="text-on-surface-variant">Email</p>
                  <p className="truncate text-xs">{detailStudent?.email || selectedRow.email || '--'}</p>

                  <p className="text-on-surface-variant">Số điện thoại</p>
                  <p>{detailStudent?.phone || selectedRow.phone || '--'}</p>

                  <p className="text-on-surface-variant border-t border-outline-variant/30 pt-2">Trạng thái tài khoản</p>
                  <div className="border-t border-outline-variant/30 pt-2">
                    <StatusBadge tone={selectedRow.statusTone}>{selectedRow.statusLabel}</StatusBadge>
                  </div>
                </div>
              </section>
            )}

            {!basicDetailLoading && (
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
                  className="app-focus-ring app-btn-primary w-full rounded-md px-3 py-2 text-sm font-semibold transition-all"
                >
                  Mở hồ sơ sức khỏe
                </button>
              </div>
            )}

            {basicDetailError ? (
              <p className="rounded-md bg-danger-soft p-2 text-center text-xs text-danger">{basicDetailError}</p>
            ) : null}
          </div>
        ) : null}
      </RightDrawer>
    </div>
  );
};

export default NurseStudentsPage;
