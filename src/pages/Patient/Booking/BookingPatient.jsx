import React, { useState, useEffect } from 'react';
import { getDataPrivate } from '../../../utils/api';
import { Calendar, Clock, MapPin, Phone, Star, Filter, Search, X } from 'lucide-react';
import './BookingPatient.css';

const BookingPatient = () => {
  const [puskesmasData, setPuskesmasData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPuskesmas, setSelectedPuskesmas] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

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

  return (
    <div className="booking-patient">
      <div className="booking-list">
        <h3>Pilih Puskesmas</h3>
        <div className="booking-search-filter">
          <div className="search-box">
            <Search />
            <input type="text" placeholder="Cari puskesmas..." />
          </div>
          <button className="filter-btn"><Filter />Filter</button>
        </div>
        {isLoading && <div>Loading data puskesmas...</div>}
        {error && <div style={{color: 'red'}}>Error: {error}</div>}
        <div className="puskesmas-list">
          {!isLoading && !error && puskesmasData.map(puskesmas => (
            <div key={puskesmas.id || puskesmas._id} className="puskesmas-card">
              <div className="puskesmas-info">
                <h4>{puskesmas.nama_puskesmas}</h4>
                <p><MapPin />{puskesmas.alamat}</p>
                <p><Phone />{puskesmas.nomor_kontak}</p>
              </div>
              <div className="puskesmas-meta">
                <span><Star />{puskesmas.rating || '-'}</span>
                <span>{puskesmas.distance || '-'}</span>
              </div>
              <div className="puskesmas-services">
                {(puskesmas.services || []).slice(0, 3).map(service => (
                  <span key={service}>{service}</span>
                ))}
              </div>
              <div className="puskesmas-actions">
                <span className={puskesmas.available ? 'available' : 'full'}>
                  {puskesmas.available ? 'Tersedia' : 'Penuh'}
                </span>
                <button
                  onClick={() => {
                    setSelectedPuskesmas(puskesmas);
                    setShowBookingForm(true);
                  }}
                  disabled={!puskesmas.available}
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
        <div className="booking-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Buat Reservasi</h3>
              <button onClick={() => setShowBookingForm(false)}><X /></button>
            </div>
            <div className="modal-body">
              <label>Puskesmas</label>
              <input type="text" value={selectedPuskesmas.nama_puskesmas} disabled />
              <label>Jenis Layanan</label>
              <select>
                <option value="">Pilih layanan</option>
                {(selectedPuskesmas.services || []).map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
              <label>Tanggal & Waktu</label>
              <input type="datetime-local" min={new Date().toISOString().slice(0, 16)} />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowBookingForm(false)} className="cancel-btn">Batal</button>
              <button className="submit-btn">Buat Reservasi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPatient; 