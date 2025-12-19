import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ home }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll untuk efek navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup menu saat pindah halaman
  useEffect(() => setIsOpen(false), [location]);

  // Kunci scroll saat menu mobile terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    }
  }, [isOpen]);

  const links = [
    { name: "Prologue", path: "/", label: "Home", icon: "📖" },
    { name: "Chapter I", path: "/about", label: "Character", icon: "👤" },
    { name: "Chapter II", path: "/projects", label: "Battles", icon: "⚔️" },
    { name: "Epilogue", path: "/contact", label: "Signal", icon: "✉️" },
  ];

  const brandName = home?.logoName || "Author";

  return (
    <>
      {/* MAIN NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#0c0c0c]/98 backdrop-blur-xl border-b border-[#333] shadow-lg shadow-black/50' 
            : 'bg-[#0c0c0c]/95 backdrop-blur-sm border-b border-[#222]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex justify-between items-center">
          
          {/* LOGO with Animation */}
          <NavLink to="/" className="group relative z-[60] flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="text-[#9f1239] text-xl md:text-2xl"
            >
              §
            </motion.div>
            <div className="font-display font-bold text-base md:text-xl tracking-widest text-white">
              {brandName.toUpperCase()}
            </div>
            {/* Underline effect */}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9f1239] group-hover:w-full transition-all duration-300"></span>
          </NavLink>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {links.map((link, idx) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `group relative py-2 transition-all duration-300 ${
                    isActive ? "text-[#9f1239]" : "text-zinc-500 hover:text-white"
                  }`
                }
              >
                {/* Chapter number */}
                <motion.span 
                  className="block font-mono text-[9px] tracking-wider opacity-50 mb-0.5"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  {link.name}
                </motion.span>
                
                {/* Label */}
                <div className="flex items-center gap-2 font-mono text-xs tracking-widest font-bold">
                  <span className="text-base opacity-0 group-hover:opacity-100 transition-opacity">
                    {link.icon}
                  </span>
                  {link.label}
                </div>

                {/* Active indicator */}
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-[#9f1239]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </NavLink>
            ))}
          </div>

          {/* MOBILE MENU BUTTON - Animated Hamburger */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden relative z-[60] w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-white origin-center"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-white"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-white origin-center"
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[56] w-full max-w-sm bg-[#0c0c0c] border-l border-[#222] shadow-2xl overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="h-16 md:h-20 border-b border-[#222] flex items-center justify-between px-6 bg-[#0a0a0a]">
                <div className="font-display text-lg text-white flex items-center gap-2">
                  <span className="text-[#9f1239]">§</span>
                  Navigation
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              {/* Menu Items with Cards */}
              <div className="p-4 space-y-3">
                {links.map((link, idx) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `group block p-5 border transition-all duration-300 relative overflow-hidden ${
                        isActive 
                          ? "bg-gradient-to-br from-[#9f1239]/20 to-[#c2410c]/10 border-[#9f1239] shadow-lg shadow-[#9f1239]/20" 
                          : "bg-[#0a0a0a] border-[#222] hover:bg-[#111] hover:border-[#333] active:scale-95"
                      }`
                    }
                  >
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx, type: "spring" }}
                    >
                      {/* Chapter info */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] text-zinc-600 tracking-wider">
                          {String(idx).padStart(2, '0')} // {link.name}
                        </span>
                        <motion.span 
                          className="text-2xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {link.icon}
                        </motion.span>
                      </div>

                      {/* Label */}
                      <div className="font-display text-2xl text-white group-hover:text-[#9f1239] transition-colors mb-3">
                        {link.label}
                      </div>

                      {/* Progress bar */}
                      <motion.div
                        className="h-0.5 bg-[#9f1239]"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * idx, duration: 0.4 }}
                      />
                    </motion.div>

                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#9f1239]/0 via-[#9f1239]/5 to-[#9f1239]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </NavLink>
                ))}
              </div>

              {/* Menu Footer */}
              <div className="mt-8 p-6 border-t border-[#222]">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[#9f1239] rounded-full animate-pulse"></div>
                    <p className="font-mono text-[10px] text-zinc-700 tracking-widest">
                      CHRONICLES SYSTEM
                    </p>
                  </div>
                  <p className="font-mono text-[9px] text-zinc-800">
                    Version 1.0 • Active Session
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}