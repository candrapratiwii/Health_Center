import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Typography } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import { getDataPrivate } from "../../utils/api";

const { Title } = Typography;
const mainColor = "#14b8a6";

// Statistik pasien per puskesmas dari API
const getPasienPerPuskesmas = (users, puskesmasList) => {
  // users: array user, puskesmasList: array puskesmas
  // user.puskesmas atau user.id_puskesmas
  return puskesmasList.map((p) => ({
    puskesmas: p.nama_puskesmas,
    pasien: users.filter(
      (u) =>
        (u.id_puskesmas === p.id_puskesmas ||
          u.puskesmas === p.nama_puskesmas) &&
        u.role === "pasien"
    ).length,
  }));
};

const Laporan = () => {
  const [totalPasien, setTotalPasien] = useState(0);
  const [loadingPasien, setLoadingPasien] = useState(true);
  const [errorPasien, setErrorPasien] = useState(null);
  const [totalDokter, setTotalDokter] = useState(0);
  const [loadingDokter, setLoadingDokter] = useState(true);
  const [errorDokter, setErrorDokter] = useState(null);
  const [totalLayanan, setTotalLayanan] = useState(0);
  const [loadingLayanan, setLoadingLayanan] = useState(true);
  const [errorLayanan, setErrorLayanan] = useState(null);
  const [totalPuskesmas, setTotalPuskesmas] = useState(0);
  const [loadingPuskesmas, setLoadingPuskesmas] = useState(true);
  const [errorPuskesmas, setErrorPuskesmas] = useState(null);
  const [pasienPerPuskesmas, setPasienPerPuskesmas] = useState([]);
  const [loadingStatPuskesmas, setLoadingStatPuskesmas] = useState(true);

  // Gabungkan seluruh statistik ke dalam satu useEffect realtime
  useEffect(() => {
    setLoadingPasien(true);
    setLoadingDokter(true);
    setLoadingLayanan(true);
    setLoadingPuskesmas(true);
    setErrorPasien(null);
    setErrorDokter(null);
    setErrorLayanan(null);
    setErrorPuskesmas(null);
    async function fetchAllStats() {
      try {
        const [reservationsResp, dokterResp, layananResp, puskesmasResp] =
          await Promise.all([
            getDataPrivate("/api/v1/reservations/"),
            getDataPrivate("/api/v1/doctors"),
            getDataPrivate("/api/v1/services"),
            getDataPrivate("/api/v1/health_centers"),
          ]);
        // Total pasien: hanya user yang punya reservasi status confirmed (unik per id_user)
        let reservations = Array.isArray(reservationsResp)
          ? reservationsResp
          : reservationsResp.data || [];
        const confirmed = reservations.filter((r) => r.status === "confirmed");
        const uniqueUserIds = [...new Set(confirmed.map((r) => r.id_user))];
        setTotalPasien(uniqueUserIds.length);
        setLoadingPasien(false);
        // Total dokter
        let dokterArr = Array.isArray(dokterResp)
          ? dokterResp
          : dokterResp.data || [];
        setTotalDokter(dokterArr.length);
        setLoadingDokter(false);
        // Total layanan
        let layananArr = Array.isArray(layananResp)
          ? layananResp
          : layananResp.data || [];
        setTotalLayanan(layananArr.length);
        setLoadingLayanan(false);
        // Total puskesmas
        let puskesmasArr = Array.isArray(puskesmasResp)
          ? puskesmasResp
          : puskesmasResp.data || [];
        setTotalPuskesmas(puskesmasArr.length);
        setLoadingPuskesmas(false);
      } catch (err) {
        setErrorPasien(err.message);
        setTotalPasien(0);
        setLoadingPasien(false);
        setErrorDokter(err.message);
        setTotalDokter(0);
        setLoadingDokter(false);
        setErrorLayanan(err.message);
        setTotalLayanan(0);
        setLoadingLayanan(false);
        setErrorPuskesmas(err.message);
        setTotalPuskesmas(0);
        setLoadingPuskesmas(false);
      }
    }
    fetchAllStats();
    // Optional: polling untuk realtime, misal setiap 15 detik
    const interval = setInterval(fetchAllStats, 15000);
    return () => clearInterval(interval);
  }, []);

  // Statistik pasien per puskesmas dari reservasi confirmed
  useEffect(() => {
    async function fetchStatPuskesmas() {
      setLoadingStatPuskesmas(true);
      try {
        const [reservationsResp, puskesmasResp] = await Promise.all([
          getDataPrivate("/api/v1/reservations/"),
          getDataPrivate("/api/v1/health_centers"),
        ]);
        let reservations = Array.isArray(reservationsResp)
          ? reservationsResp
          : reservationsResp.data || [];
        let puskesmasList = Array.isArray(puskesmasResp)
          ? puskesmasResp
          : puskesmasResp.data || [];
        // Filter hanya yang status confirmed
        const confirmed = reservations.filter((r) => r.status === "confirmed");
        // Hitung jumlah pasien unik per puskesmas
        const stat = puskesmasList.map((p) => {
          // Ambil id_user unik untuk puskesmas ini
          const userIds = [
            ...new Set(
              confirmed
                .filter((r) => r.id_puskesmas === p.id_puskesmas)
                .map((r) => r.id_user)
            ),
          ];
          return {
            puskesmas: p.nama_puskesmas,
            pasien: userIds.length,
          };
        });
        setPasienPerPuskesmas(stat);
      } catch (err) {
        setPasienPerPuskesmas([]);
      } finally {
        setLoadingStatPuskesmas(false);
      }
    }
    fetchStatPuskesmas();
  }, []);

  const statCards = [
    {
      title: "Total Pasien",
      value: loadingPasien ? "-" : totalPasien,
      icon: <UserOutlined style={{ color: mainColor, fontSize: 32 }} />,
      border: mainColor,
    },
    {
      title: "Total Dokter",
      value: loadingDokter ? "-" : totalDokter,
      icon: <TeamOutlined style={{ color: mainColor, fontSize: 32 }} />,
      border: mainColor,
    },
    {
      title: "Total Layanan",
      value: loadingLayanan ? "-" : totalLayanan,
      icon: <MedicineBoxOutlined style={{ color: mainColor, fontSize: 32 }} />,
      border: mainColor,
    },
    {
      title: "Total Puskesmas",
      value: loadingPuskesmas ? "-" : totalPuskesmas,
      icon: <HomeOutlined style={{ color: mainColor, fontSize: 32 }} />,
      border: mainColor,
    },
  ];

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
        <Column
          data={pasienPerPuskesmas}
          xField="puskesmas"
          yField="pasien"
          color={mainColor}
          label={{
            position: "middle",
            style: {
              fill: "#fff",
              opacity: 0.8,
            },
          }}
          xAxis={{
            label: {
              autoHide: true,
              autoRotate: false,
            },
          }}
          meta={{
            puskesmas: { alias: "Puskesmas" },
            pasien: { alias: "Jumlah Pasien" },
          }}
          height={320}
          loading={loadingStatPuskesmas}
        />
      </Card>
    </div>
  );
};

export default Laporan;
