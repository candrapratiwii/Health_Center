/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useContext } from 'react';
import Sidenav from './Sidenav';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import './Main.css';
import { Bell, LogOut } from 'lucide-react';

const Main = () => {
  const { isLoadingScreen, userProfile, logout } = useContext(AuthContext);
  const location = useLocation();
  const isDashboard = location.pathname === '/patien' || location.pathname === '/patien/dashboard';
  const username = userProfile?.nama || userProfile?.username || 'Pengguna';

  if (isLoadingScreen) return <div>Loading...</div>;

  return (
    <div className="main-layout">
      <Sidenav />
      <div className="main-content">
        {isDashboard && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem',
            padding: '1.2rem 2rem 0.5rem 2rem',
            background: 'transparent',
          }}>
            <div style={{textAlign: 'left'}}>
              <h2 style={{margin: 0, fontSize: '2rem', fontWeight: 700, color: '#14b8a6'}}>Selamat Datang, {username}</h2>
              <p style={{margin: 0, fontSize: '1.1rem', fontWeight: 400, opacity: 0.95, color: '#0891b2'}}>Kelola kesehatan Anda dengan mudah melalui sistem reservasi Puskesmas Buleleng</p>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                <Bell size={22} />
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}>3</span>
              </button>
              <button
                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={logout}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        )}
        <div className="main-body">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Main;
