import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';

export const parseMedicinesApiError = (error, options = {}) => {
  const forbiddenMessage = options.forbiddenMessage || 'Bạn không có quyền truy cập module giám sát thuốc.';
  const status = error?.response?.status || null;

  if (status === 401) {
    return {
      status,
      type: 'unauthorized',
      message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    };
  }

  if (status === 403) {
    return {
      status,
      type: 'forbidden',
      message: forbiddenMessage,
    };
  }

  return {
    status,
    type: 'error',
    message: normalizeApiMessage(error),
  };
};

export const parseNurseMedicineApiError = (error) => {
  return parseMedicinesApiError(error, {
    forbiddenMessage: 'Bạn không có quyền truy cập module Thuốc / Kho thuốc.',
  });
};
