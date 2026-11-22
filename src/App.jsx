import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useMemo, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { MotionConfig } from "framer-motion";
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
const NotFound = lazy(() => import("./pages/NotFound"));
// Admin-only guard (pulls in axios) stays out of the public bundle
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Overlays are only fetched the first time someone opens them
const RecruiterPitchModal = lazy(() => import("./components/ui/RecruiterPitchModal"));
const CommandPalette = lazy(() => import("./components/ui/CommandPalette"));

// Components
import Navbar from "./components/layout/Navbar";
import MusicPlayer from "./components/ui/MusicPlayer";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";
import { useState } from "react";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Move keyboard / screen-reader focus to the new page content on client-side navigation
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    }
    if (pathname === '/') {
      document.title = "Alif Haikal Nayaza — Portfolio";
    } else if (pathname === '/projects') {
      document.title = "Works — Alif Haikal Nayaza";
    } else if (pathname === '/about') {
      document.title = "About — Alif Haikal Nayaza";
    } else if (pathname === '/contact') {
      document.title = "Contact — Alif Haikal Nayaza";
    } else if (pathname.startsWith('/admin') || pathname.startsWith(ADMIN_PATH)) {
      document.title = "Studio Dashboard";
    }
  }, [pathname]);
  return null;
}

const LoadingFallback = () => (
  <div 
    role="status"
    aria-live="polite"
    className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)]"
  >
    <div className="w-12 h-12 border-2 border-[var(--color-crimson)] border-t-transparent rounded-full animate-spin mb-4" />
    <div 
      className="font-mono text-xs tracking-widest text-[var(--color-muted)] uppercase animate-pulse"
    >
      LOADING STUDIO
    </div>
  </div>
);

function Layout() {
  const { data, loading } = usePortfolio();
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Stable reference: a new array on every render would make the player reload the track
  const playlist = useMemo(() => {
    if (Array.isArray(data?.soundtrack) && data.soundtrack.length > 0) return data.soundtrack;
    if (data?.music && typeof data.music === 'object' && data.music.url) return [data.music];
    return [];
  }, [data]);

  if (loading) return <LoadingFallback />;

  return (
    <div 
      className="min-h-screen font-sans flex flex-col relative overflow-hidden bg-[var(--color-bg)] text-[var(--color-paper)]"
    >
      <a href="#main-content" className="skip-link">Skip to content</a>

      <Suspense fallback={null}>
        {/* 60-Second Recruiter Pitch Modal */}
        {isPitchOpen && (
          <RecruiterPitchModal
            isOpen={isPitchOpen}
            onClose={() => setIsPitchOpen(false)}
            data={data}
          />
        )}

        {/* Interactive Dev Command Palette (mounted fresh on every open) */}
        {isCmdOpen && (
          <CommandPalette
            isOpen={isCmdOpen}
            onClose={() => setIsCmdOpen(false)}
            onOpenPitch={() => setIsPitchOpen(true)}
            data={data}
          />
        )}
      </Suspense>

      <Navbar
        home={data?.home}
        onOpenPitch={() => setIsPitchOpen(true)}
        onOpenCmd={() => setIsCmdOpen(true)}
      />
      <MusicPlayer playlist={playlist} />
      <ScrollToTopButton />
      
      <main 
        id="main-content"
        tabIndex={-1}
        className="outline-none flex-grow pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 max-w-[1920px] mx-auto w-full relative z-10"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Outlet context={{ onOpenPitch: () => setIsPitchOpen(true), onOpenCmd: () => setIsCmdOpen(true) }} />
        </Suspense>
      </main>
      
      <footer 
        className="py-8 sm:py-10 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 mt-4 sm:mt-8 relative z-10 border-t border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)]"
      >
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <p className="tracking-wide">
            © {new Date().getFullYear()} <span className="text-[var(--color-paper)] font-bold">{data?.home?.logoName || "Alraf"}</span>. Crafted with precision & code.
          </p>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-[var(--color-muted)]">
            <span>DESIGN & ENGINEERING</span>
            <span>•</span>
            <span className="text-[var(--color-crimson)] font-bold">LIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}



export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
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
          <Routes>
            <Route path="/keyhole" element={
              <Suspense fallback={<LoadingFallback />}>
                <Login />
              </Suspense>
            } />
            
            <Route element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute />
              </Suspense>
            }>
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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}