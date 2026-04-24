import React from 'react';
import NotificationInboxWorkspace from '../components/NotificationInboxWorkspace';

const AdminNotificationsInboxPage = () => {
  return (
    <NotificationInboxWorkspace
      viewerRole="ADMIN"
      title="Hop thu thong bao quan tri"
      subtitle="Thong bao cho quan tri duoc gom chung theo shared notifications module. Bell panel se mo truoc, sau do moi den danh sach day du."
    />
  );
};

export default AdminNotificationsInboxPage;
