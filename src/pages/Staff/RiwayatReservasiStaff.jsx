import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { getDataPrivate } from "../../utils/api";
import { notification, Tag } from "antd";

const mainColor = "#14b8a6";
const accentColor = "#06b6d4";
const statusTag = {
  confirmed: (
    <Tag
      color="green"
      style={{ fontWeight: 600, fontSize: 14, padding: "2px 16px" }}
    >
      Terkonfirmasi
    </Tag>
  ),
  cancelled: (
    <Tag
      color="#b0b0b0"
      style={{ fontWeight: 600, fontSize: 14, padding: "2px 16px" }}
    >
      Dibatalkan
    </Tag>
  ),
  pending: (
    <Tag
      color="#bfa100"
      style={{ fontWeight: 600, fontSize: 14, padding: "2px 16px" }}
    >
      Menunggu
    </Tag>
  ),
};

const RiwayatReservasiStaff = () => {
  const { userProfile, isLoadingScreen } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [puskesmasList, setPuskesmasList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!userProfile?.id_user) return;
    let interval;
    const fetchData = () => {
      setLoading(true);
      getDataPrivate("/api/v1/health_centers").then((data) => {
        let arr = Array.isArray(data) ? data : data.data || [];
        setPuskesmasList(arr);
      });
      getDataPrivate(`/api/v1/reservations/staff/${userProfile.id_user}`)
        .then((data) => {
          const arr = Array.isArray(data) ? data : data.data || [];
          setReservations(arr);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    };
    fetchData();
    interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [userProfile]);

  if (isLoadingScreen) return <div>Loading...</div>;
  if (userProfile.tipe_user !== "staff") return <div>Akses ditolak</div>;

  const getPuskesmasName = (id) => {
    const p = puskesmasList.find(
      (p) => p.id_puskesmas === id || p.kode_faskes === id
    );
    return p ? p.nama_puskesmas : id;
  };

  // Filter data sesuai status
  const filteredReservations =
    statusFilter === "all"
      ? reservations
      : reservations.filter((r) => r.status === statusFilter);

  return (
    <div style={{ background: "#f6fafd", minHeight: "100vh", padding: 0 }}>
      {contextHolder}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
        <h2
          style={{
            color: mainColor,
            fontWeight: 800,
            fontSize: 32,
            marginBottom: 0,
            letterSpacing: 0.5,
          }}
        >
          Riwayat Reservasi
        </h2>
        <div
          style={{
            color: "#555",
            marginBottom: 24,
            fontSize: 17,
            fontWeight: 400,
          }}
        >
          Daftar reservasi pasien di puskesmas yang Anda kelola. Filter data
          sesuai kebutuhan.
        </div>
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span>Filter Status:</span>
          <button
            onClick={() => setStatusFilter("all")}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #e0e7ef",
              background: statusFilter === "all" ? "#1976d2" : "#f5f7fa",
              color: statusFilter === "all" ? "#fff" : "#333",
              fontWeight: statusFilter === "all" ? 700 : 400,
              cursor: "pointer",
            }}
          >
            Semua
          </button>
          <button
            onClick={() => setStatusFilter("confirmed")}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #e0e7ef",
              background: statusFilter === "confirmed" ? "#388e3c" : "#f5f7fa",
              color: statusFilter === "confirmed" ? "#fff" : "#333",
              fontWeight: statusFilter === "confirmed" ? 700 : 400,
              cursor: "pointer",
            }}
          >
            Terkonfirmasi
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #e0e7ef",
              background: statusFilter === "pending" ? "#bfa100" : "#f5f7fa",
              color: statusFilter === "pending" ? "#fff" : "#333",
              fontWeight: statusFilter === "pending" ? 700 : 400,
              cursor: "pointer",
            }}
          >
            Menunggu
          </button>
          <button
            onClick={() => setStatusFilter("cancelled")}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #e0e7ef",
              background: statusFilter === "cancelled" ? "#d32f2f" : "#f5f7fa",
              color: statusFilter === "cancelled" ? "#fff" : "#333",
              fontWeight: statusFilter === "cancelled" ? 700 : 400,
              cursor: "pointer",
            }}
          >
            Dibatalkan
          </button>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 64 }}>
            <div style={{ color: "#888", fontSize: 18 }}>Loading data...</div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div
            style={{
              color: "#888",
              fontSize: 18,
              textAlign: "center",
              marginTop: 64,
            }}
          >
            <div>Tidak ada reservasi ditemukan.</div>
          </div>
        ) : (
          <div className="appointments-list" style={{ gap: "2rem" }}>
            {filteredReservations.map((r) => (
              <div
                key={r.id_reservasi}
                className="appointment-item"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  background: r.status === "cancelled" ? "#f3f3f3" : "#fff",
                  opacity: r.status === "cancelled" ? 0.6 : 1,
                  pointerEvents: r.status === "cancelled" ? "none" : "auto",
                  filter: r.status === "cancelled" ? "grayscale(0.5)" : "none",
                }}
              >
                <div className="appointment-info" style={{ flexGrow: 1 }}>
                  <h4>{getPuskesmasName(r.id_puskesmas)}</h4>
                  <p>{r.layanan || "-"}</p>
                  <div>
                    <span>
                      Nomor Antrian:{" "}
                      {r.nomor_antrian
                        ? r.nomor_antrian.toString().padStart(3, "0")
                        : "-"}
                    </span>
                    <br />
                    <span>Tanggal: {r.tanggal_reservasi}</span>
                    <br />
                  </div>
                </div>
                <div
                  className="appointment-meta"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    textAlign: "right",
                    minWidth: "120px",
                  }}
                >
                  <span
                    className={`status ${r.status}`}
                    style={{
                      background:
                        r.status === "confirmed"
                          ? "#e0ffe0"
                          : r.status === "cancelled"
                          ? "#eee"
                          : "#fffbe0",
                      color:
                        r.status === "cancelled"
                          ? "#888"
                          : r.status === "confirmed"
                          ? "#388e3c"
                          : "#bfa100",
                      padding: "2px 10px",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {r.status === "confirmed"
                      ? "Terkonfirmasi"
                      : r.status === "cancelled"
                      ? "Dibatalkan"
                      : "Menunggu"}
                  </span>
                  <span
                    className={`queue-number ${r.status}`}
                    style={{ marginTop: "0.4rem" }}
                  >
                    {r.nomor_antrian
                      ? r.nomor_antrian.toString().padStart(3, "0")
                      : "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiwayatReservasiStaff;
