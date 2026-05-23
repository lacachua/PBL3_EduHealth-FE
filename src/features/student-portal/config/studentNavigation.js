export const studentNavigationItems = [
  {
    id: 'student-overview',
    label: 'Tổng quan',
    icon: 'dashboard',
    to: '/student/overview',
  },
  {
    id: 'student-care-history',
    label: 'Lịch sử khám bệnh',
    icon: 'history_edu',
    to: '/student/care-history',
  },
  {
    id: 'student-vaccinations',
    label: 'Tiêm chủng',
    icon: 'vaccines',
    to: '/student/vaccinations',
  },
  {
    id: 'student-messaging',
    label: 'Tin nhắn',
    icon: 'chat_bubble',
    to: '/student/messages',
  },
  {
    id: 'student-notifications',
    label: 'Thông báo',
    icon: 'notifications',
    to: '/student/notifications',
  },
  {
    id: 'student-account',
    label: 'Tài khoản',
    icon: 'person',
    to: '/student/account',
  },
];

export const studentSidebarGroups = [
  {
    id: 'main',
    label: 'Điều hướng',
    items: [
      studentNavigationItems[0],
      studentNavigationItems[1],
      studentNavigationItems[2],
      studentNavigationItems[3],
      studentNavigationItems[4],
      studentNavigationItems[5],
    ],
  },
];
