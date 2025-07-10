import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, Clock, User, LogOut } from "lucide-react";
import { Popconfirm } from "antd";
import logoMain from "../../../assets/images/Green Modern Badge Gardening Logo Design.png";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    path: "/patien/dashboard",
  },
  {
    id: "booking",
    label: "Buat Reservasi",
    icon: Calendar,
    path: "/patien/booking",
  },
  {
    id: "appointments",
    label: "Reservasi Saya",
    icon: Clock,
    path: "/patien/appointments",
  },
];

const PasienSidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fungsi logout sederhana: hapus token dan redirect ke login
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar-patient">
      <div className="sidebar-header">
        <span className="sidebar-logo">
          <img src={logoMain} alt="Logo" style={{ width: 40, height: 40 }} />
        </span>
        <div>
          <h1 className="sidebar-title">Puskesmas Buleleng</h1>
          <p className="sidebar-desc">Sistem Reservasi</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item${isActive ? " active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="sidebar-nav-icon" />
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
            style={{
              width: "100%",
              justifyContent: "flex-start",
              color: "#d32f2f",
            }}
          >
            <LogOut className="sidebar-nav-icon" />
            <span>Logout</span>
          </button>
        </Popconfirm>
      </div>
    </aside>
  );
};

export default PasienSidenav;
