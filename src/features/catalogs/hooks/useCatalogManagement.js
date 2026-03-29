import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { adaptCatalogManagementResponse } from '../adapters/catalogManagementAdapter';
import {
  deleteCatalogItemApi,
  getCatalogManagementListApi,
  upsertCatalogItemApi,
} from '../services/catalogManagementApi';
import { CATALOG_PAGE_SIZE } from '../schemas/catalogManagementSchema';

const initialFilters = { keyword: '', status: 'all' };

export const useCatalogManagement = () => {
  const [group, setGroup] = useState('vaccines');
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState({ group: 'vaccines', rows: [], page: 1, pageSize: CATALOG_PAGE_SIZE, totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchList = useCallback(async (next = {}) => {
    setLoading(true);
    setError('');

    try {
      const envelope = await getCatalogManagementListApi({
        group: next.group || group,
        page: next.page || page,
        pageSize: CATALOG_PAGE_SIZE,
        keyword: next.keyword ?? filters.keyword,
        status: next.status ?? filters.status,
      });
      setTableData(adaptCatalogManagementResponse(envelope));
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      setTableData({ group, rows: [], page: 1, pageSize: CATALOG_PAGE_SIZE, totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [filters.keyword, filters.status, group, page]);

  useEffect(() => {
    fetchList({ group, page: 1 });
  }, [fetchList, group]);

  const onGroupChange = (nextGroup) => {
    setGroup(nextGroup);
    setPage(1);
    fetchList({ group: nextGroup, page: 1 });
  };

  const onFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
    fetchList({ ...nextFilters, page: 1 });
  };

  const onPageChange = (nextPage) => {
    setPage(nextPage);
    fetchList({ page: nextPage });
  };

  const saveItem = async (payload) => {
    setSubmitting(true);
    try {
      await upsertCatalogItemApi({ ...payload, group });
      await fetchList({ page });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (itemId) => {
    setSubmitting(true);
    try {
      await deleteCatalogItemApi(itemId);
      await fetchList({ page });
    } finally {
      setSubmitting(false);
    }
  };

  const status = useMemo(() => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!tableData.rows.length) return 'empty';
    return 'success';
  }, [error, loading, tableData.rows.length]);

  return {
    group,
    filters,
    tableData,
    status,
    error,
    submitting,
    onGroupChange,
    onFiltersChange,
    onPageChange,
    fetchList,
    saveItem,
    deleteItem,
  };
};
