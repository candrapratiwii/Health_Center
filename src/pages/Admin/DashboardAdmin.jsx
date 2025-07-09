import React, { useEffect, useState } from "react";
import { getDataPrivate } from "../../utils/api";
import ReactApexChart from "react-apexcharts";
import {
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  User,
  Stethoscope,
} from "lucide-react";
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  SolutionOutlined,
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const DashboardAdmin = () => {
  // Dummy data
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalPasien, setTotalPasien] = useState(0);
  const [loadingPasien, setLoadingPasien] = useState(true);
  const [errorPasien, setErrorPasien] = useState(null);
  const [totalDokter, setTotalDokter] = useState(0);
  const [dokterTersedia, setDokterTersedia] = useState(0);
  const [loadingDokter, setLoadingDokter] = useState(true);
  const [errorDokter, setErrorDokter] = useState(null);
  const [totalReservasi, setTotalReservasi] = useState(0);
  const [loadingReservasi, setLoadingReservasi] = useState(true);
  const [errorReservasi, setErrorReservasi] = useState(null);
  const [totalStaf, setTotalStaf] = useState(0);
  const [loadingStaf, setLoadingStaf] = useState(true);
  const [errorStaf, setErrorStaf] = useState(null);
  const [totalPuskesmas, setTotalPuskesmas] = useState(0);
  const [loadingPuskesmas, setLoadingPuskesmas] = useState(true);
  const [errorPuskesmas, setErrorPuskesmas] = useState(null);
  const [totalLayanan, setTotalLayanan] = useState(0);
  const [loadingLayanan, setLoadingLayanan] = useState(true);
  const [errorLayanan, setErrorLayanan] = useState(null);
  const [chartData, setChartData] = useState({
    series: [{ name: "Kunjungan", data: [] }],
    categories: [],
  });
  const [loadingChart, setLoadingChart] = useState(true);

  // Tambahkan state untuk pasien terbaru dan dokter terbaru
  const [latestPatients, setLatestPatients] = useState([]);
  const [latestDoctors, setLatestDoctors] = useState([]);

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Jakarta",
      };
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      };
      setDate(now.toLocaleDateString("id-ID", options));
      setTime(now.toLocaleTimeString("id-ID", timeOptions) + " WIB");
    }
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchPasien() {
      setLoadingPasien(true);
      setErrorPasien(null);
      try {
        const data = await getDataPrivate("/api/v1/reservations/");
        let arr = Array.isArray(data) ? data : data.data || [];
        // Filter reservasi yang statusnya 'confirmed'
        const confirmed = arr.filter((r) => r.status === "confirmed");
        // Ambil id_user unik
        const uniqueUserIds = [...new Set(confirmed.map((r) => r.id_user))];
        setTotalPasien(uniqueUserIds.length);
      } catch (err) {
        setErrorPasien(err.message);
        setTotalPasien(0);
      } finally {
        setLoadingPasien(false);
      }
    }
    fetchPasien();
  }, []);

  useEffect(() => {
    async function fetchDokter() {
      setLoadingDokter(true);
      setErrorDokter(null);
      try {
        const resp = await getDataPrivate("/api/v1/doctors");
        let arr = Array.isArray(resp) ? resp : resp.data || [];
        setTotalDokter(arr.length);
      } catch (err) {
        setErrorDokter(err.message);
        setTotalDokter(0);
      } finally {
        setLoadingDokter(false);
      }
    }
    fetchDokter();
  }, []);

  useEffect(() => {
    async function fetchReservasi() {
      setLoadingReservasi(true);
      setErrorReservasi(null);
      try {
        const reservationsResp = await getDataPrivate("/api/v1/reservations/");
        let reservations = Array.isArray(reservationsResp)
          ? reservationsResp
          : reservationsResp.data || [];
        setTotalReservasi(reservations.length);
      } catch (err) {
        setErrorReservasi(err.message);
        setTotalReservasi(0);
      } finally {
        setLoadingReservasi(false);
      }
    }
    fetchReservasi();
  }, []);

  useEffect(() => {
    async function fetchStaf() {
      setLoadingStaf(true);
      setErrorStaf(null);
      try {
        const data = await getDataPrivate("/api/v1/users/");
        let arr = Array.isArray(data) ? data : data.data || [];
        const staff = arr.filter((u) => u.tipe_user === "staff");
        setTotalStaf(staff.length);
      } catch (err) {
        setErrorStaf(err.message);
        setTotalStaf(0);
      } finally {
        setLoadingStaf(false);
      }
    }
    fetchStaf();
  }, []);

  useEffect(() => {
    async function fetchPuskesmas() {
      setLoadingPuskesmas(true);
      setErrorPuskesmas(null);
      try {
        const resp = await getDataPrivate("/api/v1/health_centers");
        let arr = Array.isArray(resp) ? resp : resp.data || [];
        setTotalPuskesmas(arr.length);
      } catch (err) {
        setErrorPuskesmas(err.message);
        setTotalPuskesmas(0);
      } finally {
        setLoadingPuskesmas(false);
      }
    }
    fetchPuskesmas();
  }, []);

  useEffect(() => {
    async function fetchLayanan() {
      setLoadingLayanan(true);
      setErrorLayanan(null);
      try {
        const resp = await getDataPrivate("/api/v1/services");
        let arr = Array.isArray(resp) ? resp : resp.data || [];
        setTotalLayanan(arr.length);
      } catch (err) {
        setErrorLayanan(err.message);
        setTotalLayanan(0);
      } finally {
        setLoadingLayanan(false);
      }
    }
    fetchLayanan();
  }, []);

  useEffect(() => {
    async function fetchChartData() {
      setLoadingChart(true);
      try {
        const reservationsResp = await getDataPrivate("/api/v1/reservations/");
        let reservations = Array.isArray(reservationsResp)
          ? reservationsResp
          : reservationsResp.data || [];
        // Ambil tanggal 7 hari terakhir
        const today = new Date();
        const days = [...Array(7)].map((_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6 - i));
          return d;
        });
        const categories = days.map((d) =>
          d.toLocaleDateString("id-ID", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })
        );
        // Hitung jumlah reservasi per hari
        const data = days.map((d) => {
          const dStr = d.toISOString().slice(0, 10);
          return reservations.filter(
            (r) =>
              (r.tanggal_reservasi || r.tanggal || r.createdAt || "").slice(
                0,
                10
              ) === dStr
          ).length;
        });
        setChartData({
          series: [{ name: "Kunjungan", data }],
          categories,
        });
      } catch (err) {
        setChartData({
          series: [{ name: "Kunjungan", data: [] }],
          categories: [],
        });
      } finally {
        setLoadingChart(false);
      }
    }
    fetchChartData();
  }, []);

  // Fetch pasien terbaru dari reservasi, tampilkan username, layanan, puskesmas, status
  useEffect(() => {
    async function fetchLatestPatientsFromReservations() {
      try {
        // Ambil semua reservasi
        const reservationsResp = await getDataPrivate("/api/v1/reservations/");
        let reservations = Array.isArray(reservationsResp)
          ? reservationsResp
          : reservationsResp.data || [];
        // Urutkan berdasarkan tanggal reservasi terbaru
        reservations.sort(
          (a, b) =>
            new Date(b.createdAt || b.tanggal_reservasi) -
            new Date(a.createdAt || a.tanggal_reservasi)
        );
        // Ambil id_user unik sesuai urutan terbaru
        const uniqueUserIds = [];
        const latestReservations = [];
        for (const r of reservations) {
          if (r.id_user && !uniqueUserIds.includes(r.id_user)) {
            uniqueUserIds.push(r.id_user);
            latestReservations.push(r);
          }
          if (latestReservations.length >= 5) break;
        }
        // Ambil data user, layanan, dan puskesmas
        const [usersResp, servicesResp, puskesmasResp] = await Promise.all([
          getDataPrivate("/api/v1/users/"),
          getDataPrivate("/api/v1/services"),
          getDataPrivate("/api/v1/health_centers"),
        ]);
        let users = Array.isArray(usersResp) ? usersResp : usersResp.data || [];
        let services = Array.isArray(servicesResp)
          ? servicesResp
          : servicesResp.data || [];
        let puskesmas = Array.isArray(puskesmasResp)
          ? puskesmasResp
          : puskesmasResp.data || [];
        // Map ke data yang dibutuhkan
        const latestPatientsData = latestReservations.map((r) => {
          const user = users.find((u) => u.id_user === r.id_user) || {};
          const layanan =
            services.find((s) => s.id_layanan === r.id_layanan) || {};
          const pusk =
            puskesmas.find(
              (p) =>
                p.id_puskesmas === r.id_puskesmas ||
                p.kode_faskes === r.id_puskesmas
            ) || {};
          return {
            id_user: r.id_user,
            username: user.username || `Pasien #${r.id_user}`,
            layanan: layanan.nama_layanan || "-",
            puskesmas: pusk.nama_puskesmas || "-",
            status: r.status || "-",
          };
        });
        setLatestPatients(latestPatientsData);
      } catch (err) {
        setLatestPatients([]);
      }
    }
    fetchLatestPatientsFromReservations();
  }, []);

  // Fetch dokter terbaru: ambil semua dokter dari /api/v1/doctors, urutkan terbaru, tampilkan nama saja
  useEffect(() => {
    async function fetchLatestDoctors() {
      try {
        const resp = await getDataPrivate("/api/v1/doctors");
        let arr = Array.isArray(resp) ? resp : resp.data || [];
        arr.sort(
          (a, b) =>
            new Date(b.createdAt || b.tanggal_dibuat) -
            new Date(a.createdAt || a.tanggal_dibuat)
        );
        setLatestDoctors(arr.slice(0, 5));
      } catch (err) {
        setLatestDoctors([]);
      }
    }
    fetchLatestDoctors();
  }, []);

  // Dummy stats
  const stats = [
    {
      icon: "👥",
      number: loadingPasien ? "-" : totalPasien,
      label: "Total Pasien Hari Ini",
      change: "+12% dari kemarin",
      changeType: "positive",
    },
    {
      icon: "👨‍⚕",
      number: loadingDokter ? "-" : totalDokter,
      label: "Dokter Aktif",
      change: "-",
      changeType: "positive",
    },
    {
      icon: "🏥",
      number: loadingReservasi ? "-" : totalReservasi,
      label: "Total Reservasi",
      change: "+8% dari kemarin",
      changeType: "positive",
    },
    {
      icon: "💊",
      number: loadingStaf ? "-" : totalStaf,
      label: "Total Staf",
      change: "-3% dari kemarin",
      changeType: "negative",
    },
  ];
  const quickStats = [
    {
      title: "🚨 Antrian Gawat Darurat",
      value: 3,
      desc: "Perlu penanganan segera",
      color: "#ef4444",
    },
    {
      title: "⏰ Rata-rata Waktu Tunggu",
      value: "23 min",
      desc: "Dalam batas normal",
      color: "#22c55e",
    },
    {
      title: "🛏 Kapasitas Ruang",
      value: "78%",
      desc: "12 dari 15 ruang terisi",
      color: "#f59e0b",
    },
    {
      title: "💰 Pendapatan Hari Ini",
      value: "Rp 8.5M",
      desc: "Target tercapai 85%",
      color: "#22c55e",
    },
  ];
  const pasienTerbaru = [
    {
      avatar: "M",
      name: "I Made Sudarma",
      detail: "Poli Umum • 14:25 WIB",
      status: "Sedang Dilayani",
      statusClass: "status-online",
    },
    {
      avatar: "N",
      name: "Ni Luh Putu Sari",
      detail: "Poli Anak • 14:15 WIB",
      status: "Menunggu",
      statusClass: "status-busy",
    },
    {
      avatar: "I",
      name: "I Ketut Adi Wijaya",
      detail: "Poli Gigi • 14:10 WIB",
      status: "Selesai",
      statusClass: "status-offline",
    },
    {
      avatar: "N",
      name: "Ni Komang Ayu Dewi",
      detail: "Poli Mata • 14:00 WIB",
      status: "Sedang Dilayani",
      statusClass: "status-online",
    },
    {
      avatar: "I",
      name: "I Gede Putra",
      detail: "Poli Jantung • 13:45 WIB",
      status: "Selesai",
      statusClass: "status-offline",
    },
  ];
  const dokterStatus = [
    {
      avatar: "P",
      name: "dr. Putu Suryani",
      detail: "Spesialis Anak • Ruang 101",
      status: "Tersedia",
      statusClass: "status-online",
    },
    {
      avatar: "M",
      name: "dr. Made Adi",
      detail: "Dokter Umum • Ruang 102",
      status: "Sibuk",
      statusClass: "status-busy",
    },
    {
      avatar: "K",
      name: "dr. Komang Dewi",
      detail: "Spesialis Mata • Ruang 103",
      status: "Tersedia",
      statusClass: "status-online",
    },
    {
      avatar: "K",
      name: "dr. Ketut Putra",
      detail: "Spesialis Jantung • Ruang 104",
      status: "Istirahat",
      statusClass: "status-offline",
    },
    {
      avatar: "N",
      name: "dr. Nyoman Sari",
      detail: "Spesialis Gigi • Ruang 105",
      status: "Sibuk",
      statusClass: "status-busy",
    },
  ];
  const activities = [
    {
      icon: "📅",
      iconClass: "appointment",
      title: "Reservasi Baru",
      desc: "Ni Luh Putu Sari membuat reservasi untuk Poli Anak",
      time: "2 menit yang lalu",
    },
    {
      icon: "👤",
      iconClass: "registration",
      title: "Pendaftaran Pasien Baru",
      desc: "I Made Sudarma berhasil terdaftar sebagai pasien baru",
      time: "5 menit yang lalu",
    },
    {
      icon: "💊",
      iconClass: "medicine",
      title: "Pengambilan Obat",
      desc: "I Ketut Adi Wijaya mengambil obat di apotek",
      time: "10 menit yang lalu",
    },
    {
      icon: "📊",
      iconClass: "report",
      title: "Laporan Harian",
      desc: "Laporan kunjungan pasien hari ini telah dibuat",
      time: "15 menit yang lalu",
    },
    {
      icon: "🚨",
      iconClass: "appointment",
      title: "Pasien Gawat Darurat",
      desc: "Pasien dengan kondisi kritis masuk ke UGD",
      time: "20 menit yang lalu",
    },
  ];

  return (
    <div
      style={{
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div
        className="main-content"
        style={{ flex: 1, padding: 30, marginLeft: 0, width: "100%" }}
      >
        {/* HEADER: gradien biru-hijau seperti staff */}
        <div
          className="header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
            background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
            padding: 32,
            borderRadius: 18,
            boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            color: "white",
            minHeight: 110,
          }}
        >
          <div className="header-left">
            <h1
              style={{
                color: "white",
                fontSize: 32,
                fontWeight: 700,
                marginBottom: 5,
              }}
            >
              Dashboard Admin
            </h1>
            <div
              className="header-subtitle"
              style={{ color: "#e0f2f1", fontSize: 16 }}
            >
              Selamat datang di Sistem Informasi Puskesmas
            </div>
          </div>
          <div className="header-right">
            <div
              className="date-time"
              style={{ textAlign: "right", color: "#e0f2f1" }}
            >
              <div
                className="current-date"
                style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}
              >
                {date}
              </div>
              <div
                className="current-time"
                style={{ fontSize: 14, marginTop: 5 }}
              >
                {time}
              </div>
            </div>
          </div>
        </div>
        {/* CARD STATISTIK: seperti staff, gradien, icon SVG lucide, data tetap admin */}
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 25,
            marginBottom: 40,
            width: "100%",
            padding: "0 0.5rem",
          }}
        >
          <div
            className="stat-card"
            style={{
              background: "white",
              borderRadius: 18,
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "1.5rem 1.2rem",
              minHeight: 120,
            }}
          >
            <div
              className="stat-icon"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserOutlined style={{ fontSize: 32, color: "#fff" }} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  color: "#14b8a6",
                }}
              >
                {loadingPasien ? "-" : totalPasien}
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontWeight: 400 }}>
                Total Pasien Hari Ini
              </p>
            </div>
          </div>
          <div
            className="stat-card"
            style={{
              background: "white",
              borderRadius: 18,
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "1.5rem 1.2rem",
              minHeight: 120,
            }}
          >
            <div
              className="stat-icon"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MedicineBoxOutlined style={{ fontSize: 32, color: "#fff" }} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  color: "#14b8a6",
                }}
              >
                {loadingDokter ? "-" : totalDokter}
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontWeight: 400 }}>
                Dokter Aktif
              </p>
            </div>
          </div>
          <div
            className="stat-card"
            style={{
              background: "white",
              borderRadius: 18,
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "1.5rem 1.2rem",
              minHeight: 120,
            }}
          >
            <div
              className="stat-icon"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SolutionOutlined style={{ fontSize: 32, color: "#fff" }} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  color: "#14b8a6",
                }}
              >
                {loadingReservasi ? "-" : totalReservasi}
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontWeight: 400 }}>
                Total Reservasi
              </p>
            </div>
          </div>
          <div
            className="stat-card"
            style={{
              background: "white",
              borderRadius: 18,
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "1.5rem 1.2rem",
              minHeight: 120,
            }}
          >
            <div
              className="stat-icon"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TeamOutlined style={{ fontSize: 32, color: "#fff" }} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  color: "#14b8a6",
                }}
              >
                {loadingStaf ? "-" : totalStaf}
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontWeight: 400 }}>
                Total Staf
              </p>
            </div>
          </div>
          {/* Card Total Puskesmas */}
          <div
            className="stat-card"
            style={{
              background: "white",
              borderRadius: 18,
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "1.5rem 1.2rem",
              minHeight: 120,
            }}
          >
            <div
              className="stat-icon"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HomeOutlined style={{ fontSize: 32, color: "#fff" }} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  color: "#14b8a6",
                }}
              >
                {loadingPuskesmas ? "-" : totalPuskesmas}
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontWeight: 400 }}>
                Total Puskesmas
              </p>
            </div>
          </div>
          {/* Card Total Layanan */}
          <div
            className="stat-card"
            style={{
              background: "white",
              borderRadius: 18,
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "1.5rem 1.2rem",
              minHeight: 120,
            }}
          >
            <div
              className="stat-icon"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SolutionOutlined style={{ fontSize: 32, color: "#fff" }} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  color: "#14b8a6",
                }}
              >
                {loadingLayanan ? "-" : totalLayanan}
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontWeight: 400 }}>
                Total Layanan
              </p>
            </div>
          </div>
        </div>
        {/* PASIEN TERBARU & DOKTER TERBARU: card list seperti antrian pasien hari ini di staff, data dari API */}
        <div
          className="content-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 30,
            marginBottom: 40,
          }}
        >
          {/* Pasien Terbaru */}
          <div
            className="content-section"
            style={{
              background: "white",
              padding: 30,
              borderRadius: 20,
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              className="section-title"
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#333",
                marginBottom: 25,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <TeamOutlined style={{ fontSize: 28, color: "#722ed1" }} /> Pasien
              Terbaru
            </h2>
            <div
              className="patient-list"
              style={{ maxHeight: 400, overflowY: "auto" }}
            >
              {latestPatients.length === 0 ? (
                <div
                  style={{
                    color: "#888",
                    textAlign: "center",
                    padding: "2rem 0",
                    fontSize: 16,
                  }}
                >
                  Tidak ada data pasien terbaru.
                </div>
              ) : (
                latestPatients.map((p, i) => (
                  <div
                    key={p.id_user}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 2px 8px #0001",
                      padding: "1.2rem 2rem",
                      marginBottom: 18,
                      border: "1px solid #f0f4f8",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 20,
                          marginBottom: 2,
                          color: "#1e293b",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <UserOutlined
                          style={{ fontSize: 20, color: "#14b8a6" }}
                        />{" "}
                        {p.username}
                      </div>
                      <div style={{ color: "#14b8a6", marginBottom: 2 }}>
                        Layanan: {p.layanan}
                      </div>
                      <div style={{ color: "#64748b", marginBottom: 2 }}>
                        Puskesmas: {p.puskesmas}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          padding: "6px 14px",
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: 600,
                          background:
                            p.status === "confirmed"
                              ? "rgba(34,197,94,0.12)"
                              : p.status === "cancelled"
                              ? "rgba(239,68,68,0.12)"
                              : "rgba(251,191,36,0.15)",
                          color:
                            p.status === "confirmed"
                              ? "#22c55e"
                              : p.status === "cancelled"
                              ? "#ef4444"
                              : "#eab308",
                          border:
                            p.status === "confirmed"
                              ? "1px solid #22c55e33"
                              : p.status === "cancelled"
                              ? "1px solid #ef444433"
                              : "1px solid #eab30833",
                        }}
                      >
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Dokter Terbaru */}
          <div
            className="content-section"
            style={{
              background: "white",
              padding: 30,
              borderRadius: 20,
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              className="section-title"
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#333",
                marginBottom: 25,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <MedicineBoxOutlined style={{ fontSize: 28, color: "#faad14" }} />{" "}
              Dokter Terbaru
            </h2>
            <div
              className="patient-list"
              style={{ maxHeight: 400, overflowY: "auto" }}
            >
              {latestDoctors.length === 0 ? (
                <div
                  style={{
                    color: "#888",
                    textAlign: "center",
                    padding: "2rem 0",
                    fontSize: 16,
                  }}
                >
                  Tidak ada data dokter terbaru.
                </div>
              ) : (
                latestDoctors.map((d, i) => (
                  <div
                    key={d.id_dokter || i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 2px 8px #0001",
                      padding: "1.2rem 2rem",
                      marginBottom: 18,
                      border: "1px solid #f0f4f8",
                    }}
                  >
                    <MedicineBoxOutlined
                      style={{
                        fontSize: 22,
                        color: "#faad14",
                        marginRight: 14,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 20,
                        color: "#1e293b",
                      }}
                    >
                      {d.nama_dokter}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
