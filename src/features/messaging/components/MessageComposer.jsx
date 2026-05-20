import { useRef, useState } from 'react';
import Button from '../../../shared/components/common/Button';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt']);
const ACCEPTED_FILE_TYPES = '.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt';

const formatFileSize = (bytes = 0) => {
  if (!bytes) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** index);
  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
};

const getFileExtension = (fileName = '') => fileName.split('.').pop()?.toLowerCase() || '';

const MessageComposer = ({ onSend, onTyping }) => {
  const [value, setValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);
  const sendingRef = useRef(false);

  const trimmedValue = value.trim();
  const canSend = (Boolean(trimmedValue) || selectedFiles.length > 0) && !sending;

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onTyping?.(Boolean(nextValue.trim()));
  };

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const messageContent = value.trim();
    if ((!messageContent && selectedFiles.length === 0) || sending || sendingRef.current) {
      return;
    }

    try {
      sendingRef.current = true;
      setSending(true);
      const success = await onSend?.(messageContent, selectedFiles);
      if (success !== false) {
        setValue('');
        setSelectedFiles([]);
        setFileError('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onTyping?.(false);
      }
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (event.nativeEvent?.isComposing) {
        return;
      }
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleFileChange = (event) => {
    const incomingFiles = Array.from(event.target.files || []);
    const nextFiles = [...selectedFiles, ...incomingFiles];
    const acceptedFiles = [];
    const errors = [];

    nextFiles.slice(0, MAX_FILES).forEach((file) => {
      const extension = getFileExtension(file.name);
      if (!ALLOWED_EXTENSIONS.has(extension)) {
        errors.push(`${file.name}: định dạng không hỗ trợ`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: vượt quá 10MB`);
        return;
      }

      acceptedFiles.push(file);
    });

    if (nextFiles.length > MAX_FILES) {
      errors.push(`Mỗi tin nhắn chỉ được tối đa ${MAX_FILES} file`);
    }

    setSelectedFiles(acceptedFiles);
    setFileError(errors[0] || '');
    event.target.value = '';
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setFileError('');
  };

  return (
    <form className="messaging-composer" onSubmit={handleSubmit}>
      {selectedFiles.length ? (
        <div className="messaging-composer-files">
          {selectedFiles.map((file, index) => (
            <div className="messaging-composer-file" key={`${file.name}-${file.size}-${index}`}>
              <span className="material-symbols-outlined text-[18px]">draft</span>
              <span className="messaging-composer-file-name">{file.name}</span>
              <span className="messaging-composer-file-size">{formatFileSize(file.size)}</span>
              <button
                type="button"
                className="messaging-composer-file-remove"
                onClick={() => handleRemoveFile(index)}
                aria-label={`Remove ${file.name}`}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {fileError ? <p className="messaging-composer-error">{fileError}</p> : null}
      <div className="messaging-composer-form">
        <input
          ref={fileInputRef}
          type="file"
          className="messaging-composer-file-input"
          accept={ACCEPTED_FILE_TYPES}
          multiple
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="messaging-composer-attach"
          disabled={sending}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Đính kèm file"
        >
          <span className="material-symbols-outlined text-[18px]">attach_file</span>
        </Button>
        <textarea
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          className="messaging-composer-input app-input"
        />
        <Button type="submit" disabled={!canSend} className="messaging-composer-send">
          <span className="material-symbols-outlined text-[18px]">send</span>
          Gửi
        </Button>
      </div>
    </form>
  );
};

export default MessageComposer;
