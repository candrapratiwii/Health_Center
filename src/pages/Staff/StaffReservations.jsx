import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { getDataPrivate } from "../../utils/api";
import { notification, Table, Tag, Button, Popconfirm } from "antd";
import { editDataPrivatePut } from "../../utils/api";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const mainColor = "#14b8a6";
const accentColor = "#06b6d4";

const statusColor = {
  pending: "gold",
  confirmed: "green",
  cancelled: "#b0b0b0"
};

const StaffReservations = () => {
  const { userProfile, isLoadingScreen } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [servicesList, setServicesList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);

  useEffect(() => {
    if (!userProfile?.id_user) return;
    let interval;
    const fetchData = () => {
      setLoading(true);
      getDataPrivate('/api/v1/services').then((data) => {
        let arr = Array.isArray(data) ? data : data.data || [];
        setServicesList(arr);
      });
      getDataPrivate('/api/v1/users/').then((data) => {
        let arr = Array.isArray(data) ? data : data.data || [];
        setPatientsList(arr);
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
  const getLayananName = (id) => {
    const s = servicesList.find(s => s.id_layanan === id);
    return s ? s.nama_layanan : id;
  };
  const getUsername = (id_user) => {
    const u = patientsList.find(u => u.id_user === id_user);
    return u ? (u.username || u.nama || '-') : id_user;
  };

  // Aksi
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
  const refreshReservations = () => {
    setLoading(true);
    getDataPrivate(`/api/v1/reservations/staff/${userProfile.id_user}`)
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.data || [];
        setReservations(arr.filter(r => r.status === 'pending'));
        setLoading(false);
      })
      .catch(() => {
        api.error({ message: "Gagal mengambil data reservasi" });
        setLoading(false);
      });
  };

  // Table columns
  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (text, record, idx) => idx + 1
    },
    {
      title: "Username Pasien",
      dataIndex: "username",
      key: "username",
      render: (text, record) => getUsername(record.id_user)
    },
    {
      title: "Layanan",
      dataIndex: "layanan",
      key: "layanan",
      render: (text, record) => getLayananName(record.layanan || record.service_id || record.id_layanan)
    },
    {
      title: "Nomor Antrian",
      dataIndex: "nomor_antrian",
      key: "nomor_antrian",
      render: (text, record) => record.nomor_antrian || record.queue_number || record.no_antrian || '-'
    },
    {
      title: "Tanggal & Jam",
      dataIndex: "tanggal",
      key: "tanggal",
      render: (text, record) => {
        const tgl = record.tanggal_reservasi ? new Date(record.tanggal_reservasi).toLocaleDateString('id-ID') : '-';
        const jam = record.tanggal_reservasi ? record.tanggal_reservasi.slice(11,16) : '-';
        return `${tgl} • ${jam}`;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => <Tag color={statusColor[record.status] || 'default'} style={{fontWeight:600,fontSize:14}}>{record.status === 'pending' ? 'Menunggu' : record.status === 'confirmed' ? 'Terkonfirmasi' : 'Dibatalkan'}</Tag>
    },
    {
      title: "Aksi",
      key: "aksi",
      render: (text, record) => (
        <div style={{display:'flex',gap:8}}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            style={{ background: '#22c55e', borderColor: '#22c55e', fontWeight: 600, fontSize: 15, padding: '0 18px' }}
            onClick={() => handleConfirm(record)}
            size="middle"
          >
            Konfirmasi
          </Button>
          <Popconfirm
            title="Batalkan reservasi ini?"
            okText="Ya"
            cancelText="Tidak"
            onConfirm={() => handleCancel(record)}
          >
            <Button danger size="middle" icon={<CloseCircleOutlined />} style={{ fontWeight: 600, fontSize: 15, padding: '0 18px' }}>Batalkan</Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div style={{ background: "#f6fafd", minHeight: "100vh", padding: 0 }}>
      {contextHolder}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 16px' }}>
        <h2 style={{ color: mainColor, fontWeight: 800, fontSize: 32, marginBottom: 0, letterSpacing: 0.5 }}>Data Reservasi Pasien</h2>
        <div style={{ color: "#555", marginBottom: 24, fontSize: 17, fontWeight: 400 }}>Daftar reservasi pasien di puskesmas yang Anda kelola. Konfirmasi atau batalkan reservasi sesuai kebutuhan.</div>
        <Table
          columns={columns}
          dataSource={reservations}
          rowKey={record => record.id_reservasi}
          pagination={{ pageSize: 8 }}
          bordered
          loading={loading}
          style={{ background: "#fff", borderRadius: 12, border: `2px solid ${mainColor}` }}
        />
      </div>
    </div>
  );
};

export default StaffReservations; 