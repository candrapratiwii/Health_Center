import React, { useEffect, useState } from "react";

const DashboardAdmin = () => {
  // Dummy data
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  useEffect(() => {
    function updateDateTime() {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' };
      setDate(now.toLocaleDateString('id-ID', options));
      setTime(now.toLocaleTimeString('id-ID', timeOptions) + ' WIB');
    }
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dummy stats
  const stats = [
    { icon: '👥', number: 247, label: 'Total Pasien Hari Ini', change: '+12% dari kemarin', changeType: 'positive' },
    { icon: '👨‍⚕', number: 18, label: 'Dokter Aktif', change: '5 dokter tersedia', changeType: 'positive' },
    { icon: '🏥', number: 89, label: 'Kunjungan Poli', change: '+8% dari kemarin', changeType: 'positive' },
    { icon: '💊', number: 156, label: 'Obat Terdistribusi', change: '-3% dari kemarin', changeType: 'negative' },
  ];
  const quickStats = [
    { title: '🚨 Antrian Gawat Darurat', value: 3, desc: 'Perlu penanganan segera', color: '#ef4444' },
    { title: '⏰ Rata-rata Waktu Tunggu', value: '23 min', desc: 'Dalam batas normal', color: '#22c55e' },
    { title: '🛏 Kapasitas Ruang', value: '78%', desc: '12 dari 15 ruang terisi', color: '#f59e0b' },
    { title: '💰 Pendapatan Hari Ini', value: 'Rp 8.5M', desc: 'Target tercapai 85%', color: '#22c55e' },
  ];
  const pasienTerbaru = [
    { avatar: 'M', name: 'I Made Sudarma', detail: 'Poli Umum • 14:25 WIB', status: 'Sedang Dilayani', statusClass: 'status-online' },
    { avatar: 'N', name: 'Ni Luh Putu Sari', detail: 'Poli Anak • 14:15 WIB', status: 'Menunggu', statusClass: 'status-busy' },
    { avatar: 'I', name: 'I Ketut Adi Wijaya', detail: 'Poli Gigi • 14:10 WIB', status: 'Selesai', statusClass: 'status-offline' },
    { avatar: 'N', name: 'Ni Komang Ayu Dewi', detail: 'Poli Mata • 14:00 WIB', status: 'Sedang Dilayani', statusClass: 'status-online' },
    { avatar: 'I', name: 'I Gede Putra', detail: 'Poli Jantung • 13:45 WIB', status: 'Selesai', statusClass: 'status-offline' },
  ];
  const dokterStatus = [
    { avatar: 'P', name: 'dr. Putu Suryani', detail: 'Spesialis Anak • Ruang 101', status: 'Tersedia', statusClass: 'status-online' },
    { avatar: 'M', name: 'dr. Made Adi', detail: 'Dokter Umum • Ruang 102', status: 'Sibuk', statusClass: 'status-busy' },
    { avatar: 'K', name: 'dr. Komang Dewi', detail: 'Spesialis Mata • Ruang 103', status: 'Tersedia', statusClass: 'status-online' },
    { avatar: 'K', name: 'dr. Ketut Putra', detail: 'Spesialis Jantung • Ruang 104', status: 'Istirahat', statusClass: 'status-offline' },
    { avatar: 'N', name: 'dr. Nyoman Sari', detail: 'Spesialis Gigi • Ruang 105', status: 'Sibuk', statusClass: 'status-busy' },
  ];
  const activities = [
    { icon: '📅', iconClass: 'appointment', title: 'Reservasi Baru', desc: 'Ni Luh Putu Sari membuat reservasi untuk Poli Anak', time: '2 menit yang lalu' },
    { icon: '👤', iconClass: 'registration', title: 'Pendaftaran Pasien Baru', desc: 'I Made Sudarma berhasil terdaftar sebagai pasien baru', time: '5 menit yang lalu' },
    { icon: '💊', iconClass: 'medicine', title: 'Pengambilan Obat', desc: 'I Ketut Adi Wijaya mengambil obat di apotek', time: '10 menit yang lalu' },
    { icon: '📊', iconClass: 'report', title: 'Laporan Harian', desc: 'Laporan kunjungan pasien hari ini telah dibuat', time: '15 menit yang lalu' },
    { icon: '🚨', iconClass: 'appointment', title: 'Pasien Gawat Darurat', desc: 'Pasien dengan kondisi kritis masuk ke UGD', time: '20 menit yang lalu' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', padding: 0 }}>
      <div className="main-content" style={{ padding: 30, marginLeft: 0, minHeight: '100vh' }}>
        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, background: 'white', padding: 25, borderRadius: 15, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div className="header-left">
            <h1 style={{ color: '#333', fontSize: 32, fontWeight: 700, marginBottom: 5 }}>Dashboard Admin</h1>
            <div className="header-subtitle" style={{ color: '#666', fontSize: 16 }}>Selamat datang di Sistem Informasi Puskesmas</div>
      </div>
          <div className="header-right">
            <div className="date-time" style={{ textAlign: 'right', color: '#666' }}>
              <div className="current-date" style={{ fontSize: 18, fontWeight: 600, color: '#2dd4bf' }}>{date}</div>
              <div className="current-time" style={{ fontSize: 14, marginTop: 5 }}>{time}</div>
      </div>
      </div>
    </div>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 25, marginBottom: 40 }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ background: 'white', padding: 30, borderRadius: 20, boxShadow: '0 8px 25px rgba(0,0,0,0.1)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 48, marginBottom: 15, background: 'linear-gradient(135deg, #2dd4bf, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.icon}</div>
              <div className="stat-number" style={{ fontSize: 40, fontWeight: 'bold', color: '#2dd4bf', marginBottom: 10 }}>{s.number}</div>
              <div className="stat-label" style={{ fontSize: 16, color: '#666', fontWeight: 600 }}>{s.label}</div>
              <div className={`stat-change ${s.changeType}`} style={{ fontSize: 14, marginTop: 8, padding: '5px 12px', borderRadius: 20, display: 'inline-block', background: s.changeType === 'positive' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: s.changeType === 'positive' ? '#22c55e' : '#ef4444' }}>{s.change}</div>
            </div>
          ))}
        </div>
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 30, marginBottom: 40 }}>
          <div className="chart-section" style={{ background: 'white', padding: 30, borderRadius: 20, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
            <h2 className="section-title" style={{ fontSize: 24, fontWeight: 700, color: '#333', marginBottom: 25, display: 'flex', alignItems: 'center', gap: 10 }}>📊 Statistik Kunjungan Mingguan</h2>
            <div className="chart-container" style={{ height: 300, background: '#f8f9fa', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 16, position: 'relative', overflow: 'hidden' }}>
              <div className="chart-placeholder" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2dd4bf20, #14b8a620)', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>📈</div>
                <div>Grafik Kunjungan Pasien 7 Hari Terakhir</div>
                <div style={{ fontSize: 14, color: '#999', marginTop: 10 }}>Data akan dimuat secara real-time</div>
              </div>
            </div>
          </div>
          <div className="quick-stats" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
            {quickStats.map((q, i) => (
              <div key={i} className="quick-stat-card" style={{ background: 'white', padding: 25, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: 0 }}>
                <div className="quick-stat-header" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 15 }}>
                  <div className="quick-stat-title" style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{q.title}</div>
                </div>
                <div className="quick-stat-value" style={{ fontSize: 28, fontWeight: 'bold', color: '#2dd4bf' }}>{q.value}</div>
                <div style={{ color: q.color, fontSize: 14, marginTop: 5 }}>{q.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 40 }}>
          <div className="content-section" style={{ background: 'white', padding: 30, borderRadius: 20, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
            <h2 className="section-title" style={{ fontSize: 24, fontWeight: 700, color: '#333', marginBottom: 25, display: 'flex', alignItems: 'center', gap: 10 }}>👥 Pasien Terbaru</h2>
            <ul className="person-list" style={{ listStyle: 'none', maxHeight: 400, overflowY: 'auto', padding: 0 }}>
              {pasienTerbaru.map((p, i) => (
                <li key={i} className="person-item" style={{ padding: '20px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                  <div className="person-avatar" style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #2dd4bf, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', marginRight: 15, fontSize: 18 }}>{p.avatar}</div>
                  <div className="person-info" style={{ flex: 1 }}>
                    <div className="person-name" style={{ fontSize: 16, color: '#333', fontWeight: 600, marginBottom: 5 }}>{p.name}</div>
                    <div className="person-detail" style={{ fontSize: 14, color: '#666' }}>{p.detail}</div>
      </div>
                  <div className={`status-badge ${p.statusClass}`} style={{ padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', background: p.statusClass === 'status-online' ? 'rgba(34, 197, 94, 0.1)' : p.statusClass === 'status-busy' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)', color: p.statusClass === 'status-online' ? '#22c55e' : p.statusClass === 'status-busy' ? '#ef4444' : '#6b7280' }}>{p.status}</div>
                </li>
          ))}
        </ul>
      </div>
          <div className="content-section" style={{ background: 'white', padding: 30, borderRadius: 20, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
            <h2 className="section-title" style={{ fontSize: 24, fontWeight: 700, color: '#333', marginBottom: 25, display: 'flex', alignItems: 'center', gap: 10 }}>👨‍⚕ Status Dokter</h2>
            <ul className="person-list" style={{ listStyle: 'none', maxHeight: 400, overflowY: 'auto', padding: 0 }}>
              {dokterStatus.map((d, i) => (
                <li key={i} className="person-item" style={{ padding: '20px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                  <div className="person-avatar" style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #2dd4bf, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', marginRight: 15, fontSize: 18 }}>{d.avatar}</div>
                  <div className="person-info" style={{ flex: 1 }}>
                    <div className="person-name" style={{ fontSize: 16, color: '#333', fontWeight: 600, marginBottom: 5 }}><span className="doctor-prefix" style={{ color: '#2dd4bf', fontWeight: 700 }}>{d.name.startsWith('dr.') ? '' : 'dr.'}</span> {d.name}</div>
                    <div className="person-detail" style={{ fontSize: 14, color: '#666' }}>{d.detail}</div>
                  </div>
                  <div className={`status-badge ${d.statusClass}`} style={{ padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', background: d.statusClass === 'status-online' ? 'rgba(34, 197, 94, 0.1)' : d.statusClass === 'status-busy' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)', color: d.statusClass === 'status-online' ? '#22c55e' : d.statusClass === 'status-busy' ? '#ef4444' : '#6b7280' }}>{d.status}</div>
                </li>
          ))}
        </ul>
      </div>
        </div>
        <div className="activity-section" style={{ background: 'white', padding: 30, borderRadius: 20, boxShadow: '0 8px 25px rgba(0,0,0,0.1)', marginBottom: 40 }}>
          <h2 className="section-title" style={{ fontSize: 24, fontWeight: 700, color: '#333', marginBottom: 25, display: 'flex', alignItems: 'center', gap: 10 }}>📋 Aktivitas Terkini</h2>
          <ul className="activity-list" style={{ listStyle: 'none', padding: 0 }}>
            {activities.map((a, i) => (
              <li key={i} className="activity-item" style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #eee' }}>
                <div className={`activity-icon ${a.iconClass}`} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15, fontSize: 16, color: 'white', background: a.iconClass === 'appointment' ? '#3b82f6' : a.iconClass === 'registration' ? '#10b981' : a.iconClass === 'medicine' ? '#f59e0b' : '#8b5cf6' }}>{a.icon}</div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <div className="activity-title" style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 5 }}>{a.title}</div>
                  <div className="activity-desc" style={{ fontSize: 14, color: '#666' }}>{a.desc}</div>
                </div>
                <div className="activity-time" style={{ fontSize: 12, color: '#999', marginLeft: 'auto' }}>{a.time}</div>
              </li>
          ))}
        </ul>
      </div>
        <div className="footer" style={{ background: 'white', padding: 20, textAlign: 'center', color: '#666', fontSize: 14, boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', borderRadius: '20px 20px 0 0', marginTop: 40 }}>
          Copyright © 2025 HealthCenter - Powered by Semangat Hidup Team
        </div>
    </div>
  </div>
);
};

export default DashboardAdmin;
