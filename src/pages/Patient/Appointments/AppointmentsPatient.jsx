import React, { useState, useEffect, useContext } from 'react';
import { Clock } from 'lucide-react';
import './AppointmentsPatient.css';
import BookingFormModal from '../Booking/BookingFormModal';
import { getDataPrivate, sendDataPrivate, editDataPrivatePut } from '../../../utils/api';
import { AuthContext } from '../../../providers/AuthProvider';
import { notification, Popconfirm } from 'antd';

const formatQueueNumber = (number) => {
  if (!number) return 'Belum ada';
  return number.toString().padStart(3, '0');
};

const AppointmentsPatient = () => {
  const { userProfile, isLoadingScreen } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, appointment: null });
  const [puskesmasList, setPuskesmasList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (!userProfile || !userProfile.id_user) return;
    setLoading(true);
    getDataPrivate(`/api/v1/queues/user/${userProfile.id_user}`)
      .then((resp) => {
        // resp bisa array atau objek tunggal
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
    // Ambil data puskesmas & layanan
    getDataPrivate('/api/v1/health_centers').then(resp => {
      setPuskesmasList(resp?.data || resp || []);
    });
    getDataPrivate('/api/v1/services').then(resp => {
      setServicesList(resp?.data || resp || []);
    });
  }, [userProfile]);

  if (isLoadingScreen || !userProfile || !userProfile.id_user) {
    return <div>Loading user...</div>;
  }

  const filteredAppointments = statusFilter === 'all'
    ? appointments
    : appointments.filter(a => a.status === statusFilter);

  const handleReschedule = (appointment) => {
    if (!puskesmasList.length || !servicesList.length) {
      api.error({ message: 'Data puskesmas/layanan belum siap, silakan tunggu...' });
      return;
    }
    setRescheduleModal({ open: true, appointment });
  };

  const handleCancel = async (appointment) => {
    setIsSubmitting(true);
    try {
      // Ganti ke PUT status cancelled
      console.log('Cancel PUT payload:', { status: 'cancelled' });
      await editDataPrivatePut(`/api/v1/reservations/${appointment.id_reservasi}`, {
        status: 'cancelled'
      });
      api.success({ message: 'Reservasi dibatalkan' });
      setRescheduleModal({ open: false, appointment: null });
      setLoading(true);
      getDataPrivate(`/api/v1/queues/user/${userProfile.id_user}`)
        .then((resp) => {
          if (Array.isArray(resp)) setAppointments(resp);
          else if (resp) setAppointments([resp]);
          else setAppointments([]);
          setLoading(false);
        })
        .catch(() => { setAppointments([]); setLoading(false); });
    } catch (err) {
      api.error({ message: 'Gagal membatalkan reservasi' });
    }
    setIsSubmitting(false);
  };

  // Debug initialData untuk reschedule
  const debugInitialData = rescheduleModal.appointment && puskesmasList.length && servicesList.length ? {
    selectedPuskesmas: puskesmasList.find(
      p => String(p.id_puskesmas) === String(rescheduleModal.appointment.id_puskesmas)
    ),
    selectedLayanan: servicesList.find(
      s => String(s.id_layanan) === String(rescheduleModal.appointment.id_layanan)
    ) ? String(rescheduleModal.appointment.id_layanan) : (servicesList[0] ? String(servicesList[0].id_layanan) : ''),
    selectedTanggal: rescheduleModal.appointment.tanggal_reservasi
      ? new Date(rescheduleModal.appointment.tanggal_reservasi).toISOString().slice(0, 10)
      : '',
    selectedJam: rescheduleModal.appointment.waktu_antrian || ''
  } : {};
  console.log('initialData for reschedule:', debugInitialData);

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
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>
      {loading ? <div>Loading data reservasi...</div> : null}
      <div className="appointments-list">
        {filteredAppointments.map(appointment => {
          const isCancelled = appointment.status === 'cancelled';
          return (
            <div
              key={appointment.id_antrian}
              className="appointment-item"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                background: isCancelled ? '#f3f3f3' : '#fff',
                opacity: isCancelled ? 0.6 : 1,
                pointerEvents: isCancelled ? 'none' : 'auto',
                filter: isCancelled ? 'grayscale(0.5)' : 'none'
              }}
            >
              <div className="appointment-info" style={{flexGrow: 1}}>
                <h4>{appointment.nama_puskesmas || '-'}</h4>
                <p>Dr. {appointment.nama_dokter || '-'}</p>
                <p>{appointment.nama_layanan || '-'}</p>
                <div>
                  <span>Tanggal: {appointment.tanggal_reservasi ? new Date(appointment.tanggal_reservasi).toLocaleDateString('id-ID') : '-'}</span><br />
                  <span>Waktu: {appointment.waktu_antrian || '-'}</span><br />
                  <span>No. Antrian: {appointment.nomor_antrian || '-'}</span>
                </div>
                <div style={{marginTop: '0.5rem', display: 'flex', gap: '0.5rem'}}>
                  <button
                    onClick={() => handleReschedule(appointment)}
                    style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '0.4rem',
                      border: '1px solid #e0e7ef',
                      background: '#f5f7fa',
                      cursor: isCancelled ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isCancelled}
                  >
                    Reschedule
                  </button>
                  <Popconfirm
                    title="Batalkan Reservasi"
                    description="Apakah Anda yakin ingin membatalkan reservasi ini?"
                    onConfirm={() => handleCancel(appointment)}
                    okText="Ya, Batalkan"
                    cancelText="Batal"
                    disabled={isCancelled}
                  >
                    <button
                      style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '0.4rem',
                        border: '1px solid #e0e7ef',
                        background: '#ffeaea',
                        color: '#d32f2f',
                        cursor: isCancelled ? 'not-allowed' : 'pointer'
                      }}
                      disabled={isCancelled}
                    >
                      Cancel
                    </button>
                  </Popconfirm>
                </div>
              </div>
              <div className="appointment-meta" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', minWidth: '120px'}}>
                <span className={`status ${appointment.status}`} style={{
                  background: appointment.status === 'confirmed' ? '#e0ffe0' : appointment.status === 'cancelled' ? '#eee' : '#fffbe0',
                  color: appointment.status === 'cancelled' ? '#888' : appointment.status === 'confirmed' ? '#388e3c' : '#bfa100',
                  padding: '2px 10px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14
                }}>
                  {appointment.status === 'confirmed' ? 'Terkonfirmasi' : appointment.status === 'cancelled' ? 'Dibatalkan' : 'Menunggu'}
                </span>
                <span className={`queue-number ${appointment.status}`} style={{marginTop: '0.4rem'}}>{formatQueueNumber(appointment.nomor_antrian)}</span>
              </div>
            </div>
          );
        })}
      </div>
      {contextHolder}
      <BookingFormModal
        visible={rescheduleModal.open && !!puskesmasList.length && !!servicesList.length}
        onClose={() => setRescheduleModal({ open: false, appointment: null })}
        onSubmit={async ({ selectedPuskesmas, selectedLayanan, selectedTanggal, selectedJam }) => {
          if (!selectedLayanan || !selectedTanggal || !selectedJam) {
            api.error({ message: 'Lengkapi semua data' });
            return;
          }
          setIsSubmitting(true);
          // Log payload PUT
          console.log('Reschedule PUT payload:', {
            id_puskesmas: selectedPuskesmas.kode_faskes,
            id_layanan: parseInt(selectedLayanan, 10),
            tanggal_reservasi: `${selectedTanggal}T${selectedJam}:00`
          });
          try {
            await editDataPrivatePut(`/api/v1/reservations/${rescheduleModal.appointment.id_reservasi}`, {
              id_puskesmas: selectedPuskesmas.kode_faskes,
              id_layanan: parseInt(selectedLayanan, 10),
              tanggal_reservasi: `${selectedTanggal}T${selectedJam}:00`
            });
            api.success({ message: 'Reservasi berhasil diubah' });
            setRescheduleModal({ open: false, appointment: null });
            setLoading(true);
            getDataPrivate(`/api/v1/queues/user/${userProfile.id_user}`)
              .then((resp) => {
                if (Array.isArray(resp)) setAppointments(resp);
                else if (resp) setAppointments([resp]);
                else setAppointments([]);
                setLoading(false);
              })
              .catch(() => { setAppointments([]); setLoading(false); });
          } catch (err) {
            api.error({ message: 'Gagal mengubah reservasi' });
          }
          setIsSubmitting(false);
        }}
        initialData={debugInitialData}
        puskesmasList={puskesmasList}
        servicesList={servicesList}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </div>
  );
};

export default AppointmentsPatient; 