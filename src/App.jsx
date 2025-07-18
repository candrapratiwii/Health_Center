import { Routes, Route, Navigate } from "react-router-dom";

import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "./assets/styles/adaptive.css";

import LoginPage from "./pages/Login";
import PrivateRoute from "./components/layout/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/Register";
import Main from "./components/layout/Main";
import DashboardPatient from "./pages/Patient/Dashboard/DashboardPatient";
import BookingPatient from "./pages/Patient/Booking/BookingPatient";
import AppointmentsPatient from "./pages/Patient/Appointments/AppointmentsPatient";
import ProfilePatient from "./pages/Patient/Profile/ProfilePatient";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import ReservationAdmin from "./pages/Admin/ReservationAdmin";
import KelolaLayanan from "./pages/Admin/KelolaLayanan";
import DataDokter from "./pages/Admin/DataDokter";
import KelolaPuskesmas from "./pages/Admin/KelolaPuskesmas";
import KelolaStaf from "./pages/Admin/KelolaStaf";
import Laporan from "./pages/Admin/Laporan";
import StaffReservations from "./pages/Staff/StaffReservations";
import StaffLayout from "./components/layout/StaffLayout";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import RiwayatReservasiStaff from "./pages/Staff/RiwayatReservasiStaff";

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

      {/* Admin Nested Routes */}
      <Route path="/admin/*" element={<AdminDashboard />}>
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="reservasi" element={<ReservationAdmin />} />
        <Route path="layanan" element={<KelolaLayanan />} />
        <Route path="dokter" element={<DataDokter />} />
        <Route path="puskesmas" element={<KelolaPuskesmas />} />
        <Route path="staf" element={<KelolaStaf />} />
        <Route path="laporan" element={<Laporan />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="reservations" element={<StaffReservations />} />
        <Route path="history" element={<RiwayatReservasiStaff />} />
      </Route>

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
      <Route path="/patien" element={<Main />}>
        <Route index element={<DashboardPatient />} />
        <Route path="dashboard" element={<DashboardPatient />} />
        <Route path="booking" element={<BookingPatient />} />
        <Route path="appointments" element={<AppointmentsPatient />} />
        <Route path="profile" element={<ProfilePatient />} />
      </Route>
    </Routes>
  );
}

export default App;
