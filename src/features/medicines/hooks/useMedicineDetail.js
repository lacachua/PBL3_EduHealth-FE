import { useState } from 'react';
import { parseMedicinesApiError } from '../adapters/medicineErrorParser';
import { mapMedicineDetailResponse, mapMedicineMovementsResponse } from '../adapters/medicineResponseMapper';
import { getMedicineDetailApi, getMedicineMovementsApi } from '../services/medicinesApi';

const defaultMovements = {
  rows: [],
  page: 1,
  pageSize: 5,
  totalItems: 0,
  totalPages: 1,
};

export const useMedicineDetail = () => {
  const [open, setOpen] = useState(false);
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [movementsError, setMovementsError] = useState('');
  const [movementsData, setMovementsData] = useState(defaultMovements);
  const [accessState, setAccessState] = useState('ok');

  const openDetail = async (row) => {
    setOpen(true);
    setMedicine(row || null);
    setLoading(true);
    setError('');
    setAccessState('ok');
    setMovementsData(defaultMovements);
    setMovementsError('');
    setMovementsLoading(Boolean(row?.id));

    if (!row?.id) {
      setLoading(false);
      return;
    }

    try {
      const [detailResponse, movementResponse] = await Promise.all([
        getMedicineDetailApi(row.id),
        getMedicineMovementsApi(row.id, { page: 1, pageSize: 5 }),
      ]);

      const detail = mapMedicineDetailResponse(detailResponse);
      if (detail) {
        setMedicine(detail);
      }

      setMovementsData(mapMedicineMovementsResponse(movementResponse));
    } catch (apiError) {
      const parsedError = parseMedicinesApiError(apiError);
      setAccessState(parsedError.type === 'forbidden' ? 'forbidden' : parsedError.type === 'unauthorized' ? 'unauthorized' : 'ok');
      setError(parsedError.message);
    } finally {
      setLoading(false);
      setMovementsLoading(false);
    }
  };

  const refetchMovements = async (page = 1, pageSize = 5) => {
    if (!medicine?.id) return;

    setMovementsLoading(true);
    setMovementsError('');
    try {
      const response = await getMedicineMovementsApi(medicine.id, { page, pageSize });
      setMovementsData(mapMedicineMovementsResponse(response));
    } catch (apiError) {
      const parsedError = parseMedicinesApiError(apiError);
      setMovementsError(parsedError.message);
    } finally {
      setMovementsLoading(false);
    }
  };

  const closeDetail = () => {
    setOpen(false);
    setLoading(false);
    setError('');
    setMovementsError('');
    setMovementsLoading(false);
    setAccessState('ok');
  };

  return {
    open,
    medicine,
    loading,
    error,
    movementsLoading,
    movementsError,
    movementsData,
    accessState,
    openDetail,
    closeDetail,
    refetchMovements,
  };
};
