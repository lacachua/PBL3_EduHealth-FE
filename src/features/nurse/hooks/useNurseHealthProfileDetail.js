import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  mapApiFieldErrors,
  normalizeApiMessage,
} from '../../../shared/api/normalizeResponse';
import { resolveNurseStudentRouteId } from '../adapters/nurseStudentIdentifierAdapter';
import {
  buildNurseHealthProfileUpdatePayload,
  buildNurseHealthProfileViewModel,
} from '../adapters/nurseHealthProfileAdapter';
import {
  getNurseAllergyTypesApi,
  getNurseStudentDetailApi,
  getNurseStudentHealthHistoryApi,
  getNurseStudentHealthProfileApi,
  getNurseStudentVaccinationsApi,
  getNurseStudentsLookupApi,
  updateNurseStudentHealthProfileApi,
} from '../services/nurseStudentsApi';

const autoDismissMs = 2800;

const createEmptyEnvelope = () => ({
  success: false,
  message: '',
  data: null,
  errors: null,
  meta: null,
});

const resolveLookupStudentId = async () => {
  const envelope = await getNurseStudentsLookupApi({ page: 1, pageSize: 1 });
  const items = Array.isArray(envelope?.data)
    ? envelope.data
    : Array.isArray(envelope?.data?.items)
      ? envelope.data.items
      : [];

  const first = items[0];
  return resolveNurseStudentRouteId(first?.userId, first?.id);
};

