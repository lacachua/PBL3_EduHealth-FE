import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import Pagination from '../../../shared/components/admin/Pagination';
import {
  buildSummaryStats,
  mapMedicineAlertsEnvelope,
  mapMedicineDetailEnvelope,
  mapMedicineListEnvelope,
  mapMedicineMovementsEnvelope,
} from '../adapters/nurseMedicineAdapter';
import { parseNurseMedicineApiError } from '../adapters/nurseMedicineErrorParser';
import {
  MOVEMENT_PAGE_SIZE,
  PAGE_SIZE,
} from '../constants/nurseMedicineConstants';
import CreateMedicineModal from '../components/medicines/CreateMedicineModal';
import DisposeMedicineModal from '../components/medicines/DisposeMedicineModal';
import MedicineDetailDrawer from '../components/medicines/MedicineDetailDrawer';
import MedicinesAlertsPanel from '../components/medicines/MedicinesAlertsPanel';
import MedicinesSummaryCards from '../components/medicines/MedicinesSummaryCards';
import MedicinesTable from '../components/medicines/MedicinesTable';
import MedicinesToolbar from '../components/medicines/MedicinesToolbar';
import StockInMedicineModal from '../components/medicines/StockInMedicineModal';
import UpdateMedicineModal from '../components/medicines/UpdateMedicineModal';
import UpdateMedicineStatusModal from '../components/medicines/UpdateMedicineStatusModal';
import { createMedicine } from '../../medicines/services/createMedicine';
import { disposeMedicine } from '../../medicines/services/disposeMedicine';
import { getMedicineAlerts } from '../../medicines/services/getMedicineAlerts';
import { getMedicineById } from '../../medicines/services/getMedicineById';
import { getMedicineMovements } from '../../medicines/services/getMedicineMovements';
import { getMedicines } from '../../medicines/services/getMedicines';
import { stockInMedicine } from '../../medicines/services/stockInMedicine';
import { updateMedicine } from '../../medicines/services/updateMedicine';
import { updateMedicineStatus } from '../../medicines/services/updateMedicineStatus';

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
  success: 'border-[#86EFAC] bg-[#DCFCE7] text-[#166534]',
  error: 'border-[#FECACA] bg-[#FEE2E2] text-[#B91C1C]',
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
  const [alertsError, setAlertsError] = useState('');

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
      });

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
    setAlertsError('');

    try {
      const response = await getMedicineAlerts({ type: 'ALL' });
      setAlerts(mapMedicineAlertsEnvelope(response));
    } catch (error) {
      const message = resolveApiError(error);
      setAlerts([]);
      setAlertsError(message);
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
      const response = await getMedicineById(medicineId);
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
      });

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

  const openDisposeMedicine = async (medicine) => {
    setActionError('');
    setOpenDisposeModal(true);
    setActiveMedicine(medicine);
  };

  const openStatusUpdate = async (medicine) => {
    setActionError('');
    setOpenStatusModal(true);
    setActiveMedicine(medicine);
  };

  const summary = useMemo(() => buildSummaryStats({
    rows: medicinesData.rows,
    totalItems: medicinesData.totalItems,
    alerts,
  }), [alerts, medicinesData.rows, medicinesData.totalItems]);

  if (unauthorized) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-[#D7ECDD] bg-white px-4 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)] md:px-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A] md:text-3xl">Thuốc / Kho thuốc</h1>
        <p className="mt-1 text-sm text-[#64748B]">Quản lý danh mục thuốc, theo dõi tồn kho và hạn sử dụng tại phòng y tế.</p>
      </header>

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
        onCreate={() => {
          setActionError('');
          setOpenCreateModal(true);
        }}
      />

      <MedicinesSummaryCards summary={summary} loading={listStatus === 'loading'} />

      {forbidden ? (
        <section className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          Bạn không có quyền truy cập module Thuốc / Kho thuốc.
        </section>
      ) : null}

      {!forbidden ? (
        <>
          <MedicinesAlertsPanel
            alerts={alerts}
            loading={alertsLoading}
            error={alertsError}
            onOpenMedicine={openDetailByMedicineId}
          />

          <section className="space-y-3 rounded-2xl border border-[#D7ECDD] bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)] md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Danh mục thuốc</h2>
                <p className="text-sm text-[#64748B]">Theo dõi thông tin thuốc và thao tác nghiệp vụ kho.</p>
              </div>
            </div>

            <MedicinesTable
              rows={medicinesData.rows}
              loading={listStatus === 'loading'}
              error={listStatus === 'error' ? listError : ''}
              onRetry={() => fetchMedicinesList(page, appliedFilters)}
              onView={openDetailFromRow}
              onEdit={openUpdateMedicine}
              onStockIn={openStockInMedicine}
              onDispose={openDisposeMedicine}
              onToggleStatus={openStatusUpdate}
            />

            {(listStatus === 'success' || listStatus === 'empty') && medicinesData.totalPages > 1 ? (
              <Pagination
                page={medicinesData.page}
                pageSize={medicinesData.pageSize}
                totalItems={medicinesData.totalItems}
                onPageChange={(nextPage) => setPage(nextPage)}
              />
            ) : null}
          </section>
        </>
      ) : null}

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
          () => createMedicine(payload),
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
          () => updateMedicine(activeMedicine?.id, payload),
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
          () => stockInMedicine(activeMedicine?.id, payload),
          'Nhập kho thành công.'
        )}
      />

      <DisposeMedicineModal
        key={`${openDisposeModal ? 'dispose-open' : 'dispose-closed'}-${activeMedicine?.id || 'none'}`}
        open={openDisposeModal}
        medicine={activeMedicine}
        onClose={closeAllActionModals}
        submitting={actionSubmitting}
        error={actionError}
        onSubmit={(payload) => runAction(
          () => disposeMedicine(activeMedicine?.id, payload),
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
          () => updateMedicineStatus(activeMedicine?.id, payload),
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
