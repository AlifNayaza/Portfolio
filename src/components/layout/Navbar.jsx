import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ThemeToggle from "../ui/ThemeToggle";

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
          backdropFilter: scrolled ? `blur(${navBlur}px)` : 'blur(0px)',
          backgroundColor: scrolled ? 'var(--color-bg)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent'
        }}
        animate={{ 
          y: visible ? 0 : -100,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className="fixed top-0 w-full z-50 transition-all duration-500"
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
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: 'linear-gradient(to bottom right, var(--color-crimson), var(--color-gold))',
                      boxShadow: '0 10px 15px -3px rgba(159, 18, 57, 0.3)'
                    }}
                  >
                    <span className="text-white text-xl md:text-2xl font-display">§</span>
                  </div>
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 blur-xl"
                    style={{ backgroundColor: 'var(--color-crimson)' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Brand Text */}
                <div className="flex flex-col">
                  <span 
                    className="font-display font-bold text-base md:text-xl tracking-wider"
                    style={{ color: 'var(--color-paper)' }}
                  >
                    {brandName.toUpperCase()}
                  </span>
                  <motion.span 
                    className="font-mono text-[8px] md:text-[9px] tracking-[0.2em]"
                    style={{ color: 'var(--color-muted)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    DIGITAL STORYTELLER
                  </motion.span>
                </div>

                {/* Hover underline */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5"
                  style={{ 
                    background: 'linear-gradient(to right, var(--color-crimson), transparent)' 
                  }}
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
                  className="group relative px-5 py-3 transition-all duration-300"
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-paper)' : 'var(--color-muted)'
                  })}
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
                          className="text-base"
                          style={{ 
                            color: isActive ? 'var(--color-crimson)' : 'var(--color-muted)'
                          }}
                        >
                          {item.icon}
                        </motion.span>
                        <div className="flex flex-col">
                          <span className="font-display text-sm tracking-wide">
                            {item.label}
                          </span>
                          <span 
                            className="font-mono text-[8px] tracking-wider transition-colors"
                            style={{ color: isActive ? 'var(--color-muted)' : 'var(--color-line)' }}
                          >
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-2 left-0 right-0 h-0.5"
                          style={{ backgroundColor: 'var(--color-crimson)' }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}

                      {/* Hover effect */}
                      <motion.div
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{ backgroundColor: 'var(--color-line)' }}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )}
                </NavLink>
              ))}

              {/* THEME TOGGLE - Desktop */}
              <div className="ml-3 pl-3" style={{ borderLeft: '1px solid var(--color-border)' }}>
                <ThemeToggle />
              </div>
            </div>

            {/* MOBILE: Theme Toggle + Menu Button */}
            <div className="flex lg:hidden items-center gap-3 z-[60]">
              <ThemeToggle />
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-line)',
                  borderColor: 'var(--color-border)',
                  borderWidth: '1px'
                }}
              >
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="w-5 h-0.5 rounded-full"
                  style={{ backgroundColor: isOpen ? 'var(--color-crimson)' : 'var(--color-paper)' }}
                />
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-5 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-paper)' }}
                />
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="w-5 h-0.5 rounded-full"
                  style={{ backgroundColor: isOpen ? 'var(--color-crimson)' : 'var(--color-paper)' }}
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Decorative bottom border animation */}
        <motion.div
          className="absolute bottom-0 left-0 h-px w-full"
          style={{ 
            background: 'linear-gradient(to right, transparent, var(--color-crimson), transparent)',
            transformOrigin: "center"
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrolled ? 1 : 0 }}
          transition={{ duration: 0.5 }}
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
              className="fixed inset-0 z-[55] backdrop-blur-md lg:hidden"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[56] w-full max-w-md shadow-2xl overflow-y-auto lg:hidden"
              style={{ 
                backgroundColor: 'var(--color-bg)',
                borderLeft: '1px solid var(--color-border)'
              }}
            >
              {/* Header */}
              <div 
                className="h-20 flex items-center justify-between px-6"
                style={{ 
                  borderBottom: '1px solid var(--color-border)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ 
                      background: 'linear-gradient(to bottom right, var(--color-crimson), var(--color-gold))' 
                    }}
                  >
                    <span className="text-white text-lg">§</span>
                  </div>
                  <span 
                    className="font-display text-lg"
                    style={{ color: 'var(--color-paper)' }}
                  >
                    Navigation
                  </span>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full border transition-colors"
                  style={{ 
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-muted)'
                  }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Welcome Message */}
              <div 
                className="p-6"
                style={{ 
                  borderBottom: '1px solid var(--color-border)'
                }}
              >
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-muted)' }}
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
                      className="group block relative overflow-hidden rounded-xl transition-all duration-300 border p-6"
                      style={({ isActive }) => ({
                        backgroundColor: isActive 
                          ? 'rgba(159, 18, 57, 0.1)' 
                          : 'var(--color-bg)',
                        borderColor: isActive 
                          ? 'var(--color-crimson)' 
                          : 'var(--color-border)',
                        boxShadow: isActive 
                          ? '0 10px 15px -3px rgba(159, 18, 57, 0.2)' 
                          : 'none'
                      })}
                    >
                      {({ isActive }) => (
                        <>
                          {/* Content */}
                          <div className="relative z-10 flex items-start gap-4">
                            {/* Chapter Number */}
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2"
                              style={{
                                borderColor: isActive ? 'var(--color-crimson)' : 'var(--color-border)',
                                backgroundColor: isActive ? 'rgba(159, 18, 57, 0.2)' : 'var(--color-bg)'
                              }}
                            >
                              <span 
                                className="text-2xl"
                                style={{ color: isActive ? 'var(--color-crimson)' : 'var(--color-muted)' }}
                              >
                                {item.icon}
                              </span>
                            </motion.div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 
                                    className="font-display text-xl mb-1 transition-colors"
                                    style={{ 
                                      color: isActive ? 'var(--color-crimson)' : 'var(--color-paper)' 
                                    }}
                                  >
                                    {item.label}
                                  </h3>
                                  <p 
                                    className="font-mono text-[10px] tracking-wider"
                                    style={{ color: 'var(--color-muted)' }}
                                  >
                                    {item.subtitle}
                                  </p>
                                </div>
                                <motion.span
                                  animate={{ x: isActive ? 5 : 0 }}
                                  className="text-xl transition-colors"
                                  style={{ 
                                    color: isActive ? 'var(--color-crimson)' : 'var(--color-muted)' 
                                  }}
                                >
                                  →
                                </motion.span>
                              </div>
                              
                              <p 
                                className="text-xs leading-relaxed"
                                style={{ color: 'var(--color-muted)' }}
                              >
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <motion.div
                            className="h-1 mt-4"
                            style={{ 
                              background: 'linear-gradient(to right, var(--color-crimson), transparent)' 
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: isActive ? "100%" : "0%" }}
                            transition={{ duration: 0.5 }}
                          />

                          {/* Glow effect */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0"
                              style={{ 
                                background: 'linear-gradient(to right, rgba(159, 18, 57, 0.05), transparent, transparent)' 
                              }}
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
              <div 
                className="mt-auto p-6"
                style={{ 
                  borderTop: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)'
                }}
              >
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--color-crimson)' }}
                    />
                    <span 
                      className="font-mono text-[10px] tracking-widest"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      SYSTEM ACTIVE
                    </span>
                  </div>
                  <p 
                    className="font-mono text-[9px]"
                    style={{ color: 'var(--color-line)' }}
                  >
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
        className="fixed top-0 left-0 right-0 h-0.5 z-40 origin-left"
        style={{
          background: 'linear-gradient(to right, var(--color-crimson), var(--color-gold), var(--color-crimson))',
          scaleX: useTransform(scrollY, [0, document.body.scrollHeight - window.innerHeight], [0, 1])
        }}
      />
    </>
  );
}