import React from "react";
import { NavLink } from "react-router-dom";
import { HomeOutlined, FileTextOutlined, HistoryOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const mainColor = "#14b8a6";
const accentColor = "#06b6d4";

const menu = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <HomeOutlined />,
    to: "/staff/dashboard"
  },
  {
    key: "reservations",
    label: "Data Reservasi",
    icon: <FileTextOutlined />,
    to: "/staff/reservations"
  }
];

const StaffSidenav = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
  };
  return (
    <div style={{
      width: 220,
      minHeight: '100vh',
      background: '#fff',
      borderRight: `2px solid ${mainColor}10`,
      boxShadow: '2px 0 16px #0001',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <div style={{ padding: '32px 0 0 0', textAlign: 'center' }}>
        <img src="/src/assets/images/logo.png" alt="Logo" style={{ width: 54, marginBottom: 10 }} />
        <div style={{ fontWeight: 800, fontSize: 22, color: mainColor, letterSpacing: 0.5, marginBottom: 24 }}>Staff Center</div>
      </div>
      <nav style={{ marginTop: 16 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: 8 }}>
            <NavLink to="/staff/dashboard" className={({ isActive }) => isActive ? 'active' : ''} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 17, color: isActive ? mainColor : '#444', background: isActive ? '#e0fdfa' : 'transparent', borderRadius: 10, padding: '12px 24px', textDecoration: 'none', transition: 'all 0.2s', boxShadow: isActive ? `0 2px 8px ${mainColor}22` : 'none'
            })}>
              <HomeOutlined style={{ fontSize: 20, color: accentColor }} /> Dashboard
            </NavLink>
          </li>
          <li style={{ marginBottom: 8 }}>
            <NavLink to="/staff/reservations" className={({ isActive }) => isActive ? 'active' : ''} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 17, color: isActive ? mainColor : '#444', background: isActive ? '#e0fdfa' : 'transparent', borderRadius: 10, padding: '12px 24px', textDecoration: 'none', transition: 'all 0.2s', boxShadow: isActive ? `0 2px 8px ${mainColor}22` : 'none'
            })}>
              <FileTextOutlined style={{ fontSize: 20, color: accentColor }} /> Data Reservasi
            </NavLink>
          </li>
          <li style={{ marginBottom: 8 }}>
            <NavLink to="/staff/history" className={({ isActive }) => isActive ? 'active' : ''} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 17, color: isActive ? mainColor : '#444', background: isActive ? '#e0fdfa' : 'transparent', borderRadius: 10, padding: '12px 24px', textDecoration: 'none', transition: 'all 0.2s', boxShadow: isActive ? `0 2px 8px ${mainColor}22` : 'none'
            })}>
              <HistoryOutlined style={{ fontSize: 20, color: accentColor }} /> Riwayat Reservasi
            </NavLink>
          </li>
        </ul>
      </nav>
      <div style={{ position: 'absolute', bottom: 80, left: 0, width: '100%', textAlign: 'center' }}>
        <Button danger type="primary" onClick={handleLogout} style={{ width: '80%', fontWeight: 700, fontSize: 16, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default StaffSidenav;
