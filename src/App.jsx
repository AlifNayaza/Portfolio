import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
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

// IMPORT MUSIC PLAYER & CURSOR
import MusicPlayer from "./components/ui/MusicPlayer";
import Cursor from "./components/ui/Cursor"; // Pastikan Cursor sudah dibuat di langkah sebelumnya

const Admin = lazy(() => import("./pages/Admin"));
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin";

// --- LAYOUT UTAMA ---
function Layout() {
  const { data, loading } = usePortfolio();

  if (loading) return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
      <div className="font-display text-xl tracking-[0.5em] animate-pulse text-white">LOADING MANUSCRIPT...</div>
    </div>
  );

  return (
    <div className="bg-[#0c0c0c] min-h-screen text-[#e5e5e5] font-serif selection:bg-[#9f1239] selection:text-white flex flex-col relative overflow-hidden">
      
      {/* Texture Noise Overlay */}
      <div className="noise-overlay fixed top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-[0.03]"></div>

      {/* Navbar (Fixed) */}
      <Navbar home={data?.home} />

      {/* Music Player */}
      <MusicPlayer musicData={data?.music} />
      
      {/* MAIN CONTENT */}
      {/* PERBAIKAN DISINI: */}
      {/* pt-28 (112px) untuk Mobile */}
      {/* md:pt-36 (144px) untuk Desktop */}
      {/* Ini memberi jarak yang cukup jauh dari Navbar (h-20 / 80px) agar tidak terpotong */}
      <main className="flex-grow pt-28 md:pt-36 px-6 md:px-12 max-w-7xl mx-auto w-full border-r border-l border-[#222] min-h-screen relative shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 bg-[#0c0c0c]">
         
         {/* Dekorasi Garis Vertikal */}
         <div className="absolute top-0 left-6 bottom-0 w-[1px] bg-[#222] hidden md:block"></div>
         
         <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-zinc-700 text-[10px] font-mono border-t border-[#222] mt-20 relative z-10 bg-[#0c0c0c]">
        <p>CHRONICLES OF {data?.home?.logoName?.toUpperCase() || "DEV"}. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

// --- GUARD ADMIN ---
function ProtectedRoute() {
  const isAuth = localStorage.getItem("admin_session");
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <Toaster 
            position="bottom-right" 
            toastOptions={{ 
                style: { background: '#111', color: '#fff', border: '1px solid #333', fontFamily: 'monospace', fontSize: '12px' } 
            }} 
        />
        
        {/* Cursor Effect */}
        <Cursor />

        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
             <Route path={ADMIN_PATH} element={
                  <Suspense fallback={<div className="h-screen bg-[#0c0c0c] text-white flex items-center justify-center font-mono">LOADING MODULE...</div>}>
                     <Admin />
                  </Suspense>
             } />
          </Route>
          
          <Route path="/admin" element={<Navigate to="/" replace />} />

          {/* Public Routes */}
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