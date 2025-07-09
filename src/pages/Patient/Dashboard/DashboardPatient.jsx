import React, { useContext, useEffect, useState } from 'react';
import { Calendar, FileText, Activity, MapPin } from 'lucide-react';
import './DashboardPatient.css';
import { AuthContext } from '../../../providers/AuthProvider';
import { getDataPrivate } from '../../../utils/api';

const statusMap = {
  confirmed: { text: 'Terkonfirmasi', className: 'status-badge status-confirmed' },
  pending: { text: 'Menunggu', className: 'status-badge status-pending' },
  cancelled: { text: 'Dibatalkan', className: 'status-badge status-cancelled' },
};

const DashboardPatient = () => {
  const { userProfile } = useContext(AuthContext);
  const username = userProfile?.nama || userProfile?.username || 'Pengguna';

  // State untuk statistik dan janji temu
  const [stats, setStats] = useState({
    activeReservations: 0,
    availableServices: 0,
    monthlyVisits: 0,
    healthCenters: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile || !userProfile.id_user) return;
    setLoading(true);
    // Ambil data janji temu user
    getDataPrivate(`/api/v1/queues/user/${userProfile.id_user}`)
      .then((resp) => {
        let data = Array.isArray(resp) ? resp : resp ? [resp] : [];
        setAppointments(data.filter(a => a.status !== 'cancelled'));
        setStats(s => ({
          ...s,
          activeReservations: data.filter(a => a.status === 'confirmed' || a.status === 'pending').length,
        }));
        setLoading(false);
      })
      .catch(() => {
        setAppointments([]);
        setLoading(false);
      });
    // Ambil data statistik lain
    getDataPrivate('/api/v1/health_centers').then(resp => {
      setStats(s => ({ ...s, healthCenters: Array.isArray(resp) ? resp.length : (resp?.data?.length || 0) }));
    });
    getDataPrivate('/api/v1/services').then(resp => {
      setStats(s => ({ ...s, availableServices: Array.isArray(resp) ? resp.length : (resp?.data?.length || 0) }));
    });
    // Dummy monthly visits, ganti jika ada endpoint
    setStats(s => ({ ...s, monthlyVisits: 5 }));
  }, [userProfile]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Selamat Datang, {username}</h2>
        <p>Kelola kesehatan Anda dengan mudah melalui sistem reservasi Puskesmas Buleleng</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Calendar size={36} /></div>
          <div className="stat-info">
            <h3>{stats.activeReservations}</h3>
            <p>Reservasi Aktif</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Activity size={36} /></div>
          <div className="stat-info">
            <h3>{stats.monthlyVisits}</h3>
            <p>Kunjungan Bulan Ini</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><MapPin size={36} /></div>
          <div className="stat-info">
            <h3>{stats.healthCenters}</h3>
            <p>Puskesmas Tersedia</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FileText size={36} /></div>
          <div className="stat-info">
            <h3>{stats.availableServices}</h3>
            <p>Layanan Tersedia</p>
          </div>
        </div>
      </div>
      <div className="info-jadwal-row">
        {/* Section Informasi untuk pasien dan jadwal layanan */}
        <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'stretch', margin: '2rem 0 1.5rem 0'}}>
          <div className="info-section" style={{
            background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdfa 100%)',
            borderRadius: '1rem',
            padding: '1.5rem 2rem',
            boxShadow: '0 2px 8px rgba(20,184,166,0.07)',
            color: '#0369a1',
            fontSize: '1.05rem',
            flex: 2,
            minWidth: 280,
          }}>
            <b>Informasi untuk Pasien:</b>
            <ul style={{margin: '1rem 0 0 1.2rem', color: '#0369a1'}}>
              <li>Datanglah ke puskesmas sesuai waktu reservasi Anda.</li>
              <li><b>Diwajibkan membawa kelengkapan persyaratan Pemeriksaan / Pengobatan sebagai berikut:</b>
                <ul style={{marginTop: '0.5rem'}}>
                  <li>Fotokopi Kartu Keluarga (KK) <i>(ketentuan terbaru)</i></li>
                  <li>Alamat email yang berlaku <i>(ketentuan terbaru untuk pasien non lansia)</i></li>
                  <li>Kartu BPJS Kesehatan dan KTP</li>
                  <li>Kartu berobat (bagi pasien lama, umum, dan BPJS Kesehatan)</li>
                  <li>Dokumen rujukan dari rumah sakit dan Kartu Pengambilan Obat (KPO), khusus pasien yang melakukan perpanjangan rujukan</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="jadwal-section" style={{
            background: '#fff',
            borderRadius: '1rem',
            padding: '1.5rem 2rem',
            boxShadow: '0 2px 8px rgba(20,184,166,0.07)',
            color: '#1e293b',
            minWidth: 260,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <b style={{fontSize: '1.1rem', marginBottom: 12}}>Jadwal Layanan</b>
            <div style={{marginTop: 12}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                <span>Senin-Kamis</span>
                <span>08:00 - 14:00</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                <span>Jumat</span>
                <span>08:00 - 11:00</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                <span>Sabtu</span>
                <span>08:00 - 12:00</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', color: '#888'}}>
                <span>Minggu</span>
                <span>Tutup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-card" style={{marginTop: '2rem'}}>
        <div className="section-header">
          <h3>Janji Temu Mendatang</h3>
        </div>
        {loading ? (
          <div style={{padding: '2rem 0', textAlign: 'center', color: '#888', fontSize: 18}}>
            Loading data janji temu...
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.filter(app => app.status === 'confirmed').length === 0 ? (
              <div style={{color: '#888', textAlign: 'center', padding: '2rem 0', fontSize: 16}}>
                Tidak ada janji temu mendatang.
              </div>
            ) : appointments.filter(app => app.status === 'confirmed').map(app => (
              <div className="appointment-card" key={app.id_antrian}>
                <div className="appointment-info">
                  <h4>{app.nama_layanan || '-'}</h4>
                  <p className="puskesmas-name">{app.nama_puskesmas || '-'}</p>
                  <p className="appointment-details">{app.tanggal_reservasi ? new Date(app.tanggal_reservasi).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'} • {app.waktu_antrian || '-'}</p>
                  <p className="doctor-name">{app.nama_dokter || '-'}</p>
                </div>
                <div className="appointment-status" style={{alignItems: 'center', justifyContent: 'center'}}>
                  <span className={statusMap[app.status]?.className || 'status-badge'} style={{marginBottom: 12}}>{statusMap[app.status]?.text || app.status}</span>
                  <div className="queue-number" style={{marginTop: 8}}>
                    <span style={{fontSize: 13, color: '#64748b'}}>No. Antrian</span>
                    <span className="queue-highlight">{app.nomor_antrian ? app.nomor_antrian.toString().padStart(3, '0') : '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPatient; 