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
  Card,
  Avatar,
  notification,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getDataPrivate, deleteData } from "../../utils/api";

const mainColor = "#14b8a6";

const statusTag = {
  Aktif: <Tag color="green">Aktif</Tag>,
  Cuti: <Tag color="orange">Cuti</Tag>,
  Nonaktif: <Tag color="red">Nonaktif</Tag>,
};

const pageSize = 3;

const KelolaStaf = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title, description) => {
    api[type]({ message: title, description: description });
  };

  useEffect(() => {
    getDataPrivate("/api/v1/users/").then((data) => {
      let arr = Array.isArray(data) ? data : data.data || [];
      const staff = arr.filter((u) => u.role === "staff");
      setStaff(staff);
    });
  }, []);

  // Filtered staff hanya berdasarkan username
  const filteredStaff = staff.filter((s) =>
    s.username.toLowerCase().includes(search.toLowerCase())
  );
  const pagedStaff = filteredStaff.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Summary hanya total staff
  const totalStaff = staff.length;

  function handleAdd() {
    setEditingStaff(null);
    form.resetFields();
    setShowModal(true);
  }
  function handleEdit(staff) {
    setEditingStaff(staff);
    form.setFieldsValue(staff);
    setShowModal(true);
  }
  function handleDelete(id) {
    deleteData(`/api/v1/users/${id}`).then((resp) => {
      setStaff((prev) => prev.filter((s) => s.id !== id));
      message.success("Staf berhasil dihapus");
    });
  }
  function handleModalOk() {
    form.validateFields().then((values) => {
      const payload = {
        username: values.username,
        password: values.password,
        role: "staf",
      };
      if (editingStaff) {
        // Edit mode
        fetch(
          import.meta.env.VITE_REACT_APP_API_URL +
            `/api/v1/users/${editingStaff.id}`,
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
              openNotificationWithIcon(
                "success",
                "Staff",
                "Staff berhasil diubah!"
              );
              // Refresh data staf
              getDataPrivate("/api/v1/users/").then((data) => {
                let arr = Array.isArray(data) ? data : data.data || [];
                const staff = arr.filter((u) => u.role === "staff");
                setStaff(staff);
              });
            } else {
              openNotificationWithIcon(
                "error",
                "Staff",
                "Gagal mengubah staff."
              );
            }
          })
          .catch(() => {
            setShowModal(false);
            setTimeout(() => form.resetFields(), 300);
            openNotificationWithIcon("error", "Staff", "Gagal mengubah staff.");
          });
      } else {
        // Tambah mode
        fetch(import.meta.env.VITE_REACT_APP_API_URL + "/api/v1/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify({
            username: values.username,
            password: values.password,
            role: "staff"
          }),
        })
          .then(async (res) => {
            setShowModal(false);
            setTimeout(() => form.resetFields(), 300);
            if (res.ok) {
              openNotificationWithIcon(
                "success",
                "Staff",
                "Staff berhasil ditambah!"
              );
              // Refresh data staff
              getDataPrivate("/api/v1/users/").then((data) => {
                let arr = Array.isArray(data) ? data : data.data || [];
                const staff = arr.filter((u) => u.role === "staff");
                setStaff(staff);
              });
            } else {
              openNotificationWithIcon(
                "error",
                "Staff",
                "Gagal menambah staff."
              );
            }
          })
          .catch(() => {
            setShowModal(false);
            setTimeout(() => form.resetFields(), 300);
            openNotificationWithIcon("error", "Staff", "Gagal menambah staff.");
          });
      }
    });
  }

  return (
    <div style={{ padding: 32, background: "#f6fafd", minHeight: "100vh" }}>
      {contextHolder}
      {/* Header & Tambah Staff */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: mainColor, fontWeight: 700 }}>
            Data Staff
          </h2>
          <div style={{ color: "#555", fontSize: 16 }}>
            Daftar staff puskesmas
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            borderColor: mainColor,
            color: mainColor,
            background: "#fff",
            boxShadow: "0 2px 8px #0001",
          }}
          onClick={handleAdd}
        >
          Tambah Staff
        </Button>
      </div>
      {/* Summary Card hanya total staff */}
      <div
        style={{ display: "flex", gap: 24, marginBottom: 24, flexWrap: "wrap" }}
      >
        <Card
          style={{
            flex: 1,
            minWidth: 180,
            textAlign: "center",
            boxShadow: "0 2px 8px #0001",
          }}
        >
          <div style={{ fontSize: 32, color: mainColor, fontWeight: 700 }}>
            {totalStaff}
          </div>
          <div style={{ color: "#888" }}>Total Staff</div>
        </Card>
      </div>
      {/* Search Bar hanya username */}
      <div style={{ marginBottom: 24 }}>
        <Input
          prefix={<SearchOutlined style={{ color: mainColor }} />}
          placeholder="Cari staff..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            borderRadius: 24,
            padding: 8,
            fontSize: 16,
            maxWidth: 400,
            boxShadow: "0 2px 8px #0001",
          }}
        />
      </div>
      {/* Staff Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "flex-start",
          minHeight: 200,
        }}
      >
        {pagedStaff.length === 0 ? (
          <div style={{ color: "#888", fontSize: 18 }}>
            Tidak ada staff ditemukan.
          </div>
        ) : (
          pagedStaff.map((s) => (
            <Card
              key={s.id}
              style={{
                width: 320,
                borderRadius: 18,
                boxShadow: "0 2px 12px #0001",
                border: `1.5px solid ${mainColor}10`,
                padding: 0,
              }}
              bodyStyle={{ padding: 20, paddingBottom: 12 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Avatar
                  style={{
                    background: mainColor,
                    marginRight: 16,
                    fontWeight: 700,
                    fontSize: 22,
                  }}
                  size={56}
                >
                  {s.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 20 }}>{s.username}</div>
                </div>
              </div>
              {/* Status jika ada */}
              {s.status && (
                <div style={{ marginBottom: 12 }}>
                  <Tag>{s.status}</Tag>
                </div>
              )}
              <div
                style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
              >
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  style={{
                    borderColor: mainColor,
                    color: mainColor,
                    background: "#fff",
                  }}
                  onClick={() => handleEdit(s)}
                />
                <Popconfirm
                  title="Yakin hapus staf ini?"
                  onConfirm={() => handleDelete(s.id)}
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
              </div>
            </Card>
          ))
        )}
      </div>
      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{
            marginRight: 8,
            borderRadius: 8,
            borderColor: mainColor,
            color: mainColor,
            background: "#fff",
          }}
        >
          &lt;
        </Button>
        <span
          style={{
            fontWeight: 600,
            color: mainColor,
            fontSize: 18,
            margin: "0 12px",
          }}
        >
          {page}
        </span>
        <Button
          disabled={page * pageSize >= filteredStaff.length}
          onClick={() => setPage(page + 1)}
          style={{
            marginLeft: 8,
            borderRadius: 8,
            borderColor: mainColor,
            color: mainColor,
            background: "#fff",
          }}
        >
          &gt;
        </Button>
      </div>
      {/* Modal Tambah/Edit */}
      <Modal
        title={editingStaff ? "Edit Staff" : "Tambah Staff"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleModalOk}
        okText={editingStaff ? "Update" : "Simpan"}
        cancelText="Batal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username wajib diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password wajib diisi" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KelolaStaf;
