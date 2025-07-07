import React from 'react';
import { User } from 'lucide-react';
import './ProfilePatient.css';

const ProfilePatient = () => (
  <div className="profile-patient">
    <h3>Profil Saya</h3>
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          <User />
        </div>
        <div>
          <h4>I Made Budi Santosa</h4>
          <p>NIK: 5107011234567890</p>
        </div>
      </div>
      <form className="profile-form">
        <div className="form-row">
          <label>Nama Lengkap</label>
          <input type="text" value="I Made Budi Santosa" readOnly />
        </div>
        <div className="form-row">
          <label>Tanggal Lahir</label>
          <input type="date" value="1985-03-15" readOnly />
        </div>
        <div className="form-row">
          <label>Jenis Kelamin</label>
          <select value="L" disabled>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div className="form-row">
          <label>No. Telepon</label>
          <input type="tel" value="082345678901" readOnly />
        </div>
        <div className="form-row">
          <label>Alamat</label>
          <textarea value="Jl. Gajah Mada No. 123, Banjar Dinas Singaraja, Desa Singaraja, Kec. Buleleng" readOnly rows="3" />
        </div>
        <div className="form-actions">
          <button className="save-btn" disabled>Simpan Perubahan</button>
          <button className="cancel-btn" disabled>Batal</button>
        </div>
      </form>
    </div>
  </div>
);

export default ProfilePatient; 