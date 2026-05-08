const TypingIndicator = ({ label = 'Đang nhập...' }) => (
  <div className="messaging-typing">
    <span className="messaging-typing-dot" />
    <span className="messaging-typing-dot" />
    <span className="messaging-typing-dot" />
    <span className="messaging-typing-text">{label}</span>
  </div>
);

export default TypingIndicator;
