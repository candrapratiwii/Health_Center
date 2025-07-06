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

function StaffSidenav({ color }) {
  const [selectedKey, setSelectedKey] = useState("/staff/dashboard");

  const menuItems = [
    {
      key: "/staff/dashboard",
      label: (
        <NavLink to="/staff/dashboard">
          <span
            className="icon"
            style={{
              backgroundColor:
                selectedKey === "/staff/dashboard" ? "#f0f6ff" : "",
            }}
          >
            <HomeOutlined
              style={{
                color: selectedKey === "/staff/dashboard" ? "#1677ff" : color,
              }}
            />
          </span>
          <span className="label">Dashboard</span>
        </NavLink>
      ),
    },
    {
      key: "/staff/reservasi",
      label: (
        <NavLink to="/staff/reservasi">
          <span
            className="icon"
            style={{
              backgroundColor:
                selectedKey === "/staff/reservasi" ? "#f0f6ff" : "",
            }}
          >
            <CalendarOutlined
              style={{
                color: selectedKey === "/staff/reservasi" ? "#1677ff" : color,
              }}
            />
          </span>
          <span className="label">Kelola Reservasi</span>
        </NavLink>
      ),
    },
    {
      key: "/staff/layanan",
      label: (
        <NavLink to="/staff/layanan">
          <span
            className="icon"
            style={{
              backgroundColor:
                selectedKey === "/staff/layanan" ? "#f0f6ff" : "",
            }}
          >
            <MedicineBoxOutlined
              style={{
                color: selectedKey === "/staff/layanan" ? "#1677ff" : color,
              }}
            />
          </span>
          <span className="label">Data Layanan</span>
        </NavLink>
      ),
    },
    {
      key: "/staff/dokter",
      label: (
        <NavLink to="/staff/dokter">
          <span
            className="icon"
            style={{
              backgroundColor: selectedKey === "/staff/dokter" ? "#f0f6ff" : "",
            }}
          >
            <TeamOutlined
              style={{
                color: selectedKey === "/staff/dokter" ? "#1677ff" : color,
              }}
            />
          </span>
          <span className="label">Data Dokter</span>
        </NavLink>
      ),
    },
    {
      key: "/staff/pasien",
      label: (
        <NavLink to="/staff/pasien">
          <span
            className="icon"
            style={{
              backgroundColor: selectedKey === "/staff/pasien" ? "#f0f6ff" : "",
            }}
          >
            <UserAddOutlined
              style={{
                color: selectedKey === "/staff/pasien" ? "#1677ff" : color,
              }}
            />
          </span>
          <span className="label">Data Pasien</span>
        </NavLink>
      ),
    },
    {
      key: "/staff/laporan",
      label: (
        <NavLink to="/staff/laporan">
          <span
            className="icon"
            style={{
              backgroundColor:
                selectedKey === "/staff/laporan" ? "#f0f6ff" : "",
            }}
          >
            <BarChartOutlined
              style={{
                color: selectedKey === "/staff/laporan" ? "#1677ff" : color,
              }}
            />
          </span>
          <span className="label">Laporan</span>
        </NavLink>
      ),
    },
    // {
    //   key: "/staff/pengaturan",
    //   label: (
    //     <NavLink to="/staff/pengaturan">
    //       <span
    //         className="icon"
    //         style={{ backgroundColor: selectedKey === "/staff/pengaturan" ? "#f0f6ff" : "" }}
    //       >
    //         <SettingOutlined style={{ color: selectedKey === "/staff/pengaturan" ? "#1677ff" : color }} />
    //       </span>
    //       <span className="label">Pengaturan</span>
    //     </NavLink>
    //   ),
    // },
  ];

  const handleMenuKey = ({ key }) => {
    setSelectedKey(key);
  };

  return (
    <>
      <div className="brand">
        <span>Staff Puskesmas</span>
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

export default StaffSidenav;
