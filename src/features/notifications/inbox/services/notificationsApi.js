import { apiPatchEnvelope, apiPostEnvelope } from '../../../../shared/api/apiClient';

const ENDPOINTS = Object.freeze({
  previewRecipients: '/api/v1/notifications/recipients/preview',
  create: '/api/v1/notifications',
  markRead: (notificationId) => `/api/v1/notifications/${notificationId}/read`,
});

export const notificationsApi = {
  previewRecipients: (payload) => apiPostEnvelope(ENDPOINTS.previewRecipients, payload),
  create: (payload) => apiPostEnvelope(ENDPOINTS.create, payload),
  markRead: (notificationId) => apiPatchEnvelope(ENDPOINTS.markRead(notificationId), {}),
};
