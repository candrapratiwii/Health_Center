import { useState } from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import {
  HomeOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  UserAddOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

function AdminSidenav({ color }) {
  const [selectedKey, setSelectedKey] = useState("/admin/dashboard");

  const menuItems = [
    {
      key: "/admin/dashboard",
      label: (
        <NavLink to="/admin/dashboard">
          <span
            className="icon"
            style={{ backgroundColor: selectedKey === "/admin/dashboard" ? "#f0f6ff" : "" }}
          >
            <HomeOutlined style={{ color: selectedKey === "/admin/dashboard" ? "#1677ff" : color }} />
          </span>
          <span className="label">Dashboard</span>
        </NavLink>
      ),
    },
    {
      key: "/admin/reservasi",
      label: (
        <NavLink to="/admin/reservasi">
          <span
            className="icon"
            style={{ backgroundColor: selectedKey === "/admin/reservasi" ? "#f0f6ff" : "" }}
          >
            <CalendarOutlined style={{ color: selectedKey === "/admin/reservasi" ? "#1677ff" : color }} />
          </span>
          <span className="label">Kelola Reservasi</span>
        </NavLink>
      ),
    },
    {
      key: "/admin/layanan",
      label: (
        <NavLink to="/admin/layanan">
          <span
            className="icon"
            style={{ backgroundColor: selectedKey === "/admin/layanan" ? "#f0f6ff" : "" }}
          >
            <MedicineBoxOutlined style={{ color: selectedKey === "/admin/layanan" ? "#1677ff" : color }} />
          </span>
          <span className="label">Data Layanan</span>
        </NavLink>
      ),
    },
    {
      key: "/admin/dokter",
      label: (
        <NavLink to="/admin/dokter">
          <span
            className="icon"
            style={{ backgroundColor: selectedKey === "/admin/dokter" ? "#f0f6ff" : "" }}
          >
            <TeamOutlined style={{ color: selectedKey === "/admin/dokter" ? "#1677ff" : color }} />
          </span>
          <span className="label">Data Dokter</span>
        </NavLink>
      ),
    },
    {
      key: "/admin/pasien",
      label: (
        <NavLink to="/admin/pasien">
          <span
            className="icon"
            style={{ backgroundColor: selectedKey === "/admin/pasien" ? "#f0f6ff" : "" }}
          >
            <UserAddOutlined style={{ color: selectedKey === "/admin/pasien" ? "#1677ff" : color }} />
          </span>
          <span className="label">Data Pasien</span>
        </NavLink>
      ),
    },
    {
      key: "/admin/laporan",
      label: (
        <NavLink to="/admin/laporan">
          <span
            className="icon"
            style={{ backgroundColor: selectedKey === "/admin/laporan" ? "#f0f6ff" : "" }}
          >
            <BarChartOutlined style={{ color: selectedKey === "/admin/laporan" ? "#1677ff" : color }} />
          </span>
          <span className="label">Laporan</span>
        </NavLink>
      ),
    },
    {
      key: "/admin/pengaturan",
      label: (
        <NavLink to="/admin/pengaturan">
          <span
            className="icon"
            style={{ backgroundColor: selectedKey === "/admin/pengaturan" ? "#f0f6ff" : "" }}
          >
            <SettingOutlined style={{ color: selectedKey === "/admin/pengaturan" ? "#1677ff" : color }} />
          </span>
          <span className="label">Pengaturan</span>
        </NavLink>
      ),
    },
  ];

  const handleMenuKey = ({ key }) => {
    setSelectedKey(key);
  };

  return (
    <>
      <div className="brand">
        <span>Admin Puskesmas</span>
      </div>
      <hr />
      <Menu
        theme="light"
        mode="inline"
        items={menuItems}
        selectedKeys={[selectedKey]}
        onSelect={handleMenuKey}
      />
    </>
  );
}

export default AdminSidenav;
