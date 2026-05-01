import SearchInput from '../../../shared/components/core/SearchInput';
import Button from '../../../shared/components/common/Button';
import EmptyState from '../../../shared/components/core/EmptyState';
import ErrorState from '../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../shared/components/core/LoadingSpinner';

const getInitials = (value) => {
  const text = String(value || '').trim();
  if (!text) return '?';
  return text[0].toUpperCase();
};

const ContactPickerModal = ({
  open,
  title,
  contacts = [],
  status,
  error,
  keyword,
  onKeywordChange,
  onClose,
  onSelectContact,
  viewerRole,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="messaging-modal">
      <button type="button" className="messaging-modal-backdrop" onClick={onClose} aria-label="Đóng" />
      <section className="messaging-modal-card">
        <header className="messaging-modal-header">
          <div>
            <h3 className="app-section-title">{title}</h3>
            <p className="app-meta-text">Chọn liên hệ để bắt đầu hội thoại.</p>
          </div>
          <button type="button" onClick={onClose} className="messaging-modal-close" aria-label="Đóng">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </header>

        <div className="messaging-modal-body">
          <SearchInput
            value={keyword}
            onChange={onKeywordChange}
            placeholder="Tìm kiếm..."
          />

          <div className="messaging-modal-list">
            {status === 'loading' ? <LoadingSpinner label="Đang tải liên hệ..." /> : null}
            {status === 'error' ? <ErrorState message={error || 'Không thể tải liên hệ.'} /> : null}
            {status === 'empty' ? (
              <EmptyState title="Không có liên hệ" description="Chưa tìm thấy liên hệ phù hợp." />
            ) : null}
            {status === 'success'
              ? contacts.map((contact) => (
                <div key={contact.userId} className="messaging-contact-item">
                  <div className="messaging-avatar">
                    {contact.avatarUrl ? (
                      <img src={contact.avatarUrl} alt={contact.fullName} className="messaging-avatar-img" />
                    ) : (
                      <span className="messaging-avatar-fallback">{getInitials(contact.fullName)}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="messaging-contact-name truncate">{contact.fullName}</p>
                    {viewerRole === 'NURSE' ? (
                      <p className="messaging-contact-meta truncate">{contact.className || 'Chưa cập nhật lớp'}</p>
                    ) : (
                      <p className="messaging-contact-meta truncate">{contact.role || 'NURSE'}</p>
                    )}
                    {viewerRole === 'STUDENT' && (contact.email || contact.phoneNumber) ? (
                      <p className="messaging-contact-meta truncate">
                        {[contact.email, contact.phoneNumber].filter(Boolean).join(' · ')}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    type="button"
                    variant={contact.hasConversation ? 'secondary' : 'primary'}
                    onClick={() => onSelectContact?.(contact)}
                    className="text-xs"
                  >
                    {contact.hasConversation ? 'Mở hội thoại' : 'Bắt đầu nhắn'}
                  </Button>
                </div>
              ))
              : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPickerModal;
