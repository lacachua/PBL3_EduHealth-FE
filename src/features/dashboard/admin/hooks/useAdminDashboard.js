import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
import { adaptAdminDashboardEnvelope } from '../adapters/adminDashboardAdapter';
import { fetchAdminDashboardOverview, fetchRecentActivities } from '../services/adminDashboardApi';
import { subscribeMedicineInventoryChanged } from '../../../medicines/services/medicineInventoryEvents';

export const useAdminDashboard = (initialQuery) => {
  const initialQueryRef = useRef(initialQuery ?? {});
  const fallbackData = useMemo(() => adaptAdminDashboardEnvelope(null, []), []);

  const [dashboardData, setDashboardData] = useState(fallbackData);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDashboard = useCallback(async (nextQuery) => {
    const query = nextQuery ?? initialQueryRef.current;

    setLoading(true);
    setErrorMessage('');

    try {
      // Fetch both overview and recent activities in parallel
      const [envelope, activitiesEnvelope] = await Promise.all([
        fetchAdminDashboardOverview(query),
        fetchRecentActivities(4),
      ]);

      const viewModel = adaptAdminDashboardEnvelope(envelope, activitiesEnvelope);
      setDashboardData(viewModel);
      return viewModel;
    } catch (apiError) {
      setErrorMessage(normalizeApiMessage(apiError));
      setDashboardData((prev) => prev || fallbackData);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fallbackData]);

  useEffect(() => {
    fetchDashboard(initialQueryRef.current);
  }, [fetchDashboard]);

  useEffect(() => subscribeMedicineInventoryChanged(() => {
    fetchDashboard();
  }), [fetchDashboard]);

  const status = useMemo(() => {
    if (loading) return 'loading';
    if (errorMessage) return 'error';
    return 'success';
  }, [errorMessage, loading]);

  return {
    dashboardData,
    error: errorMessage,
    status,
    fetchDashboard,
  };
};
