import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { getDataPrivate } from "../../utils/api";
import { notification, Card, Tag, Divider, Button, Popconfirm } from "antd";
import { editDataPrivatePut } from "../../utils/api";
import { CalendarOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const mainColor = "#14b8a6";
const accentColor = "#06b6d4";

const statusTag = {
  pending: <Tag color="gold" style={{ fontWeight: 600, fontSize: 14, padding: '2px 16px' }}>Menunggu</Tag>,
  confirmed: <Tag color="green" style={{ fontWeight: 600, fontSize: 14, padding: '2px 16px' }}>Terkonfirmasi</Tag>,
  cancelled: <Tag color="#b0b0b0" style={{ fontWeight: 600, fontSize: 14, padding: '2px 16px' }}>Dibatalkan</Tag>
};

const StaffReservations = () => {
  const { userProfile, isLoadingScreen } = useContext(AuthContext);
  console.log("StaffReservations MOUNTED", userProfile);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [puskesmasList, setPuskesmasList] = useState([]);
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    if (!userProfile?.id_user) return;
    let interval;
    const fetchData = () => {
      setLoading(true);
      getDataPrivate('/api/v1/health_centers').then((data) => {
        let arr = Array.isArray(data) ? data : data.data || [];
        setPuskesmasList(arr);
      });
      getDataPrivate('/api/v1/services').then((data) => {
        let arr = Array.isArray(data) ? data : data.data || [];
        setServicesList(arr);
      });
      getDataPrivate(`/api/v1/reservations/staff/${userProfile.id_user}`)
        .then((data) => {
          const arr = Array.isArray(data) ? data : data.data || [];
          setReservations(arr.filter(r => r.status === 'pending'));
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

  // Helper mapping
  const getPuskesmasName = (id) => {
    const p = puskesmasList.find(p => p.id_puskesmas === id || p.kode_faskes === id);
    return p ? p.nama_puskesmas : id;
  };
  const getLayananName = (id) => {
    const s = servicesList.find(s => s.id_layanan === id);
    return s ? s.nama_layanan : id;
  };

  // Tambah fungsi konfirmasi dan cancel
  const refreshReservations = () => {
    setLoading(true);
    getDataPrivate(`/api/v1/reservations/staff/${userProfile.id_user}`)
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.data || [];
        // Filter hanya status pending
        setReservations(arr.filter(r => r.status === 'pending'));
        setLoading(false);
      })
      .catch(() => {
        api.error({ message: "Gagal mengambil data reservasi" });
        setLoading(false);
      });
  };

  const handleConfirm = async (r) => {
    try {
      await editDataPrivatePut(`/api/v1/reservations/${r.id_reservasi}`, {
        id_user: r.id_user,
        id_puskesmas: r.id_puskesmas,
        id_layanan: r.id_layanan,
        tanggal_reservasi: r.tanggal_reservasi,
        status: "confirmed",
      });
      api.success({ message: "Reservasi berhasil dikonfirmasi" });
      refreshReservations();
    } catch (e) {
      api.error({ message: "Gagal konfirmasi reservasi" });
    }
  };

  const handleCancel = async (r) => {
    try {
      await editDataPrivatePut(`/api/v1/reservations/${r.id_reservasi}`, {
        id_user: r.id_user,
        id_puskesmas: r.id_puskesmas,
        id_layanan: r.id_layanan,
        tanggal_reservasi: r.tanggal_reservasi,
        status: "cancelled",
      });
      api.success({ message: "Reservasi berhasil dibatalkan" });
      refreshReservations();
    } catch (e) {
      api.error({ message: "Gagal membatalkan reservasi" });
    }
  };

  return (
    <div style={{ background: "#f6fafd", minHeight: "100vh", padding: 0 }}>
      {contextHolder}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 16px' }}>
        <h2 style={{ color: mainColor, fontWeight: 800, fontSize: 32, marginBottom: 0, letterSpacing: 0.5 }}>Data Reservasi Pasien</h2>
        <div style={{ color: "#555", marginBottom: 24, fontSize: 17, fontWeight: 400 }}>Daftar reservasi pasien di puskesmas yang Anda kelola. Konfirmasi atau batalkan reservasi sesuai kebutuhan.</div>
        <Divider style={{ margin: '16px 0 32px 0', borderColor: mainColor, borderWidth: 2 }} />
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <img src="/src/assets/images/hamster.gif" alt="loading" style={{ width: 60, opacity: 0.5, marginBottom: 16 }} />
            <div style={{ color: '#888', fontSize: 18 }}>Loading data...</div>
          </div>
        ) : reservations.length === 0 ? (
          <div style={{ color: '#888', fontSize: 18, textAlign: 'center', marginTop: 64 }}>
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="empty" style={{ width: 80, opacity: 0.3, marginBottom: 16 }} />
            <div>Tidak ada reservasi ditemukan.</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 32
          }}>
            {reservations.map((r) => (
              <Card
                key={r.id_reservasi}
                style={{
                  borderRadius: 20,
                  boxShadow: "0 4px 24px #0002",
                  border: `1.5px solid ${mainColor}10`,
                  background: r.status === 'cancelled' ? '#f8f8f8' : '#fff',
                  opacity: r.status === 'cancelled' ? 0.7 : 1,
                  minHeight: 200,
                  transition: 'box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                bodyStyle={{ padding: 28, paddingBottom: 18 }}
                hoverable
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CalendarOutlined style={{ color: accentColor, fontSize: 22, marginRight: 4 }} />
                    <span style={{ fontWeight: 700, fontSize: 20, color: mainColor, letterSpacing: 0.2 }}>{getPuskesmasName(r.id_puskesmas)}</span>
                  </div>
                  {statusTag[r.status] || <Tag>{r.status}</Tag>}
                </div>
                <div style={{ color: '#555', fontSize: 16, marginBottom: 8, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserOutlined style={{ color: accentColor, fontSize: 16 }} />
                  {getLayananName(r.id_layanan)}
                </div>
                <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>
                  <b>Tanggal:</b> {r.tanggal_reservasi}
                </div>
                <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>
                  <b>ID Reservasi:</b> {r.id_reservasi}
                </div>
                {/* Tombol aksi jika status pending */}
                {r.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 14, marginTop: 12 }}>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      style={{ background: '#22c55e', borderColor: '#22c55e', fontWeight: 600, fontSize: 15, padding: '0 18px' }}
                      onClick={() => handleConfirm(r)}
                      size="middle"
                    >
                      Konfirmasi
                    </Button>
                    <Popconfirm
                      title="Batalkan reservasi ini?"
                      okText="Ya"
                      cancelText="Tidak"
                      onConfirm={() => handleCancel(r)}
                    >
                      <Button danger size="middle" icon={<CloseCircleOutlined />} style={{ fontWeight: 600, fontSize: 15, padding: '0 18px' }}>Batalkan</Button>
                    </Popconfirm>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffReservations; 