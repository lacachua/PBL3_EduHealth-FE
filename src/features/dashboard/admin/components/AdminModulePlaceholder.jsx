import React from 'react';

const moduleCopyMap = {
  students: {
    title: 'Quản lý học sinh',
    description: 'Module quản lý học sinh sẽ được bổ sung tại đây.',
  },
  users: {
    title: 'Người dùng',
    description: 'Module người dùng sẽ được bổ sung tại đây.',
  },
  catalogs: {
    title: 'Quản lý danh mục',
    description: 'Module danh mục dữ liệu gốc sẽ được bổ sung tại đây.',
  },
  reports: {
    title: 'Báo cáo',
    description: 'Module báo cáo tổng hợp sẽ được bổ sung tại đây.',
  },
  systemLogs: {
    title: 'Nhật ký hệ thống',
    description: 'Module nhật ký hệ thống sẽ được bổ sung tại đây.',
  },
  settings: {
    title: 'Cài đặt',
    description: 'Module cài đặt hệ thống sẽ được bổ sung tại đây.',
  },
};

const AdminModulePlaceholder = ({ moduleKey }) => {
  const moduleCopy = moduleCopyMap[moduleKey] ?? {
    title: 'Module quản trị',
    description: 'Nội dung module sẽ được bổ sung sau.',
  };

  return (
    <section className="rounded-lg border border-dashed border-outline-variant/55 bg-surface-container-low p-8 text-center">
      <h1 className="font-headline text-2xl font-bold text-on-surface">{moduleCopy.title}</h1>
      <p className="mt-2 text-sm text-on-surface-variant">{moduleCopy.description}</p>
    </section>
  );
};

export default AdminModulePlaceholder;
