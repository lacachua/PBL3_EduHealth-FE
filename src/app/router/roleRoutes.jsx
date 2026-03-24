import React from 'react';
import { Route } from 'react-router-dom';
import RequireAuth from '../guards/RequireAuth';
import RequireRole from '../guards/RequireRole';
import AdminLayout from '../../layouts/AdminLayout';
import AdminDashboard from '../../features/dashboard/admin/AdminDashboard';
import NurseDashboard from '../../features/dashboard/nurse/NurseDashboard';
import ParentDashboard from '../../features/dashboard/parent/ParentDashboard';

// This file can define chunks of routes to be used in index.jsx
export const adminRoutes = (
  <Route element={<RequireAuth />}>
    <Route element={<RequireRole allowedRoles={['admin']} />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* Add more admin routes here */}
      </Route>
    </Route>
  </Route>
);

export const nurseRoutes = (
  <Route element={<RequireAuth />}>
    <Route element={<RequireRole allowedRoles={['nurse']} />}>
      <Route path="/nurse/dashboard" element={<NurseDashboard />} />
      {/* Add more nurse routes here */}
    </Route>
  </Route>
);

export const parentRoutes = (
  <Route element={<RequireAuth />}>
    <Route element={<RequireRole allowedRoles={['parent']} />}>
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      {/* Add more parent routes here */}
    </Route>
  </Route>
);
