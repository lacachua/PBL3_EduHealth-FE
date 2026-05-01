const MESSAGING_BASE = '/api/v1/messaging';

export const MESSAGING_ENDPOINTS = Object.freeze({
  conversations: `${MESSAGING_BASE}/conversations`,
  conversationDetail: (conversationId) => `${MESSAGING_BASE}/conversations/${conversationId}`,
  conversationMessages: (conversationId) => `${MESSAGING_BASE}/conversations/${conversationId}/messages`,
  conversationRead: (conversationId) => `${MESSAGING_BASE}/conversations/${conversationId}/read`,
  contactsStudents: `${MESSAGING_BASE}/contacts/students`,
  contactsNurses: `${MESSAGING_BASE}/contacts/nurses`,
});
