import ConversationList from '../components/ConversationList';
import MessageThread from '../components/MessageThread';
import ContactPickerModal from '../components/ContactPickerModal';
import { useMessagingPageState } from '../hooks/useMessagingPageState';
import '../styles/messaging.css';

const NurseMessagingPage = () => {
  const {
    conversations,
    messageState,
    contacts,
    contactsStatus,
    contactsError,
    contactsKeyword,
    setContactsKeyword,
    contactsOpen,
    handleOpenContacts,
    handleCloseContacts,
    handleSelectConversation,
    handleSelectContact,
  } = useMessagingPageState({ role: 'NURSE' });

  return (
    <div className="messaging-shell">
      <div className="messaging-layout">
        <ConversationList
          title="Hội thoại"
          actionLabel="Tạo hội thoại"
          onAction={handleOpenContacts}
          items={conversations.items}
          status={conversations.status}
          error={conversations.error}
          keyword={conversations.keyword}
          onKeywordChange={conversations.setKeyword}
          selectedId={conversations.selectedConversationId}
          onSelect={handleSelectConversation}
          onRetry={conversations.reload}
        />

        <MessageThread
          conversation={conversations.selectedConversation}
          messages={messageState.items}
          status={messageState.status}
          error={messageState.error}
          typing={messageState.typingIndicator}
          onSend={messageState.sendMessage}
          onTyping={messageState.sendTyping}
          onRetry={messageState.loadMessages}
        />
      </div>

      <ContactPickerModal
        open={contactsOpen}
        title="Chọn học sinh/phụ huynh"
        contacts={contacts}
        status={contactsStatus}
        error={contactsError}
        keyword={contactsKeyword}
        onKeywordChange={setContactsKeyword}
        onClose={handleCloseContacts}
        onSelectContact={handleSelectContact}
        viewerRole="NURSE"
      />
    </div>
  );
};

export default NurseMessagingPage;
