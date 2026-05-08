import EmptyState from '../../../shared/components/core/EmptyState';

const EmptyConversationState = () => (
  <div className="messaging-empty-thread">
    <EmptyState
      title="Chọn một hội thoại để bắt đầu nhắn tin"
      description="Danh sách tin nhắn sẽ hiển thị sau khi bạn chọn hội thoại."
    />
  </div>
);

export default EmptyConversationState;
