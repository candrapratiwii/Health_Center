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
  message,
  Popconfirm,
  notification,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getDataPrivate, sendData, deleteData } from "../../utils/api";

const mainColor = "#14b8a6";

const statusTag = {
  Aktif: <Tag color="green">Aktif</Tag>,
  Cuti: <Tag color="orange">Cuti</Tag>,
  Nonaktif: <Tag color="red">Nonaktif</Tag>,
};

const DataDokter = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title, description) => {
    api[type]({ message: title, description: description });
  };

  useEffect(() => {
    getDataDokter();
  }, []);

  const getDataDokter = () => {
    setLoading(true);
    getDataPrivate("/api/v1/doctors")
      .then((resp) => {
        setLoading(false);
        let arr = Array.isArray(resp) ? resp : resp.data || [];
        arr = arr.map((item) => ({
          ...item,
          id: item.id_dokter,
          key: item.id_dokter,
        }));
        setDoctors(arr);
      })
      .catch(() => setLoading(false));
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.nama_dokter.toLowerCase().includes(search.toLowerCase()) ||
      d.spesialis.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Nama Dokter",
      dataIndex: "nama_dokter",
      key: "nama_dokter",
      render: (text) => (
        <span>
          <UserOutlined style={{ color: mainColor, marginRight: 6 }} />
          {text}
        </span>
      ),
    },
    {
      title: "Spesialis",
      dataIndex: "spesialis",
      key: "spesialis",
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
            title="Yakin hapus dokter ini?"
            onConfirm={() => handleDelete(record)}
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

  function handleAdd() {
    setEditingDoctor(null);
    form.resetFields();
    setShowModal(true);
  }

  function handleEdit(doctor) {
    setEditingDoctor(doctor.id_dokter);
    form.setFieldsValue({
      nomor_str: doctor.nomor_str,
      nama_dokter: doctor.nama_dokter,
      spesialis: doctor.spesialis,
    });
    setShowModal(true);
  }

  function handleDelete(record) {
    let url = `/api/v1/doctors/${record.id_dokter}`;
    let params = new URLSearchParams();
    params.append("id", record.id_dokter);
    deleteData(url, params)
      .then((resp) => {
        if (resp?.status === 200) {
          setDoctors((prevData) =>
            prevData.filter((item) => item.id_dokter !== record.id_dokter)
          );
          openNotificationWithIcon(
            "success",
            "Dokter",
            "Dokter berhasil dihapus!"
          );
        } else {
          openNotificationWithIcon(
            "error",
            "Dokter",
            "Gagal menghapus dokter."
          );
        }
      })
      .catch(() => {
        openNotificationWithIcon("error", "Dokter", "Gagal menghapus dokter.");
      });
  }

  function handleModalOk() {
    form.validateFields().then((values) => {
      const payload = {
        nomor_str: values.nomor_str,
        nama_dokter: values.nama_dokter,
        spesialis: values.spesialis,
      };
      if (editingDoctor) {
        // Edit mode
        fetch(
          import.meta.env.VITE_REACT_APP_API_URL +
            `/api/v1/doctors/${editingDoctor}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify(payload),
          }
        )
          .then(async (res) => {
            setShowModal(false);
            setEditingDoctor(null);
            setTimeout(() => form.resetFields(), 300);
            if (res.ok) {
              setDoctors((prevData) =>
                prevData.map((item) =>
                  item.id_dokter === editingDoctor
                    ? { ...item, ...payload }
                    : item
                )
              );
              openNotificationWithIcon(
                "success",
                "Dokter",
                "Dokter berhasil diubah!"
              );
            } else {
              openNotificationWithIcon(
                "error",
                "Dokter",
                "Gagal mengubah dokter."
              );
            }
          })
          .catch(() => {
            setShowModal(false);
            setEditingDoctor(null);
            setTimeout(() => form.resetFields(), 300);
            openNotificationWithIcon(
              "error",
              "Dokter",
              "Gagal mengubah dokter."
            );
          });
      } else {
        // Tambah mode
        fetch(import.meta.env.VITE_REACT_APP_API_URL + "/api/v1/doctors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify(payload),
        })
          .then(async (res) => {
            setShowModal(false);
            setTimeout(() => form.resetFields(), 300);
            if (res.ok) {
              openNotificationWithIcon(
                "success",
                "Dokter",
                "Dokter berhasil ditambah!"
              );
              getDataDokter();
            } else {
              openNotificationWithIcon(
                "error",
                "Dokter",
                "Gagal menambah dokter."
              );
            }
          })
          .catch(() => {
            setShowModal(false);
            setTimeout(() => form.resetFields(), 300);
            openNotificationWithIcon(
              "error",
              "Dokter",
              "Gagal menambah dokter."
            );
          });
      }
    });
  }

  return (
    <>
      {contextHolder}
      <div style={{ padding: 32, background: "#f6fafd", minHeight: "100vh" }}>
        <Row gutter={24} style={{ marginBottom: 24 }} align="middle">
          <Col xs={24} md={12}>
            <h2 style={{ margin: 0, color: mainColor, fontWeight: 700 }}>
              Data Dokter
            </h2>
            <div style={{ color: "#555", fontSize: 16 }}>
              Daftar dokter puskesmas
            </div>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                borderColor: mainColor,
                color: mainColor,
                background: "#fff",
              }}
              onClick={handleAdd}
            >
              Tambah Dokter
            </Button>
          </Col>
        </Row>
        <Row style={{ marginBottom: 16 }}>
          <Col xs={24} md={8}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Cari dokter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              size="large"
              style={{ maxWidth: 350 }}
            />
          </Col>
        </Row>
        <div>
          <Table
            columns={columns}
            dataSource={filteredDoctors}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            bordered
            loading={loading}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: `2px solid ${mainColor}`,
            }}
          />
        </div>
        <Modal
          title={editingDoctor ? "Edit Dokter" : "Tambah Dokter"}
          open={showModal}
          onCancel={() => setShowModal(false)}
          onOk={handleModalOk}
          okText={editingDoctor ? "Update" : "Simpan"}
          cancelText="Batal"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Nomor STR"
              name="nomor_str"
              rules={[{ required: true, message: "Nomor STR wajib diisi" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nama Dokter"
              name="nama_dokter"
              rules={[{ required: true, message: "Nama dokter wajib diisi" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Spesialis"
              name="spesialis"
              rules={[{ required: true, message: "Spesialis wajib diisi" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default DataDokter;
