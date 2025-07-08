import React from "react";
import { Row, Col, Card, Statistic, Typography } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/plots";

const { Title } = Typography;
const mainColor = "#14b8a6";

const dummyStats = {
  pasien: 1200,
  dokter: 45,
  layanan: 18,
  puskesmas: 13,
};

const pasienPerPuskesmas = [
  { puskesmas: "Buleleng I", pasien: 180 },
  { puskesmas: "Buleleng II", pasien: 150 },
  { puskesmas: "Sukasada I", pasien: 120 },
  { puskesmas: "Sukasada II", pasien: 90 },
  { puskesmas: "Sawan I", pasien: 100 },
  { puskesmas: "Sawan II", pasien: 80 },
  { puskesmas: "Banjar I", pasien: 110 },
  { puskesmas: "Banjar II", pasien: 70 },
  { puskesmas: "Seririt I", pasien: 100 },
  { puskesmas: "Seririt II", pasien: 60 },
  { puskesmas: "Tejakula", pasien: 70 },
  { puskesmas: "Kubutambahan", pasien: 40 },
  { puskesmas: "Busungbiu", pasien: 30 },
];

const columnConfig = {
  data: pasienPerPuskesmas,
  xField: "puskesmas",
  yField: "pasien",
  color: mainColor,
  label: {
    position: "middle",
    style: {
      fill: "#fff",
      opacity: 0.8,
    },
  },
  xAxis: {
    label: {
      autoHide: true,
      autoRotate: false,
    },
  },
  meta: {
    puskesmas: { alias: "Puskesmas" },
    pasien: { alias: "Jumlah Pasien" },
  },
  height: 320,
};

const statCards = [
  {
    title: "Total Pasien",
    value: dummyStats.pasien,
    icon: <UserOutlined style={{ color: mainColor, fontSize: 32 }} />,
    border: mainColor,
  },
  {
    title: "Total Dokter",
    value: dummyStats.dokter,
    icon: <TeamOutlined style={{ color: mainColor, fontSize: 32 }} />,
    border: mainColor,
  },
  {
    title: "Total Layanan",
    value: dummyStats.layanan,
    icon: <MedicineBoxOutlined style={{ color: mainColor, fontSize: 32 }} />,
    border: mainColor,
  },
  {
    title: "Total Puskesmas",
    value: dummyStats.puskesmas,
    icon: <HomeOutlined style={{ color: mainColor, fontSize: 32 }} />,
    border: mainColor,
  },
];

const Laporan = () => {
  return (
    <div style={{ padding: 32, background: "#f6fafd", minHeight: "100vh" }}>
      <Title
        level={2}
        style={{ color: mainColor, fontWeight: 700, marginBottom: 0 }}
      >
        Laporan & Statistik
      </Title>
      <div style={{ color: "#555", fontSize: 18, marginBottom: 24 }}>
        Statistik data puskesmas Buleleng
      </div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {statCards.map((item) => (
          <Col xs={12} md={6} key={item.title}>
            <Card
              style={{
                background: "#fff",
                border: `2px solid ${item.border}`,
                borderRadius: 14,
                textAlign: "center",
                boxShadow: "0 2px 8px 0 rgba(20,184,166,0.04)",
              }}
              bodyStyle={{ padding: 18 }}
            >
              <div style={{ marginBottom: 8 }}>{item.icon}</div>
              <div
                style={{ fontSize: 22, fontWeight: 700, color: item.border }}
              >
                {item.value}
              </div>
              <div style={{ fontSize: 14, color: "#555" }}>{item.title}</div>
            </Card>
          </Col>
        ))}
      </Row>
      <Card
        title={
          <span style={{ color: mainColor }}>
            Statistik Pasien per Puskesmas
          </span>
        }
        style={{ borderRadius: 16, border: `2px solid ${mainColor}` }}
      >
        <Column {...columnConfig} />
      </Card>
    </div>
  );
};

export default Laporan;
