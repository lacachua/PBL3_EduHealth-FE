import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { adaptSystemLogsResponse } from '../adapters/systemLogsAdapter';
import { getSystemLogsApi } from '../services/systemLogsApi';

const initialFilters = { keyword: '', actor: '', module: 'all', action: 'all', timeRange: 'all' };

export const useSystemLogs = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState({ rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchList = useCallback(async (next = {}) => {
    setLoading(true);
    setError('');

    try {
      const envelope = await getSystemLogsApi({
        page: next.page || page,
        pageSize: 10,
        keyword: next.keyword ?? filters.keyword,
        actor: next.actor ?? filters.actor,
        module: next.module ?? filters.module,
        action: next.action ?? filters.action,
        timeRange: next.timeRange ?? filters.timeRange,
      });
      setTableData(adaptSystemLogsResponse(envelope));
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      setTableData({ rows: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [filters.action, filters.actor, filters.keyword, filters.module, filters.timeRange, page]);

  useEffect(() => {
    fetchList({ page: 1 });
  }, [fetchList]);

  const onFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
    fetchList({ ...nextFilters, page: 1 });
  };

  const onPageChange = (nextPage) => {
    setPage(nextPage);
    fetchList({ page: nextPage });
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
