import { formatTime } from '../../../shared/utils/dateFormat';

const statusLabels = {
  sending: 'Đang gửi',
  sent: 'Đã gửi',
  failed: 'Gửi lỗi',
};

const formatFileSize = (bytes = 0) => {
  if (!bytes) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** index);
  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
};

const isImageAttachment = (attachment) => String(attachment?.contentType || '').startsWith('image/');

const AttachmentPreview = ({ attachment }) => {
  const fileName = attachment?.originalFileName || attachment?.fileName || 'File đính kèm';
  const fileUrl = attachment?.fileUrl || '';

  if (isImageAttachment(attachment) && fileUrl) {
    return (
      <a
        className="messaging-attachment-image-link"
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${fileName}`}
      >
        <img className="messaging-attachment-image" src={fileUrl} alt={fileName} loading="lazy" />
      </a>
    );
  }

  return (
    <div className="messaging-attachment-file">
      <span className="material-symbols-outlined messaging-attachment-file-icon">description</span>
      <div className="messaging-attachment-file-main">
        <span className="messaging-attachment-file-name">{fileName}</span>
        <span className="messaging-attachment-file-size">{formatFileSize(attachment?.sizeBytes)}</span>
      </div>
      {fileUrl ? (
        <a className="messaging-attachment-file-action" href={fileUrl} target="_blank" rel="noreferrer">
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
        </a>
      ) : null}
    </div>
  );
};

const MessageBubble = ({ message }) => {
  const isMine = Boolean(message?.isMine);
  const statusLabel = message?.status ? statusLabels[message.status] : '';
  const attachments = Array.isArray(message?.attachments) ? message.attachments : [];
  const hasContent = Boolean(message?.content);

  return (
    <div className={`messaging-bubble ${isMine ? 'is-mine' : ''}`}>
      <div className="messaging-bubble-header">
        <span className="messaging-bubble-name">{message?.senderName}</span>
        <span className="messaging-bubble-time">
          {message?.sentAt ? formatTime(message.sentAt) : '--'}
        </span>
      </div>
      {message?.isDeleted ? (
        <p className="messaging-bubble-content">Tin nhắn đã bị xóa</p>
      ) : (
        <>
          {hasContent ? <p className="messaging-bubble-content">{message.content}</p> : null}
          {attachments.length ? (
            <div className="messaging-attachments">
              {attachments.map((attachment, index) => (
                <AttachmentPreview
                  key={attachment.attachmentId || `${attachment.fileName}-${index}`}
                  attachment={attachment}
                />
              ))}
            </div>
          ) : null}
        </>
      )}
      {statusLabel ? (
        <span className="messaging-bubble-status">{statusLabel}</span>
      ) : null}
    </div>
  );
};

export default MessageBubble;
