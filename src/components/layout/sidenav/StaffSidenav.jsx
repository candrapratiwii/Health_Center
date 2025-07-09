import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, FileTextOutlined, HistoryOutlined, LogoutOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <HomeOutlined className="sidebar-nav-icon" />, path: '/staff/dashboard' },
  { id: 'reservations', label: 'Data Reservasi', icon: <FileTextOutlined className="sidebar-nav-icon" />, path: '/staff/reservations' },
  { id: 'history', label: 'Riwayat Reservasi', icon: <HistoryOutlined className="sidebar-nav-icon" />, path: '/staff/history' }
];

const StaffSidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar-patient">
      <div className="sidebar-header">
        <span className="sidebar-logo">S</span>
        <div>
          <h1 className="sidebar-title">Staff Center</h1>
          <p className="sidebar-desc">Sistem Reservasi</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item${isActive ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <Popconfirm
          title="Logout"
          description="Apakah Anda yakin ingin logout?"
          onConfirm={handleLogout}
          okText="Ya, Logout"
          cancelText="Batal"
        >
          <button
            className="sidebar-nav-item"
            style={{ width: '100%', justifyContent: 'flex-start', color: '#d32f2f' }}
          >
            <LogoutOutlined className="sidebar-nav-icon" />
            <span>Logout</span>
          </button>
        </Popconfirm>
      </div>
    </aside>
  );
};

export default StaffSidenav;
