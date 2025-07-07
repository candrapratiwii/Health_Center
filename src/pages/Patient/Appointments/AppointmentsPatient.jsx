import React from 'react';
import { Clock } from 'lucide-react';
import './AppointmentsPatient.css';

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
  },
  {
    id_reservasi: 2,
    id_user: 1,
    id_puskesmas: 2,
    id_layanan: 3,
    tanggal_reservasi: "2025-07-15T10:30:00",
    status: "pending",
    nomor_antrian: 25,
    waktu_antrian: "10:30:00",
    puskesmas: "Puskesmas Buleleng",
    service: "Pemeriksaan Gigi",
    doctor: "drg. Made Wirawan"
  }
];

const formatQueueNumber = (number) => {
  if (!number) return 'Belum ada';
  return number.toString().padStart(3, '0');
};

const AppointmentsPatient = () => (
  <div className="appointments-patient">
    <h3>Reservasi Saya</h3>
    <div className="appointments-list">
      {appointments.map(appointment => (
        <div key={appointment.id_reservasi} className="appointment-item">
          <div className="appointment-info">
            <h4>{appointment.service}</h4>
            <p>{appointment.puskesmas}</p>
            <p>Dr. {appointment.doctor}</p>
            <span>Tanggal: {new Date(appointment.tanggal_reservasi).toLocaleDateString('id-ID')}</span>
            <span>Waktu: {appointment.waktu_antrian || 'Belum ditentukan'}</span>
            <span>ID Reservasi: #{appointment.id_reservasi}</span>
          </div>
          <div className="appointment-meta">
            <span className={`queue-number ${appointment.status}`}>{formatQueueNumber(appointment.nomor_antrian)}</span>
            <span className={`status ${appointment.status}`}>{appointment.status === 'confirmed' ? 'Terkonfirmasi' : 'Menunggu'}</span>
          </div>
          <div className="appointment-actions">
            <button>Lihat Detail</button>
            <button>Reschedule</button>
            <button>Batal</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AppointmentsPatient; 