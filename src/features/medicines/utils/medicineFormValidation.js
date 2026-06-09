export const toLocalDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTomorrowDateInputValue = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toLocalDateInputValue(tomorrow);
};

export const isFutureDateOnly = (value) => {
  if (!value) return false;
  return value > toLocalDateInputValue();
};

export const hasInitialBatchData = (form) => {
  return Boolean(
    String(form.initialQuantity ?? '').trim()
    || String(form.expiryDate ?? '').trim()
    || String(form.batchNumber ?? '').trim(),
  );
};
