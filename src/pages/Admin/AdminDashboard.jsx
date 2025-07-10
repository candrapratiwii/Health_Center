import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidenav from '../../components/layout/sidenav/AdminSidenav';
import Footer from '../../components/layout/Footer';

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      <AdminSidenav color="#14b8a6" />
      <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AdminDashboard; 