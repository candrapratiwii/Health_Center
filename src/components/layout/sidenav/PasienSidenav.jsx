import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, User } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/patien/dashboard' },
  { id: 'booking', label: 'Buat Reservasi', icon: Calendar, path: '/patien/booking' },
  { id: 'appointments', label: 'Reservasi Saya', icon: Clock, path: '/patien/appointments' },
  { id: 'profile', label: 'Profil Saya', icon: User, path: '/patien/profile' }
];

const PasienSidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar-patient">
      <div className="sidebar-header">
        <span className="sidebar-logo">P</span>
        <div>
          <h1 className="sidebar-title">Puskesmas Buleleng</h1>
          <p className="sidebar-desc">Sistem Reservasi</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item${isActive ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="sidebar-nav-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <User className="sidebar-user-icon" />
          <span>I Made Budi</span>
        </div>
      </div>
    </aside>
  );
};

export default PasienSidenav;
