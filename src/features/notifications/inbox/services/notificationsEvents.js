export const NOTIFICATIONS_CHANGED_EVENT = 'eduhealth:notifications-changed';

export const emitNotificationsChanged = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGED_EVENT));
};

export const subscribeNotificationsChanged = (callback) => {
  if (typeof window === 'undefined' || typeof callback !== 'function') {
    return () => {};
  }

  window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, callback);
  return () => window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, callback);
};
