import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  normalizeApiMessage,
} from '../../../shared/api/normalizeResponse';
import {
  adaptStudentDetailResponse,
  adaptStudentHealthProfileResponse,
  adaptStudentManagementResponse,
} from '../adapters/studentManagementAdapter';
import {
  getStudentManagementDetailApi,
  getStudentHealthProfileApi,
  getStudentManagementListApi,
} from '../services/studentManagementApi';
import { userManagementRepository } from '../../users/repositories/userManagementRepository';
import { DATA_MODULES } from '../../../app/config/dataMode';
import {
  STUDENT_FILTER_DEFAULTS,
  STUDENT_PAGE_SIZE,
} from '../constants/studentManagementConstants';

const defaultTableData = {
  rows: [],
  page: 1,
  pageSize: STUDENT_PAGE_SIZE,
  totalItems: 0,
  totalPages: 1,
};

export const useStudentManagement = ({ autoFetch = true, moduleKey = DATA_MODULES.ADMIN_STUDENTS } = {}) => {
  const [filters, setFilters] = useState(STUDENT_FILTER_DEFAULTS);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState(defaultTableData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedHealthProfile, setSelectedHealthProfile] = useState(null);
  const [basicDetailLoading, setBasicDetailLoading] = useState(false);
  const [healthDetailLoading, setHealthDetailLoading] = useState(false);
  const [basicDetailError, setBasicDetailError] = useState('');
  const [healthDetailError, setHealthDetailError] = useState('');
  const [basicSyncMessage, setBasicSyncMessage] = useState('');
  const [healthSyncMessage, setHealthSyncMessage] = useState('');

  const selectedStudentRef = useRef(selectedStudent);
  const selectedHealthProfileRef = useRef(selectedHealthProfile);

  useEffect(() => {
    selectedStudentRef.current = selectedStudent;
  }, [selectedStudent]);

  useEffect(() => {
    selectedHealthProfileRef.current = selectedHealthProfile;
  }, [selectedHealthProfile]);

  const fetchList = useCallback(async (next = {}) => {
    setLoading(true);
    setError('');

    const query = {
      page: next.page || page,
      pageSize: STUDENT_PAGE_SIZE,
      keyword: next.keyword ?? filters.keyword,
      classId: next.classId ?? filters.classId,
      status: next.status ?? filters.status,
    };

    try {
      const envelope = await getStudentManagementListApi(query, {
        moduleKey,
      });
      setTableData(adaptStudentManagementResponse(envelope));
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      setTableData(defaultTableData);
    } finally {
      setLoading(false);
    }
  }, [filters.classId, filters.keyword, filters.status, moduleKey, page]);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    fetchList({ page: 1 });
  }, [autoFetch, fetchList]);

  const onFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
    if (autoFetch) {
      fetchList({ ...nextFilters, page: 1 });
    }
  };

  const onPageChange = (nextPage) => {
    setPage(nextPage);
    if (autoFetch) {
      fetchList({ page: nextPage });
    }
  };

  const fetchBasicDetail = useCallback(async (studentId, fallbackStudent = null) => {
    setBasicDetailLoading(true);
    setBasicDetailError('');
    setBasicSyncMessage('');

    try {
      const envelope = await getStudentManagementDetailApi(studentId, { moduleKey });
      const detail = adaptStudentDetailResponse(envelope);
      setSelectedStudent(detail);
      return detail;
    } catch (apiError) {
      const currentSelected = selectedStudentRef.current;
      const hasFallback = Boolean((currentSelected && (currentSelected.apiId === studentId || currentSelected.id === studentId)) || fallbackStudent);
      
      if (hasFallback) {
        setSelectedStudent((prev) => {
          if (prev && (prev.apiId === studentId || prev.id === studentId)) {
            return prev;
          }
          return fallbackStudent || prev;
        });
        setBasicSyncMessage('Không thể đồng bộ dữ liệu mới từ máy chủ. Đang hiển thị dữ liệu gần nhất.');
        return fallbackStudent || currentSelected;
      }

      setBasicDetailError(normalizeApiMessage(apiError));
      setSelectedStudent(null);
      return null;
    } finally {
      setBasicDetailLoading(false);
    }
  }, [moduleKey]);

  const fetchHealthProfile = useCallback(async (studentId, fallbackProfile = null) => {
    setHealthDetailLoading(true);
    setHealthDetailError('');
    setHealthSyncMessage('');

    try {
      const envelope = await getStudentHealthProfileApi(studentId, { moduleKey });
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
  }, [moduleKey]);

  const fetchStudentDetail = useCallback(async (studentId, fallbackStudent = null) => {
    const basic = await fetchBasicDetail(studentId, fallbackStudent);
    
    const currentSelected = selectedStudentRef.current;
    const currentProfile = selectedHealthProfileRef.current;
    
    const fallbackProfile = (currentSelected?.apiId === studentId || currentSelected?.id === studentId) 
      ? currentProfile 
      : null;
      
    await fetchHealthProfile(studentId, fallbackProfile);
    return basic;
  }, [fetchBasicDetail, fetchHealthProfile]);

  const toggleStatus = async (userRow, reason) => {
    if (!userRow?.userId) {
      throw new Error('Tài khoản học sinh chưa có userId hợp lệ.');
    }

    const payload = {
      status: userRow.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE',
      ...(reason?.trim() ? { reason: reason.trim() } : {}),
    };

    return userManagementRepository.toggleUserStatus(userRow.userId, payload);
  };

  const resetPassword = async (userRow, payload) => {
    if (!userRow?.userId) {
      throw new Error('Tài khoản học sinh chưa có userId hợp lệ.');
    }
    return userManagementRepository.resetUserPassword(userRow.userId, payload);
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
    selectedStudent,
    selectedHealthProfile,
    basicDetailLoading,
    healthDetailLoading,
    basicDetailError,
    healthDetailError,
    basicSyncMessage,
    healthSyncMessage,
    onFiltersChange,
    onPageChange,
    fetchList,
    fetchStudentDetail,
    toggleStatus,
    resetPassword,
    setSelectedStudent,
    setSelectedHealthProfile,
  };
};
