import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DATA_MODULES } from '../../../app/config/dataMode';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import {
  mapMedicineAlertsEnvelope,
  mapMedicineDetailEnvelope,
  mapMedicineListEnvelope,
  mapMedicineMovementsEnvelope,
} from '../adapters/nurseMedicineAdapter';
import { parseNurseMedicineApiError } from '../adapters/medicineErrorParser';
import {
  MOVEMENT_PAGE_SIZE,
  PAGE_SIZE,
} from '../constants/nurseMedicineConstants';
import CreateMedicineModal from '../components/nurse/CreateMedicineModal';
import DisposeMedicineModal from '../components/nurse/DisposeMedicineModal';
import MedicineDetailDrawer from '../components/nurse/MedicineDetailDrawer';
import MedicinesTable from '../components/nurse/MedicinesTable';
import MedicinesToolbar from '../components/nurse/MedicinesToolbar';
import StockInMedicineModal from '../components/nurse/StockInMedicineModal';
import UpdateMedicineModal from '../components/nurse/UpdateMedicineModal';
import UpdateMedicineStatusModal from '../components/nurse/UpdateMedicineStatusModal';
import { createMedicine } from '../services/createMedicine';
import { disposeMedicine } from '../services/disposeMedicine';
import { getMedicineAlerts } from '../services/getMedicineAlerts';
import { getMedicineById } from '../services/getMedicineById';
import { getMedicineMovements } from '../services/getMedicineMovements';
import { getMedicines } from '../services/getMedicines';
import { stockInMedicine } from '../services/stockInMedicine';
import { updateMedicine } from '../services/updateMedicine';
import { updateMedicineStatus } from '../services/updateMedicineStatus';
import { notifyMedicineInventoryChanged } from '../services/medicineInventoryEvents';

const NURSE_MEDICINES_OPTIONS = { moduleKey: DATA_MODULES.NURSE_MEDICINES };

const DEFAULT_FILTERS = {
  keyword: '',
  status: 'all',
  lowStock: false,
  expiring: false,
};

const DEFAULT_MOVEMENT_FILTERS = {
  type: '',
  fromDate: '',
  toDate: '',
};

const EMPTY_PAGED_LIST = {
  rows: [],
  page: 1,
  pageSize: PAGE_SIZE,
  totalItems: 0,
  totalPages: 0,
};

const EMPTY_MOVEMENT_LIST = {
  rows: [],
  page: 1,
  pageSize: MOVEMENT_PAGE_SIZE,
  totalItems: 0,
  totalPages: 0,
};

const TOAST_CLASS_MAP = {
  success: 'border-success/25 bg-success-soft text-success',
  error: 'border-danger/25 bg-danger-soft text-danger',
};

