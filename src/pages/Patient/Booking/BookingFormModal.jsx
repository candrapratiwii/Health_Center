import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Form, Input, Select, Button } from 'antd';

const BookingFormModal = ({ visible, onClose, onSubmit, initialData = {}, puskesmasList = [], servicesList = [], mode = 'add', isSubmitting }) => {
  // HOOKS SELALU DI ATAS
  const [form] = Form.useForm();
  const tanggal = Form.useWatch('tanggal', form);

  useEffect(() => {
    if (visible) {
      form.resetFields(); // Reset form setiap modal dibuka
      if (initialData) {
        form.setFieldsValue({
          puskesmas: initialData.selectedPuskesmas ? (initialData.selectedPuskesmas.id_puskesmas) : '',
          layanan: typeof initialData.selectedLayanan === 'string' ? initialData.selectedLayanan : '',
          tanggal: initialData.selectedTanggal || '',
          jam: typeof initialData.selectedJam === 'string' ? initialData.selectedJam : ''
        });
      }
    }
  }, [visible, initialData, form]);

  function getDayName(dateStr) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    if (!dateStr) return '';
    let date;
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else if (dateStr.includes('/')) {
      const [month, day, year] = dateStr.split('/').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateStr);
    }
    return days[date.getDay()];
  }

  function generateJamOptions(jamBuka, jamTutup) {
    const buka = parseInt(jamBuka.split(':')[0], 10);
    const tutup = parseInt(jamTutup.split(':')[0], 10);
    const options = [];
    for (let h = buka; h <= tutup; h++) {
      options.push(h.toString().padStart(2, '0') + ':00');
    }
    return options;
  }

  // PENGECEKAN SETELAH HOOKS
  if (!visible) return null;

  const handleFinish = (values) => {
    const selectedPuskesmas = puskesmasList.find(p => String(p.id_puskesmas) === String(values.puskesmas));
    onSubmit({
      selectedPuskesmas,
      selectedLayanan: values.layanan,
      selectedTanggal: values.tanggal,
      selectedJam: values.jam
    });
    form.resetFields();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const jamOptions = tanggal && getDayName(tanggal).toLowerCase() !== 'minggu'
    ? generateJamOptions('08:00', '16:00')
    : [];

  return (
    <div className="booking-modal" style={{zIndex: 1000}}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{mode === 'edit' ? 'Reschedule Reservasi' : 'Buat Reservasi'}</h3>
          <button onClick={handleClose}><X /></button>
        </div>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <div className="modal-body">
            <Form.Item label="Puskesmas" name="puskesmas">
              <Select disabled>
                {puskesmasList.map(p => (
                  <Select.Option key={p.id_puskesmas} value={p.id_puskesmas}>{p.nama_puskesmas}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Jenis Layanan" name="layanan" rules={[{ required: true, message: 'Pilih layanan' }]}> 
              <Select placeholder="Pilih layanan">
                {servicesList.map(service => (
                  <Select.Option key={service.id_layanan} value={String(service.id_layanan)}>{service.nama_layanan}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Tanggal" name="tanggal" rules={[{ required: true, message: 'Pilih tanggal' }]}> 
              <Input type="date" min={new Date().toISOString().slice(0, 10)} />
            </Form.Item>
            <Form.Item label="Jam" name="jam" rules={[{ required: true, message: 'Pilih jam' }]}> 
              {tanggal && getDayName(tanggal).toLowerCase() === 'minggu' ? (
                <div style={{color:'#aaa',marginTop:4}}>Tutup</div>
              ) : (
                <Select placeholder="Pilih jam">
                  {jamOptions.map(jam => (
                    <Select.Option key={jam} value={jam}>{jam}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </div>
          <div className="modal-actions">
            <Button onClick={handleClose} className="cancel-btn">Batal</Button>
            <Button type="primary" htmlType="submit" className="submit-btn" loading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : (mode === 'edit' ? 'Simpan Perubahan' : 'Buat Reservasi')}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default BookingFormModal; 