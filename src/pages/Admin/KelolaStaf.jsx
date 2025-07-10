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
  Select,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { getDataPrivate, deleteData, sendDataPrivate } from "../../utils/api";

const mainColor = "#14b8a6";

const statusTag = {
  Aktif: <Tag color="green">Aktif</Tag>,
  Cuti: <Tag color="orange">Cuti</Tag>,
  Nonaktif: <Tag color="red">Nonaktif</Tag>,
};

const pageSize = 12;

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
  const [puskesmasList, setPuskesmasList] = useState([]);
  const [assignModal, setAssignModal] = useState({
    open: false,
    staff: null,
    assigned: [],
  });
  const [assignPuskesmas, setAssignPuskesmas] = useState([]); // State untuk puskesmas yang dipilih di modal tambah/edit

  // Helper untuk refresh assignment semua staff
  async function refreshAllStaffAssignments(staffList) {
    const updated = await Promise.all(
      staffList.map(async (s) => {
        const assigned = await getDataPrivate(
          `/api/v1/health_center_staff/${s.id_user}`
        );
        return {
          ...s,
          puskesmasAssigned: Array.isArray(assigned)
            ? assigned
            : assigned.data || [],
        };
      })
    );
    setStaff(updated);
  }

  useEffect(() => {
    getDataPrivate("/api/v1/users/").then((data) => {
      let arr = Array.isArray(data) ? data : data.data || [];
      const staff = arr.filter(
        (u) => (u.tipe_user || "").toLowerCase() === "staff"
      );
      refreshAllStaffAssignments(staff);
    });
    getDataPrivate("/api/v1/health_centers").then((data) => {
      let arr = Array.isArray(data) ? data : data.data || [];
      setPuskesmasList(arr);
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
    setAssignPuskesmas([]); // Reset assign puskesmas
    setShowModal(true);
  }
  function handleEdit(staff) {
    setEditingStaff(staff);
    form.setFieldsValue(staff);
    setAssignPuskesmas(staff.puskesmasAssigned || []); // Set assign puskesmas dari data staff
    setShowModal(true);
  }
  function handleDelete(id_user) {
    deleteData(`/api/v1/users/${id_user}`)
      .then((resp) => {
        // Setelah delete, refresh data staff
        getDataPrivate("/api/v1/users/").then((data) => {
          let arr = Array.isArray(data) ? data : data.data || [];
          const staff = arr.filter(
            (u) => (u.tipe_user || "").toLowerCase() === "staff"
          );
          setStaff(staff);
          message.success("Staf berhasil dihapus");
        });
      })
      .catch(() => {
        message.error("Gagal menghapus staf");
      });
  }
  async function handleModalOk() {
    const values = await form.validateFields();
    const payload = {
      username: values.username,
      password: values.password,
      tipe_user: "staff",
    };
    if (editingStaff) {
      // Edit mode
      fetch(
        import.meta.env.VITE_REACT_APP_API_URL +
          `/api/v1/users/${editingStaff.id_user}`,
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
              editingStaff
                ? "Staff berhasil diubah!"
                : "Staff berhasil ditambah!"
            );
            // Refresh data staff setelah create/update
            getDataPrivate("/api/v1/users/").then((data) => {
              let arr = Array.isArray(data) ? data : data.data || [];
              const staff = arr.filter(
                (u) => (u.tipe_user || "").toLowerCase() === "staff"
              );
              setStaff(staff);
              setShowModal(false);
            });
            // Update assignment puskesmas jika diubah
            Promise.all(
              assignPuskesmas.map((id_puskesmas) =>
                sendDataPrivate("/api/v1/health_center_staff/", {
                  id_user: editingStaff.id_user,
                  id_puskesmas,
                })
              )
            );
          } else {
            openNotificationWithIcon("error", "Staff", "Gagal mengubah staff.");
          }
        })
        .catch(() => {
          setShowModal(false);
          setTimeout(() => form.resetFields(), 300);
          openNotificationWithIcon("error", "Staff", "Gagal mengubah staff.");
        });
    } else {
      // Tambah mode
      try {
        const res = await fetch(
          import.meta.env.VITE_REACT_APP_API_URL + "/api/v1/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify({
              username: values.username,
              password: values.password,
              tipe_user: "staff",
            }),
          }
        );
        setShowModal(false);
        setTimeout(() => form.resetFields(), 300);
        if (res.ok) {
          const respData = await res.json();
          const newStaffId = respData?.id_user || respData?.data?.id_user;
          openNotificationWithIcon(
            "success",
            "Staff",
            "Staff berhasil ditambah!"
          );
          // Refresh data staff
          getDataPrivate("/api/v1/users/").then((data) => {
            let arr = Array.isArray(data) ? data : data.data || [];
            const staff = arr.filter(
              (u) => (u.tipe_user || "").toLowerCase() === "staff"
            );
            setStaff(staff);
          });
          // Assign puskesmas ke staff baru
          if (newStaffId && assignPuskesmas.length > 0) {
            try {
              await Promise.all(
                assignPuskesmas.map((id_puskesmas) =>
                  sendDataPrivate("/api/v1/health_center_staff/", {
                    id_user: newStaffId,
                    id_puskesmas,
                  })
                )
              );
              // Delay 500ms untuk memastikan backend commit
              await new Promise((resolve) => setTimeout(resolve, 500));
            } catch (err) {
              openNotificationWithIcon(
                "error",
                "Staff",
                "Gagal assign puskesmas ke staff baru!"
              );
            }
          }
          // Refresh assignment staff agar assignment langsung muncul
          const staffResp = await getDataPrivate("/api/v1/users/");
          let arr = Array.isArray(staffResp) ? staffResp : staffResp.data || [];
          const staffList = arr.filter(
            (u) => (u.tipe_user || "").toLowerCase() === "staff"
          );
          await refreshAllStaffAssignments(staffList);
          window.location.reload();
        } else {
          openNotificationWithIcon("error", "Staff", "Gagal menambah staff.");
        }
      } catch {
        setShowModal(false);
        setTimeout(() => form.resetFields(), 300);
        openNotificationWithIcon("error", "Staff", "Gagal menambah staff.");
      }
    }
  }

  // Assign puskesmas modal handlers
  function openAssignModal(staff) {
    getDataPrivate(`/api/v1/health_center_staff/${staff.id_user}`).then(
      (assigned) => {
        setAssignModal({
          open: true,
          staff,
          assigned: Array.isArray(assigned) ? assigned : assigned.data || [],
        });
      }
    );
  }
  function handleAssignPuskesmas(selectedPuskesmas) {
    sendDataPrivate("/api/v1/health_center_staff/", {
      id_user: assignModal.staff.id_user,
      id_puskesmas: selectedPuskesmas,
    })
      .then(() => {
        openNotificationWithIcon(
          "success",
          "Puskesmas",
          "Assignment berhasil disimpan!"
        );
        setAssignModal({ open: false, staff: null, assigned: [] });
        // Refresh assignment semua staff
        getDataPrivate("/api/v1/users/").then((data) => {
          let arr = Array.isArray(data) ? data : data.data || [];
          const staff = arr.filter(
            (u) => (u.tipe_user || "").toLowerCase() === "staff"
          );
          refreshAllStaffAssignments(staff);
        });
      })
      .catch(() => {
        openNotificationWithIcon(
          "error",
          "Puskesmas",
          "Gagal menyimpan assignment!"
        );
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
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
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
              key={s.id_user}
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
                  <div style={{ fontWeight: 600, fontSize: 20 }}>
                    {s.username}
                  </div>
                </div>
              </div>
              {/* Status jika ada */}
              {s.status && (
                <div style={{ marginBottom: 12 }}>
                  <Tag>{s.status}</Tag>
                </div>
              )}
              {/* Assignment Puskesmas */}
              <div style={{ margin: "8px 0" }}>
                <EnvironmentOutlined
                  style={{ color: mainColor, marginRight: 4 }}
                />
                <span style={{ fontSize: 14, color: "#555" }}>
                  {s.puskesmasAssigned && s.puskesmasAssigned.length > 0
                    ? s.puskesmasAssigned
                        .map((id) => {
                          const p = puskesmasList.find(
                            (p) => p.id_puskesmas === id
                          );
                          return p ? p.nama_puskesmas : id;
                        })
                        .join(", ")
                    : "Belum di-assign"}
                </span>
              </div>
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
                <Button
                  icon={<EnvironmentOutlined />}
                  size="small"
                  style={{
                    borderColor: mainColor,
                    color: mainColor,
                    background: "#fff",
                  }}
                  onClick={() => openAssignModal(s)}
                >
                  Atur Puskesmas
                </Button>
                <Popconfirm
                  title="Yakin hapus staf ini?"
                  onConfirm={() => handleDelete(s.id_user)}
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
          {/* Pilih Puskesmas */}
          <Form.Item label="Puskesmas Tempat Bertugas">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Pilih puskesmas"
              value={assignPuskesmas}
              onChange={setAssignPuskesmas}
            >
              {puskesmasList.map((p) => (
                <Select.Option key={p.id_puskesmas} value={p.id_puskesmas}>
                  {p.nama_puskesmas}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal Assign Puskesmas */}
      <Modal
        title={`Atur Puskesmas untuk ${assignModal.staff?.username || ""}`}
        open={assignModal.open}
        onCancel={() =>
          setAssignModal({ open: false, staff: null, assigned: [] })
        }
        onOk={() => handleAssignPuskesmas(assignModal.assigned)}
        okText="Simpan"
        cancelText="Batal"
      >
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Pilih puskesmas"
          value={assignModal.assigned}
          onChange={(arr) =>
            setAssignModal((modal) => ({ ...modal, assigned: arr }))
          }
        >
          {puskesmasList.map((p) => (
            <Select.Option key={p.id_puskesmas} value={p.id_puskesmas}>
              {p.nama_puskesmas}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default KelolaStaf;
