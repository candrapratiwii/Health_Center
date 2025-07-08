import React, { useState, useEffect, useContext } from 'react';
import { Clock } from 'lucide-react';
import './AppointmentsPatient.css';
import { getDataPrivate } from '../../../utils/api';
import { AuthContext } from '../../../providers/AuthProvider';

const formatQueueNumber = (number) => {
  if (!number) return 'Belum ada';
  return number.toString().padStart(3, '0');
};

const AppointmentsPatient = () => {
  const { userProfile, isLoadingScreen } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile || !userProfile.id_user) return;
    setLoading(true);
    getDataPrivate(`/api/v1/queues/${userProfile.id_user}`)
      .then((resp) => {
        console.log('Response antrian:', resp); // Tambahkan log ini
        if (Array.isArray(resp)) {
          setAppointments(resp);
        } else if (resp) {
          setAppointments([resp]);
        } else {
          setAppointments([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setAppointments([]);
        setLoading(false);
      });
  }, [userProfile]);

  if (isLoadingScreen || !userProfile || !userProfile.id_user) {
    return <div>Loading user...</div>;
  }

  const filteredAppointments = statusFilter === 'all'
    ? appointments
    : appointments.filter(a => a.status === statusFilter);

  return (
    <div className="appointments-patient">
      <h3>Reservasi Saya</h3>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label htmlFor="statusFilter">Filter Status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '0.4rem 1rem', borderRadius: '0.5rem', border: '1px solid #e0e7ef' }}
        >
          <option value="all">Semua</option>
          <option value="confirmed">Terkonfirmasi</option>
          <option value="pending">Menunggu</option>
        </select>
      </div>
      {loading ? <div>Loading data reservasi...</div> : null}
      <div className="appointments-list">
        {filteredAppointments.map(appointment => (
          <div key={appointment.id_antrian} className="appointment-item" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div className="appointment-info" style={{flexGrow: 1}}>
              <h4>{appointment.nama_layanan || '-'}</h4>
              <p>{appointment.nama_puskesmas || '-'}</p>
              <p>Dr. {appointment.nama_dokter || '-'}</p>
              <span>Tanggal: {appointment.tanggal_reservasi ? new Date(appointment.tanggal_reservasi).toLocaleDateString('id-ID') : '-'}</span>
              <span>Waktu: {appointment.waktu_antrian || '-'}</span>
              <span>Status: {appointment.status || '-'}</span>
              <span>ID Reservasi: #{appointment.id_reservasi}</span>
            </div>
            <div className="appointment-meta" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', minWidth: '120px'}}>
              <span className={`status ${appointment.status}`}>{appointment.status === 'confirmed' ? 'Terkonfirmasi' : 'Menunggu'}</span>
              <span className={`queue-number ${appointment.status}`} style={{marginTop: '0.4rem'}}>{formatQueueNumber(appointment.nomor_antrian)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsPatient; 