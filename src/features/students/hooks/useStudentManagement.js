import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  isNetworkError,
  mapApiFieldErrors,
  normalizeApiMessage,
} from '../../../shared/api/normalizeResponse';
import {
  adaptStudentDetailResponse,
  adaptStudentHealthProfileResponse,
  adaptStudentManagementResponse,
} from '../adapters/studentManagementAdapter';
import {
  createStudentManagementApi,
  deleteStudentManagementApi,
  getStudentManagementDetailApi,
  getStudentHealthProfileApi,
  getStudentManagementListApi,
  updateStudentManagementApi,
  updateStudentHealthProfileApi,
} from '../services/studentManagementApi';
import {
  buildStudentBasicPatchPayload,
  buildStudentHealthPatchPayload,
  STUDENT_FILTER_DEFAULTS,
  STUDENT_PAGE_SIZE,
  validateStudentBasicForm,
  validateStudentHealthForm,
} from '../schemas/studentManagementSchema';

const defaultTableData = {
  rows: [],
  page: 1,
  pageSize: STUDENT_PAGE_SIZE,
  totalItems: 0,
  totalPages: 1,
};

const autoDismissDelay = 2600;

export const useStudentManagement = () => {
  const [filters, setFilters] = useState(STUDENT_FILTER_DEFAULTS);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState(defaultTableData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedHealthProfile, setSelectedHealthProfile] = useState(null);
  const [detailStudentId, setDetailStudentId] = useState(null);
  const [basicDetailLoading, setBasicDetailLoading] = useState(false);
  const [healthDetailLoading, setHealthDetailLoading] = useState(false);
  const [basicDetailError, setBasicDetailError] = useState('');
  const [healthDetailError, setHealthDetailError] = useState('');
  const [basicSyncMessage, setBasicSyncMessage] = useState('');
  const [healthSyncMessage, setHealthSyncMessage] = useState('');
  const [basicFieldErrors, setBasicFieldErrors] = useState({});
  const [healthFieldErrors, setHealthFieldErrors] = useState({});
  const [basicSaving, setBasicSaving] = useState(false);
  const [healthSaving, setHealthSaving] = useState(false);
  const feedbackTimerRef = useRef(null);

  const showFeedback = useCallback((message, type = 'success') => {
    setFeedback({ message, type });

    window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, autoDismissDelay);
  }, []);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
    window.clearTimeout(feedbackTimerRef.current);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(feedbackTimerRef.current);
  }, []);

  const fetchList = useCallback(async (next = {}) => {
    setLoading(true);
    setError('');

    const query = {
      page: next.page || page,
      pageSize: STUDENT_PAGE_SIZE,
      keyword: next.keyword ?? filters.keyword,
      classId: next.classId ?? filters.classId,
      gender: next.gender ?? filters.gender,
      status: next.status ?? filters.status,
    };

    try {
      const envelope = await getStudentManagementListApi(query);
      setTableData(adaptStudentManagementResponse(envelope));
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      setTableData(defaultTableData);
    } finally {
      setLoading(false);
    }
  }, [filters.classId, filters.gender, filters.keyword, filters.status, page]);

  useEffect(() => {
    fetchList({ page: 1 });
  }, [fetchList]);

  const onFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
    fetchList({ ...nextFilters, page: 1 });
  };

  const onPageChange = (nextPage) => {
    setPage(nextPage);
    fetchList({ page: nextPage });
  };

  const createStudent = async (payload) => {
    setSubmitting(true);
    try {
      await createStudentManagementApi(payload);
      await fetchList({ page });
    } finally {
      setSubmitting(false);
    }
  };

  const updateStudent = async (studentId, payload) => {
    setSubmitting(true);
    try {
      await updateStudentManagementApi(studentId, payload);
      await fetchList({ page });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStudent = async (studentId) => {
    setSubmitting(true);
    try {
      await deleteStudentManagementApi(studentId);
      await fetchList({ page });
    } finally {
      setSubmitting(false);
    }
  };

  const fetchBasicDetail = async (studentId, fallbackStudent = null) => {
    setDetailStudentId(studentId);
    setBasicDetailLoading(true);
    setBasicDetailError('');
    setBasicSyncMessage('');

    try {
      const envelope = await getStudentManagementDetailApi(studentId);
      const detail = adaptStudentDetailResponse(envelope);
      setSelectedStudent(detail);
      return detail;
    } catch (apiError) {
      const hasFallback = Boolean((selectedStudent && selectedStudent.apiId === studentId) || fallbackStudent);
      if (hasFallback) {
        setSelectedStudent((prev) => {
          if (prev && prev.apiId === studentId) {
            return prev;
          }
          return fallbackStudent || prev;
        });
        setBasicSyncMessage('Không thể đồng bộ dữ liệu mới từ máy chủ. Đang hiển thị dữ liệu gần nhất.');
        return fallbackStudent || selectedStudent;
      }

      setBasicDetailError(normalizeApiMessage(apiError));
      setSelectedStudent(null);
      return null;
    } finally {
      setBasicDetailLoading(false);
    }
  };

  const fetchHealthProfile = async (studentId, fallbackProfile = null) => {
    setHealthDetailLoading(true);
    setHealthDetailError('');
    setHealthSyncMessage('');

    try {
      const envelope = await getStudentHealthProfileApi(studentId);
      const profile = adaptStudentHealthProfileResponse(envelope);
      setSelectedHealthProfile(profile);
      return profile;
    } catch (apiError) {
      const hasFallback = Boolean(fallbackProfile);
      if (hasFallback) {
        setSelectedHealthProfile((prev) => prev || fallbackProfile);
        setHealthSyncMessage('Chưa thể tải dữ liệu mới. Đang hiển thị dữ liệu gần nhất.');
        return fallbackProfile;
      }

      setHealthDetailError(normalizeApiMessage(apiError));
      setSelectedHealthProfile(null);
      return null;
    } finally {
      setHealthDetailLoading(false);
    }
  };

  const fetchStudentDetail = async (studentId, fallbackStudent = null) => {
    const basic = await fetchBasicDetail(studentId, fallbackStudent);
    const fallbackProfile = selectedStudent?.apiId === studentId ? selectedHealthProfile : null;
    await fetchHealthProfile(studentId, fallbackProfile);
    return basic;
  };

  const updateStudentBasic = async (studentId, values) => {
    const validationErrors = validateStudentBasicForm(values);
    setBasicFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      throw new Error(Object.values(validationErrors)[0]);
    }

    setBasicSaving(true);
    setBasicFieldErrors({});

    try {
      const payload = buildStudentBasicPatchPayload(values);
      await updateStudentManagementApi(studentId, payload);
      setSelectedStudent((prev) => (prev ? { ...prev, ...payload } : prev));
      showFeedback('Đã lưu thông tin cơ bản học sinh');
      await fetchList({ page });
      return true;
    } catch (apiError) {
      const mapped = mapApiFieldErrors(apiError);
      if (Object.keys(mapped).length) {
        setBasicFieldErrors(mapped);
      }

      if (isNetworkError(apiError)) {
        showFeedback('Không thể lưu thay đổi. Vui lòng kiểm tra kết nối hoặc thử lại.', 'error');
      } else {
        showFeedback(normalizeApiMessage(apiError), 'error');
      }
      throw apiError;
    } finally {
      setBasicSaving(false);
    }
  };

  const updateStudentHealth = async (studentId, values) => {
    const validationErrors = validateStudentHealthForm(values);
    setHealthFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      throw new Error(Object.values(validationErrors)[0]);
    }

    setHealthSaving(true);
    setHealthFieldErrors({});

    try {
      const payload = buildStudentHealthPatchPayload(values);
      await updateStudentHealthProfileApi(studentId, payload);
      setSelectedHealthProfile((prev) => ({ ...(prev || {}), ...payload }));
      showFeedback('Đã lưu thông tin sức khỏe');
      return true;
    } catch (apiError) {
      const mapped = mapApiFieldErrors(apiError);
      if (Object.keys(mapped).length) {
        setHealthFieldErrors(mapped);
      }

      if (isNetworkError(apiError)) {
        showFeedback('Không thể lưu thay đổi. Vui lòng kiểm tra kết nối hoặc thử lại.', 'error');
      } else {
        showFeedback(normalizeApiMessage(apiError), 'error');
      }
      throw apiError;
    } finally {
      setHealthSaving(false);
    }
  };

  const status = useMemo(() => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!tableData.rows.length) return 'empty';
    return 'success';
  }, [error, loading, tableData.rows.length]);

  return {
    filters,
    tableData,
    status,
    loading,
    error,
    submitting,
    feedback,
    selectedStudent,
    selectedHealthProfile,
    detailStudentId,
    basicDetailLoading,
    healthDetailLoading,
    basicDetailError,
    healthDetailError,
    basicSyncMessage,
    healthSyncMessage,
    basicFieldErrors,
    healthFieldErrors,
    basicSaving,
    healthSaving,
    onFiltersChange,
    onPageChange,
    fetchList,
    fetchStudentDetail,
    fetchHealthProfile,
    clearFeedback,
    setSelectedStudent,
    setSelectedHealthProfile,
    createStudent,
    updateStudent,
    updateStudentBasic,
    updateStudentHealth,
    deleteStudent,
  };
};
