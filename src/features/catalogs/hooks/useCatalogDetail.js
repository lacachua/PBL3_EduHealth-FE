import { useState } from 'react';
import { parseCatalogApiError } from '../adapters/catalogErrorParser';
import { mapCatalogDetailResponse } from '../adapters/catalogResponseMapper';
import { getCatalogDetailApi } from '../services/catalogsApi';

export const useCatalogDetail = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [accessState, setAccessState] = useState('ok');

  const openDetail = async (row, options = {}) => {
    setSelectedItem(row || null);
    setDetailOpen(true);
    setDetailLoading(Boolean(row?.id));
    setDetailError('');
    setAccessState('ok');

    if (!row?.id) {
      setDetailLoading(false);
      return;
    }

    try {
      const response = await getCatalogDetailApi(row.id);
      const detail = mapCatalogDetailResponse(response, options.group);
      if (detail) {
        setSelectedItem(detail);
      }
    } catch (apiError) {
      const parsedError = parseCatalogApiError(apiError);
      setAccessState(parsedError.type === 'forbidden' ? 'forbidden' : parsedError.type === 'unauthorized' ? 'unauthorized' : 'ok');
      setDetailError(parsedError.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailLoading(false);
    setDetailError('');
    setAccessState('ok');
  };

  return {
    selectedItem,
    detailOpen,
    detailLoading,
    detailError,
    accessState,
    openDetail,
    closeDetail,
  };
};
