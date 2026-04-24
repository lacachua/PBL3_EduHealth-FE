import React from 'react';
import NotificationInboxWorkspace from '../components/NotificationInboxWorkspace';

const NurseNotificationsInboxPage = () => {
  return (
    <NotificationInboxWorkspace
      viewerRole="NURSE"
      title="Hop thu thong bao dieu duong"
      subtitle="Thong bao dieu duong hien la luong partial: inbox dung mock/pending fallback, compose co the live theo backend NURSE hien tai."
    />
  );
};

export default NurseNotificationsInboxPage;
