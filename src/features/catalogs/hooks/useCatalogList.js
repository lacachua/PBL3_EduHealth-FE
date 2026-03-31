import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseCatalogApiError } from '../adapters/catalogErrorParser';
import { mapCatalogListResponse } from '../adapters/catalogResponseMapper';
import { getCatalogListApi } from '../services/catalogsApi';

const defaultFilters = {
  keyword: '',
  status: 'all',
};

const defaultTableData = {
  group: 'vaccines',
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

export const useCatalogList = () => {
  const [group, setGroup] = useState('vaccines');
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
      const response = await getCatalogListApi({
        page,
        pageSize: 10,
        keyword: filters.keyword,
        status: filters.status,
        group,
      });

      setTableData(mapCatalogListResponse(response));
    } catch (apiError) {
      const parsedError = parseCatalogApiError(apiError);
      setAccessState(parsedError.type === 'forbidden' ? 'forbidden' : parsedError.type === 'unauthorized' ? 'unauthorized' : 'ok');
      setError(parsedError.message);
      setTableData({ ...defaultTableData, group });
    } finally {
      setLoading(false);
    }
  }, [filters.keyword, filters.status, group, page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const onGroupChange = (nextGroup) => {
    setGroup(nextGroup);
    setPage(1);
  };

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
    group,
    filters,
    tableData,
    status,
    error,
    accessState,
    fetchList,
    onGroupChange,
    onFiltersChange,
    onResetFilters,
    onPageChange,
  };
};
