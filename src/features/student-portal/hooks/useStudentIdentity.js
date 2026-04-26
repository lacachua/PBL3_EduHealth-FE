import { useEffect, useMemo, useState } from 'react';
import { studentPortalService } from '../services/studentPortalService';

const resolveFallbackIdentity = (user) => ({
  fullName: user?.fullName || user?.name || 'Học sinh',
  className: 'Chưa cập nhật',
  studentCode: 'Chưa cập nhật',
  avatar: user?.avatar || user?.avatarUrl || '',
});

/**
 * Tách business logic fetch identity ra khỏi StudentLayout.
 * Layout chỉ nên quan tâm đến việc render, không nên fetch data trực tiếp.
 *
 * @param {object|null} user - user từ AuthContext
 * @returns {object} identity đã được merge giữa fallback và override từ API
 */
export const useStudentIdentity = (user) => {
  const fallback = useMemo(() => resolveFallbackIdentity(user), [user]);
  const [overrides, setOverrides] = useState(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const response = await studentPortalService.getIdentity();
        if (isActive && response?.data) {
          setOverrides(response.data);
        }
      } catch {
        // Giữ fallback khi API không khả dụng — không cần log noise
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  return useMemo(
    () => ({ ...fallback, ...(overrides ?? {}) }),
    [fallback, overrides]
  );
};