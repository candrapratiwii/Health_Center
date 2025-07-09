import React, { useEffect, useState, useContext } from "react";
import { getDataPrivate } from "../../utils/api";
import { AuthContext } from "../../providers/AuthProvider";
import '../../pages/Patient/Dashboard/DashboardPatient.css';
import { Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react';

function formatDateTime(dt) {
  const d = new Date(dt);
  return d.toLocaleString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

const StaffDashboard = () => {
  const { userProfile } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [services, setServices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [puskesmasList, setPuskesmasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [namaPuskesmas, setNamaPuskesmas] = useState("");
  const [idPuskesmas, setIdPuskesmas] = useState(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!userProfile?.id_user) return;
    setLoading(true);
    Promise.all([
      getDataPrivate(`/api/v1/reservations/staff/${userProfile.id_user}`),
      getDataPrivate('/api/v1/services'),
      getDataPrivate('/api/v1/users/'),
      getDataPrivate('/api/v1/health_centers')
    ]).then(([resv, serv, users, puskesmas]) => {
      const resArr = Array.isArray(resv) ? resv : resv.data || [];
      setReservations(resArr);
      setServices(Array.isArray(serv) ? serv : serv.data || []);
      setPatients(Array.isArray(users) ? users : users.data || []);
      const pList = Array.isArray(puskesmas) ? puskesmas : puskesmas.data || [];
      setPuskesmasList(pList);
      // Cari nama & id puskesmas staff
      let idPuskesmas = userProfile.id_puskesmas;
      if (!idPuskesmas && resArr.length > 0) idPuskesmas = resArr[0].id_puskesmas;
      setIdPuskesmas(idPuskesmas);
      const puskesmasObj = pList.find(p => p.id_puskesmas === idPuskesmas || p.kode_faskes === idPuskesmas);
      setNamaPuskesmas(puskesmasObj ? puskesmasObj.nama_puskesmas : "-");
      setLoading(false);
    });
  }, [userProfile]);

  // Filter reservasi hanya untuk puskesmas staff
  const reservasiPuskesmas = idPuskesmas ? reservations.filter(r => r.id_puskesmas === idPuskesmas) : reservations;
  const today = new Date().toISOString().slice(0, 10);
  const todayRes = reservasiPuskesmas.filter(r => r.tanggal_reservasi && r.tanggal_reservasi.slice(0,10) === today);
  const antrianHariIni = todayRes.length;
  const pasienTerdaftar = reservasiPuskesmas.length;
  const selesaiDilayani = reservasiPuskesmas.filter(r => r.status === 'confirmed').length;
  const kasusEmergency = reservasiPuskesmas.filter(r => {
    const layanan = services.find(s => s.id_layanan === r.id_layanan);
    return layanan && layanan.nama_layanan && layanan.nama_layanan.toLowerCase().includes('gawat darurat');
  }).length;

  // Daftar antrian hari ini
  const antrianList = todayRes.sort((a, b) => a.tanggal_reservasi.localeCompare(b.tanggal_reservasi));

  // Statistik pelayanan per poli
  const poliStats = services.map(s => {
    const count = reservasiPuskesmas.filter(r => r.id_layanan === s.id_layanan).length;
    return { nama: s.nama_layanan, count };
  });

  // Jadwal dokter hari ini (dummy mapping dari layanan, bisa diimprove jika ada endpoint khusus)
  const jadwalDokter = services.slice(0,4).map((s, i) => ({
    waktu: ["08:00 - 12:00", "08:00 - 14:00", "13:00 - 17:00", "09:00 - 15:00"][i%4],
    dokter: s.nama_layanan
  }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Selamat Datang, {userProfile?.nama || userProfile?.username || 'Staff'}</h2>
        <p>Puskesmas: <b>{namaPuskesmas}</b> &nbsp;|&nbsp; Sistem Manajemen Pasien</p>
        <div style={{ float: 'right', fontSize: '1.1em', marginTop: '-2.5rem', color: 'white', opacity: 0.95 }}>{formatDateTime(currentTime)}</div>
      </div>
      {/* Statistik (kembalikan grid kotak statistik di atas konten utama) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)'}}>
            <Calendar size={36} />
          </div>
          <div className="stat-info">
            <h3>{antrianHariIni}</h3>
            <p>Antrian Hari Ini</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #98c1d9 0%, #7c9eb2 100%)'}}>
            <Users size={36} />
          </div>
          <div className="stat-info">
            <h3>{pasienTerdaftar}</h3>
            <p>Pasien Terdaftar</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'}}>
            <CheckCircle size={36} />
          </div>
          <div className="stat-info">
            <h3>{selesaiDilayani}</h3>
            <p>Selesai Dilayani</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'}}>
            <AlertCircle size={36} />
          </div>
          <div className="stat-info">
            <h3>{kasusEmergency}</h3>
            <p>Kasus Emergency</p>
          </div>
        </div>
      </div>
      {/* ANTRIAN PASIEN HARI INI & AKSI CEPAT & JADWAL DOKTER */}
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:30, marginTop:32, marginBottom:32}}>
        {/* Antrian Pasien Hari Ini */}
        <div className="section-card">
          <div className="section-header">
            <h3>Antrian Pasien Hari Ini</h3>
          </div>
          <div className="patient-list" style={{maxHeight:400, overflowY:'auto'}}>
            {loading ? (
              <div style={{padding:'2rem 0', textAlign:'center', color:'#888', fontSize:18}}>Loading data antrian...</div>
            ) : antrianList.length === 0 ? (
              <div style={{color:'#888', textAlign:'center', padding:'2rem 0', fontSize:16}}>Tidak ada antrian hari ini.</div>
            ) : antrianList.map((r, idx) => {
              const pasien = patients.find(p => p.id_user === r.id_user);
              const layanan = services.find(s => s.id_layanan === r.id_layanan);
              let statusClass = 'status-waiting', statusText = 'Menunggu';
              if (r.status === 'confirmed') { statusClass = 'status-process'; statusText = 'Sedang Dilayani'; }
              if (r.status === 'cancelled') { statusClass = 'status-done'; statusText = 'Dibatalkan'; }
              if (layanan && layanan.nama_layanan && layanan.nama_layanan.toLowerCase().includes('gawat darurat')) { statusClass = 'status-emergency'; statusText = 'Gawat Darurat'; }
              return (
                <div key={r.id_reservasi} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fff',borderRadius:12,boxShadow:'0 2px 8px #0001',padding:'1.2rem 2rem',marginBottom:18,border:'1px solid #f0f4f8'}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:20,marginBottom:2,color:'#1e293b'}}>{namaPuskesmas}</div>
                    <div style={{color:'#64748b',marginBottom:2}}>{pasien ? pasien.nama : 'Pasien #' + r.id_user}</div>
                    <div style={{color:'#14b8a6',marginBottom:2}}>{layanan ? layanan.nama_layanan : '-'}</div>
                    <div style={{color:'#475569',fontSize:15,marginBottom:2}}>Tanggal: {r.tanggal_reservasi ? new Date(r.tanggal_reservasi).toLocaleDateString('id-ID') : '-'}<br/>Waktu: {r.tanggal_reservasi ? r.tanggal_reservasi.slice(11,16) : '-'}<br/>No. Antrian: {r.nomor_antrian || '-'}</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:12}}>
                    <span className={`status-badge ${statusClass}`} style={{marginBottom:8}}>{statusText}</span>
                    <div style={{background:'#fef9c3',color:'#b45309',fontWeight:700,fontSize:32,padding:'0.5rem 1.5rem',borderRadius:12,letterSpacing:2}}>{r.nomor_antrian ? r.nomor_antrian.toString().padStart(3,'0') : '-'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Aksi Cepat & Jadwal Dokter */}
        <div style={{display:'flex',flexDirection:'column',gap:30}}>
          {/* Aksi Cepat */}
          <div className="section-card" style={{padding:'1.5rem'}}>
            <div className="section-header"><h3>Aksi Cepat</h3></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:15}}>
              <button className="action-btn btn-primary" style={{padding:15,border:'none',borderRadius:10,cursor:'pointer',fontSize:'1em',fontWeight:500,background:'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',color:'white'}} onClick={()=>alert('Fitur "Daftar Pasien Baru" akan segera tersedia!')}>Daftar Pasien Baru</button>
              <button className="action-btn btn-secondary" style={{padding:15,border:'none',borderRadius:10,cursor:'pointer',fontSize:'1em',fontWeight:500,background:'linear-gradient(135deg, #98c1d9 0%, #7c9eb2 100%)',color:'white'}} onClick={()=>alert('Fitur "Cari Pasien" akan segera tersedia!')}>Cari Pasien</button>
              <button className="action-btn btn-success" style={{padding:15,border:'none',borderRadius:10,cursor:'pointer',fontSize:'1em',fontWeight:500,background:'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',color:'#2c3e50'}} onClick={()=>alert('Fitur "Cetak Laporan" akan segera tersedia!')}>Cetak Laporan</button>
              <button className="action-btn btn-info" style={{padding:15,border:'none',borderRadius:10,cursor:'pointer',fontSize:'1em',fontWeight:500,background:'linear-gradient(135deg, #7c9eb2 0%, #6b8ca3 100%)',color:'white'}} onClick={()=>alert('Fitur "Update Status" akan segera tersedia!')}>Update Status</button>
            </div>
          </div>
          {/* Jadwal Dokter Hari Ini */}
          <div className="section-card" style={{padding:'1.5rem'}}>
            <div className="section-header"><h3>Jadwal Dokter Hari Ini</h3></div>
            {jadwalDokter.map((j, i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid #e2e8f0'}}>
                <span style={{fontWeight:600,color:'#14b8a6'}}>{j.waktu}</span>
                <span style={{color:'#1e293b'}}>{j.dokter}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* NOTIFIKASI & STATISTIK PELAYANAN */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))',gap:30}}>
        {/* Notifikasi & Peringatan */}
        <div className="section-card">
          <div className="section-header"><h3>Notifikasi & Peringatan</h3></div>
          <div className="alert alert-warning" style={{padding:15,marginBottom:15,borderRadius:8,borderLeft:'4px solid #ffc107',backgroundColor:'#fff3cd',color:'#856404'}}>
            <strong>Perhatian!</strong> Stok obat Paracetamol menipis. Segera lakukan pemesanan ulang.
          </div>
          <div className="alert alert-info" style={{padding:15,marginBottom:15,borderRadius:8,borderLeft:'4px solid #17a2b8',backgroundColor:'#d1ecf1',color:'#0c5460'}}>
            <strong>Info:</strong> Jadwal vaksinasi massal akan dilaksanakan minggu depan. Siapkan berkas pendukung.
          </div>
          <div className="alert alert-warning" style={{padding:15,marginBottom:15,borderRadius:8,borderLeft:'4px solid #ffc107',backgroundColor:'#fff3cd',color:'#856404'}}>
            <strong>Reminder:</strong> Laporan bulanan harus diserahkan sebelum tanggal 10.
          </div>
        </div>
        {/* Statistik Pelayanan */}
        <div className="section-card">
          <div className="section-header"><h3>Statistik Pelayanan</h3></div>
          {poliStats.map((p, i) => (
            <div key={i} style={{marginBottom:20}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span>{p.nama}</span>
                <span>{p.count} pasien</span>
              </div>
              <div style={{width:'100%',height:8,background:'#ecf0f1',borderRadius:4}}>
                <div style={{width:`${Math.min(100,p.count*10)}%`,height:'100%',background:['#14b8a6','#98c1d9','#c6e9da','#7c9eb2'][i%4],borderRadius:4}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
  </div>
);
};

export default StaffDashboard; 