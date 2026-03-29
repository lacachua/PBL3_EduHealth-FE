export const adminSidebarGroups = [
  {
    id: 'overview',
    label: 'Tổng quan',
    items: [
      {
        id: 'admin-dashboard',
        label: 'Tổng quan',
        icon: 'dashboard',
        to: '/admin/dashboard',
      },
    ],
  },
  {
    id: 'data-management',
    label: 'Quản trị dữ liệu',
    items: [
      {
        id: 'admin-students',
        label: 'Quản lý học sinh',
        icon: 'school',
        to: '/admin/students',
      },
      {
        id: 'admin-users',
        label: 'Người dùng',
        icon: 'group',
        to: '/admin/users',
      },
      {
        id: 'admin-catalogs',
        label: 'Quản lý danh mục',
        icon: 'category',
        to: '/admin/catalogs',
      },
      {
        id: 'admin-reports',
        label: 'Báo cáo',
        icon: 'assessment',
        to: '/admin/reports',
      },
    ],
  },
  {
    id: 'system',
    label: 'Hệ thống',
    items: [
      {
        id: 'admin-system-logs',
        label: 'Nhật ký hệ thống',
        icon: 'history',
        to: '/admin/system-logs',
      },
      {
        id: 'admin-settings',
        label: 'Cài đặt',
        icon: 'settings',
        to: '/admin/settings',
      },
    ],
  },
];

export const adminSidebarActions = {
  secondary: {
    label: 'Đăng xuất',
    icon: 'logout',
  },
};
