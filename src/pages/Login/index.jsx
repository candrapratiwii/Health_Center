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
import SignBG from "../../assets/images/2.jpg";
import "./login.css";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { sendData } from "../../utils/api";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    let formdata = new FormData();
    formdata.append("username", values.username);
    formdata.append("password", values.password);

    sendData("/api/v1/users/login", formdata)
      .then((resp) => {
        setLoading(false);
        if (resp?.access_token) {
          login(resp.access_token);
        } else {
          failedLogin();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        failedLogin();
      });
  };

  const failedLogin = () => {
    api.error({
      message: "Failed to Login",
      description: "Invalid username or password",
    });
  };

  return (
    <Layout
      className="layout-default layout-signin"
      style={{ minHeight: "100vh" }}
    >
      {contextHolder}
      <Header>
        <div className="header-col header-brand">
          <h5>pemwebsi.com</h5>
        </div>
        <div className="header-col header-nav">test</div>
        <div className="header-col header-btn">
          <Button type="primary">Public Sites</Button>
        </div>
      </Header>
      <Content
        className="signin login-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <Row
          gutter={[24, 0]}
          justify="center"
          align="middle"
          style={{ width: "100%", maxWidth: 900 }}
        >
          <Col
            className="sign-img"
            xs={{ span: 24 }}
            md={{ span: 12 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={SignBG}
              alt="Login Illustration"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                objectFit: "cover",
                maxHeight: 400,
              }}
            />
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} style={{ padding: 24 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                padding: 32,
              }}
            >
              <Title className="mb-15">Sign In</Title>
              <Title className="font-regular text-muted" level={5}>
                Enter your email and password to sign in
              </Title>
              <Form
                form={form}
                onFinish={handleLogin}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Isi username!",
                    },
                  ]}
                >
                  <Input placeholder="Username" />
                </Form.Item>

                <Form.Item
                  className="password"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Isi password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    loading={loading}
                  >
                    SIGN IN
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer>
        <p className="copyright">
          {" "}
          Copyright © 2024 WebfmSI.com - Powered by Universitas Pendidikan
          Ganesha
        </p>
      </Footer>
    </Layout>
  );
};

export default LoginPage;
