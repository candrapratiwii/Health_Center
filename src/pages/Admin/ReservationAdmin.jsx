import React, { useEffect, useState } from "react";
import { Table, Tag, Card, message, Dropdown, Button, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getDataPrivate } from "../../utils/api";

const mainColor = "#14b8a6";
const accentColor = "#06b6d4";

// Referensi id ke nama puskesmas
const puskesmasList = [
  { id: 1, nama: "Buleleng I" },
  { id: 2, nama: "Buleleng II" },
  { id: 3, nama: "Sukasada I" },
  { id: 4, nama: "Sukasada II" },
  { id: 5, nama: "Sawan I" },
  { id: 6, nama: "Sawan II" },
  { id: 7, nama: "Banjar I" },
  { id: 8, nama: "Banjar II" },
  { id: 9, nama: "Seririt I" },
  { id: 10, nama: "Seririt II" },
  { id: 11, nama: "Tejakula" },
  { id: 12, nama: "Kubutambahan" },
  { id: 13, nama: "Busungbiu" },
];

const mapPuskesmasIdToNama = (id) => {
  const found = puskesmasList.find((p) => p.id === id);
  return found ? found.nama : "-";
};

const statusColor = {
  pending: "gold",
  accepted: "green",
  rejected: "volcano",
};

const ReservationAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPuskesmas, setFilterPuskesmas] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const reservationsResp = await getDataPrivate("/api/v1/reservations/");
      let reservations = Array.isArray(reservationsResp)
        ? reservationsResp
        : reservationsResp.data || [];
      console.log("reservations", reservations);
      const mergedData = await Promise.all(
        reservations.map(async (res) => {
          let queue = null;
          try {
            const queueResp = await getDataPrivate(
              `/api/v1/queues/user/${res.id_user}`
            );
            queue = Array.isArray(queueResp)
              ? queueResp[0]
              : queueResp?.data?.[0] || null;
          } catch (e) {
            queue = null;
          }
          return {
            nama_pasien: res.nama_pasien || res.nama || res.user_name || "-",
            nama_puskesmas: res.nama_puskesmas || res.puskesmas || "-",
            nomor_antrian: queue?.Queue || "-",
            status: queue?.status || res.status || "-",
            id_reservasi: res.id_reservasi || res.id || Math.random(),
          };
        })
      );
      setData(mergedData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const columns = [
    { title: "Nama Pasien", dataIndex: "nama_pasien", key: "nama_pasien" },
    {
      title: "Nama Puskesmas",
      dataIndex: "nama_puskesmas",
      key: "nama_puskesmas",
    },
    {
      title: "Nomor Antrian",
      dataIndex: "nomor_antrian",
      key: "nomor_antrian",
    },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  // Filter data sesuai puskesmas
  const filteredData = filterPuskesmas
    ? data.filter((item) => item.puskesmas === filterPuskesmas)
    : data;

  return (
    <div style={{ padding: 32, background: "#f6fafd", minHeight: "100vh" }}>
      <Card
        style={{
          border: `2px solid ${mainColor}`,
          borderRadius: 16,
          boxShadow: "0 2px 8px 0 rgba(20,184,166,0.04)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <h2 style={{ marginBottom: 16, color: mainColor }}>Kelola Reservasi</h2>
        <div style={{ marginBottom: 16 }}>
          <Select
            allowClear
            placeholder="Filter Puskesmas"
            style={{ minWidth: 220 }}
            value={filterPuskesmas || undefined}
            onChange={setFilterPuskesmas}
            options={puskesmasList.map((p) => ({
              label: p.nama,
              value: p.nama,
            }))}
          />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id_reservasi}
          pagination={{ pageSize: 8 }}
          bordered
          loading={loading}
          style={{
            background: "#fff",
            borderRadius: 12,
            border: `2px solid ${mainColor}`,
          }}
        />
      </Card>
    </div>
  );
};

export default ReservationAdmin;
