/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar({ home, onOpenPitch, onOpenCmd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const location = useLocation();
  const { scrollYProgress } = useScroll();

  const brandName = home?.logoName || "ALRAF";

  const navigationItems = [
    { path: "/", label: "Index", subtitle: "Overview" },
    { path: "/about", label: "About", subtitle: "Story & Skills" },
    { path: "/projects", label: "Works", subtitle: "Selected Projects" },
    { path: "/contact", label: "Contact", subtitle: "Get in Touch" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
            setVisible(false);
          } else {
            setVisible(true);
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] origin-left bg-gradient-to-r from-[var(--color-crimson)] via-[var(--color-gold)] to-[var(--color-crimson)]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating Island Navigation Header */}
      <motion.header
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-4 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pointer-events-none"
      >
        <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)]/95 backdrop-blur-2xl shadow-xl pointer-events-auto">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="group flex items-center gap-2 pr-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-crimson)] animate-pulse" />
            <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-[var(--color-paper)] group-hover:text-[var(--color-crimson)] transition-colors">
              {brandName.toUpperCase()}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-3.5 py-1.5 rounded-full font-mono text-xs transition-all duration-200 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-[var(--color-muted)] hover:text-[var(--color-paper)] hover:bg-[var(--color-line)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-full bg-[var(--color-crimson)] -z-10 shadow-sm"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Bar: 60s Pitch + Cmd+K + ThemeToggle + Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* 60s Recruiter Fast-Pitch Button */}
            {onOpenPitch && (
              <button
                onClick={onOpenPitch}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[var(--color-crimson)] text-white font-mono text-[10px] sm:text-xs font-bold tracking-tight hover:opacity-90 transition-all shadow-sm flex items-center gap-1"
                aria-label="Open 60 second pitch"
              >
                <span>⚡</span>
                <span className="hidden sm:inline">60s Pitch</span>
                <span className="sm:hidden">Pitch</span>
              </button>
            )}

            {/* Command Palette Trigger */}
            {onOpenCmd && (
              <button
                onClick={onOpenCmd}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-paper)] font-mono text-[11px] transition-colors"
                aria-label="Open command palette"
                title="Command Palette (Ctrl+K)"
              >
                <span>⌘K</span>
              </button>
            )}

            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-8 h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-line)] flex flex-col items-center justify-center gap-1 text-[var(--color-paper)] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                className="w-3.5 h-0.5 rounded-full bg-current origin-center transition-transform"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-3.5 h-0.5 rounded-full bg-current transition-opacity"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                className="w-3.5 h-0.5 rounded-full bg-current origin-center transition-transform"
              />
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 right-0 pt-24 pb-8 px-6 bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-2xl rounded-b-3xl"
            >
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">
                  NAVIGATION INDEX
                </span>
                {navigationItems.map((item, idx) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
                        isActive
                          ? "bg-[var(--color-crimson)] text-white border-[var(--color-crimson)] shadow-md"
                          : "bg-[var(--color-line)]/50 border-[var(--color-border)] text-[var(--color-paper)] hover:border-[var(--color-crimson)]"
                      }`
                    }
                  >
                    <div>
                      <div className="font-display text-lg sm:text-xl font-bold">{item.label}</div>
                      <div className="font-mono text-xs opacity-70">{item.subtitle}</div>
                    </div>
                    <span className="font-mono text-lg">→</span>
                  </NavLink>
                ))}

                {/* Mobile 60s Pitch Button */}
                {onOpenPitch && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenPitch();
                    }}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--color-crimson)] bg-[var(--color-crimson)]/10 text-[var(--color-crimson)] font-mono text-xs font-bold hover:bg-[var(--color-crimson)] hover:text-white transition-all mt-1"
                  >
                    <span className="flex items-center gap-2">
                      <span>⚡</span>
                      <span>60-Second Recruiter Pitch</span>
                    </span>
                    <span>→</span>
                  </button>
                )}

                {/* Mobile Command Palette Trigger */}
                {onOpenCmd && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenCmd();
                    }}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-line)] text-[var(--color-paper)] font-mono text-xs font-bold hover:border-[var(--color-crimson)] transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <span>⌘</span>
                      <span>Quick Command Palette</span>
                    </span>
                    <span className="text-[var(--color-muted)]">Ctrl+K</span>
                  </button>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-mono text-[var(--color-muted)]">
                <span>© {new Date().getFullYear()} STUDIO</span>
                <span className="text-[var(--color-crimson)] font-bold">AVAILABLE FOR WORK</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}