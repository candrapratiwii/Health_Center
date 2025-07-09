import React, { useState } from "react";
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
  Select,
} from "antd";
import {
  PlusOutlined,
  HomeOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getDataPrivate, sendData, deleteData } from "../../utils/api";

const mainColor = "#14b8a6";

// Ambil data dokter untuk mapping id_dokter ke nama dokter
const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  React.useEffect(() => {
    getDataPrivate("/api/v1/doctors").then((resp) => {
      let arr = Array.isArray(resp) ? resp : resp.data || [];
      setDoctors(arr);
    });
  }, []);
  return doctors;
};

const statusTag = {
  Aktif: <Tag color="green">Aktif</Tag>,
  Nonaktif: <Tag color="red">Nonaktif</Tag>,
};

const KelolaPuskesmas = () => {
  const [puskesmas, setPuskesmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPuskesmas, setEditingPuskesmas] = useState(null);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title, description) => {
    api[type]({ message: title, description: description });
  };
  const doctors = useDoctors();

  React.useEffect(() => {
    getDataPuskesmas();
  }, []);

  const getDataPuskesmas = () => {
    setLoading(true);
    getDataPrivate("/api/v1/health_centers/")
      .then((resp) => {
        setLoading(false);
        let arr = Array.isArray(resp) ? resp : resp.data || [];
        arr = arr.map((item) => ({
          ...item,
          id: item.id_puskesmas,
          key: item.id_puskesmas,
        }));
        setPuskesmas(arr);
      })
      .catch(() => setLoading(false));
  };

  const filteredPuskesmas = puskesmas.filter(
    (p) =>
      p.nama_puskesmas.toLowerCase().includes(search.toLowerCase()) ||
      p.alamat.toLowerCase().includes(search.toLowerCase()) ||
      (p.nomor_kontak || "").toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, idx) => idx + 1,
    },
    {
      title: "Kode Faskes",
      dataIndex: "kode_faskes",
      key: "kode_faskes",
    },
    {
      title: "Nama Puskesmas",
      dataIndex: "nama_puskesmas",
      key: "nama_puskesmas",
      render: (text) => text,
    },
    {
      title: "Alamat",
      dataIndex: "alamat",
      key: "alamat",
    },
    {
      title: "Nomor Kontak",
      dataIndex: "nomor_kontak",
      key: "nomor_kontak",
    },
    {
      title: "Nama Dokter",
      key: "nama_dokter",
      render: (_, record) => {
        const dokter = doctors.find(
          (d) => String(d.id_dokter) === String(record.id_dokter)
        );
        return dokter ? dokter.nama_dokter : "-";
      },
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
            title="Yakin hapus puskesmas ini?"
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
    setEditingPuskesmas(null);
    form.resetFields();
    setShowModal(true);
  }

  function handleEdit(puskesmas) {
    setEditingPuskesmas(puskesmas);
    form.setFieldsValue({
      kode_faskes: puskesmas.kode_faskes,
      nama_puskesmas: puskesmas.nama_puskesmas,
      alamat: puskesmas.alamat,
      jam_operasional:
        typeof puskesmas.jam_operasional === "string"
          ? puskesmas.jam_operasional
          : JSON.stringify(puskesmas.jam_operasional),
      nomor_kontak: puskesmas.nomor_kontak,
      id_dokter: puskesmas.id_dokter,
    });
    setShowModal(true);
  }

  function handleDelete(record) {
    let url = `/api/v1/health_centers/${record.id_puskesmas}`;
    deleteData(url)
      .then((resp) => {
        if (resp?.status === 200 || resp?.status === 204) {
          setPuskesmas((prevData) =>
            prevData.filter((item) => item.id_puskesmas !== record.id_puskesmas)
          );
          openNotificationWithIcon(
            "success",
            "Puskesmas",
            "Puskesmas berhasil dihapus!"
          );
        } else {
          openNotificationWithIcon(
            "error",
            "Puskesmas",
            "Gagal menghapus puskesmas."
          );
        }
      })
      .catch(() => {
        openNotificationWithIcon(
          "error",
          "Puskesmas",
          "Gagal menghapus puskesmas."
        );
      });
  }

  function handleModalOk() {
    form.validateFields().then((values) => {
      let jam_operasional = values.jam_operasional;
      try {
        jam_operasional = JSON.parse(jam_operasional);
      } catch {
        message.error("Jam operasional harus format JSON valid!");
        return;
      }
      const payload = {
        kode_faskes: values.kode_faskes,
        nama_puskesmas: values.nama_puskesmas,
        alamat: values.alamat,
        jam_operasional,
        nomor_kontak: values.nomor_kontak,
        id_dokter: Number(values.id_dokter),
      };
      if (editingPuskesmas) {
        // Edit mode
        fetch(
          import.meta.env.VITE_REACT_APP_API_URL +
            `/api/v1/health_centers/${editingPuskesmas.id_puskesmas}`,
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
            setTimeout(() => form.resetFields(), 300);
            if (res.ok) {
              setPuskesmas((prevData) =>
                prevData.map((item) =>
                  item.id_puskesmas === editingPuskesmas.id_puskesmas
                    ? { ...item, ...payload }
                    : item
                )
              );
              openNotificationWithIcon(
                "success",
                "Puskesmas",
                "Puskesmas berhasil diubah!"
              );
            } else {
              openNotificationWithIcon(
                "error",
                "Puskesmas",
                "Gagal mengubah puskesmas."
              );
            }
          })
          .catch(() => {
            setShowModal(false);
            setTimeout(() => form.resetFields(), 300);
            openNotificationWithIcon(
              "error",
              "Puskesmas",
              "Gagal mengubah puskesmas."
            );
          });
      } else {
        // Tambah mode
        fetch(
          import.meta.env.VITE_REACT_APP_API_URL + "/api/v1/health_centers/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify(payload),
          }
        )
          .then(async (res) => {
            setShowModal(false);
            setTimeout(() => form.resetFields(), 300);
            if (res.ok) {
              openNotificationWithIcon(
                "success",
                "Puskesmas",
                "Puskesmas berhasil ditambah!"
              );
              getDataPuskesmas();
            } else {
              openNotificationWithIcon(
                "error",
                "Puskesmas",
                "Gagal menambah puskesmas."
              );
            }
          })
          .catch(() => {
            setShowModal(false);
            setTimeout(() => form.resetFields(), 300);
            openNotificationWithIcon(
              "error",
              "Puskesmas",
              "Gagal menambah puskesmas."
            );
          });
      }
      setEditingPuskesmas(null); // reset setelah submit
    });
  }

  return (
    <div style={{ padding: 32, background: "#f6fafd", minHeight: "100vh" }}>
      {contextHolder}
      <Row gutter={24} style={{ marginBottom: 24 }} align="middle">
        <Col xs={24} md={12}>
          <h2 style={{ margin: 0, color: mainColor, fontWeight: 700 }}>
            Data Puskesmas
          </h2>
          <div style={{ color: "#555", fontSize: 16 }}>
            Daftar puskesmas terdaftar
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
            Tambah Puskesmas
          </Button>
        </Col>
      </Row>
      <Row style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Cari puskesmas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredPuskesmas}
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
      <Modal
        title={editingPuskesmas ? "Edit Puskesmas" : "Tambah Puskesmas"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleModalOk}
        okText={editingPuskesmas ? "Update" : "Simpan"}
        cancelText="Batal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Kode Faskes"
            name="kode_faskes"
            rules={[{ required: true, message: "Kode faskes wajib diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nama Puskesmas"
            name="nama_puskesmas"
            rules={[{ required: true, message: "Nama puskesmas wajib diisi" }]}
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
            label="Jam Operasional (format JSON)"
            name="jam_operasional"
            rules={[
              {
                required: true,
                message: "Jam operasional wajib diisi (format JSON)",
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject("Format harus JSON valid!");
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder='{"Senin": {"buka": "08:00", "tutup": "14:00"}, ...}'
            />
          </Form.Item>
          <Form.Item
            label="Nomor Kontak"
            name="nomor_kontak"
            rules={[{ required: true, message: "Nomor kontak wajib diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nama Dokter"
            name="id_dokter"
            rules={[{ required: true, message: "Nama dokter wajib dipilih" }]}
          >
            <Select
              showSearch
              placeholder="Pilih dokter"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {doctors.map((d) => (
                <Select.Option key={d.id_dokter} value={d.id_dokter}>
                  {d.nama_dokter}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KelolaPuskesmas;
