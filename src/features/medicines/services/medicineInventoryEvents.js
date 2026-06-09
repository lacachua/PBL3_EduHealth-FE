export const MEDICINE_INVENTORY_CHANGED_EVENT = 'eduhealth:medicine-inventory-changed';

export const notifyMedicineInventoryChanged = (detail = {}) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(MEDICINE_INVENTORY_CHANGED_EVENT, { detail }));
};

export const subscribeMedicineInventoryChanged = (listener) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(MEDICINE_INVENTORY_CHANGED_EVENT, listener);
  return () => window.removeEventListener(MEDICINE_INVENTORY_CHANGED_EVENT, listener);
};
