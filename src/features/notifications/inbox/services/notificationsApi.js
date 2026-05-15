import { apiGetEnvelope, apiPatchEnvelope, apiPostEnvelope } from '../../../../shared/api/apiClient';

const ENDPOINTS = Object.freeze({
  list: '/api/v1/notifications',
  sent: '/api/v1/notifications/sent',
  previewRecipients: '/api/v1/notifications/recipients/preview',
  create: '/api/v1/notifications',
  uploadImage: '/api/v1/notifications/upload-image',
  markRead: (notificationId) => `/api/v1/notifications/${notificationId}/read`,
  markAllRead: '/api/v1/notifications/read-all',
  publicList: '/api/v1/public/notifications',
  classes: '/api/v1/classes',
  diseases: '/api/v1/diseases',
  students: '/api/v1/students',
  users: '/api/v1/users',
});

const buildImageFormData = (fileOrFormData) => {
  if (!fileOrFormData) {
    return null;
  }

  if (fileOrFormData instanceof FormData) {
    return fileOrFormData;
  }

  const formData = new FormData();
  formData.append('file', fileOrFormData);
  return formData;
};

export const notificationsApi = {
  getList: (params) => apiGetEnvelope(ENDPOINTS.list, { params }),
  getSentList: (params) => apiGetEnvelope(ENDPOINTS.sent, { params }),
  getPublicList: (params) => apiGetEnvelope(ENDPOINTS.publicList, { params }),
  previewRecipients: (payload) => apiPostEnvelope(ENDPOINTS.previewRecipients, payload),
  create: (payload) => apiPostEnvelope(ENDPOINTS.create, payload),
  uploadImage: (fileOrFormData) => {
    const formData = buildImageFormData(fileOrFormData);
    if (!formData) {
      return Promise.reject(new Error('File ảnh không hợp lệ.'));
    }

    return apiPostEnvelope(ENDPOINTS.uploadImage, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  markRead: (notificationId) => apiPatchEnvelope(ENDPOINTS.markRead(notificationId), {}),
  markAllRead: () => apiPatchEnvelope(ENDPOINTS.markAllRead, {}),
  getClasses: () => apiGetEnvelope(ENDPOINTS.classes),
  getDiseases: () => apiGetEnvelope(ENDPOINTS.diseases),
  getStudents: (params) => apiGetEnvelope(ENDPOINTS.students, { params }),
  getUsers: (params) => apiGetEnvelope(ENDPOINTS.users, { params }),
};
