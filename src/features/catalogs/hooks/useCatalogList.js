import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseCatalogApiError } from '../adapters/catalogErrorParser';
import { mapCatalogGroupsResponse, mapCatalogListResponse } from '../adapters/catalogResponseMapper';
import { getCatalogGroupsApi, getCatalogListApi } from '../services/catalogsApi';
import { CATALOG_GROUPS } from '../schemas/catalogManagementSchema';

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
  const [groups, setGroups] = useState(CATALOG_GROUPS);
  const [group, setGroup] = useState('vaccines');
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState(defaultTableData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessState, setAccessState] = useState('ok');

  // Fetch catalog groups from API once on mount
  useEffect(() => {
    let cancelled = false;

    const fetchGroups = async () => {
      try {
        const response = await getCatalogGroupsApi();
        const mapped = mapCatalogGroupsResponse(response);
        if (!cancelled && mapped && mapped.length > 0) {
          setGroups(mapped);
          // If current group isn't in the fetched groups, switch to the first one
          if (!mapped.some((g) => g.value === group)) {
            setGroup(mapped[0].value);
          }
        }
      } catch {
        // If groups fetch fails, keep using the static fallback
      }
    };

    fetchGroups();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      setTableData(mapCatalogListResponse(response, group));
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
    groups,
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
