import React, { useContext } from 'react';
import { Calendar, Clock, FileText, Heart, Activity, MapPin } from 'lucide-react';
import './DashboardPatient.css';
import { AuthContext } from '../../../providers/AuthProvider';

const appointments = [
  {
    id_reservasi: 1,
    id_user: 1,
    id_puskesmas: 1,
    id_layanan: 1,
    tanggal_reservasi: "2025-07-08T09:00:00",
    status: "confirmed",
    nomor_antrian: 1,
    waktu_antrian: "09:00:00",
    puskesmas: "Puskesmas Singaraja",
    service: "Pemeriksaan Umum",
    doctor: "dr. Kadek Sari"
  }
];

const formatQueueNumber = (number) => {
  if (!number) return 'Belum ada';
  return number.toString().padStart(3, '0');
};

const DashboardPatient = () => {
  const { userProfile } = useContext(AuthContext);
  const username = userProfile?.nama || userProfile?.username || 'Pengguna';
  return (
    <>
  <div className="dashboard-patient">
    <div className="quick-actions">
      <button className="action-btn"><Calendar />Buat Janji</button>
      <button className="action-btn"><Clock />Janji Temu</button>
      <button className="action-btn"><FileText />Layanan</button>
      <button className="action-btn"><Heart />Kesehatan</button>
    </div>
    <div className="upcoming-appointments">
      <h3>Janji Temu Mendatang</h3>
      {appointments.filter(apt => apt.status === 'confirmed').map(appointment => (
        <div key={appointment.id_reservasi} className="appointment-card">
          <div>
            <h4>{appointment.service}</h4>
            <p>{appointment.puskesmas}</p>
            <p>{new Date(appointment.tanggal_reservasi).toLocaleDateString('id-ID')} - {appointment.waktu_antrian}</p>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <span className="status-confirmed" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  Terkonfirmasi
                  <span className="queue-number-highlight" style={{margin: '0.3rem 0 0 0'}}>{formatQueueNumber(appointment.nomor_antrian)}</span>
                </span>
          </div>
        </div>
      ))}
    </div>
    <div className="health-stats">
      <div className="stat-card">
        <span>Kunjungan Bulan Ini</span>
        <span>2</span>
        <Activity />
      </div>
      <div className="stat-card">
        <span>Reservasi Aktif</span>
        <span>1</span>
        <Calendar />
      </div>
      <div className="stat-card">
        <span>Puskesmas Tersedia</span>
        <span>2</span>
        <MapPin />
      </div>
    </div>
  </div>
    </>
);
};

export default DashboardPatient; 