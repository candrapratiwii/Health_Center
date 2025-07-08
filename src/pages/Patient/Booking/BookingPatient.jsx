import React, { useState, useEffect } from 'react';
import { getDataPrivate, sendDataPrivate } from '../../../utils/api';
import { Calendar, Clock, MapPin, Phone, Star, Filter, Search, X, Stethoscope, HeartPulse } from 'lucide-react';
import './BookingPatient.css';
import { useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import { notification, Popconfirm } from 'antd';
import BookingFormModal from './BookingFormModal';

const BookingPatient = () => {
  const [puskesmasData, setPuskesmasData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPuskesmas, setSelectedPuskesmas] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("all");
  const [servicesList, setServicesList] = useState([]);
  const [selectedLayanan, setSelectedLayanan] = useState("");
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [selectedJam, setSelectedJam] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userProfile, isLoadingScreen } = useContext(AuthContext);
  const [api, contextHolder] = notification.useNotification();
  const [doctorsMap, setDoctorsMap] = useState({});
  const [initialDataBooking, setInitialDataBooking] = useState({});
  const [rescheduleData, setRescheduleData] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  if (isLoadingScreen || !userProfile || !userProfile.id_user) {
    return <div>Loading user...</div>;
  }

  const dummyJadwal = {
    "Senin": { buka: "08:00", tutup: "14:00" },
    "Selasa": { buka: "08:00", tutup: "14:00" },
    "Rabu": { buka: "08:00", tutup: "14:00" },
    "Kamis": { buka: "08:00", tutup: "14:00" },
    "Jumat": { buka: "08:00", tutup: "11:00" },
    "Sabtu": { buka: "08:00", tutup: "12:00" },
    "Minggu": { tutup: true }
  };
  const dummyPuskesmas = [
    { id: 1, nama_puskesmas: "Tejakula I", alamat: "Jl. Singaraja – Amlapura, Dusu", nomor_kontak: "0362-3301240", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Kadek Sari", jadwal_operasional: dummyJadwal },
    { id: 2, nama_puskesmas: "Tejakula II", alamat: "Jl. Singaraja – Amlapura", nomor_kontak: "0362-3303242", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "drg. Made Wirawan", jadwal_operasional: dummyJadwal },
    { id: 3, nama_puskesmas: "Kubutambahan I", alamat: "Br. Dinas Kubuanyar", nomor_kontak: "0362-036221892", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Putu Dewi", jadwal_operasional: dummyJadwal },
    { id: 4, nama_puskesmas: "Kubutambahan II", alamat: "Jl. Raya Kubutambahan Kintaman", nomor_kontak: "0362-3303277", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. I Nyoman Agus", jadwal_operasional: dummyJadwal },
    { id: 5, nama_puskesmas: "Sawan I", alamat: "Jl. Raya Sangsit", nomor_kontak: "0362-24960", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Luh Putu", jadwal_operasional: dummyJadwal },
    { id: 6, nama_puskesmas: "Sawan II", alamat: "Jl. Raya Sawan", nomor_kontak: "0362-3303726", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Gede Arya", jadwal_operasional: dummyJadwal },
    { id: 7, nama_puskesmas: "Buleleng I", alamat: "Jl. Ahmad Yani No. 43", nomor_kontak: "0362-081797583", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Ni Komang", jadwal_operasional: dummyJadwal },
    { id: 8, nama_puskesmas: "Buleleng II", alamat: "Jl. Singaraja-Seririt", nomor_kontak: "0362-41116", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. I Made Suta", jadwal_operasional: dummyJadwal },
    { id: 9, nama_puskesmas: "Buleleng III", alamat: "Jl. Pulau Seribu", nomor_kontak: "0362-25931", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Ayu Lestari", jadwal_operasional: dummyJadwal },
    { id: 10, nama_puskesmas: "Sukasada I", alamat: "Jl. Jelantik Gingsir No. 51", nomor_kontak: "0362-23135", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Komang Sari", jadwal_operasional: dummyJadwal },
    { id: 11, nama_puskesmas: "Sukasada II", alamat: "Jl. Raya Denpasar – Singaraja", nomor_kontak: "0362-29954", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Putu Eka", jadwal_operasional: dummyJadwal },
    { id: 12, nama_puskesmas: "Banjar I", alamat: "Jl. Segara No 1", nomor_kontak: "0362-92242", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Gede Wirata", jadwal_operasional: dummyJadwal },
    { id: 13, nama_puskesmas: "Banjar II", alamat: "Dsn. Ideran", nomor_kontak: "0362-3361990", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Luh Ayu", jadwal_operasional: dummyJadwal },
    { id: 14, nama_puskesmas: "Busungbiu I", alamat: "Jl. Amerta No. 12", nomor_kontak: "0362-081236085", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. I Gusti Rai", jadwal_operasional: dummyJadwal },
    { id: 15, nama_puskesmas: "Busungbiu II", alamat: "Jl. Raya Pupuan – Pekutatan", nomor_kontak: "0362-081237011", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Ni Luh Sari", jadwal_operasional: dummyJadwal },
    { id: 16, nama_puskesmas: "Seririt I", alamat: "Jl. Jendral Sudirman No. 50", nomor_kontak: "0362-21665", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Komang Putra", jadwal_operasional: dummyJadwal },
    { id: 17, nama_puskesmas: "Seririt II", alamat: "Jl. Seririt – Gilimanuk", nomor_kontak: "0362-081337888", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Ayu Wulandari", jadwal_operasional: dummyJadwal },
    { id: 18, nama_puskesmas: "Seririt III", alamat: "Jl. Raya Seririt – Pupuan", nomor_kontak: "0362-036233613", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. I Made Agus", jadwal_operasional: dummyJadwal },
    { id: 19, nama_puskesmas: "Gerokgak I", alamat: "Jl. Seririt – Gilimanuk", nomor_kontak: "0362-3361389", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Putu Sulastri", jadwal_operasional: dummyJadwal },
    { id: 20, nama_puskesmas: "Gerokgak II", alamat: "Jl. Seririt – Gilimanuk", nomor_kontak: "0362-28148", jam_operasional: "2024-06-01T08:00:00", jam_tutup: "16:00", nama_dokter: "dr. Gede Sugiarta", jadwal_operasional: dummyJadwal }
  ];

  const getDataPuskesmas = () => {
    setIsLoading(true);
    getDataPrivate('/api/v1/health_centers')
      .then((resp) => {
        setIsLoading(false);
        if (resp?.data) {
          setPuskesmasData(resp.data);
        } else if (Array.isArray(resp)) {
          setPuskesmasData(resp);
        } else {
          setPuskesmasData([]);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError('Gagal mengambil data puskesmas');
        console.log(err);
      });
  };

  useEffect(() => {
    getDataPuskesmas();
  }, []);

  useEffect(() => {
    getDataPrivate('/api/v1/doctors')
      .then(resp => {
        let list = resp?.data || resp || [];
        const map = {};
        list.forEach(dokter => {
          map[dokter.id_dokter] = dokter.nama_dokter;
        });
        setDoctorsMap(map);
      })
      .catch(err => {
        setDoctorsMap({});
        console.log('Gagal mengambil data dokter', err);
      });
  }, []);

  // Ambil data layanan dari API saat modal booking dibuka
  useEffect(() => {
    if (showBookingForm) {
      getDataPrivate('/api/v1/services')
        .then((resp) => {
          let list = [];
          if (resp?.data) {
            list = resp.data;
          } else if (Array.isArray(resp)) {
            list = resp;
          }
          console.log('Data layanan dari API:', list);
          setServicesList(list);
        })
        .catch((err) => {
          setServicesList([]);
          console.log('Gagal mengambil data layanan', err);
        });
    }
  }, [showBookingForm]);

  function extractKecamatan(nama) {
    return nama.split(' ').slice(0, -1).join(' ');
  }
  const kecamatanList = [
    ...new Set(puskesmasData.map(p => extractKecamatan(p.nama_puskesmas)))
  ];

  // Filter dan search data
  const filteredPuskesmas = puskesmasData.filter(p => {
    const matchSearch =
      p.nama_puskesmas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    const kecamatan = extractKecamatan(p.nama_puskesmas);
    const matchKecamatan = filterKecamatan === "all" || kecamatan === filterKecamatan;
    return matchSearch && matchKecamatan;
  });

  // Fungsi untuk generate array jam dari jam buka ke jam tutup
  function generateJamOptions(jamBuka, jamTutup) {
    const buka = parseInt(jamBuka.split(':')[0], 10);
    const tutup = parseInt(jamTutup.split(':')[0], 10);
    const options = [];
    for (let h = buka; h <= tutup; h++) {
      options.push(h.toString().padStart(2, '0') + ':00');
    }
    return options;
  }

  // Tambahkan fungsi handleCancelBooking
  const handleCancelBooking = async (id_reservasi) => {
    try {
      await getDataPrivate(`/api/v1/reservations/${id_reservasi}`, 'PUT', { status: 'cancelled' });
      api.success({ message: 'Reservasi dibatalkan' });
      // Jika ingin refresh data, panggil getDataPuskesmas() atau handler lain di sini
    } catch (err) {
      api.error({ message: 'Gagal membatalkan reservasi' });
    }
  };

  return (
    <div className="booking-patient">
      {contextHolder}
      <div className="booking-list">
        <h3>Pilih Puskesmas</h3>
        <div className="booking-search-filter">
          <div className="search-box">
            <Search />
            <input
              type="text"
              placeholder="Cari puskesmas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-btn"
            value={filterKecamatan}
            onChange={e => setFilterKecamatan(e.target.value)}
          >
            <option value="all">Semua Daerah</option>
            {kecamatanList.map(kec => (
              <option key={kec} value={kec}>{kec}</option>
            ))}
          </select>
        </div>
        {isLoading && <div>Loading data puskesmas...</div>}
        {error && <div style={{color: 'red'}}>Error: {error}</div>}
        <div className="puskesmas-list">
          {!isLoading && !error && filteredPuskesmas.map(puskesmas => (
            <div key={puskesmas.id} className="puskesmas-card">
              <div className="puskesmas-icon"><Stethoscope color="#fff" /></div>
              <div className="puskesmas-info">
                <h4 style={{textAlign: 'center'}}>{puskesmas.nama_puskesmas}</h4>
                <p style={{fontSize: '0.97rem'}}><MapPin size={16} style={{marginRight: 4}} />{puskesmas.alamat}</p>
                <p style={{fontSize: '0.97rem'}}><Phone size={15} style={{marginRight: 4}} />{puskesmas.nomor_kontak}</p>
                <p>Jam Operasional: {new Date(puskesmas.jam_operasional).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                <p>Dokter: {doctorsMap[puskesmas.id_dokter] || '-'}</p>
              </div>
              <div className="puskesmas-actions">
                <button
                  onClick={() => {
                    setSelectedPuskesmas(puskesmas);
                    setInitialDataBooking({
                      selectedPuskesmas: puskesmas,
                      selectedLayanan: '',
                      selectedTanggal: '',
                      selectedJam: ''
                    });
                    setShowBookingForm(true);
                  }}
                  className="choose-btn"
                >
                  Pilih
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showBookingForm && selectedPuskesmas && (
        <BookingFormModal
          visible={showBookingForm}
          onClose={() => setShowBookingForm(false)}
          onSubmit={async ({ selectedPuskesmas, selectedLayanan, selectedTanggal, selectedJam }) => {
            if (!selectedLayanan || !selectedTanggal || !selectedJam) {
              api.error({ message: 'Reservasi', description: 'Lengkapi semua data reservasi!' });
              return;
            }
            setIsSubmitting(true);
            try {
              if (!selectedPuskesmas || !selectedPuskesmas.id_puskesmas) {
                api.error({ message: 'Reservasi', description: 'Puskesmas belum dipilih!' });
                setIsSubmitting(false);
                return;
              }
              // Gabungkan tanggal dan jam tanpa detik
              const tanggal_reservasi = `${selectedTanggal}T${selectedJam}`;
              const payload = {
                id_user: userProfile.id_user,
                id_puskesmas: selectedPuskesmas.id_puskesmas,
                id_layanan: parseInt(selectedLayanan, 10),
                tanggal_reservasi: tanggal_reservasi,
                status: 'pending',
              };
              await sendDataPrivate('/api/v1/reservations/', JSON.stringify(payload));
              api.success({
                message: 'Reservasi Berhasil',
                description: 'Reservasi Anda berhasil dibuat.'
              });
              // Coba ambil nomor antrian
              try {
                const antrian = await getDataPrivate(`/api/v1/queues/user/${userProfile.id_user}`);
                const nomor = Array.isArray(antrian) ? (antrian[antrian.length-1]?.nomor_antrian) : (antrian?.nomor_antrian);
                if (nomor) {
                  api.info({
                    message: 'Nomor Antrian',
                    description: 'Nomor antrian Anda: ' + nomor
                  });
                } else {
                  api.warning({
                    message: 'Reservasi Berhasil',
                    description: 'Reservasi berhasil, namun nomor antrian belum tersedia.'
                  });
                }
              } catch (err) {
                api.warning({
                  message: 'Reservasi Berhasil',
                  description: 'Reservasi berhasil, namun gagal mengambil nomor antrian.'
                });
              }
              setShowBookingForm(false);
              setSelectedLayanan("");
              setSelectedTanggal("");
              setSelectedJam("");
            } catch (err) {
              api.error({ message: 'Reservasi Gagal', description: 'Reservasi gagal! Silakan coba lagi.' });
            }
            setIsSubmitting(false);
          }}
          puskesmasList={filteredPuskesmas}
          servicesList={servicesList}
          isSubmitting={isSubmitting}
          mode="add"
          initialData={initialDataBooking}
        />
      )}
      {showRescheduleModal && rescheduleData && (
        <BookingFormModal
          visible={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          initialData={rescheduleData && puskesmasData.length ? {
            selectedPuskesmas: puskesmasData.find(
              p => String(p.id_puskesmas) === String(rescheduleData.id_puskesmas)
            ),
            selectedLayanan: String(rescheduleData.id_layanan),
            selectedTanggal: rescheduleData.tanggal_reservasi
              ? new Date(rescheduleData.tanggal_reservasi).toISOString().slice(0, 10)
              : '',
            selectedJam: rescheduleData.waktu_antrian || ''
          } : {}}
          puskesmasList={puskesmasData}
          servicesList={servicesList}
          isSubmitting={isSubmitting}
          mode="edit"
          onSubmit={async ({ selectedPuskesmas, selectedLayanan, selectedTanggal, selectedJam }) => {
            setIsSubmitting(true);
            try {
              await sendDataPrivate(`/api/v1/reservations/${rescheduleData.id_reservasi}`, JSON.stringify({
                id_puskesmas: selectedPuskesmas.id_puskesmas,
                id_layanan: parseInt(selectedLayanan, 10),
                tanggal_reservasi: `${selectedTanggal}T${selectedJam}`
              }), 'PUT');
              api.success({ message: 'Reservasi berhasil diubah' });
              setShowRescheduleModal(false);
              setRescheduleData(null);
              // refresh data jika perlu
            } catch (err) {
              api.error({ message: 'Gagal mengubah reservasi' });
            }
            setIsSubmitting(false);
          }}
        />
      )}
    </div>
  );
};

export default BookingPatient; 