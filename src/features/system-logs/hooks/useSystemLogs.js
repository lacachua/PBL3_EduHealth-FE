import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { adaptSystemLogDetailResponse, adaptSystemLogsResponse } from '../adapters/systemLogsAdapter';
import { getSystemLogDetailApi, getSystemLogsApi } from '../services/systemLogsApi';

export const SYSTEM_LOGS_DEFAULT_FILTERS = {
  keyword: '',
  fromDate: '',
  toDate: '',
  role: 'all',
};

const normalizeFilters = (nextFilters = {}) => ({
  ...SYSTEM_LOGS_DEFAULT_FILTERS,
  ...nextFilters,
});

export const useSystemLogs = () => {
  const [filters, setFilters] = useState(SYSTEM_LOGS_DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState({ rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const envelope = await getSystemLogsApi({
        page,
        pageSize: 10,
        ...filters,
      });
      setTableData(adaptSystemLogsResponse(envelope));
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      setTableData({ rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const onFiltersChange = (nextFilters) => {
    setFilters(normalizeFilters(nextFilters));
    setPage(1);
  };

  const onPageChange = (nextPage) => {
    setPage(nextPage);
  };

  const status = useMemo(() => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!tableData.rows.length) return 'empty';
    return 'success';
  }, [error, loading, tableData.rows.length]);

  return {
    filters,
    tableData,
    status,
    error,
    onFiltersChange,
    onPageChange,
    fetchList,
  };
};

/**
 * Hook to fetch a single system log detail from the API.
 * Used when the user clicks on a row in the table.
 */
export const useSystemLogDetail = () => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const openDetail = async (row) => {
    // Immediately show the drawer with row-level data from the list
    setSelectedLog(row || null);
    setDetailOpen(true);
    setDetailError('');

    if (!row?.id || row.id === '--') {
      setDetailLoading(false);
      return;
    }

    setDetailLoading(true);

    try {
      const envelope = await getSystemLogDetailApi(row.id);
      const detail = adaptSystemLogDetailResponse(envelope);
      if (detail) {
        setSelectedLog(detail);
      }
    } catch (apiError) {
      setDetailError(normalizeApiMessage(apiError));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailLoading(false);
    setDetailError('');
  };

  return {
    selectedLog,
    detailOpen,
    detailLoading,
    detailError,
    openDetail,
    closeDetail,
  };
};
