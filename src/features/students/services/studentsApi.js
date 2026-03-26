import axiosClient from "../../../shared/api/axiosClient";
import { normalizeApiData } from "../../../shared/api/normalizeResponse";

const STUDENTS_ENDPOINT = "/students";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const getStudentsApi = async (params = {}) => {
  const query = buildQueryString(params);
  const response = await axiosClient.get(`${STUDENTS_ENDPOINT}${query}`);
  const normalizedData = normalizeApiData(response);

  if (Array.isArray(normalizedData)) {
    return normalizedData;
  }

  return normalizedData?.items || normalizedData?.students || [];
};

export const getStudentByIdApi = async (studentId) => {
  const response = await axiosClient.get(`${STUDENTS_ENDPOINT}/${studentId}`);
  return normalizeApiData(response);
};

export const createStudentApi = async (payload) => {
  const response = await axiosClient.post(STUDENTS_ENDPOINT, payload);
  return normalizeApiData(response);
};

export const updateStudentApi = async (studentId, payload) => {
  const response = await axiosClient.patch(`${STUDENTS_ENDPOINT}/${studentId}`, payload);
  return normalizeApiData(response);
};

export const deleteStudentApi = async (studentId) => {
  await axiosClient.delete(`${STUDENTS_ENDPOINT}/${studentId}`);
  return { success: true };
};
