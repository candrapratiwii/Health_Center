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

// import { useState } from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

import { useState, useContext } from "react";
import {
  DollarOutlined,
  FileImageOutlined,
  FundOutlined,
  IdcardOutlined,
  PieChartOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../providers/AuthProvider";
import AdminSidenav from "./sidenav/AdminSidenav";
import StaffSidenav from "./sidenav/StaffSidenav";


function Sidenav({ color }) {
  const { userProfile } = useContext(AuthContext);
  // Diasumsikan userProfile.roles berisi string role, misal: 'admin', 'staff', 'pasien'
  if (!userProfile || !userProfile.tipe_user) return null;

  if (userProfile.tipe_user === "admin") return <AdminSidenav color={color} />;
  if (userProfile.tipe_user === "staff") return <StaffSidenav color={color} />;
  // if (userProfile.roles === "pasien") return <PasienSidenav color={color} />;

  return null;
}

export default Sidenav;
