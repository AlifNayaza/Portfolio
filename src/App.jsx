import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));

// Components
import Navbar from "./components/layout/Navbar";
import MusicPlayer from "./components/ui/MusicPlayer";
import Cursor from "./components/ui/Cursor";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: 'instant' }); 
  }, [pathname]);
  return null;
}

const LoadingFallback = () => (
  <div 
    className="min-h-screen flex items-center justify-center"
    style={{ backgroundColor: 'var(--color-bg)' }}
  >
    <div 
      className="font-display text-xl tracking-[0.5em] animate-pulse"
      style={{ color: 'var(--color-crimson)' }}
    >
      LOADING...
    </div>
  </div>
);

function Layout() {
  const { data, loading } = usePortfolio();

  let playlist = [];
  if (data) {
    if (data.soundtrack && Array.isArray(data.soundtrack) && data.soundtrack.length > 0) {
      playlist = data.soundtrack;
    } 
    else if (data.music && typeof data.music === 'object' && data.music.url) {
      playlist = [data.music];
    }
  }

  if (loading) return <LoadingFallback />;

  return (
    <div 
      className="min-h-screen font-serif flex flex-col relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-paper)'
      }}
    >
      <div className="noise-overlay"></div>
      
      <style>{`
        ::selection {
          background-color: var(--color-crimson);
          color: white;
        }
      `}</style>
      
      <Navbar home={data?.home} />
      <MusicPlayer playlist={playlist} />
      
      <main 
        className="flex-grow pt-28 md:pt-36 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-screen relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.8)]" 
        style={{ 
          borderLeft: '1px solid var(--color-border)',
          borderRight: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg)'
        }}
      >
        <div 
          className="absolute top-0 left-6 bottom-0 w-[1px] hidden md:block" 
          style={{ backgroundColor: 'var(--color-border)' }}
        ></div>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
      
      <footer 
        className="py-12 text-center text-[10px] font-mono mt-20 relative z-10" 
        style={{ 
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-muted)'
        }}
      >
        <p>CHRONICLES OF {data?.home?.logoName?.toUpperCase() || "DEV"}. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

function ProtectedRoute() {
  const isAuth = localStorage.getItem("admin_session");
  return isAuth ? <Outlet /> : <Navigate to="/keyhole" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster 
            position="bottom-right" 
            toastOptions={{ 
              style: { 
                background: 'var(--color-bg)', 
                color: 'var(--color-paper)', 
                border: '1px solid var(--color-line)', 
                fontFamily: 'monospace', 
                fontSize: '12px' 
              },
              duration: 3000
            }} 
          />
          <Cursor />
          <Routes>
            <Route path="/keyhole" element={
              <Suspense fallback={<LoadingFallback />}>
                <Login />
              </Suspense>
            } />
            
            <Route element={<ProtectedRoute />}>
              <Route path={ADMIN_PATH} element={
                <Suspense fallback={<LoadingFallback />}>
                  <Admin />
                </Suspense>
              } />
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
    </ThemeProvider>
  );
}