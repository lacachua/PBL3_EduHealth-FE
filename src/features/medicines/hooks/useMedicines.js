import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseMedicinesApiError } from '../adapters/medicineErrorParser';
import { mapMedicinesListResponse } from '../adapters/medicineResponseMapper';
import { getMedicines } from '../services/getMedicines';

const defaultFilters = {
  keyword: '',
  status: 'all',
  lowStock: false,
  expiring: false,
};

const defaultTableData = {
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

export const useMedicines = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState(defaultTableData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessState, setAccessState] = useState('ok');

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError('');
    setAccessState('ok');

    try {
      const response = await getMedicines({
        page,
        pageSize: 10,
        keyword: filters.keyword,
        status: filters.status,
        lowStock: filters.lowStock,
        expiring: filters.expiring,
      });

      setTableData(mapMedicinesListResponse(response));
    } catch (apiError) {
      const parsedError = parseMedicinesApiError(apiError);
      setAccessState(parsedError.type === 'forbidden' ? 'forbidden' : parsedError.type === 'unauthorized' ? 'unauthorized' : 'ok');
      setError(parsedError.message);
      setTableData(defaultTableData);
    } finally {
      setLoading(false);
    }
  }, [filters.expiring, filters.keyword, filters.lowStock, filters.status, page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const onFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const onResetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const onPageChange = (nextPage) => {
    setPage(nextPage);
  };

  const status = useMemo(() => {
    if (accessState !== 'ok') return 'blocked';
    if (loading) return 'loading';
    if (error) return 'error';
    if (!tableData.rows.length) return 'empty';
    return 'success';
  }, [accessState, error, loading, tableData.rows.length]);

  return {
    filters,
    tableData,
    status,
    error,
    accessState,
    fetchList,
    onFiltersChange,
    onResetFilters,
    onPageChange,
  };
};
