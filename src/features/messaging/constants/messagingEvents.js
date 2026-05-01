export const CHAT_HUB_METHODS = Object.freeze({
  JOIN_CONVERSATION: 'JoinConversation',
  LEAVE_CONVERSATION: 'LeaveConversation',
  SEND_MESSAGE: 'SendMessage',
  TYPING: 'Typing',
  MARK_CONVERSATION_READ: 'MarkConversationRead',
});

export const CHAT_HUB_EVENTS = Object.freeze({
  JOINED_CONVERSATION: 'JoinedConversation',
  LEFT_CONVERSATION: 'LeftConversation',
  MESSAGE_CREATED: 'MessageCreated',
  CONVERSATION_UPDATED: 'ConversationUpdated',
  TYPING_CHANGED: 'TypingChanged',
  CONVERSATION_READ: 'ConversationRead',
  MESSAGING_ERROR: 'MessagingError',
});
