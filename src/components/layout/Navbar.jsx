import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ home }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
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
    { 
      name: "Beginning", 
      path: "/", 
      label: "Home", 
      icon: "✨",
      description: "Start your journey here"
    },
    { 
      name: "The Story", 
      path: "/about", 
      label: "About Me", 
      icon: "📖",
      description: "Learn about my journey"
    },
    { 
      name: "My Work", 
      path: "/projects", 
      label: "Projects", 
      icon: "💻",
      description: "Explore what I've built"
    },
    { 
      name: "Let's Talk", 
      path: "/contact", 
      label: "Contact", 
      icon: "📨",
      description: "Get in touch with me"
    },
  ];

  const brandName = home?.logoName || "Portfolio";

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
            <div className="flex flex-col">
              <div className="font-display font-bold text-base md:text-xl tracking-widest text-white">
                {brandName.toUpperCase()}
              </div>
              <div className="font-mono text-[8px] text-zinc-600 tracking-widest">
                DIGITAL STORYTELLER
              </div>
            </div>
            {/* Underline effect */}
            <motion.span 
              className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9f1239]"
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </NavLink>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {links.map((link, idx) => (
              <motion.div
                key={link.name}
                onHoverStart={() => setHoveredLink(idx)}
                onHoverEnd={() => setHoveredLink(null)}
                className="relative"
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `group relative py-2 transition-all duration-300 ${
                      isActive ? "text-[#9f1239]" : "text-zinc-500 hover:text-white"
                    }`
                  }
                >
                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {hoveredLink === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#0c0c0c] border border-[#333] px-3 py-2 rounded-lg whitespace-nowrap z-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#9f1239] text-sm">{link.icon}</span>
                          <span className="text-xs text-white">{link.description}</span>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#0c0c0c] border-b border-r border-[#333] rotate-45"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Menu item */}
                  <div className="flex flex-col items-center px-3">
                    <div className="flex items-center gap-2 font-mono text-xs tracking-wider font-bold">
                      <motion.span
                        animate={{ 
                          rotate: hoveredLink === idx ? [0, 10, -10, 0] : 0,
                          scale: hoveredLink === idx ? 1.2 : 1
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-base"
                      >
                        {link.icon}
                      </motion.span>
                      {link.label}
                    </div>
                    
                    {/* Chapter name */}
                    <motion.span 
                      className="block font-mono text-[9px] tracking-wider mt-1"
                      initial={{ opacity: 0.5 }}
                      animate={{ 
                        opacity: hoveredLink === idx ? 1 : 0.5,
                        color: hoveredLink === idx ? "#9f1239" : "#666"
                      }}
                    >
                      {link.name}
                    </motion.span>
                  </div>

                  {/* Active indicator */}
                  <motion.span 
                    className="absolute -bottom-1 left-0 h-0.5 bg-[#9f1239]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* MOBILE MENU BUTTON - Animated Hamburger */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden relative z-[60] w-10 h-10 flex items-center justify-center group"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-white origin-center group-hover:bg-[#9f1239] transition-colors"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-white group-hover:bg-[#9f1239] transition-colors"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-white origin-center group-hover:bg-[#9f1239] transition-colors"
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
              className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm"
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
              <div className="h-16 md:h-20 border-b border-[#222] flex items-center justify-between px-6 bg-gradient-to-r from-[#0a0a0a] to-[#111]">
                <div className="font-display text-lg text-white flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="text-[#9f1239]"
                  >
                    §
                  </motion.div>
                  <span>Navigation</span>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full border border-[#333] hover:border-[#9f1239]"
                  aria-label="Close menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </div>

              {/* Welcome Message */}
              <div className="p-6 border-b border-[#222] bg-gradient-to-r from-[#111] to-[#0a0a0a]">
                <p className="text-zinc-400 text-sm">
                  Welcome to my digital space. Where would you like to go?
                </p>
              </div>

              {/* Menu Items with Cards */}
              <div className="p-4 space-y-3">
                {links.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, type: "spring" }}
                  >
                    <NavLink
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `group block p-5 border transition-all duration-300 relative overflow-hidden rounded-xl ${
                          isActive 
                            ? "bg-gradient-to-br from-[#9f1239]/20 to-[#c2410c]/10 border-[#9f1239] shadow-lg shadow-[#9f1239]/20" 
                            : "bg-[#0a0a0a] border-[#222] hover:bg-[#111] hover:border-[#333] active:scale-95"
                        }`
                      }
                    >
                      {/* Content */}
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <motion.div 
                          className="text-2xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {link.icon}
                        </motion.div>
                        
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-display text-xl text-white group-hover:text-[#9f1239] transition-colors mb-1">
                                {link.label}
                              </div>
                              <div className="font-mono text-[10px] text-zinc-600 tracking-wider">
                                {link.name}
                              </div>
                            </div>
                            <motion.span 
                              className="text-zinc-600 group-hover:text-[#9f1239] transition-colors text-lg"
                              initial={{ x: 0 }}
                              whileHover={{ x: 5 }}
                            >
                              →
                            </motion.span>
                          </div>
                          
                          <p className="text-xs text-zinc-500">
                            {link.description}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <motion.div
                        className="h-0.5 bg-gradient-to-r from-[#9f1239] to-transparent mt-3"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * idx, duration: 0.4 }}
                      />

                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#9f1239]/0 via-[#9f1239]/5 to-[#9f1239]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="p-6 border-t border-[#222]">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#111] border border-[#333] p-3 rounded-lg text-center">
                    <div className="text-[#9f1239] text-sm font-bold">Always</div>
                    <div className="text-xs text-zinc-500">Available</div>
                  </div>
                  <div className="bg-[#111] border border-[#333] p-3 rounded-lg text-center">
                    <div className="text-[#c2410c] text-sm font-bold">Quick</div>
                    <div className="text-xs text-zinc-500">Response</div>
                  </div>
                </div>
                <p className="text-center text-xs text-zinc-600">
                  Feel free to explore every section
                </p>
              </div>

              {/* Menu Footer */}
              <div className="mt-auto p-6 border-t border-[#222] bg-[#0a0a0a]">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[#9f1239] rounded-full animate-pulse"></div>
                    <p className="font-mono text-[10px] text-zinc-700 tracking-widest">
                      NAVIGATION ACTIVE
                    </p>
                  </div>
                  <p className="font-mono text-[9px] text-zinc-800">
                    Current session • Secure connection
                  </p>
                  
                  {/* Social prompt */}
                  <div className="pt-4 border-t border-[#222]/50">
                    <p className="text-xs text-zinc-600">
                      Like what you see? Check out my work!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Scroll progress indicator */}
      <motion.div 
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-[#9f1239] to-[#c2410c] z-40"
        style={{ 
          width: `${(window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%` 
        }}
      />
    </>
  );
}