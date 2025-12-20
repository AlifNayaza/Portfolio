import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export default function Navbar({ home }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // Scroll-aware transforms
  const navOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 10]);

  // Navigation items - using dynamic data structure with user-friendly labels
  const navigationItems = [
    { 
      path: "/", 
      label: "Home", 
      subtitle: "Start Here",
      icon: "✦",
      description: "Welcome to my portfolio"
    },
    { 
      path: "/about", 
      label: "About Me", 
      subtitle: "My Story",
      icon: "◈",
      description: "Get to know who I am"
    },
    { 
      path: "/projects", 
      label: "Projects", 
      subtitle: "My Work",
      icon: "◇",
      description: "Explore what I've built"
    },
    { 
      path: "/contact", 
      label: "Contact", 
      subtitle: "Get in Touch",
      icon: "◆",
      description: "Let's work together"
    }
  ];

  const brandName = home?.logoName || "Portfolio";

  // Detect scroll direction and position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 20);
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
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
      {/* MAIN NAVBAR */}
      <motion.nav
        style={{ 
          opacity: navOpacity,
          backdropFilter: scrolled ? `blur(${navBlur}px)` : 'blur(0px)'
        }}
        animate={{ 
          y: visible ? 0 : -100,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#0c0c0c]/90 border-b border-[#333]/50 shadow-2xl shadow-black/50' 
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            
            {/* BRAND LOGO */}
            <NavLink to="/" className="relative z-[60] group">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Icon */}
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9f1239] to-[#c2410c] flex items-center justify-center shadow-lg shadow-[#9f1239]/30">
                    <span className="text-white text-xl md:text-2xl font-display">§</span>
                  </div>
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#9f1239] opacity-0 group-hover:opacity-30 blur-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Brand Text */}
                <div className="flex flex-col">
                  <span className="font-display font-bold text-base md:text-xl tracking-wider text-white">
                    {brandName.toUpperCase()}
                  </span>
                  <motion.span 
                    className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] text-zinc-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    DIGITAL STORYTELLER
                  </motion.span>
                </div>

                {/* Hover underline */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#9f1239] to-transparent"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </NavLink>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item, idx) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative px-5 py-3 transition-all duration-300 ${
                      isActive ? "text-white" : "text-zinc-500 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <div className="relative">
                      {/* Main Label */}
                      <div className="flex items-center gap-2">
                        <motion.span
                          animate={{ 
                            rotate: isActive ? [0, 10, -10, 0] : 0,
                            scale: isActive ? 1.1 : 1
                          }}
                          transition={{ duration: 0.5 }}
                          className={`text-base ${isActive ? 'text-[#9f1239]' : 'text-zinc-600 group-hover:text-[#9f1239]'}`}
                        >
                          {item.icon}
                        </motion.span>
                        <div className="flex flex-col">
                          <span className="font-display text-sm tracking-wide">
                            {item.label}
                          </span>
                          <span className="font-mono text-[8px] tracking-wider text-zinc-700 group-hover:text-zinc-600">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Active indicator */}
                      <motion.div
                        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#9f1239] to-transparent"
                        initial={{ width: 0 }}
                        animate={{ width: isActive ? "100%" : 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Hover tooltip */}
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          whileHover={{ opacity: 1, y: 0, scale: 1 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-[#0c0c0c] border border-[#333] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        >
                          <span className="text-xs text-zinc-400">{item.description}</span>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0c0c0c] border-t border-l border-[#333] rotate-45" />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>

            {/* MOBILE MENU BUTTON */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden relative z-[60] w-12 h-12 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-white origin-center"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  className="w-full h-0.5 bg-white"
                />
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-white origin-center"
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Decorative bottom border animation */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-[#9f1239] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrolled ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: "center" }}
        />
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-md lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[56] w-full max-w-md bg-[#0c0c0c] border-l border-[#333] shadow-2xl overflow-y-auto lg:hidden"
            >
              {/* Header */}
              <div className="h-20 border-b border-[#333] flex items-center justify-between px-6 bg-gradient-to-r from-[#0a0a0a] to-[#0c0c0c]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9f1239] to-[#c2410c] flex items-center justify-center">
                    <span className="text-white text-lg">§</span>
                  </div>
                  <span className="font-display text-lg text-white">Navigation</span>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-[#333] hover:border-[#9f1239] text-zinc-500 hover:text-white transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              {/* Welcome Message */}
              <div className="p-6 border-b border-[#333] bg-gradient-to-b from-[#0c0c0c] to-[#0a0a0a]">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-zinc-400 text-sm leading-relaxed"
                >
                  Welcome! Navigate through my portfolio and discover my work.
                </motion.p>
              </div>

              {/* Navigation Items */}
              <div className="p-4 space-y-3">
                {navigationItems.map((item, idx) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx, type: "spring", stiffness: 200 }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `group block relative overflow-hidden rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-br from-[#9f1239]/20 to-[#c2410c]/10 border-[#9f1239] shadow-lg shadow-[#9f1239]/20"
                            : "bg-[#0a0a0a] hover:bg-[#111]"
                        } border p-6`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Content */}
                          <div className="relative z-10 flex items-start gap-4">
                            {/* Chapter Number */}
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                                isActive
                                  ? "border-[#9f1239] bg-[#9f1239]/20"
                                  : "border-[#333] bg-[#0c0c0c]"
                              }`}
                            >
                              <span className={`text-2xl ${isActive ? "text-[#9f1239]" : "text-zinc-600"}`}>
                                {item.icon}
                              </span>
                            </motion.div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className={`font-display text-xl mb-1 transition-colors ${
                                    isActive ? "text-[#9f1239]" : "text-white group-hover:text-[#9f1239]"
                                  }`}>
                                    {item.label}
                                  </h3>
                                  <p className="font-mono text-[10px] text-zinc-600 tracking-wider">
                                    {item.subtitle}
                                  </p>
                                </div>
                                <motion.span
                                  animate={{ x: isActive ? 5 : 0 }}
                                  className={`text-xl transition-colors ${
                                    isActive ? "text-[#9f1239]" : "text-zinc-600 group-hover:text-[#9f1239]"
                                  }`}
                                >
                                  →
                                </motion.span>
                              </div>
                              
                              <p className="text-xs text-zinc-500 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <motion.div
                            className="h-1 bg-gradient-to-r from-[#9f1239] to-transparent mt-4"
                            initial={{ width: 0 }}
                            animate={{ width: isActive ? "100%" : "0%" }}
                            transition={{ duration: 0.5 }}
                          />

                          {/* Glow effect */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-[#9f1239]/5 via-transparent to-transparent"
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-auto p-6 border-t border-[#333] bg-[#0a0a0a]">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-[#9f1239] rounded-full"
                    />
                    <span className="font-mono text-[10px] text-zinc-700 tracking-widest">
                      SYSTEM ACTIVE
                    </span>
                  </div>
                  <p className="font-mono text-[9px] text-zinc-800">
                    Secure navigation • All paths accessible
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9f1239] via-[#c2410c] to-[#9f1239] z-40 origin-left"
        style={{
          scaleX: useTransform(scrollY, [0, document.body.scrollHeight - window.innerHeight], [0, 1])
        }}
      />
    </>
  );
}