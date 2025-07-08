import { NavLink, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import {
  HomeOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  UserAddOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../../providers/AuthProvider";

function AdminSidenav({ color }) {
  const { logout } = useContext(AuthContext);

  const menu = [
    {
      key: "/admin/dashboard",
      label: "Dashboard",
      icon: <HomeOutlined className="sidebar-nav-icon" />,
    },
    {
      key: "/admin/reservasi",
      label: "Kelola Reservasi",
      icon: <CalendarOutlined className="sidebar-nav-icon" />,
    },
    {
      key: "/admin/layanan",
      label: "Data Layanan",
      icon: <MedicineBoxOutlined className="sidebar-nav-icon" />,
    },
    {
      key: "/admin/dokter",
      label: "Data Dokter",
      icon: <TeamOutlined className="sidebar-nav-icon" />,
    },
    {
      key: "/admin/pasien",
      label: "Data Pasien",
      icon: <UserAddOutlined className="sidebar-nav-icon" />,
    },
    {
      key: "/admin/staf",
      label: "Data Staf",
      icon: <TeamOutlined className="sidebar-nav-icon" />,
    },
    {
      key: "/admin/laporan",
      label: "Laporan",
      icon: <BarChartOutlined className="sidebar-nav-icon" />,
    },
  ];

  return (
    <div className="sidebar-patient">
      <div>
        <div className="sidebar-header" style={{ cursor: 'pointer' }} onClick={() => useNavigate()('/admin/dashboard')}>
          <div className="sidebar-logo">A</div>
          <div>
            <div className="sidebar-title">Admin Puskesmas</div>
            <div className="sidebar-desc">Manajemen Sistem</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {menu.map((item) => (
            <NavLink
              to={item.key}
              key={item.key}
              className={({ isActive }) =>
                'sidebar-nav-item' + (isActive ? ' active' : '')
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="sidebar-footer">
        <button
          className="sidebar-nav-item"
          style={{ color: '#d32f2f', width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
          onClick={logout}
        >
          <LogoutOutlined className="sidebar-nav-icon" /> Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidenav;
