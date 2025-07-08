import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  Select,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { getDataPrivate } from "../../utils/api";

const puskesmasList = [
  "Puskesmas Buleleng I",
  "Puskesmas Buleleng II",
  "Puskesmas Sukasada I",
  "Puskesmas Sukasada II",
  "Puskesmas Sawan I",
  "Puskesmas Sawan II",
  "Puskesmas Banjar I",
  "Puskesmas Banjar II",
  "Puskesmas Seririt I",
  "Puskesmas Seririt II",
  "Puskesmas Tejakula",
  "Puskesmas Kubutambahan",
  "Puskesmas Busungbiu",
];

const mockPatients = [
  {
    id: 1,
    nama: "I Made Sudarma",
    nik: "5102010101010001",
    alamat: "Desa Kalibukbuk",
    puskesmas: "Puskesmas Buleleng I",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Ni Luh Putu Sari",
    nik: "5102010202020002",
    alamat: "Desa Anturan",
    puskesmas: "Puskesmas Buleleng II",
    status: "Aktif",
  },
  {
    id: 3,
    nama: "I Ketut Adi Wijaya",
    nik: "5102010303030003",
    alamat: "Desa Sukasada",
    puskesmas: "Puskesmas Sukasada I",
    status: "Nonaktif",
  },
  {
    id: 4,
    nama: "Ni Komang Ayu Dewi",
    nik: "5102010404040004",
    alamat: "Desa Banjar",
    puskesmas: "Puskesmas Banjar I",
    status: "Aktif",
  },
  {
    id: 5,
    nama: "I Gede Putra",
    nik: "5102010505050005",
    alamat: "Desa Tejakula",
    puskesmas: "Puskesmas Tejakula",
    status: "Aktif",
  },
];

const statusTag = {
  Aktif: <Tag color="green">Aktif</Tag>,
  Nonaktif: <Tag color="red">Nonaktif</Tag>,
};

const mainColor = "#14b8a6";

const DataPasien = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPuskesmas, setFilterPuskesmas] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getDataPrivate("/api/v1/users/1").then((data) => {
      // Jika data berupa array, filter role pasien
      let arr = Array.isArray(data) ? data : data.data || [];
      const pasien = arr.filter((u) => u.role === "pasien");
      setPatients(pasien);
    });
  }, []);

  const filteredPatients = patients.filter((p) => {
    const matchPuskesmas = filterPuskesmas
      ? p.puskesmas === filterPuskesmas
      : true;
    const matchSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nik.includes(search) ||
      p.alamat.toLowerCase().includes(search.toLowerCase());
    return matchPuskesmas && matchSearch;
  });

  const columns = [
    {
      title: "Nama Pasien",
      dataIndex: "nama",
      key: "nama",
      render: (text) => (
        <span>
          <UserOutlined style={{ color: mainColor, marginRight: 6 }} />
          {text}
        </span>
      ),
    },
    {
      title: "NIK",
      dataIndex: "nik",
      key: "nik",
    },
    {
      title: "Alamat",
      dataIndex: "alamat",
      key: "alamat",
    },
    {
      title: "Puskesmas",
      dataIndex: "puskesmas",
      key: "puskesmas",
      render: (puskesmas) => (
        <span>
          <HomeOutlined style={{ color: mainColor, marginRight: 6 }} />
          {puskesmas}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => statusTag[status] || <Tag>{status}</Tag>,
    },
    {
      title: "Aksi",
      key: "aksi",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            size="small"
            style={{
              marginRight: 8,
              borderColor: mainColor,
              color: mainColor,
              background: "#fff",
            }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Yakin hapus pasien ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              style={{
                borderColor: mainColor,
                color: mainColor,
                background: "#fff",
              }}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  function handleEdit(patient) {
    setEditingPatient(patient);
    form.setFieldsValue(patient);
    setShowModal(true);
  }

  function handleDelete(id) {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    message.success("Pasien berhasil dihapus");
  }

  function handleModalOk() {
    form.validateFields().then((values) => {
      if (editingPatient) {
        setPatients((prev) =>
          prev.map((p) =>
            p.id === editingPatient.id ? { ...editingPatient, ...values } : p
          )
        );
        message.success("Pasien berhasil diubah");
      } else {
        setPatients((prev) => [
          ...prev,
          { ...values, id: Date.now(), status: "Aktif" },
        ]);
        message.success("Pasien berhasil ditambah");
      }
      setShowModal(false);
    });
  }

  return (
    <div style={{ padding: 32, background: "#f6fafd", minHeight: "100vh" }}>
      <Row gutter={24} style={{ marginBottom: 24 }} align="middle">
        <Col xs={24} md={12}>
          <h2 style={{ margin: 0, color: mainColor, fontWeight: 700 }}>
            Data Pasien
          </h2>
          <div style={{ color: "#555", fontSize: 16 }}>
            Daftar pasien puskesmas
          </div>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: "right" }}>
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              borderColor: mainColor,
              color: mainColor,
              background: "#fff",
            }}
            onClick={handleAdd}
          >
            Tambah Pasien
          </Button> */}
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Cari pasien, NIK, atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            size="large"
            style={{ maxWidth: 350 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            value={filterPuskesmas}
            onChange={setFilterPuskesmas}
            style={{ width: "100%" }}
            allowClear
            placeholder="Filter Puskesmas"
            size="large"
          >
            {puskesmasList.map((p) => (
              <Select.Option key={p} value={p}>
                {p}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <div>
        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          bordered={false}
          style={{ background: "#fff", borderRadius: 12 }}
        />
      </div>
      <Modal
        title={editingPatient ? "Edit Pasien" : "Tambah Pasien"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleModalOk}
        okText={editingPatient ? "Update" : "Simpan"}
        cancelText="Batal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nama Pasien"
            name="nama"
            rules={[{ required: true, message: "Nama pasien wajib diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="NIK"
            name="nik"
            rules={[{ required: true, message: "NIK wajib diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Alamat"
            name="alamat"
            rules={[{ required: true, message: "Alamat wajib diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Puskesmas"
            name="puskesmas"
            rules={[{ required: true, message: "Puskesmas wajib diisi" }]}
          >
            <Select showSearch>
              {puskesmasList.map((p) => (
                <Select.Option key={p} value={p}>
                  {p}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataPasien;
