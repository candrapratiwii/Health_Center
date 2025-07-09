import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Table,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Row,
  Col,
  notification,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getDataPrivate, sendData, deleteData } from "../../utils/api";
import { Modal as AntdModal } from "antd";

const mainColor = "#14b8a6";

const KelolaLayanan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  // Hapus Form/Modal yang tidak dipakai (showReservasiModal, formReservasi, handleSubmitReservasi)

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, title, description) => {
    api[type]({
      message: title,
      description: description,
    });
  };

  useEffect(() => {
    getDataLayanan();
  }, []);

  const getDataLayanan = () => {
    setLoading(true);
    getDataPrivate("/api/v1/services")
      .then((resp) => {
        setLoading(false);
        let arr = Array.isArray(resp) ? resp : resp.data || [];
        // Mapping id_layanan ke id dan key agar konsisten di frontend
        arr = arr.map((item) => ({
          ...item,
          id: item.id_layanan,
          key: item.id_layanan,
        }));
        setData(arr);
      })
      .catch((err) => {
        setLoading(false);
        setError(err?.message || "Gagal mengambil data layanan");
      });
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record.id);
    form.setFieldsValue({
      nama_layanan: record.nama_layanan,
      deskripsi: record.deskripsi,
      tarif: record.tarif,
    });
    setModalOpen(true);
  };

  const handleDelete = (record) => {
    let url = `/api/v1/services/${record.id}`;
    let params = new URLSearchParams();
    params.append("id", record.id);
    deleteData(url, params)
      .then((resp) => {
        if (resp?.status === 200) {
          setData((prevData) =>
            prevData.filter((item) => item.id !== record.id)
          );
          openNotificationWithIcon(
            "success",
            "Layanan",
            "Layanan berhasil dihapus!"
          );
        } else {
          openNotificationWithIcon(
            "error",
            "Layanan",
            "Gagal menghapus layanan."
          );
        }
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Layanan",
          "Gagal menghapus layanan."
        );
      });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editing) {
        setData((prev) =>
          prev.map((item) =>
            item.key === editing ? { ...item, ...values } : item
          )
        );
        message.success("Layanan berhasil diubah");
      } else {
        setData((prev) => [
          ...prev,
          { ...values, key: prev.length ? prev[prev.length - 1].key + 1 : 1 },
        ]);
        message.success("Layanan berhasil ditambah");
      }
      setModalOpen(false);
    });
  };

  // Fungsi submit reservasi
  // Fungsi submit layanan pakai sendData
  const handleSubmitLayanan = () => {
    form.validateFields().then((values) => {
      if (editing) {
        // Edit mode: PUT request
        fetch(
          import.meta.env.VITE_REACT_APP_API_URL +
            `/api/v1/services/${editing}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify(values),
          }
        )
          .then(async (res) => {
            setModalOpen(false);
            setEditing(null);
            setTimeout(() => form.resetFields(), 300);
            if (res.ok) {
              setData((prevData) =>
                prevData.map((item) =>
                  item.id === editing ? { ...item, ...values } : item
                )
              );
              openNotificationWithIcon(
                "success",
                "Layanan",
                "Layanan berhasil diubah!"
              );
            } else {
              let errMsg = "Gagal mengubah layanan.";
              try {
                const err = await res.json();
                if (err && err.message) errMsg = err.message;
              } catch (e) {}
              openNotificationWithIcon("error", "Layanan", errMsg);
            }
          })
          .catch(() => {
            setModalOpen(false);
            setEditing(null);
            setTimeout(() => form.resetFields(), 300);
            openNotificationWithIcon(
              "error",
              "Layanan",
              "Gagal mengubah layanan."
            );
          });
      } else {
        // Tambah mode: POST request
        fetch(import.meta.env.VITE_REACT_APP_API_URL + "/api/v1/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify(values),
        })
          .then(async (res) => {
            setModalOpen(false);
            setTimeout(() => form.resetFields(), 300);
            if (res.ok) {
              let data = {};
              try {
                data = await res.json();
              } catch (e) {}
              openNotificationWithIcon(
                "success",
                "Layanan",
                "Layanan berhasil ditambah!"
              );
            } else {
              let errMsg = "Gagal menambah layanan.";
              try {
                const err = await res.json();
                if (err && err.message) errMsg = err.message;
              } catch (e) {}
              openNotificationWithIcon("error", "Layanan", errMsg);
            }
          })
          .catch(() => {
            setModalOpen(false);
            setTimeout(() => form.resetFields(), 300);
            openNotificationWithIcon(
              "error",
              "Layanan",
              "Gagal menambah layanan."
            );
          });
      }
    });
  };

  // Filter data sesuai pencarian
  const filteredData = data.filter(
    (item) =>
      (item.nama_layanan || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.deskripsi || "").toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Nama Layanan",
      dataIndex: "nama_layanan",
      key: "nama_layanan",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.nama_layanan.localeCompare(b.nama_layanan),
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      key: "deskripsi",
      sorter: (a, b) => a.deskripsi.localeCompare(b.deskripsi),
    },
    {
      title: "Tarif",
      dataIndex: "tarif",
      key: "tarif",
      render: (tarif) => (
        <span style={{ fontWeight: 600, color: mainColor }}>
          Rp{" "}
          {parseFloat(tarif).toLocaleString("id-ID", {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
      sorter: (a, b) => parseFloat(a.tarif) - parseFloat(b.tarif),
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
          >
            Edit
          </Button>
          <Popconfirm
            title="Yakin hapus layanan ini?"
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
            >
              Hapus
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ padding: 32, background: "#f6fafd", minHeight: "100vh" }}>
        <Row gutter={24} style={{ marginBottom: 24 }} align="middle">
          <Col xs={24} md={12}>
            <h2 style={{ margin: 0, color: mainColor, fontWeight: 700 }}>
              Kelola Layanan
            </h2>
            <div style={{ color: "#555", fontSize: 16 }}>
              Manajemen data layanan puskesmas
            </div>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: mainColor, borderColor: mainColor }}
              onClick={handleAdd}
            >
              Tambah Layanan
            </Button>
          </Col>
        </Row>
        {/* Hapus search bar */}
        {/* <Row style={{ marginBottom: 16 }}>
          <Col xs={24} md={8}>
            <Input.Search
              placeholder="Cari layanan atau deskripsi..."
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 350 }}
            />
          </Col>
        </Row> */}
        <Card
          style={{
            border: `2px solid ${mainColor}`,
            borderRadius: 16,
            boxShadow: "0 2px 8px 0 rgba(20,184,166,0.04)",
          }}
          styles={{ body: { padding: 24 } }}
        >
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record.id}
            bordered
          />
          {error && (
            <div style={{ color: "red", marginTop: 16 }}>Error: {error}</div>
          )}
        </Card>
        <Modal
          title={editing ? "Edit Layanan" : "Tambah Layanan"}
          open={modalOpen}
          onOk={handleSubmitLayanan}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
            setTimeout(() => form.resetFields(), 300);
          }}
          okText={editing ? "Simpan" : "Tambah"}
          cancelText="Batal"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="nama_layanan"
              label="Nama Layanan"
              rules={[{ required: true, message: "Nama layanan wajib diisi" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="deskripsi"
              label="Deskripsi"
              rules={[{ required: true, message: "Deskripsi wajib diisi" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="tarif"
              label="Tarif"
              rules={[{ required: true, message: "Tarif wajib diisi" }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Form>
        </Modal>
        {/* Hapus tombol Tambah Reservasi dan modal reservasi */}
      </div>
    </>
  );
};

export default KelolaLayanan;
