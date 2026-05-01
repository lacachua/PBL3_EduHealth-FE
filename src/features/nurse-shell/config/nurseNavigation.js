export const nurseSidebarGroups = [
  {
    id: 'overview',
    label: 'Tổng quan',
    items: [
      {
        id: 'nurse-dashboard',
        label: 'Tổng quan',
        icon: 'dashboard',
        to: '/nurse/dashboard',
      },
    ],
  },
  {
    id: 'medical-operations',
    label: 'Nghiệp vụ y tế',
    items: [
      {
        id: 'nurse-students',
        label: 'Học sinh',
        icon: 'group',
        to: '/nurse/students',
      },
      {
        id: 'nurse-health-profiles',
        label: 'Hồ sơ sức khỏe',
        icon: 'medical_information',
        to: '/nurse/health-profiles',
      },
      {
        id: 'nurse-medicines',
        label: 'Thuốc / Kho thuốc',
        icon: 'inventory_2',
        to: '/nurse/medicines',
      },
      {
        id: 'nurse-examinations',
        label: 'Khám bệnh',
        icon: 'stethoscope',
        to: '/nurse/examinations',
      },
      {
        id: 'nurse-vaccinations',
        label: 'Tiêm chủng',
        icon: 'vaccines',
        to: '/nurse/vaccinations',
      },
    ],
  },
  {
    id: 'tracking-report',
    label: 'Theo dõi & báo cáo',
    items: [
      {
        id: 'nurse-notifications',
        label: 'Hộp thư',
        icon: 'notifications',
        to: '/nurse/notifications',
      },
      {
        id: 'nurse-messaging',
        label: 'Tin nhắn',
        icon: 'chat_bubble',
        to: '/nurse/messages',
      },
      {
        id: 'nurse-reports',
        label: 'Báo cáo',
        icon: 'bar_chart',
        to: '/nurse/reports',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    items: [
      {
        id: 'nurse-profile',
        label: 'Tài khoản cá nhân',
        icon: 'account_circle',
        to: '/nurse/profile',
      },
      {
        id: 'nurse-logout',
        label: 'Đăng xuất',
        icon: 'logout',
        action: 'logout',
      },
    ],
  },
];
