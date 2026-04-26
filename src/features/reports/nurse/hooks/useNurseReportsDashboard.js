import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
import { createNurseReportFilters } from '../config/nurseReportFilterOptions';
import {
  adaptNurseReportsDashboardResponse,
  createEmptyNurseReportsViewModel,
} from '../adapters/nurseReportsAdapter';
import { nurseReportsRepository } from '../repositories/nurseReportsRepository';

export const useNurseReportsDashboard = () => {
  const fallbackViewModel = useMemo(() => createEmptyNurseReportsViewModel(), []);

  const [filters, setFilters] = useState(() => createNurseReportFilters());
  const [viewModel, setViewModel] = useState(fallbackViewModel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchDashboard = useCallback(async (nextFilters = filters) => {
    setLoading(true);
    setError('');

    try {
      const response = await nurseReportsRepository.getDashboard(nextFilters);
      const mapped = adaptNurseReportsDashboardResponse(response);
      setViewModel(mapped);
      setHasLoaded(true);
      return mapped;
    } catch (apiError) {
      const message = normalizeApiMessage(apiError, 'Không thể tải báo cáo y tế tổng hợp.');
      setError(message);
      setViewModel(fallbackViewModel);
      setHasLoaded(true);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fallbackViewModel, filters]);

  useEffect(() => {
    fetchDashboard(filters);
  }, [fetchDashboard, filters]);

  const applyFilters = useCallback((nextFilters) => {
    setFilters((previous) => ({
      ...previous,
      ...nextFilters,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(createNurseReportFilters());
  }, []);

  const status = useMemo(() => {
    if (loading && !hasLoaded) {
      return 'loading';
    }

    if (error) {
      return 'error';
    }

    return 'success';
  }, [error, hasLoaded, loading]);

  return {
    filters,
    viewModel,
    loading,
    hasLoaded,
    error,
    status,
    applyFilters,
    resetFilters,
    fetchDashboard,
  };
};
