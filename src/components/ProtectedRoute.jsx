import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("admin_session");

  // --- PERUBAHAN DI SINI ---
  // Jika tidak ada sesi, arahkan pengguna ke halaman login baru, yaitu /keyhole.
  return isAuthenticated ? <Outlet /> : <Navigate to="/keyhole" replace />;
}