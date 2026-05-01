import EmptyState from '../../../shared/components/core/EmptyState';
import ErrorState from '../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../shared/components/core/LoadingSpinner';
import EmptyConversationState from './EmptyConversationState';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import TypingIndicator from './TypingIndicator';

const MessageThread = ({
  conversation,
  messages = [],
  status,
  error,
  typing,
  onSend,
  onTyping,
  onRetry,
}) => {
  if (!conversation) {
    return (
      <section className="messaging-thread">
        <EmptyConversationState />
      </section>
    );
  }

  return (
    <section className="messaging-thread">
      <header className="messaging-thread-header">
        <div className="min-w-0">
          <h3 className="messaging-thread-title truncate">{conversation.title}</h3>
          {conversation.studentName || conversation.className ? (
            <p className="messaging-thread-subtitle truncate">
              {[conversation.studentName, conversation.className].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </div>
      </header>

      <div className="messaging-thread-body">
        {status === 'loading' ? <LoadingSpinner label="Đang tải tin nhắn..." /> : null}
        {status === 'error' ? (
          <ErrorState message={error || 'Không thể tải tin nhắn.'} onRetry={onRetry} />
        ) : null}
        {status === 'empty' ? (
          <EmptyState
            title="Chưa có tin nhắn"
            description="Bắt đầu nhắn tin để tạo cuộc trò chuyện."
          />
        ) : null}
        {status === 'success'
          ? messages.map((message) => (
            <MessageBubble
              key={message.messageId || message.clientMessageId}
              message={message}
            />
          ))
          : null}
        {typing ? <TypingIndicator /> : null}
      </div>

      <MessageComposer onSend={onSend} onTyping={onTyping} />
    </section>
  );
};

export default MessageThread;
