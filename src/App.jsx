import { Routes, Route } from "react-router-dom";

import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "./assets/styles/adaptive.css";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/layout/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/Register";

// Temporary placeholder component for routes that don't have components yet
const PlaceholderComponent = () => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <h2>Page Under Development</h2>
    <p>This page is currently being developed.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/register" element={<RegisterPage />} />

      {/* Admin Routes */}
      <Route
        exact
        path="/admin/dashboard"
        element={<PrivateRoute component={<Dashboard />} />}
      />
      <Route
        exact
        path="/admin/reservasi"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/admin/layanan"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/admin/dokter"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/admin/pasien"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/admin/laporan"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/admin/pengaturan"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />

      {/* Staff Routes */}
      <Route
        exact
        path="/staff/dashboard"
        element={<PrivateRoute component={<Dashboard />} />}
      />
      <Route
        exact
        path="/staff/reservasi"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/staff/layanan"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/staff/dokter"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/staff/pasien"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/staff/laporan"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />

      {/* Legacy Routes - Redirect to dashboard */}
      <Route
        exact
        path="/dashboard"
        element={<PrivateRoute component={<Dashboard />} />}
      />
      <Route
        exact
        path="/books"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/films"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/orders"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/categories"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/products"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/report-orders"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/summary"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/product-sales-report"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/profile"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/membership"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
      <Route
        exact
        path="/gallery"
        element={<PrivateRoute component={<PlaceholderComponent />} />}
      />
    </Routes>
  );
}

export default App;
