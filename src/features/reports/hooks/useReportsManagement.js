import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { adaptReportsManagementResponse } from '../adapters/reportsManagementAdapter';
import { exportReportApi, getReportsManagementApi } from '../services/reportsManagementApi';

const initialFilters = {
  reportType: 'all',
  range: 'week',
  scope: 'all',
};

export const useReportsManagement = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchList = useCallback(async (nextFilters = filters) => {
    setLoading(true);
    setError('');

    try {
      const envelope = await getReportsManagementApi(nextFilters);
      const model = adaptReportsManagementResponse(envelope);
      setRows(model.rows);
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchList(filters);
  }, [fetchList, filters]);

  const onFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
  };

  const exportReports = async (format) => {
    setExporting(true);
    try {
      await exportReportApi({ ...filters, format });
    } finally {
      setExporting(false);
    }
  };

  const status = useMemo(() => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!rows.length) return 'empty';
    return 'success';
  }, [error, loading, rows.length]);

  return {
    filters,
    rows,
    status,
    error,
    exporting,
    onFiltersChange,
    exportReports,
    fetchList,
  };
};
