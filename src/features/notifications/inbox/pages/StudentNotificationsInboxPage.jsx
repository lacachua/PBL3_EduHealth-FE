import React from 'react';
import NotificationInboxWorkspace from '../components/NotificationInboxWorkspace';

const StudentNotificationsInboxPage = () => {
  return (
    <NotificationInboxWorkspace
      viewerRole="STUDENT"
      title="Hop thu thong bao hoc sinh"
      subtitle="Thong bao hoc sinh duoc dung chung trong shared module. Reply duoc dat san trong detail, con live thread/reply van cho backend."
    />
  );
};

export default StudentNotificationsInboxPage;