const NurseMedicinesPage = () => {
  const [unauthorized, setUnauthorized] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const [listStatus, setListStatus] = useState('loading');
  const [listError, setListError] = useState('');
  const [medicinesData, setMedicinesData] = useState(EMPTY_PAGED_LIST);

  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [detailMedicine, setDetailMedicine] = useState(null);

  const [movementData, setMovementData] = useState(EMPTY_MOVEMENT_LIST);
  const [movementLoading, setMovementLoading] = useState(false);
  const [movementError, setMovementError] = useState('');
  const [movementFilters, setMovementFilters] = useState(DEFAULT_MOVEMENT_FILTERS);
  const [movementPage, setMovementPage] = useState(1);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openStockInModal, setOpenStockInModal] = useState(false);
  const [openDisposeModal, setOpenDisposeModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const [activeMedicine, setActiveMedicine] = useState(null);
  const [activeBatch, setActiveBatch] = useState(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  const [feedback, setFeedback] = useState(null);

  const resolveApiError = useCallback((error) => {
    const parsed = parseNurseMedicineApiError(error);

    if (parsed.type === 'unauthorized') {
      setUnauthorized(true);
    }

    if (parsed.type === 'forbidden') {
      setForbidden(true);
    }

    return parsed.message;
  }, []);

  const fetchMedicinesList = useCallback(async (nextPage = page, nextFilters = appliedFilters) => {
    setListStatus('loading');
    setListError('');

    try {
      const response = await getMedicines({
        page: nextPage,
        pageSize: PAGE_SIZE,
        keyword: nextFilters.keyword,
        status: nextFilters.status,
        lowStock: nextFilters.lowStock,
        expiring: nextFilters.expiring,
      }, NURSE_MEDICINES_OPTIONS);

      const mapped = mapMedicineListEnvelope(response);
      setMedicinesData(mapped);
      setListStatus(mapped.rows.length ? 'success' : 'empty');
    } catch (error) {
      const message = resolveApiError(error);
      setListError(message);
      setListStatus('error');
      setMedicinesData(EMPTY_PAGED_LIST);
    }
  }, [appliedFilters, page, resolveApiError]);

  const fetchAlerts = useCallback(async () => {
    setAlertsLoading(true);

    try {
      const [lowStockResponse, expiringResponse] = await Promise.all([
        getMedicineAlerts({ type: 'LOW_STOCK' }, NURSE_MEDICINES_OPTIONS),
        getMedicineAlerts({ type: 'EXPIRING' }, NURSE_MEDICINES_OPTIONS),
      ]);

      const lowStockAlerts = mapMedicineAlertsEnvelope(lowStockResponse)
        .map((item) => ({ ...item, alertType: 'LOW_STOCK' }));
      const expiringAlerts = mapMedicineAlertsEnvelope(expiringResponse)
        .map((item) => ({ ...item, alertType: 'EXPIRING' }));

      setAlerts([...lowStockAlerts, ...expiringAlerts]);
    } catch (error) {
      resolveApiError(error);
      setAlerts([]);
    } finally {
      setAlertsLoading(false);
    }
  }, [resolveApiError]);

  const fetchDetail = useCallback(async (medicineId) => {
    if (!medicineId) {
      return null;
    }

    setDetailLoading(true);
    setDetailError('');

    try {
      const response = await getMedicineById(medicineId, NURSE_MEDICINES_OPTIONS);
      const mapped = mapMedicineDetailEnvelope(response);
      setDetailMedicine(mapped);
      return mapped;
    } catch (error) {
      const message = resolveApiError(error);
      setDetailMedicine(null);
      setDetailError(message);
      return null;
    } finally {
      setDetailLoading(false);
    }
  }, [resolveApiError]);

  const fetchMovements = useCallback(async (medicineId, nextPage = movementPage, nextFilters = movementFilters) => {
    if (!medicineId) {
      return;
    }

    setMovementLoading(true);
    setMovementError('');

    try {
      const response = await getMedicineMovements(medicineId, {
        page: nextPage,
        pageSize: MOVEMENT_PAGE_SIZE,
        type: nextFilters.type || undefined,
        fromDate: nextFilters.fromDate || undefined,
        toDate: nextFilters.toDate || undefined,
      }, NURSE_MEDICINES_OPTIONS);

      setMovementData(mapMedicineMovementsEnvelope(response));
    } catch (error) {
      const message = resolveApiError(error);
      setMovementData(EMPTY_MOVEMENT_LIST);
      setMovementError(message);
    } finally {
      setMovementLoading(false);
    }
  }, [movementFilters, movementPage, resolveApiError]);

  useEffect(() => {
    fetchMedicinesList(page, appliedFilters);
  }, [appliedFilters, fetchMedicinesList, page]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    if (!detailOpen || !selectedMedicineId) {
      return;
    }

    fetchMovements(selectedMedicineId, movementPage, movementFilters);
  }, [detailOpen, fetchMovements, movementFilters, movementPage, selectedMedicineId]);

  const closeAllActionModals = () => {
    setOpenCreateModal(false);
    setOpenUpdateModal(false);
    setOpenStockInModal(false);
    setOpenDisposeModal(false);
    setOpenStatusModal(false);
    setActiveBatch(null);
    setActionError('');
    setActionSubmitting(false);
  };

  const refreshCurrentData = async () => {
    await Promise.all([
      fetchMedicinesList(page, appliedFilters),
      fetchAlerts(),
      detailOpen && selectedMedicineId ? fetchDetail(selectedMedicineId) : Promise.resolve(),
      detailOpen && selectedMedicineId ? fetchMovements(selectedMedicineId, movementPage, movementFilters) : Promise.resolve(),
    ]);
  };

  const runAction = async (requestFactory, successFallbackMessage) => {
    setActionSubmitting(true);
    setActionError('');

    try {
      const response = await requestFactory();
      const successMessage = response?.message || successFallbackMessage;

      closeAllActionModals();
      setFeedback({
        type: 'success',
        message: successMessage,
      });

      await refreshCurrentData();
      notifyMedicineInventoryChanged({
        medicineId: activeMedicine?.id || selectedMedicineId || null,
      });
    } catch (error) {
      const message = resolveApiError(error);
      setActionError(message);
      setFeedback({
        type: 'error',
        message,
      });
    } finally {
      setActionSubmitting(false);
    }
  };

  const openDetailByMedicineId = async (medicineId) => {
    if (!medicineId) {
      return;
    }

    const rowMatch = medicinesData.rows.find((item) => item.id === medicineId);

    setDetailOpen(true);
    setSelectedMedicineId(medicineId);
    setDetailMedicine(rowMatch || null);
    setDetailError('');
    setMovementData(EMPTY_MOVEMENT_LIST);
    setMovementFilters(DEFAULT_MOVEMENT_FILTERS);
    setMovementPage(1);

    await fetchDetail(medicineId);
  };

  const openDetailFromRow = async (row) => {
    await openDetailByMedicineId(row?.id);
  };

  const openUpdateMedicine = async (medicine) => {
    setActionError('');
    setOpenUpdateModal(true);
    setActiveMedicine(medicine);

    if (medicine?.id) {
      const detail = await fetchDetail(medicine.id);
      if (detail) {
        setActiveMedicine(detail);
      }
    }
  };

  const openStockInMedicine = async (medicine) => {
    setActionError('');
    setOpenStockInModal(true);
    setActiveMedicine(medicine);
  };

  const openDisposeMedicine = async (medicine, batch) => {
    if (!batch?.id || batch.remainingQuantity <= 0 || ['DEPLETED', 'DISPOSED'].includes(batch.status)) {
      return;
    }
    setActionError('');
    setOpenDisposeModal(true);
    setActiveMedicine(medicine);
    setActiveBatch(batch);
  };

  const openStatusUpdate = async (medicine) => {
    setActionError('');
    setOpenStatusModal(true);
    setActiveMedicine(medicine);
  };

  const alertSummary = useMemo(() => ({
    lowStock: alerts.filter((item) => item.alertType === 'LOW_STOCK').length,
    expiring: alerts.filter((item) => item.alertType === 'EXPIRING').length,
  }), [alerts]);

  if (unauthorized) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-5 text-on-surface">
      <NurseModulePageHeader
        title="Thuốc / Kho thuốc"
        description="Quản lý danh mục thuốc, theo dõi tồn kho và hạn sử dụng tại phòng y tế."
        actions={(
          <button
            type="button"
            onClick={() => {
              setActionError('');
              setOpenCreateModal(true);
            }}
            className="app-btn-primary app-focus-ring inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Thêm thuốc mới
          </button>
        )}
      />

      <AdminManagementListSection
        filters={(
          <div className="space-y-4">
            <MedicinesToolbar
              value={draftFilters}
              onChange={setDraftFilters}
              onApply={() => {
                setAppliedFilters(draftFilters);
                setPage(1);
              }}
              onReset={() => {
                setDraftFilters(DEFAULT_FILTERS);
                setAppliedFilters(DEFAULT_FILTERS);
                setPage(1);
              }}
            />

            {forbidden ? (
              <section className="mt-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
                Bạn không có quyền truy cập module Thuốc / Kho thuốc.
              </section>
            ) : null}

            {!forbidden ? (
              <section className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <article className="app-kpi-card">
                  <p className="app-kpi-label">Sắp hết thuốc</p>
                  <p className="app-kpi-value text-warning">{alertsLoading ? '--' : alertSummary.lowStock}</p>
                </article>
                <article className="app-kpi-card">
                  <p className="app-kpi-label">Sắp hết hạn</p>
                  <p className="app-kpi-value text-danger">{alertsLoading ? '--' : alertSummary.expiring}</p>
                </article>
              </section>
            ) : null}
          </div>
        )}
        summary={medicinesData.rows.length > 0 ? `Hiển thị ${medicinesData.rows.length} bản ghi/trang • Tổng ${medicinesData.totalItems} thuốc` : null}
        status={forbidden ? 'idle' : listStatus}
        error={listError}
        onRetry={() => fetchMedicinesList(page, appliedFilters)}
        loadingLabel="Đang tải danh sách thuốc..."
        emptyTitle="Không có thuốc"
        emptyDescription="Danh sách thuốc sẽ hiển thị sau khi hệ thống đồng bộ dữ liệu."
        sectionClassName="space-y-3"
        table={!forbidden ? (
          <MedicinesTable
            rows={medicinesData.rows}
            loading={listStatus === 'loading'}
            onView={openDetailFromRow}
            onStockIn={openStockInMedicine}
          />
        ) : null}
        pagination={!forbidden ? {
          page: medicinesData.page,
          pageSize: medicinesData.pageSize,
          totalItems: medicinesData.totalItems,
          totalPages: medicinesData.totalPages,
          onPageChange: (nextPage) => setPage(nextPage),
        } : null}
      />

      <MedicineDetailDrawer
        key={detailOpen ? (selectedMedicineId || 'detail-open') : 'detail-closed'}
        open={detailOpen}
        medicine={detailMedicine}
        loading={detailLoading}
        error={detailError}
        onClose={() => {
          setDetailOpen(false);
          setSelectedMedicineId('');
          setDetailMedicine(null);
          setDetailError('');
          setMovementData(EMPTY_MOVEMENT_LIST);
          setMovementFilters(DEFAULT_MOVEMENT_FILTERS);
          setMovementPage(1);
        }}
        movementData={movementData}
        movementLoading={movementLoading}
        movementError={movementError}
        movementFilters={movementFilters}
        onMovementFiltersChange={(nextFilters) => {
          setMovementFilters(nextFilters);
          setMovementPage(1);
        }}
        onMovementPageChange={setMovementPage}
        onEdit={openUpdateMedicine}
        onStockIn={openStockInMedicine}
        onDispose={openDisposeMedicine}
        onToggleStatus={openStatusUpdate}
      />

      <CreateMedicineModal
        key={openCreateModal ? 'create-open' : 'create-closed'}
        open={openCreateModal}
        onClose={closeAllActionModals}
        submitting={actionSubmitting}
        error={actionError}
        onSubmit={(payload) => runAction(
          () => createMedicine(payload, NURSE_MEDICINES_OPTIONS),
          'Thêm thuốc thành công.'
        )}
      />

      <UpdateMedicineModal
        key={`${openUpdateModal ? 'update-open' : 'update-closed'}-${activeMedicine?.id || 'none'}-${activeMedicine?.updatedAt || ''}`}
        open={openUpdateModal}
        medicine={activeMedicine}
        onClose={closeAllActionModals}
        submitting={actionSubmitting}
        error={actionError}
        onSubmit={(payload) => runAction(
          () => updateMedicine(activeMedicine?.id, payload, NURSE_MEDICINES_OPTIONS),
          'Cập nhật thuốc thành công.'
        )}
      />

      <StockInMedicineModal
        key={`${openStockInModal ? 'stock-open' : 'stock-closed'}-${activeMedicine?.id || 'none'}`}
        open={openStockInModal}
        medicine={activeMedicine}
        onClose={closeAllActionModals}
        submitting={actionSubmitting}
        error={actionError}
        onSubmit={(payload) => runAction(
          () => stockInMedicine(activeMedicine?.id, payload, NURSE_MEDICINES_OPTIONS),
          'Nhập kho thành công.'
        )}
      />

      <DisposeMedicineModal
        key={`${openDisposeModal ? 'dispose-open' : 'dispose-closed'}-${activeMedicine?.id || 'none'}-${activeBatch?.id || 'none'}`}
        open={openDisposeModal}
        medicine={activeMedicine}
        batch={activeBatch}
        onClose={closeAllActionModals}
        submitting={actionSubmitting}
        error={actionError}
        onSubmit={(payload) => runAction(
          () => disposeMedicine(activeMedicine?.id, payload, NURSE_MEDICINES_OPTIONS),
          'Hủy thuốc thành công.'
        )}
      />

      <UpdateMedicineStatusModal
        key={`${openStatusModal ? 'status-open' : 'status-closed'}-${activeMedicine?.id || 'none'}-${activeMedicine?.status || 'unknown'}`}
        open={openStatusModal}
        medicine={activeMedicine}
        onClose={closeAllActionModals}
        submitting={actionSubmitting}
        error={actionError}
        onSubmit={(payload) => runAction(
          () => updateMedicineStatus(activeMedicine?.id, payload, NURSE_MEDICINES_OPTIONS),
          'Cập nhật trạng thái thành công.'
        )}
      />

      <AdminFeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        classMap={TOAST_CLASS_MAP}
      />
    </div>
  );
};

export default NurseMedicinesPage;
