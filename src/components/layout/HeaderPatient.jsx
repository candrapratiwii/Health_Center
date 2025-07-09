import React from 'react';
import { User, Bell, LogOut } from 'lucide-react';
import './HeaderPatient.css';

const HeaderMain = ({
  title = 'Layanan Puskesmas Buleleng',
  subtitle = 'Portal Kesehatan Digital',
  onLogout,
  notificationsCount = 3,
  avatarIcon = <User size={36} />, // tidak dipakai lagi
  rightContent
}) => (
  <header className="header-patient">
    <div className="header-patient-left">
      {/* Hapus avatar/profile */}
      <div>
        <div className="header-patient-title">{title}</div>
        <div className="header-patient-subtitle">{subtitle}</div>
      </div>
    </div>
    <div className="header-patient-right">
      {/* Hanya tombol logout, hilangkan notifikasi */}
      <button className="header-patient-logout" onClick={onLogout}>
        <LogOut size={20} /> Keluar
      </button>
    </div>
  </header>
);

export default HeaderMain; 