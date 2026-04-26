export const normalizeAccountStatus = (statusValue, isActive) => {
  if (statusValue === 'ACTIVE' || statusValue === 'Hoạt động' || isActive === true) {
    return 'ACTIVE';
  }
  if (statusValue === 'LOCKED' || statusValue === 'INACTIVE' || statusValue === 'Đã khóa' || isActive === false) {
    return 'LOCKED';
  }
  return 'ACTIVE';
};
