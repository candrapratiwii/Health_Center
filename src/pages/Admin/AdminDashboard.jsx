import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidenav from '../../components/layout/sidenav/AdminSidenav';

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      <AdminSidenav color="#14b8a6" />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard; 