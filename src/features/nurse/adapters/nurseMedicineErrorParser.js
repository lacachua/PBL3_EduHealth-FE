import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';

export const parseNurseMedicineApiError = (error) => {
  const status = Number(error?.response?.status || 0);

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
      message: 'Bạn không có quyền truy cập module Thuốc / Kho thuốc.',
    };
  }

  return {
    status,
    type: 'error',
    message: normalizeApiMessage(error),
  };
};
