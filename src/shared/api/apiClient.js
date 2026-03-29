import axiosClient from './axiosClient';
import { normalizeApiEnvelope } from './normalizeResponse';

const createApiError = ({ message, status, field, errors, response }) => {
  const error = new Error(message || 'Request failed');
  error.name = 'ApiError';
  error.status = status || null;
  error.field = field || null;
  error.errors = errors || null;
  error.response = response || null;
  return error;
};

const assertSuccessEnvelope = (response, envelope) => {
  if (envelope.success === false) {
    throw createApiError({
      message: envelope.message,
      status: response?.status,
      errors: envelope.errors,
      field: response?.data?.field || null,
      response: {
        status: response?.status,
        data: response?.data,
      },
    });
  }
};

export const requestEnvelope = async ({
  method,
  url,
  data,
  params,
  responseType,
  headers,
}) => {
  const response = await axiosClient.request({
    method,
    url,
    data,
    params,
    responseType,
    headers,
  });

  if (responseType === 'blob' || responseType === 'arraybuffer') {
    return response.data;
  }

  const envelope = normalizeApiEnvelope(response);
  assertSuccessEnvelope(response, envelope);
  return envelope;
};

export const requestData = async (options) => {
  const envelope = await requestEnvelope(options);
  return envelope?.data;
};

export const apiGetEnvelope = (url, options = {}) => requestEnvelope({ method: 'get', url, ...options });
export const apiPostEnvelope = (url, data, options = {}) => requestEnvelope({ method: 'post', url, data, ...options });
export const apiPatchEnvelope = (url, data, options = {}) => requestEnvelope({ method: 'patch', url, data, ...options });
export const apiDeleteEnvelope = (url, options = {}) => requestEnvelope({ method: 'delete', url, ...options });

export const apiGetData = (url, options = {}) => requestData({ method: 'get', url, ...options });
export const apiPostData = (url, data, options = {}) => requestData({ method: 'post', url, data, ...options });
export const apiPatchData = (url, data, options = {}) => requestData({ method: 'patch', url, data, ...options });
