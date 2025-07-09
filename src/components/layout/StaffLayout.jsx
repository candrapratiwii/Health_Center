import React from "react";
import StaffSidenav from "./sidenav/StaffSidenav";
import { Outlet } from "react-router-dom";

const StaffLayout = () => (
  <div style={{ minHeight: "100vh", background: "#f6fafd" }}>
    <StaffSidenav />
    <div style={{ flex: 1, minHeight: "100vh", background: "#f6fafd", display: 'flex', flexDirection: 'column', marginLeft: 220 }}>
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <footer style={{ textAlign: 'center', color: '#888', fontSize: 13, padding: '18px 0 10px 0', opacity: 0.7 }}>
        Copyright © 2025 HealthCenter - Powered by Semangat Hidup Team
      </footer>
    </div>
  </div>
);

export default StaffLayout; 