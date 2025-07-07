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
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import './Main.css';

const Main = () => {
  const { isLoadingScreen, userProfile, logout } = useContext(AuthContext);
  if (isLoadingScreen) return <div>Loading...</div>;

  return (
    <div className="main-layout">
      <Sidenav />
      <div className="main-content">
        <div className="main-body">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Main;
