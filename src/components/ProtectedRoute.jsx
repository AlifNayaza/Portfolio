import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Cek apakah ada 'session' password tersimpan di LocalStorage
  const isAuthenticated = localStorage.getItem("admin_session");

  // Jika tidak ada, tendang ke halaman Login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}