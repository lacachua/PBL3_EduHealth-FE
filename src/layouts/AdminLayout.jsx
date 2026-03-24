import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar & Header for Admin */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container shadow-lg">
        <div className="p-6 text-2xl font-bold text-primary">EduHealth Admin</div>
        <nav className="mt-6 px-4 space-y-2">
          <div className="p-3 rounded-xl bg-primary/10 text-primary font-bold">Dashboard</div>
          <div className="p-3 rounded-xl hover:bg-surface-container-high transition-colors">Users</div>
          <div className="p-3 rounded-xl hover:bg-surface-container-high transition-colors">Students</div>
          <div className="p-3 rounded-xl hover:bg-surface-container-high transition-colors">Settings</div>
        </nav>
      </aside>
      <main className="ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined p-2 rounded-full hover:bg-surface-container-high">notifications</span>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
