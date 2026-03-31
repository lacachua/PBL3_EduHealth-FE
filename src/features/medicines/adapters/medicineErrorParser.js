import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';

export const parseMedicinesApiError = (error) => {
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
      message: 'Bạn không có quyền truy cập module giám sát thuốc.',
    };
  }

  return {
    status,
    type: 'error',
    message: normalizeApiMessage(error),
  };
};
