import React from 'react';
import { User, Bell, LogOut } from 'lucide-react';
import './HeaderPatient.css';

const HeaderMain = ({
  title = 'Layanan Puskesmas Buleleng',
  subtitle = 'Portal Kesehatan Digital',
  onLogout,
  notificationsCount = 3,
  avatarIcon = <User size={36} />,
  rightContent
}) => (
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
      {rightContent ? rightContent : <>
        <div className="header-patient-notif">
          <Bell size={28} />
          {notificationsCount > 0 && (
            <span className="header-patient-badge">{notificationsCount}</span>
          )}
        </div>
        <button className="header-patient-logout" onClick={onLogout}>
          <LogOut size={20} /> Keluar
        </button>
      </>}
    </div>
  </header>
);

export default HeaderMain; 