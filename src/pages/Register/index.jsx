import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  notification,
} from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import "../Login/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendData } from "../../utils/api";

const { Title, Text } = Typography;
const { Footer, Content } = Layout;

const RegisterPage = () => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setLoading(true);
    const payload = {
      username: values.username,
      password: values.password,
      tipe_user: "patien",
    };
    sendData("/api/v1/users/register", payload)
      .then((resp) => {
        setLoading(false);
        api.success({
          message: "Registrasi Berhasil",
          description: "Akun berhasil dibuat. Silakan login.",
        });
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch((err) => {
        setLoading(false);
        api.error({
          message: "Registrasi Gagal",
          description: err?.message || "Terjadi kesalahan saat registrasi.",
        });
      });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Content
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f6fa",
        }}
      >
        <Row
          style={{
            width: "100%",
            maxWidth: 900,
            minHeight: 500,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            borderRadius: 20,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Kiri: Welcome */}
          <Col
            xs={24}
            md={12}
            style={{
              background: "linear-gradient(135deg, #36d1c4 0%, #5b86e5 100%)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              minHeight: 400,
            }}
          >
            <CheckCircleFilled
              style={{
                fontSize: 64,
                color: "#fff",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
                marginBottom: 24,
              }}
            />
            <Title level={2} style={{ color: "#fff", marginBottom: 0 }}>
              Daftar Akun Pasien
            </Title>
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Sistem Reservasi Online Puskesmas
              <br />
              Daftarkan akun Anda untuk mulai reservasi layanan kesehatan
            </Text>
          </Col>
          {/* Kanan: Form Register */}
          <Col
            xs={24}
            md={12}
            style={{
              padding: 32,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ maxWidth: 350, margin: "0 auto", width: "100%" }}>
              <Title level={2} style={{ marginBottom: 0, textAlign: "left" }}>
                Daftar
              </Title>
              <Text
                style={{ color: "#555", marginBottom: 24, display: "block" }}
              >
                Silakan buat akun pasien baru
              </Text>
              <Form
                form={form}
                onFinish={handleRegister}
                layout="vertical"
                style={{ marginTop: 16 }}
              >
                <Form.Item
                  label="Email atau NIK"
                  name="username"
                  rules={[
                    { required: true, message: "Masukkan email atau NIK Anda" },
                  ]}
                >
                  <Input
                    placeholder="Masukkan email atau NIK Anda"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  label="Kata Sandi"
                  name="password"
                  rules={[
                    { required: true, message: "Masukkan kata sandi Anda" },
                  ]}
                >
                  <Input.Password
                    placeholder="Masukkan kata sandi Anda"
                    size="large"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: "100%",
                      background:
                        "linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%)",
                      border: 0,
                    }}
                    loading={loading}
                    size="large"
                  >
                    Daftar
                  </Button>
                </Form.Item>
              </Form>
              <div style={{ textAlign: "center" }}>
                Sudah punya akun?{" "}
                <a href="/login" style={{ color: "#36d1c4" }}>
                  Masuk di sini
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: "center", background: "#f5f6fa" }}>
        <p className="copyright">
          Copyright © 2025 HealthCenter - Powered by Semangat Hidup Team
        </p>
      </Footer>
    </Layout>
  );
};

export default RegisterPage; 