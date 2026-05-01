import { formatTime } from '../../../shared/utils/dateFormat';

const statusLabels = {
  sending: 'Đang gửi',
  sent: 'Đã gửi',
  failed: 'Gửi lỗi',
};

const MessageBubble = ({ message }) => {
  const isMine = Boolean(message?.isMine);
  const statusLabel = message?.status ? statusLabels[message.status] : '';

  return (
    <div className={`messaging-bubble ${isMine ? 'is-mine' : ''}`}>
      <div className="messaging-bubble-header">
        <span className="messaging-bubble-name">{message?.senderName}</span>
        <span className="messaging-bubble-time">
          {message?.sentAt ? formatTime(message.sentAt) : '--'}
        </span>
      </div>
      <p className="messaging-bubble-content">
        {message?.isDeleted ? 'Tin nhắn đã bị xóa' : message?.content}
      </p>
      {statusLabel ? (
        <span className="messaging-bubble-status">{statusLabel}</span>
      ) : null}
    </div>
  );
};

export default MessageBubble;
