import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  ProfileOutlined,
  FieldTimeOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import landingImg from "../../assets/images/landing.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  React.useEffect(() => {
    // Smooth scrolling for nav links
    const handleSmoothScroll = (e) => {
      if (e.target.matches('a[href^="#"]')) {
        const href = e.target.getAttribute("href");
        if (href === "#home") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    document.querySelectorAll(".nav-links a").forEach((anchor) => {
      anchor.addEventListener("click", handleSmoothScroll);
    });
    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.querySelectorAll(".nav-links a").forEach((anchor) => {
        anchor.removeEventListener("click", handleSmoothScroll);
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">
              <MedicineBoxOutlined style={{ fontSize: 28, color: "#fff" }} />
            </div>
            <div className="logo-text">Reservasi Puskesmas</div>
          </div>
          <ul className="nav-links">
            <li>
              <a href="#home">Beranda</a>
            </li>
            <li>
              <a href="#layanan">Layanan</a>
            </li>
            <li>
              <a href="#info">Informasi</a>
            </li>
          </ul>
          <button className="login-btn" onClick={goToLogin}>
            Masuk / Daftar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-container">
          <div
            className="hero-content"
            style={{
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              zIndex: 2,
            }}
          >
            <h1
              style={{
                fontSize: "2.7rem",
                color: "#fff",
                fontWeight: 700,
                marginBottom: "1rem",
                textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              Reservasi Online Puskesmas
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "rgba(255,255,255,0.95)",
                marginBottom: "2rem",
                lineHeight: 1.6,
                textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
              }}
            >
              Sistem reservasi online untuk seluruh Puskesmas di Kabupaten
              Buleleng. Daftar dan reservasi layanan kesehatan dengan mudah dan
              praktis.
            </p>
            <button
              className="cta-button"
              onClick={goToLogin}
              style={{ alignSelf: "flex-start" }}
            >
              Mulai Reservasi
            </button>
          </div>
          <div className="hero-bg-img" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="layanan">
        <div className="features-container">
          <h2>Layanan Kami</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <CalendarOutlined style={{ fontSize: 32 }} />
              </div>
              <h3>Reservasi Online</h3>
              <p>
                Buat janji temu dengan dokter di puskesmas pilihan Anda dengan
                mudah melalui sistem online.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <ProfileOutlined style={{ fontSize: 32 }} />
              </div>
              <h3>Riwayat Kunjungan</h3>
              <p>
                Lihat riwayat kunjungan dan hasil pemeriksaan kesehatan Anda
                secara digital.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FieldTimeOutlined style={{ fontSize: 32 }} />
              </div>
              <h3>Cek Antrian</h3>
              <p>
                Pantau nomor antrian dan perkiraan waktu tunggu untuk kunjungan
                Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info" id="info">
        <div className="features-container">
          <h2
            style={{
              fontSize: "2.5rem",
              marginBottom: "2rem",
              color: "#fff",
              fontWeight: 600,
              marginTop: "-3rem",
              letterSpacing: "0.5px",
            }}
          >
            Informasi dan Kontak
          </h2>
        </div>
        <div className="info-container">
          <div className="info-card">
            <h3 style={{ color: "white" }}>Jam Operasional</h3>
            <div
              style={{
                color: "white",
                textAlign: "left",
                fontSize: "1.1rem",
                lineHeight: 1.7,
              }}
            >
              {Object.entries({
                Senin: { buka: "08:00", tutup: "14:00" },
                Selasa: { buka: "08:00", tutup: "14:00" },
                Rabu: { buka: "08:00", tutup: "14:00" },
                Kamis: { buka: "08:00", tutup: "14:00" },
                Jumat: { buka: "08:00", tutup: "11:00" },
                Sabtu: { buka: "08:00", tutup: "12:00" },
                Minggu: { tutup: true },
              }).map(([hari, jam]) => (
                <div
                  key={hari}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "220px",
                  }}
                >
                  <span>{hari}</span>
                  <span>
                    {jam.tutup === true
                      ? "Tutup"
                      : `${jam.buka} - ${jam.tutup}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="info-card">
            <h3>Persyaratan</h3>
            <p>
              KTP Buleleng / Kartu Keluarga
              <br />
              Kartu BPJS (jika ada)
              <br />
              Surat rujukan (untuk spesialis)
            </p>
          </div>
          <div className="info-card">
            <h3>Kontak Darurat</h3>
            <p style={{ color: "white" }}>
              Email: info@puskesmasbuleleng.id
              <br />
              Telepon: 3621111
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="kontak">
        <div className="footer-content">
          <p className="copyright">
            Copyright © 2025 HealthCenter - Powered by Semangat Hidup Team
          </p>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
