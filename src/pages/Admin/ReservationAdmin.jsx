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
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Ambil semua user untuk mapping id_user ke username
      const usersResp = await getDataPrivate("/api/v1/users/");
      let usersArr = Array.isArray(usersResp)
        ? usersResp
        : usersResp.data || [];
      const userMapObj = {};
      usersArr.forEach((u) => {
        userMapObj[u.id_user] =
          u.username || u.nama || u.email || `User #${u.id_user}`;
      });
      setUserMap(userMapObj);

      // Ambil semua reservasi
      const reservationsResp = await getDataPrivate("/api/v1/reservations/");
      let reservations = Array.isArray(reservationsResp)
        ? reservationsResp
        : reservationsResp.data || [];

      // Ambil semua queue sekaligus
      const queuesResp = await getDataPrivate("/api/v1/queues/");
      let queuesArr = Array.isArray(queuesResp)
        ? queuesResp
        : queuesResp.data || [];
      // Buat map id_reservasi -> nomor_antrian
      const queueMap = {};
      queuesArr.forEach((q) => {
        if (q.id_reservasi) queueMap[q.id_reservasi] = q.nomor_antrian;
      });

      // Gabungkan data
      let mergedData = reservations.map((res) => ({
        id_user: res.id_user,
        nama_pasien: userMapObj[res.id_user] || "-",
        id_puskesmas: res.id_puskesmas,
        nama_puskesmas: mapPuskesmasIdToNama(res.id_puskesmas),
        nomor_antrian: queueMap[res.id_reservasi] || "-",
        tanggal_reservasi: res.tanggal_reservasi
          ? new Date(res.tanggal_reservasi).toLocaleString("id-ID")
          : "-",
        _tanggal_reservasi_raw: res.tanggal_reservasi || "",
        status: res.status || "-",
        id_reservasi: res.id_reservasi || res.id || Math.random(),
      }));
      // Urutkan berdasarkan tanggal_reservasi terbaru (descending)
      mergedData = mergedData.sort(
        (a, b) =>
          new Date(b._tanggal_reservasi_raw) -
          new Date(a._tanggal_reservasi_raw)
      );
      setData(mergedData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const columns = [
    {
      title: "Nama Pasien",
      dataIndex: "nama_pasien",
      key: "nama_pasien",
      sorter: (a, b) => a.nama_pasien.localeCompare(b.nama_pasien),
    },
    {
      title: "Nama Puskesmas",
      dataIndex: "nama_puskesmas",
      key: "nama_puskesmas",
      sorter: (a, b) => a.nama_puskesmas.localeCompare(b.nama_puskesmas),
    },
    {
      title: "Nomor Antrian",
      dataIndex: "nomor_antrian",
      key: "nomor_antrian",
      sorter: (a, b) =>
        (Number(a.nomor_antrian) || 0) - (Number(b.nomor_antrian) || 0),
    },
    {
      title: "Tanggal Reservasi",
      dataIndex: "tanggal_reservasi",
      key: "tanggal_reservasi",
      sorter: (a, b) =>
        new Date(a._tanggal_reservasi_raw) - new Date(b._tanggal_reservasi_raw),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "confirmed") color = "green";
        else if (status === "cancelled") color = "red";
        else if (status === "pending") color = "gold";
        return (
          <Tag
            color={color}
            style={{
              fontWeight: 600,
              fontSize: 14,
              textTransform: "capitalize",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
  ];

  // Filter data sesuai puskesmas
  const filteredData = filterPuskesmas
    ? data.filter((item) => item.nama_puskesmas === filterPuskesmas)
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
        <Table
          columns={columns}
          dataSource={filteredData}
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
