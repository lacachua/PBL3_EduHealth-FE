import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
import { adaptNurseDashboardOverview } from '../adapters/nurseDashboardAdapter';
import { nurseDashboardRepository } from '../repositories/nurseDashboardRepository';
import { subscribeMedicineInventoryChanged } from '../../../medicines/services/medicineInventoryEvents';

export const useNurseDashboard = () => {
  const fallbackData = useMemo(() => adaptNurseDashboardOverview(null), []);

  const [dashboardData, setDashboardData] = useState(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const envelope = await nurseDashboardRepository.fetchOverview();
      const viewModel = adaptNurseDashboardOverview(envelope);
      setDashboardData(viewModel);
      return viewModel;
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      setDashboardData((prev) => prev || fallbackData);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fallbackData]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => subscribeMedicineInventoryChanged(() => {
    fetchDashboard();
  }), [fetchDashboard]);

  const status = useMemo(() => {
    if (loading) {
      return 'loading';
    }

    if (error) {
      return 'error';
    }

    return 'success';
  }, [error, loading]);

  return {
    dashboardData,
    error,
    status,
    fetchDashboard,
  };
};
