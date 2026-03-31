import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiEnvelope, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { adaptAdminReportsDashboardResponse } from '../adapters/adminReportsAdapter';
import {
  exportAdminReportsApi,
  getAdminClassDetailApi,
  getAdminReportsDashboardApi,
  saveAdminClassDirectiveApi,
} from '../services/adminReportsApi';

const triggerBlobDownload = ({ blob, filename }) => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
};

const triggerUrlDownload = ({ url, filename }) => {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  if (filename) {
    anchor.download = filename;
  }
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

const createDefaultModel = () => ({
  header: null,
  filterOptions: null,
  summaryCards: [],
  chartData: [],
  classRows: [],
  sidePanel: {
    highPriorityAlerts: [],
    lowSupplies: [],
    lowVaccinationCoverage: [],
  },
  classDetails: {},
});

export const useAdminReportsDashboard = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);
  const [dashboard, setDashboard] = useState(createDefaultModel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [savingDirective, setSavingDirective] = useState(false);

  const fetchDashboard = useCallback(async (nextFilters = filters) => {
    setLoading(true);
    setError('');

    try {
      const response = await getAdminReportsDashboardApi(nextFilters);
      const model = adaptAdminReportsDashboardResponse(response);
      setDashboard(model);
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      setDashboard(createDefaultModel());
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboard(filters);
  }, [fetchDashboard, filters]);

  const applyFilters = (nextFilters) => {
    setFilters(nextFilters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const exportReports = async (format) => {
    setExporting(true);
    try {
      const result = await exportAdminReportsApi({ filters, format });

      if (result?.mode === 'blob' && result.blob) {
        triggerBlobDownload({
          blob: result.blob,
          filename: result.filename || `admin-report.${format}`,
        });
      }

      if (result?.mode === 'url' && result.downloadUrl) {
        triggerUrlDownload({
          url: result.downloadUrl,
          filename: result.filename,
        });
      }
    } finally {
      setExporting(false);
    }
  };

  const saveDirective = async ({ classId, note }) => {
    setSavingDirective(true);
    try {
      return await saveAdminClassDirectiveApi({ classId, note, filters });
    } finally {
      setSavingDirective(false);
    }
  };

  const fetchClassDetail = async (classId) => {
    const response = await getAdminClassDetailApi({ classId, filters });
    const envelope = normalizeApiEnvelope(response);
    return envelope.data?.detail || null;
  };

  const status = useMemo(() => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!dashboard.classRows.length) return 'empty';
    return 'success';
  }, [dashboard.classRows.length, error, loading]);

  return {
    filters,
    dashboard,
    loading,
    error,
    status,
    exporting,
    savingDirective,
    applyFilters,
    resetFilters,
    fetchDashboard,
    exportReports,
    saveDirective,
    fetchClassDetail,
  };
};
