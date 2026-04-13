import React, { useEffect, useMemo, useState } from 'react';
import AdminAsyncState from '../../../shared/components/admin/AdminAsyncState';
import Pagination from '../../../shared/components/admin/Pagination';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { STUDENT_PICKER_PAGE_SIZE } from '../schemas/examinationsSchema';
import { getStudents } from '../../students/services/getStudents';
import { getStudentDetail } from '../../students/services/getStudentDetail';
import { getStudentHealthProfile } from '../../students/services/getStudentHealthProfile';
import { getStudentHealthHistory } from '../../students/services/getStudentHealthHistory';

const defaultListData = {
  rows: [],
  page: 1,
  pageSize: STUDENT_PICKER_PAGE_SIZE,
  totalItems: 0,
  totalPages: 0,
};

const dateLabel = (value) => {
  if (!value) return '--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('vi-VN');
};

const statusFilterToQuery = (value) => {
  if (value === 'active') return true;
  if (value === 'inactive') return false;
  return undefined;
};

const parseStudentsEnvelope = (envelope) => {
  const rows = Array.isArray(envelope?.data)
    ? envelope.data
    : Array.isArray(envelope?.data?.students)
      ? envelope.data.students
    : Array.isArray(envelope?.data?.items)
      ? envelope.data.items
      : [];

  const resolveStudentUserId = (item) => {
    const parsed = Number(item?.userId ?? item?.id ?? item?.studentId);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  return {
    rows: rows
      .map((item) => {
        const userId = resolveStudentUserId(item);
        if (!userId) {
          return null;
        }

        return {
          userId,
          fullName: item.fullName || '--',
          className: item.className || '--',
          dateOfBirth: item.dateOfBirth || null,
          guardian: item.guardian || item.parentName || '--',
          isActive: typeof item.isActive === 'boolean' ? item.isActive : item.status === 'ACTIVE',
        };
      })
      .filter(Boolean),
    page: Number(envelope?.meta?.page || 1),
    pageSize: Number(envelope?.meta?.pageSize || STUDENT_PICKER_PAGE_SIZE),
    totalItems: Number(envelope?.meta?.total || envelope?.meta?.totalItems || rows.length),
    totalPages: Number(envelope?.meta?.totalPages || 0),
  };
};

const StudentPickerModal = ({
  open,
  initialSelectedStudentId = null,
  initialSelectedStudentName = '',
  onClose,
  onViewProfile,
  onContinue,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);

  const [listStatus, setListStatus] = useState('loading');
  const [listError, setListError] = useState('');
  const [listData, setListData] = useState(defaultListData);

  const [selectedStudentId, setSelectedStudentId] = useState(initialSelectedStudentId);
  const [selectedStudentSnapshot, setSelectedStudentSnapshot] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [previewData, setPreviewData] = useState({
    detail: null,
    profile: null,
    history: [],
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSelectedStudentId(initialSelectedStudentId || null);
      setSelectedStudentSnapshot(null);
      if (initialSelectedStudentName) {
        setSearch(initialSelectedStudentName);
      } else {
        setSearch('');
      }
      setPage(1);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [initialSelectedStudentId, initialSelectedStudentName, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let isMounted = true;

    const fetchStudents = async () => {
      setListStatus('loading');
      setListError('');

      try {
        const response = await getStudents({
          page,
          pageSize: STUDENT_PICKER_PAGE_SIZE,
          search,
          isActive: statusFilterToQuery(statusFilter),
        });

        if (!isMounted) {
          return;
        }

        const mapped = parseStudentsEnvelope(response);
        setListData(mapped);
        setListStatus(mapped.rows.length ? 'success' : 'empty');

        setSelectedStudentId((current) => {
          if (current) {
            return current;
          }

          return mapped.rows.length ? mapped.rows[0].userId : null;
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setListData(defaultListData);
        setListStatus('error');
        setListError(normalizeApiMessage(error));
      }
    };

    fetchStudents();

    return () => {
      isMounted = false;
    };
  }, [open, page, reloadToken, search, statusFilter]);

  useEffect(() => {
    if (!open || !selectedStudentId) {
      return;
    }

    let isMounted = true;

    const fetchPreview = async () => {
      setPreviewLoading(true);
      setPreviewError('');

      const [detailResult, profileResult, historyResult] = await Promise.allSettled([
        getStudentDetail(selectedStudentId),
        getStudentHealthProfile(selectedStudentId),
        getStudentHealthHistory(selectedStudentId, { page: 1, pageSize: 5 }),
      ]);

      if (!isMounted) {
        return;
      }

      const detail = detailResult.status === 'fulfilled' ? detailResult.value?.data : null;
      const profileEnvelope = profileResult.status === 'fulfilled' ? profileResult.value?.data : null;
      const historyEnvelope = historyResult.status === 'fulfilled' ? historyResult.value : null;
      const historyRows = Array.isArray(historyEnvelope?.data)
        ? historyEnvelope.data
        : Array.isArray(historyEnvelope?.data?.items)
          ? historyEnvelope.data.items
          : [];

      setPreviewData({
        detail,
        profile: profileEnvelope,
        history: historyRows,
      });

      if (detail) {
        setSelectedStudentSnapshot({
          userId: selectedStudentId,
          fullName: detail.fullName || '--',
          className: detail.className || '--',
        });
      }

      if (detailResult.status === 'rejected' && profileResult.status === 'rejected' && historyResult.status === 'rejected') {
        setPreviewError('Không thể tải dữ liệu xem trước của học sinh.');
      }

      setPreviewLoading(false);
    };

    fetchPreview();

    return () => {
      isMounted = false;
    };
  }, [open, selectedStudentId]);

  const selectedRow = useMemo(() => {
    return listData.rows.find((row) => row.userId === selectedStudentId) || null;
  }, [listData.rows, selectedStudentId]);

  const selectedStudent = selectedRow || selectedStudentSnapshot;
  const allergies = Array.isArray(previewData.profile?.healthProfile?.allergies)
    ? previewData.profile.healthProfile.allergies
    : [];
  const hasMedicalWarning = allergies.length > 0 || Boolean(previewData.profile?.healthProfile?.chronicNote);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0F172A]/35 opacity-100 transition-opacity duration-150"
        onClick={onClose}
        aria-label="Đóng cửa sổ"
      />

      <div className="relative z-10 flex h-[85vh] w-full max-w-6xl translate-y-0 flex-col overflow-hidden rounded-2xl border border-[#D9E2DE] bg-white opacity-100 shadow-[0_24px_48px_rgba(15,23,42,0.18)] transition duration-150">
        <header className="shrink-0 border-b border-[#D9E2DE] bg-[#F8FAF9] px-4 py-3 md:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#163126]">Chọn học sinh để lập phiếu khám</h3>
              <p className="mt-0.5 text-sm text-[#5F746B]">Xác nhận đúng hồ sơ học sinh trước khi sang bước ghi nhận khám.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="nurse-focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9E2DE] text-[#5F746B] hover:bg-white"
              aria-label="Đóng"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 grid-cols-1 gap-0 lg:grid lg:grid-cols-5 bg-[#F4F7F6]">
          <section className="min-h-0 border-r border-[#D9E2DE] bg-white p-4 lg:col-span-2">
            <div className="space-y-2.5">
              <label className="relative block">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#5F746B]">search</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Tìm theo tên học sinh"
                  className="nurse-focus-ring nurse-input h-10 w-full rounded-lg pl-10 pr-3 text-sm"
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className="nurse-focus-ring nurse-input h-10 w-full rounded-lg px-3 text-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đã khóa</option>
              </select>
            </div>

            <div className="mt-3 min-h-0 h-[calc(100%-6.75rem)] overflow-hidden rounded-xl border border-[#D9E2DE] bg-white">
              <AdminAsyncState
                status={listStatus}
                error={listError}
                onRetry={() => setReloadToken((current) => current + 1)}
                loadingLabel="Đang tải danh sách học sinh..."
                emptyTitle="Không có học sinh"
                emptyDescription="Không tìm thấy học sinh phù hợp bộ lọc hiện tại."
                containerClassName="px-3 py-5"
              >
                <ul className="max-h-full overflow-y-auto divide-y divide-[#D9E2DE]">
                  {listData.rows.map((row) => {
                    const active = row.userId === selectedStudentId;
                    return (
                      <li key={row.userId}>
                        <button
                          type="button"
                          onClick={() => setSelectedStudentId(row.userId)}
                          className={`w-full px-3 py-3 text-left transition ${active ? 'border border-[#BBF7D0] bg-[#DCFCE7]' : 'hover:bg-[#F8FAF9]'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#163126]">{row.fullName}</p>
                              <p className="mt-0.5 text-xs text-[#5F746B]">Lớp {row.className}</p>
                            </div>
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${row.isActive ? 'bg-[#E8F6EE] text-[#0B6F3C]' : 'bg-[#FDECEC] text-[#B42318]'}`}>
                              {row.isActive ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {listData.totalPages > 1 ? (
                  <div className="border-t border-[#D9E2DE] bg-white px-3 py-2">
                    <Pagination
                      page={listData.page}
                      pageSize={listData.pageSize}
                      totalItems={listData.totalItems}
                      onPageChange={(nextPage) => setPage(nextPage)}
                    />
                  </div>
                ) : null}
              </AdminAsyncState>
            </div>
          </section>

          <section className="min-h-0 p-4 lg:col-span-3">
            {selectedStudentId ? (
              <div className="h-full overflow-y-auto rounded-xl border border-[#D9E2DE] bg-[#F8FAF9] p-4 animate-[nurseFadeSlideIn_180ms_ease-out]">
                {previewLoading ? (
                  <p className="text-sm text-[#5F746B]">Đang tải thông tin học sinh...</p>
                ) : null}

                {previewError ? (
                  <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">{previewError}</p>
                ) : null}

                <div className="space-y-4">
                  <article className="nurse-card-soft rounded-lg p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#163126]">Thông tin cơ bản</h4>
                      <button
                        type="button"
                        onClick={() => onViewProfile?.(selectedStudentId)}
                        className="nurse-focus-ring rounded-md px-1.5 py-0.5 text-xs font-semibold text-[#175CD3] hover:text-[#1248AC]"
                      >
                        Xem hồ sơ học sinh
                      </button>
                    </div>
                    <dl className="mt-2 grid grid-cols-1 gap-2 text-sm text-[#334155] sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-[#5F746B]">Họ tên</dt>
                        <dd className="font-medium text-[#163126]">{previewData.detail?.fullName || selectedStudent?.fullName || '--'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5F746B]">Mã học sinh</dt>
                        <dd className="font-medium text-[#163126]">{previewData.profile?.studentId || '--'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5F746B]">Mã hồ sơ</dt>
                        <dd className="font-medium text-[#163126]">{previewData.profile?.studentCode || '--'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5F746B]">Lớp</dt>
                        <dd className="font-medium text-[#163126]">{previewData.profile?.className || selectedStudent?.className || '--'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5F746B]">Ngày sinh</dt>
                        <dd className="font-medium text-[#163126]">{dateLabel(previewData.detail?.dateOfBirth || selectedRow?.dateOfBirth)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5F746B]">Phụ huynh</dt>
                        <dd className="font-medium text-[#163126]">{previewData.detail?.guardian || selectedRow?.guardian || '--'}</dd>
                      </div>
                    </dl>
                  </article>

                  {hasMedicalWarning ? (
                    <article className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-[#B91C1C]">
                      <p className="text-xs font-semibold uppercase tracking-[0.02em]">Cảnh báo y tế</p>
                      {allergies.length ? (
                        <p className="mt-1 text-sm">Dị ứng: {allergies.map((item) => item.allergyTypeName).join(', ')}</p>
                      ) : null}
                      {previewData.profile?.healthProfile?.chronicNote ? (
                        <p className="mt-1 text-sm">Lưu ý bệnh nền: {previewData.profile.healthProfile.chronicNote}</p>
                      ) : null}
                    </article>
                  ) : null}

                  <article className="nurse-card-soft rounded-lg p-3">
                    <h4 className="text-sm font-bold text-[#163126]">Tóm tắt hồ sơ sức khỏe</h4>
                    <dl className="mt-2 grid grid-cols-1 gap-2 text-sm text-[#334155] sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-[#5F746B]">Chiều cao</dt>
                        <dd className="font-medium text-[#163126]">{previewData.profile?.healthProfile?.heightCm ?? '--'} cm</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5F746B]">Cân nặng</dt>
                        <dd className="font-medium text-[#163126]">{previewData.profile?.healthProfile?.weightKg ?? '--'} kg</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5F746B]">Nhóm máu</dt>
                        <dd className="font-medium text-[#163126]">{previewData.profile?.healthProfile?.bloodType || '--'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#5F746B]">Dị ứng</dt>
                        <dd className="font-medium text-[#163126]">
                          {allergies.length
                            ? allergies.map((item) => item.allergyTypeName).join(', ')
                            : '--'}
                        </dd>
                      </div>
                    </dl>
                  </article>

                  <article className="nurse-card-soft rounded-lg p-3">
                    <h4 className="text-sm font-bold text-[#163126]">Lịch sử khám gần đây</h4>
                    {previewData.history.length ? (
                      <ul className="mt-2 space-y-2">
                        {previewData.history.slice(0, 3).map((item) => (
                          <li key={item.visitId} className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                            <p className="text-xs text-[#5F746B]">{dateLabel(item.visitDate)}</p>
                            <p className="text-sm font-semibold text-[#163126]">{item.diagnosis || 'Chưa có chẩn đoán'}</p>
                            <p className="text-xs text-[#5F746B]">{item.diseaseType?.name || 'Không có loại bệnh'}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-[#5F746B]">Chưa có dữ liệu lịch sử khám.</p>
                    )}
                  </article>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#D9E2DE] bg-[#F8FAF9] p-6 text-sm text-[#5F746B]">
                Chọn một học sinh để xem thông tin chi tiết.
              </div>
            )}
          </section>
        </div>

        <footer className="shrink-0 flex items-center justify-end gap-2 border-t border-[#D9E2DE] bg-white px-4 py-3 md:px-5">
          <button
            type="button"
            onClick={onClose}
            className="nurse-btn-secondary nurse-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              if (!selectedStudentId || !selectedStudent) {
                return;
              }

              onContinue({
                userId: selectedStudentId,
                fullName: selectedStudent.fullName,
              });
            }}
            disabled={!selectedStudentId || !selectedStudent}
            className="nurse-btn-primary nurse-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-55"
          >
            Tiếp tục lập phiếu khám
          </button>
        </footer>
      </div>
    </div>
  );
};

export default StudentPickerModal;
