import { useEffect, useState } from 'react';
import { getStudentClassesApi } from '../services/classesApi';

export const useClassOptions = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const envelope = await getStudentClassesApi({ page: 1, pageSize: 100 });
        if (!mounted) return;

        const rows = Array.isArray(envelope?.data)
          ? envelope.data
          : Array.isArray(envelope?.data?.items)
            ? envelope.data.items
            : [];

        if (envelope?.success !== false) {
          if (rows.length === 0) {
            setError('Chưa có lớp để chọn.');
          } else {
            setClasses(rows.map((item) => ({
              ...item,
              classId: item.classId ?? item.id,
              className: item.className || item.name || '',
            })).filter((item) => item.classId != null));
          }
        } else {
          setError('Không thể tải danh sách lớp. Vui lòng thử lại.');
        }
      } catch (err) {
        if (mounted) {
          const status = err.response?.status || err.status;
          if (status === 404) {
            setError('Không tìm thấy API danh sách lớp. Vui lòng kiểm tra cấu hình hệ thống.');
          } else if (status === 403) {
            setError('Tài khoản chưa có quyền xem danh sách lớp.');
          } else {
            setError('Không thể tải danh sách lớp. Vui lòng thử lại.');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchClasses();

    return () => {
      mounted = false;
    };
  }, []);

  return { classes, loading, error };
};
