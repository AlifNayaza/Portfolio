import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";

// Imports Components
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ProjectDetail from "./pages/ProjectDetail";

import MusicPlayer from "./components/ui/MusicPlayer";
import Cursor from "./components/ui/Cursor";

const Admin = lazy(() => import("./pages/Admin"));
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout() {
  const { data, loading } = usePortfolio();

  // --- LOGIKA PERBAIKAN DI SINI ---
  // Membuat variabel playlist yang fleksibel untuk backward compatibility.
  // Ini akan memastikan MusicPlayer selalu menerima sebuah array.
  let playlist = [];
  if (data) {
    // 1. Prioritaskan struktur data BARU (soundtrack array)
    if (data.soundtrack && Array.isArray(data.soundtrack) && data.soundtrack.length > 0) {
      playlist = data.soundtrack;
    } 
    // 2. Jika tidak ada, cek struktur data LAMA (music object)
    else if (data.music && typeof data.music === 'object' && data.music.url) {
      // Ubah data lama menjadi format array agar kompatibel
      playlist = [data.music];
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
      <div className="font-display text-xl tracking-[0.5em] animate-pulse text-white">LOADING MANUSCRIPT...</div>
    </div>
  );

  return (
    <div className="bg-[#0c0c0c] min-h-screen text-[#e5e5e5] font-serif selection:bg-[#9f1239] selection:text-white flex flex-col relative overflow-hidden">
      <div className="noise-overlay fixed top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-[0.03]"></div>
      <Navbar home={data?.home} />
      
      {/* Mengirim 'playlist' yang sudah dijamin berupa array */}
      <MusicPlayer playlist={playlist} />
      
      <main className="flex-grow pt-28 md:pt-36 px-6 md:px-12 max-w-7xl mx-auto w-full border-r border-l border-[#222] min-h-screen relative shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 bg-[#0c0c0c]">
         <div className="absolute top-0 left-6 bottom-0 w-[1px] bg-[#222] hidden md:block"></div>
         <Outlet />
      </main>
      <footer className="py-12 text-center text-zinc-700 text-[10px] font-mono border-t border-[#222] mt-20 relative z-10 bg-[#0c0c0c]">
        <p>CHRONICLES OF {data?.home?.logoName?.toUpperCase() || "DEV"}. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

function ProtectedRoute() {
  const isAuth = localStorage.getItem("admin_session");
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333', fontFamily: 'monospace', fontSize: '12px' } }} />
        <Cursor />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
             <Route path={ADMIN_PATH} element={ <Suspense fallback={<div className="h-screen bg-[#0c0c0c] text-white flex items-center justify-center font-mono">LOADING MODULE...</div>}> <Admin /> </Suspense> } />
          </Route>
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="contact" element={<Contact />} />
            <Route path="project/:id" element={<ProjectDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  );
}