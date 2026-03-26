import { useCallback, useMemo, useState } from "react";
import {
  createStudentApi,
  deleteStudentApi,
  getStudentByIdApi,
  getStudentsApi,
  updateStudentApi,
} from "../services/studentsApi";
import { normalizeApiMessage } from "../../../shared/api/normalizeResponse";

export const useStudents = (initialQuery = {}) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = useCallback(
    async (nextQuery = initialQuery) => {
      setLoading(true);
      setError("");

      try {
        const data = await getStudentsApi(nextQuery);
        setStudents(Array.isArray(data) ? data : []);
      } catch (apiError) {
        setError(normalizeApiMessage(apiError));
        setStudents([]);
      } finally {
        setLoading(false);
      }
    },
    [initialQuery]
  );

  const fetchStudentById = useCallback(async (studentId) => {
    setLoading(true);
    setError("");

    try {
      const data = await getStudentByIdApi(studentId);
      setSelectedStudent(data || null);
      return data;
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      setSelectedStudent(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (payload) => {
    setSubmitting(true);
    setError("");

    try {
      const createdStudent = await createStudentApi(payload);
      setStudents((prev) => [createdStudent, ...prev]);
      return createdStudent;
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      throw apiError;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updateStudent = useCallback(async (studentId, payload) => {
    setSubmitting(true);
    setError("");

    try {
      const updatedStudent = await updateStudentApi(studentId, payload);

      setStudents((prev) =>
        prev.map((student) => (student?.id === studentId ? updatedStudent : student))
      );

      setSelectedStudent((prev) => (prev?.id === studentId ? updatedStudent : prev));

      return updatedStudent;
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      throw apiError;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const deleteStudent = useCallback(async (studentId) => {
    setSubmitting(true);
    setError("");

    try {
      await deleteStudentApi(studentId);
      setStudents((prev) => prev.filter((student) => student?.id !== studentId));
      setSelectedStudent((prev) => (prev?.id === studentId ? null : prev));
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      throw apiError;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const status = useMemo(() => {
    if (loading) return "loading";
    if (error) return "error";
    if (!students.length) return "empty";
    return "success";
  }, [loading, error, students.length]);

  return {
    students,
    selectedStudent,
    loading,
    submitting,
    error,
    status,
    fetchStudents,
    fetchStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    clearError: () => setError(""),
  };
};
