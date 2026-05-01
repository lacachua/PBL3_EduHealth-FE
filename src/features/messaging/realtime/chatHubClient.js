import { createSignalRConnection } from '../../../shared/realtime/createSignalRConnection';
import { CHAT_HUB_EVENTS, CHAT_HUB_METHODS } from '../constants/messagingEvents';

const DEFAULT_HUB_PATH = '/hubs/chat';

export const createChatHubClient = ({ hubPath = DEFAULT_HUB_PATH } = {}) => {
  const connection = createSignalRConnection({ hubPath });

  return {
    connection,
    start: () => connection.start(),
    stop: () => connection.stop(),
    on: (eventName, handler) => connection.on(eventName, handler),
    off: (eventName, handler) => connection.off(eventName, handler),
    onReconnecting: (handler) => {
      connection.onreconnecting(handler);
    },
    onReconnected: (handler) => {
      connection.onreconnected(handler);
    },
    onClose: (handler) => {
      connection.onclose(handler);
    },
    joinConversation: (payload) => connection.invoke(CHAT_HUB_METHODS.JOIN_CONVERSATION, payload),
    leaveConversation: (payload) => connection.invoke(CHAT_HUB_METHODS.LEAVE_CONVERSATION, payload),
    sendMessage: (payload) => connection.invoke(CHAT_HUB_METHODS.SEND_MESSAGE, payload),
    sendTyping: (payload) => connection.invoke(CHAT_HUB_METHODS.TYPING, payload),
    markConversationRead: (payload) => connection.invoke(CHAT_HUB_METHODS.MARK_CONVERSATION_READ, payload),
    events: CHAT_HUB_EVENTS,
  };
};
