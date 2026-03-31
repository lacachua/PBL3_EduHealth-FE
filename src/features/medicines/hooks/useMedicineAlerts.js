import { useCallback, useEffect, useState } from 'react';
import { parseMedicinesApiError } from '../adapters/medicineErrorParser';
import { mapMedicineAlertsResponse } from '../adapters/medicineResponseMapper';
import { getMedicineAlertsApi } from '../services/medicinesApi';

const defaultAlerts = {
  alerts: [],
  summary: {
    lowStockCount: 0,
    expiringCount: 0,
    totalAlerts: 0,
  },
};

export const useMedicineAlerts = () => {
  const [alertsData, setAlertsData] = useState(defaultAlerts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getMedicineAlertsApi({ type: 'ALL' });
      setAlertsData(mapMedicineAlertsResponse(response));
    } catch (apiError) {
      const parsedError = parseMedicinesApiError(apiError);
      setError(parsedError.message);
      setAlertsData(defaultAlerts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alertsData,
    loading,
    error,
    fetchAlerts,
  };
};
