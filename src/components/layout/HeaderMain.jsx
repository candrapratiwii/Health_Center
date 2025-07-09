import React from 'react';
import { User, Bell, LogOut } from 'lucide-react';
import './HeaderPatient.css';

const HeaderMain = ({ onLogout, notificationsCount = 3, title = 'Layanan Puskesmas Buleleng', subtitle = 'Portal Kesehatan Digital', avatarIcon = <User size={36} /> }) => (
  <header className="header-patient">
    <div className="header-patient-left">
      <div className="header-patient-avatar">
        {avatarIcon}
      </div>
      <div>
        <div className="header-patient-title">{title}</div>
        <div className="header-patient-subtitle">{subtitle}</div>
      </div>
    </div>
    <div className="header-patient-right">
      <div className="header-patient-notif">
        <Bell size={28} />
        {notificationsCount > 0 && (
          <span className="header-patient-badge">{notificationsCount}</span>
        )}
      </div>
      {/* Hapus tombol logout di sini */}
    </div>
  </header>
);

export default HeaderMain; 