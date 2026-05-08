import { useState } from 'react';
import Button from '../../../shared/components/common/Button';

const MessageComposer = ({ onSend, onTyping }) => {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);

  const trimmedValue = value.trim();
  const canSend = Boolean(trimmedValue) && !sending;

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onTyping?.(Boolean(nextValue.trim()));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    setSending(true);
    const success = await onSend?.(trimmedValue);
    setSending(false);

    if (success !== false) {
      setValue('');
      onTyping?.(false);
    }
  };

  return (
    <form className="messaging-composer" onSubmit={handleSubmit}>
      <div className="messaging-composer-form">
        <textarea
          rows={1}
          value={value}
          onChange={handleChange}
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
