/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { Layout } from "antd";
import { HeartFilled } from "@ant-design/icons";

const { Footer: AntFooter } = Layout;

const Footer = () => (
  <AntFooter style={{ textAlign: "center", background: "#f5f6fa" }}>
    <p className="copyright">
      Copyright © 2025 HealthCenter - Powered by Semangat Hidup Team
    </p>
  </AntFooter>
);

export default Footer;
