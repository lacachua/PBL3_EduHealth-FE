import {
  apiGetEnvelope,
  apiPatchEnvelope,
  apiPostEnvelope,
} from '../../../shared/api/apiClient';
import { MESSAGING_ENDPOINTS } from '../constants/messagingApiContract';

export const messagingApi = {
  getConversations: (params = {}) => apiGetEnvelope(MESSAGING_ENDPOINTS.conversations, { params }),
  createConversation: (payload) => apiPostEnvelope(MESSAGING_ENDPOINTS.conversations, payload),
  getConversationDetail: (conversationId) => apiGetEnvelope(MESSAGING_ENDPOINTS.conversationDetail(conversationId)),
  getMessages: (conversationId, params = {}) => apiGetEnvelope(MESSAGING_ENDPOINTS.conversationMessages(conversationId), { params }),
  markConversationRead: (conversationId, payload) => apiPatchEnvelope(MESSAGING_ENDPOINTS.conversationRead(conversationId), payload),
  getStudentContacts: (params = {}) => apiGetEnvelope(MESSAGING_ENDPOINTS.contactsStudents, { params }),
  getNurseContacts: (params = {}) => apiGetEnvelope(MESSAGING_ENDPOINTS.contactsNurses, { params }),
};
