import { formatTime } from '../../../shared/utils/dateFormat';

const getInitials = (value) => {
  const text = String(value || '').trim();
  if (!text) return '?';
  return text[0].toUpperCase();
};

const ConversationListItem = ({ conversation, active, onSelect }) => {
  const lastMessage = conversation?.lastMessage;
  const previewTime = conversation?.updatedAt || lastMessage?.sentAt;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`messaging-conversation-item ${active ? 'is-active' : ''}`}
    >
      <div className="messaging-avatar">
        {conversation?.avatarUrl ? (
          <img src={conversation.avatarUrl} alt={conversation.title} className="messaging-avatar-img" />
        ) : (
          <span className="messaging-avatar-fallback">{getInitials(conversation?.title)}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="messaging-conversation-title truncate">{conversation?.title}</p>
          {previewTime ? (
            <span className="messaging-conversation-time">{formatTime(previewTime)}</span>
          ) : null}
        </div>

        {conversation?.studentName || conversation?.className ? (
          <p className="messaging-conversation-meta truncate">
            {[conversation?.studentName, conversation?.className].filter(Boolean).join(' · ')}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <p className="messaging-conversation-preview truncate">
            {lastMessage?.content || 'Chưa có tin nhắn'}
          </p>
          {conversation?.unreadCount ? (
            <span className="messaging-unread-badge">{conversation.unreadCount}</span>
          ) : null}
        </div>
      </div>
    </button>
  );
};

export default ConversationListItem;
