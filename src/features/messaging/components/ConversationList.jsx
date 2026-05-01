import SearchInput from '../../../shared/components/core/SearchInput';
import Button from '../../../shared/components/common/Button';
import EmptyState from '../../../shared/components/core/EmptyState';
import ErrorState from '../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../shared/components/core/LoadingSpinner';
import ConversationListItem from './ConversationListItem';

const ConversationList = ({
  title = 'Hội thoại',
  actionLabel,
  onAction,
  items = [],
  status,
  error,
  keyword,
  onKeywordChange,
  selectedId,
  onSelect,
  onRetry,
}) => {
  return (
    <section className="messaging-sidebar">
      <div className="messaging-sidebar-header">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="app-section-title">{title}</h2>
            {actionLabel ? (
              <Button type="button" onClick={onAction} className="text-sm">
                <span className="material-symbols-outlined text-[18px]">add</span>
                {actionLabel}
              </Button>
            ) : null}
          </div>
          <SearchInput
            value={keyword}
            onChange={onKeywordChange}
            placeholder="Tìm kiếm hội thoại..."
          />
        </div>
      </div>

      <div className="messaging-sidebar-body">
        {status === 'loading' ? <LoadingSpinner label="Đang tải hội thoại..." /> : null}
        {status === 'error' ? (
          <ErrorState message={error || 'Không thể tải hội thoại.'} onRetry={onRetry} />
        ) : null}
        {status === 'empty' ? (
          <EmptyState
            title="Chưa có hội thoại"
            description="Tạo hội thoại mới để bắt đầu nhắn tin."
          />
        ) : null}

        {status === 'success'
          ? items.map((conversation) => (
            <ConversationListItem
              key={conversation.conversationId}
              conversation={conversation}
              active={conversation.conversationId === selectedId}
              onSelect={() => onSelect?.(conversation.conversationId)}
            />
          ))
          : null}
      </div>
    </section>
  );
};

export default ConversationList;
