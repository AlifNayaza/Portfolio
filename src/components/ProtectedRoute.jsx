import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = "/.netlify/functions/portfolio";

export default function ProtectedRoute() {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      // Cek apakah ada token di storage
      const token = localStorage.getItem("admin_session") || sessionStorage.getItem("admin_session");
      
      if (!token) {
        console.log('No token found in storage');
        setIsValidating(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        // Validasi token dengan backend
        console.log('Validating session with backend...');
        const response = await axios.post(
          `${API_URL}?action=verify`,
          {},
          { 
            headers: { Authorization: token },
            timeout: 15000
          }
        );

        console.log('Validation response:', response.data);

        if (response.status === 200 && response.data?.authenticated === true) {
          console.log('✅ Session valid');
          setIsAuthenticated(true);
        } else {
          console.log('❌ Session invalid');
          // Token tidak valid, hapus dari storage
          localStorage.removeItem("admin_session");
          sessionStorage.removeItem("admin_session");
          setIsAuthenticated(false);
          toast.error("Session invalid. Please login again.");
        }
      } catch (error) {
        console.error("Session validation error:", error);
        // Jika error 401, berarti token salah
        if (error.response?.status === 401) {
          localStorage.removeItem("admin_session");
          sessionStorage.removeItem("admin_session");
          toast.error("Invalid session. Please login again.");
        } else if (error.response?.status === 500) {
          toast.error("Server configuration error. Check ADMIN_SECRET in .env");
        } else if (!error.response) {
          toast.error("Network error. Cannot validate session.");
        }
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, []);

  // Tampilkan loading saat validasi
  if (isValidating) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-xs text-zinc-500 tracking-widest mb-4">VALIDATING SESSION...</div>
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-[#9f1239]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Jika tidak authenticated, redirect ke login
  return isAuthenticated ? <Outlet /> : <Navigate to="/keyhole" replace />;
}