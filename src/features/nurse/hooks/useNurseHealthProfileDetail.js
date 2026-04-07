import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  mapApiFieldErrors,
  normalizeApiMessage,
} from '../../../shared/api/normalizeResponse';
import { runtimeConfig } from '../../../shared/config/runtimeConfig';
import { getExaminations } from '../../examinations/services/getExaminations';
import { resolveNurseStudentRouteId } from '../adapters/nurseStudentIdentifierAdapter';
import {
  buildNurseHealthProfileUpdatePayload,
  buildNurseHealthProfileViewModel,
} from '../adapters/nurseHealthProfileAdapter';
import {
  getNurseHealthExaminationMockEnvelope,
  getNurseHealthHistoryMockEnvelope,
  getNurseHealthProfileMockEnvelope,
  getNurseHealthStudentDetailMockEnvelope,
} from '../mocks/nurseHealthProfileDetailMock';
import {
  getNurseStudentDetailApi,
  getNurseStudentHealthHistoryApi,
  getNurseStudentHealthProfileApi,
  getNurseStudentsLookupApi,
  updateNurseStudentHealthProfileApi,
} from '../services/nurseStudentsApi';

const autoDismissMs = 2800;

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

const getProfileStudentCode = (profileEnvelope) => {
  const data = profileEnvelope?.data || null;
  if (!data || typeof data !== 'object') {
    return '';
  }

  return data.studentId || data.studentCode || '';
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

    if (runtimeConfig.enableMockAdminDashboard) {
      const detailEnvelope = getNurseHealthStudentDetailMockEnvelope(targetStudentId);
      const profileEnvelope = getNurseHealthProfileMockEnvelope(targetStudentId);
      const historyEnvelope = getNurseHealthHistoryMockEnvelope(targetStudentId, { page: 1, pageSize: 10 });
      const examEnvelope = getNurseHealthExaminationMockEnvelope(targetStudentId);

      const viewModel = buildNurseHealthProfileViewModel({
        studentId: targetStudentId,
        detailEnvelope,
        profileEnvelope,
        healthHistoryEnvelope: historyEnvelope,
        examinationEnvelope: examEnvelope,
      });

      setModel(viewModel);
      setSyncMessage('Đang hiển thị dữ liệu mẫu để tiếp tục hoàn thiện giao diện nghiệp vụ y tế học đường.');
      setStatus('success');
      return;
    }

    const [detailResult, profileResult, historyResult] = await Promise.allSettled([
      getNurseStudentDetailApi(targetStudentId),
      getNurseStudentHealthProfileApi(targetStudentId),
      getNurseStudentHealthHistoryApi(targetStudentId, { page: 1, pageSize: 10 }),
    ]);

    const detailEnvelope = detailResult.status === 'fulfilled'
      ? detailResult.value
      : getNurseHealthStudentDetailMockEnvelope(targetStudentId);

    const profileEnvelope = profileResult.status === 'fulfilled'
      ? profileResult.value
      : getNurseHealthProfileMockEnvelope(targetStudentId);

    const historyEnvelope = historyResult.status === 'fulfilled'
      ? historyResult.value
      : getNurseHealthHistoryMockEnvelope(targetStudentId, { page: 1, pageSize: 10 });

    const profileStudentCode = getProfileStudentCode(profileEnvelope);

    let examinationEnvelope = getNurseHealthExaminationMockEnvelope(targetStudentId);
    if (profileStudentCode) {
      try {
        examinationEnvelope = await getExaminations({
          studentId: profileStudentCode,
          page: 1,
          pageSize: 8,
        });
      } catch {
        examinationEnvelope = getNurseHealthExaminationMockEnvelope(targetStudentId);
      }
    }

    const allFailed = detailResult.status === 'rejected'
      && profileResult.status === 'rejected'
      && historyResult.status === 'rejected';

    if (allFailed) {
      setSyncMessage('Không thể đồng bộ đầy đủ dữ liệu từ máy chủ. Đang hiển thị bộ dữ liệu gần nhất để tiếp tục theo dõi.');
    } else if (detailResult.status === 'rejected' || profileResult.status === 'rejected' || historyResult.status === 'rejected') {
      setSyncMessage('Một phần dữ liệu chưa đồng bộ kịp thời. Hệ thống đã bổ sung dữ liệu dự phòng để giữ liền mạch nghiệp vụ.');
    } else {
      setSyncMessage('');
    }

    const viewModel = buildNurseHealthProfileViewModel({
      studentId: targetStudentId,
      detailEnvelope,
      profileEnvelope,
      healthHistoryEnvelope: historyEnvelope,
      examinationEnvelope,
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

    if (runtimeConfig.enableMockAdminDashboard) {
      showFeedback('Cập nhật thành công trên chế độ dữ liệu mẫu.', 'success');
      await fetchProfile(resolvedStudentId);
      return true;
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
    feedback,
    clearFeedback: () => setFeedback(null),
    refreshProfile,
    updateHealthProfile,
  };
};
