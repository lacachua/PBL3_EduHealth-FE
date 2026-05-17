import { useState, useRef } from 'react';
import Button from '../../../shared/components/common/Button';

const MessageComposer = ({ onSend, onTyping }) => {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);

  const trimmedValue = value.trim();
  const canSend = Boolean(trimmedValue) && !sending;

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
    if (!messageContent || sending || sendingRef.current) {
      return;
    }

    try {
      sendingRef.current = true;
      setSending(true);
      const success = await onSend?.(messageContent);
      if (success !== false) {
        setValue('');
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

  return (
    <form className="messaging-composer" onSubmit={handleSubmit}>
      <div className="messaging-composer-form">
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