export const useNurseHealthProfileDetail = ({
  initialStudentId,
  initialTab = 'overview',
  initialHealthEditOpen = false,
}) => {
  const [resolvedStudentId, setResolvedStudentId] = useState(resolveNurseStudentRouteId(initialStudentId));
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [model, setModel] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [healthEditOpen, setHealthEditOpen] = useState(Boolean(initialHealthEditOpen));
  const [healthSaving, setHealthSaving] = useState(false);
  const [healthFieldErrors, setHealthFieldErrors] = useState({});
  const [allergyTypeOptions, setAllergyTypeOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const feedbackTimerRef = useRef(null);

  const showFeedback = useCallback((message, type = 'success') => {
    setFeedback({ message, type });
    window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), autoDismissMs);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(feedbackTimerRef.current);
  }, []);

  const fetchAllergyTypeOptions = useCallback(async () => {
    try {
      const envelope = await getNurseAllergyTypesApi();
      const source = Array.isArray(envelope?.data)
        ? envelope.data
        : [];

      const mapped = source
        .filter((item) => Number.isFinite(Number(item?.allergyId)) && Number(item.allergyId) > 0)
        .map((item) => {
          const allergyId = Number(item.allergyId);
          const allergyTypeId = item.allergyTypeId || `ALG${String(allergyId).padStart(3, '0')}`;
          const allergyTypeName = item.allergyTypeName || `Dị ứng #${allergyId}`;

          return {
            allergyId,
            allergyTypeId,
            allergyTypeName,
            severity: item.severity || '',
            label: `${allergyTypeName} (${allergyTypeId})`,
          };
        });

      setAllergyTypeOptions(mapped);
    } catch {
      setAllergyTypeOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchAllergyTypeOptions().catch(() => {
      setAllergyTypeOptions([]);
    });
  }, [fetchAllergyTypeOptions]);

  const fetchProfile = useCallback(async (requestedStudentId) => {
    setStatus('loading');
    setError('');

    let targetStudentId = resolveNurseStudentRouteId(requestedStudentId, resolvedStudentId);

    if (!targetStudentId) {
      try {
        targetStudentId = await resolveLookupStudentId();
      } catch {
        targetStudentId = null;
      }
    }

    if (!targetStudentId) {
      setResolvedStudentId(null);
      setModel(null);
      setSyncMessage('');
      setStatus('empty');
      return;
    }

    setResolvedStudentId(targetStudentId);

    const [detailResult, profileResult, historyResult, vaccinationResult] = await Promise.allSettled([
      getNurseStudentDetailApi(targetStudentId),
      getNurseStudentHealthProfileApi(targetStudentId),
      getNurseStudentHealthHistoryApi(targetStudentId, { page: 1, pageSize: 10 }),
      getNurseStudentVaccinationsApi(targetStudentId),
    ]);

    const detailEnvelope = detailResult.status === 'fulfilled'
      ? detailResult.value
      : createEmptyEnvelope();

    const profileEnvelope = profileResult.status === 'fulfilled'
      ? profileResult.value
      : createEmptyEnvelope();

    const historyEnvelope = historyResult.status === 'fulfilled'
      ? historyResult.value
      : createEmptyEnvelope();

    const vaccinationEnvelope = vaccinationResult.status === 'fulfilled'
      ? vaccinationResult.value
      : createEmptyEnvelope();

    const allFailed = detailResult.status === 'rejected'
      && profileResult.status === 'rejected'
      && historyResult.status === 'rejected';

    if (allFailed) {
      setSyncMessage('');
      setModel(null);
      setError('Không thể đồng bộ hồ sơ sức khỏe từ máy chủ. Vui lòng thử lại.');
      setStatus('error');
      return;
    } else if (
      detailResult.status === 'rejected'
      || profileResult.status === 'rejected'
      || historyResult.status === 'rejected'
      || vaccinationResult.status === 'rejected'
    ) {
      setSyncMessage('Một phần dữ liệu chưa đồng bộ kịp thời. Vui lòng kiểm tra lại kết nối để lấy đủ hồ sơ mới nhất.');
    } else {
      setSyncMessage('');
    }

    const viewModel = buildNurseHealthProfileViewModel({
      studentId: targetStudentId,
      detailEnvelope,
      profileEnvelope,
      healthHistoryEnvelope: historyEnvelope,
      vaccinationEnvelope,
    });

    setModel(viewModel);
    setStatus('success');
  }, [resolvedStudentId]);

  useEffect(() => {
    fetchProfile(resolveNurseStudentRouteId(initialStudentId)).catch((apiError) => {
      setStatus('error');
      setError(normalizeApiMessage(apiError));
    });
  }, [fetchProfile, initialStudentId]);

  const refreshProfile = useCallback(async () => {
    try {
      await fetchProfile(resolvedStudentId);
    } catch (apiError) {
      setStatus('error');
      setError(normalizeApiMessage(apiError));
    }
  }, [fetchProfile, resolvedStudentId]);

  const updateHealthProfile = useCallback(async (values) => {
    if (!resolvedStudentId) {
      return false;
    }

    setHealthSaving(true);
    setHealthFieldErrors({});

    try {
      const payload = buildNurseHealthProfileUpdatePayload(values);
      await updateNurseStudentHealthProfileApi(resolvedStudentId, payload);
      showFeedback('Đã cập nhật hồ sơ sức khỏe học sinh.', 'success');
      await fetchProfile(resolvedStudentId);
      return true;
    } catch (apiError) {
      const mappedErrors = mapApiFieldErrors(apiError);
      if (Object.keys(mappedErrors).length) {
        setHealthFieldErrors(mappedErrors);
      }
      showFeedback(normalizeApiMessage(apiError), 'error');
      throw apiError;
    } finally {
      setHealthSaving(false);
    }
  }, [fetchProfile, resolvedStudentId, showFeedback]);

  const tabs = useMemo(() => ([
    { id: 'overview', label: 'Tổng quan' },
    { id: 'alerts', label: 'Dị ứng & Bệnh nền' },
    { id: 'health-history', label: 'Lịch sử khám' },
    { id: 'medication-history', label: 'Lịch sử dùng thuốc' },
    { id: 'vaccinations', label: 'Tiêm chủng' },
  ]), []);

  return {
    status,
    error,
    syncMessage,
    model,
    tabs,
    activeTab,
    setActiveTab,
    healthEditOpen,
    setHealthEditOpen,
    healthSaving,
    healthFieldErrors,
    allergyTypeOptions,
    feedback,
    clearFeedback: () => setFeedback(null),
    refreshProfile,
    updateHealthProfile,
  };
};
