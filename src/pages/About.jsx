import { useState, useEffect, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// --- Canvas Background dengan Efek Tinta Air ---
const InkCanvas = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0, radius: 100 };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = window.innerWidth < 768 ? 20 : 40;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          color: `rgba(159, 18, 57, ${Math.random() * 0.05 + 0.02})`
        });
      }
    };

    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(159, 18, 57, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      connectParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }
      });
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);

    setTimeout(() => {
      animate();
    }, 300);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none opacity-20 z-0"
    />
  );
};

// --- Modal untuk Gambar Full Size ---
const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-5xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-[#9f1239] text-2xl transition-colors"
        >
          ✕
        </button>
        <img
          src={imageUrl}
          alt="Full size"
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
        <div className="absolute -bottom-10 left-0 right-0 text-center text-sm text-zinc-500">
          Click anywhere to close
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Profile Image Gallery dengan Modal dan Interaksi Keren ---
const ProfileImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(false);

  const minSwipeDistance = 50;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-square border-2 border-dashed border-[#333] rounded-2xl bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] flex items-center justify-center group overflow-hidden"
      >
        <div className="text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9f1239]/20 to-transparent flex items-center justify-center mx-auto mb-6 border border-[#9f1239]/30">
            <span className="text-4xl text-[#9f1239]/60">👤</span>
          </div>
          <p className="text-zinc-500 font-serif">Add profile images</p>
          <p className="text-zinc-600 text-sm mt-2 font-mono">Upload in admin panel</p>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#9f1239]"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#9f1239]"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#9f1239]"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#9f1239]"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <ImageModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        imageUrl={images[currentIndex]} 
      />
      
      <div className="relative group">
        {/* Main Image Display dengan Frame Artistik */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] border border-[#333] shadow-xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Decorative Frame Corners */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#9f1239] z-10"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#9f1239] z-10"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#9f1239] z-10"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#9f1239] z-10"></div>
          
          {/* Main Image dengan Overlay Gradient */}
          <div 
            className="relative w-full h-full cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                <img
                  src={images[currentIndex]}
                  alt={`Profile ${currentIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Zoom Hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  Click to view full size
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows - Desktop */}
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-[#9f1239] transition-all opacity-0 group-hover:opacity-100 hidden md:flex border border-[#333] hover:border-[#9f1239] shadow-lg"
                aria-label="Previous image"
              >
                <span className="text-xl">‹</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-[#9f1239] transition-all opacity-0 group-hover:opacity-100 hidden md:flex border border-[#333] hover:border-[#9f1239] shadow-lg"
                aria-label="Next image"
              >
                <span className="text-xl">›</span>
              </motion.button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full font-mono border border-[#333]">
              <span className="text-[#9f1239]">{currentIndex + 1}</span> / {images.length}
            </div>
          )}
        </motion.div>

        {/* Thumbnail Navigation dengan Scroll Horizontal */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <div className="relative">
              <h4 className="text-sm text-zinc-500 font-mono mb-3 tracking-wider">GALLERY</h4>
              
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex-shrink-0 relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                      idx === currentIndex 
                        ? 'border-[#9f1239] scale-105 shadow-lg shadow-[#9f1239]/20' 
                        : 'border-[#333] hover:border-[#555]'
                    }`}
                    style={{ width: '80px', height: '80px' }}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {idx === currentIndex && (
                      <div className="absolute inset-0 bg-[#9f1239]/20 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-[#9f1239]"></div>
                      </div>
                    )}
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-mono">#{idx + 1}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Navigation Controls for Mobile */}
              <div className="flex justify-center gap-3 mt-4 md:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={prevImage}
                  className="flex-1 max-w-[120px] px-4 py-2 bg-[#111] border border-[#333] text-white rounded-lg hover:border-[#9f1239] hover:bg-[#9f1239]/10 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-lg">‹</span>
                  <span className="text-sm">Previous</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={nextImage}
                  className="flex-1 max-w-[120px] px-4 py-2 bg-[#111] border border-[#333] text-white rounded-lg hover:border-[#9f1239] hover:bg-[#9f1239]/10 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-sm">Next</span>
                  <span className="text-lg">›</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

// --- Profile Header dengan Nama dari Admin ---
const ProfileHeader = ({ home }) => {
  const displayName = home?.logoName || "About Me";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Main Title dengan Dekorasi */}
        <div className="relative mb-6 md:mb-8">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-px bg-gradient-to-r from-transparent to-[#9f1239] hidden md:block" />
          <div className="text-center md:text-left">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-2">
              {displayName}
            </h1>
            <div className="h-px w-24 md:w-32 bg-gradient-to-r from-[#9f1239] to-transparent mx-auto md:mx-0"></div>
          </div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-px bg-gradient-to-l from-transparent to-[#9f1239] hidden md:block" />
        </div>

        {/* Subtitle dengan Border Artistik */}
        <div className="relative py-4 md:py-6 border-y border-[#333] mb-6 md:mb-8">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#9f1239] md:w-4 md:h-4" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#9f1239] md:w-4 md:h-4" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#9f1239] md:w-4 md:h-4" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#9f1239] md:w-4 md:h-4" />
          
          <p className="font-serif text-base md:text-lg text-zinc-400 text-center max-w-3xl mx-auto italic px-4">
            "Crafting digital experiences with purpose and precision."
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Stats Cards dengan Desain Minimalis ---
const StatsOverview = ({ projects, skills, experience, aboutPage }) => {
  const stats = [
    { 
      label: "Projects", 
      value: projects?.length || 0, 
      description: "Successful deliveries",
      icon: "📦",
      gradient: "from-[#9f1239] to-[#c2410c]"
    },
    { 
      label: "Skills", 
      value: skills?.length || 0, 
      description: "Areas of expertise",
      icon: "🎯",
      gradient: "from-[#c2410c] to-[#d97706]"
    },
    { 
      label: "Experience", 
      value: experience?.length || 0, 
      description: "Professional journey",
      icon: "📅",
      gradient: "from-[#d97706] to-[#22c55e]"
    },
    { 
      label: "Status", 
      value: aboutPage?.availabilityStatus === 'open' ? "Available" : "Engaged", 
      description: "Current availability",
      icon: "🔔",
      gradient: "from-[#22c55e] to-[#0ea5e9]"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto px-4 mb-8 md:mb-12 relative z-10">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          <div className="relative bg-[#111]/80 backdrop-blur-sm border border-[#333] rounded-xl p-4 md:p-6 hover:border-[#555] transition-all duration-300 overflow-hidden">
            {/* Animated Background */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10`}
              animate={{ opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-xl md:text-2xl">{stat.icon}</span>
                <div className={`text-2xl md:text-3xl font-display bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
              <h3 className="text-sm md:text-lg font-medium text-white mb-1 md:mb-2">{stat.label}</h3>
              <p className="text-xs text-zinc-500">{stat.description}</p>
            </div>
            
            {/* Bottom Border Animation */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#9f1239] to-transparent"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0.5 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Content Tabs dengan Desain Baru ---
const ContentTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "story", label: "My Story", icon: "📖" },
    { id: "journey", label: "Experience", icon: "🛣️" },
    { id: "skills", label: "Skills", icon: "🔧" }
  ];

  return (
    <div className="relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center mb-6 md:mb-8 overflow-x-auto">
          <div className="inline-flex bg-[#111] border border-[#333] rounded-lg p-1 space-x-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-md transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-[#9f1239] to-[#c2410c] text-white shadow-lg' 
                    : 'text-zinc-500 hover:text-white hover:bg-[#222]'
                }`}
              >
                <span className="text-base md:text-lg">{tab.icon}</span>
                <span className="text-sm md:text-base font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Tab Content: My Story ---
const StoryContent = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="bg-[#111]/50 backdrop-blur-sm border border-[#333] rounded-2xl p-6 md:p-8 lg:p-12 overflow-hidden">
        {/* Header dengan Decorative Line */}
        <div className="flex items-center gap-4 mb-6 md:mb-8 pb-4 border-b border-[#333]">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9f1239] to-[#c2410c] flex items-center justify-center flex-shrink-0">
            <span className="text-xl md:text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-display text-white">Personal Journey</h2>
            <p className="text-zinc-500 text-sm md:text-base">The path that shaped my approach</p>
          </div>
          <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-transparent via-[#333] to-transparent ml-6"></div>
        </div>

        {profile?.about ? (
          <div className="space-y-4 md:space-y-6">
            {profile.about.split('\n').map((paragraph, index) => (
              <motion.p 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-zinc-300 leading-relaxed text-base md:text-lg font-serif"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12 border-2 border-dashed border-[#333] rounded-lg">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#9f1239]/20 to-transparent flex items-center justify-center mx-auto mb-4 border border-[#9f1239]/30">
              <span className="text-2xl md:text-3xl text-[#9f1239]">+</span>
            </div>
            <p className="text-zinc-500 font-serif">Your story awaits to be written</p>
            <p className="text-zinc-600 text-sm mt-2 font-mono">Add your biography in the admin panel</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Tab Content: Experience ---
const ExperienceContent = ({ experience }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="bg-[#111]/50 backdrop-blur-sm border border-[#333] rounded-2xl p-6 md:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8 pb-4 border-b border-[#333]">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#c2410c] to-[#d97706] flex items-center justify-center flex-shrink-0">
            <span className="text-xl md:text-2xl">💼</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-display text-white">Professional Experience</h2>
            <p className="text-zinc-500 text-sm md:text-base">Where I've learned and grown</p>
          </div>
        </div>

        {experience && experience.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 md:pl-10 pb-4 md:pb-6 border-l border-[#333] last:pb-0 group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-2 top-0 w-4 h-4 bg-[#0c0c0c] border-2 border-[#9f1239] rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                
                {/* Content Card */}
                <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 md:p-6 hover:border-[#555] transition-all duration-300 group-hover:translate-x-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-medium text-white mb-1">{exp.role || "Position"}</h3>
                      <p className="text-zinc-400 text-sm md:text-base">{exp.company || "Company"}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 md:gap-2 text-sm bg-gradient-to-r from-[#9f1239] to-[#c2410c] text-white px-3 py-1.5 rounded-full font-mono border border-[#9f1239]/30">
                      <span>📅</span>
                      {exp.year || "Year"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12 border-2 border-dashed border-[#333] rounded-lg">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#c2410c]/20 to-transparent flex items-center justify-center mx-auto mb-4 border border-[#c2410c]/30">
              <span className="text-2xl md:text-3xl text-[#c2410c]">+</span>
            </div>
            <p className="text-zinc-500 font-serif">Add your work experiences</p>
            <p className="text-zinc-600 text-sm mt-2 font-mono">Showcase your professional journey</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Tab Content: Skills ---
const SkillsContent = ({ skills, projects }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);

  const handleSkillClick = (skillName) => {
    if (selectedSkill === skillName) {
      setSelectedSkill(null);
      setRelatedProjects([]);
      return;
    }

    const foundProjects = projects?.filter(p => 
      p.technologies?.some(tech => 
        tech.toLowerCase().includes(skillName.toLowerCase()) || 
        skillName.toLowerCase().includes(tech.toLowerCase())
      )
    ) || [];
    
    setSelectedSkill(skillName);
    setRelatedProjects(foundProjects);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="bg-[#111]/50 backdrop-blur-sm border border-[#333] rounded-2xl p-6 md:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8 pb-4 border-b border-[#333]">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#d97706] to-[#22c55e] flex items-center justify-center flex-shrink-0">
            <span className="text-xl md:text-2xl">⚡</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-display text-white">Technical Skills</h2>
            <p className="text-zinc-500 text-sm md:text-base">Tools and technologies I work with</p>
          </div>
        </div>

        {skills && skills.length > 0 ? (
          <div className="space-y-6 md:space-y-8">
            {/* Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {skills.map((skill, index) => {
                const skillData = typeof skill === 'string' ? { name: skill, level: "Intermediate" } : skill;
                const level = skillData.level?.toLowerCase() || "intermediate";
                const isSelected = selectedSkill === skillData.name;
                
                const levelColors = {
                  beginner: { bg: "from-blue-500/20 to-cyan-500/20", text: "text-blue-400", border: "border-blue-500/30" },
                  intermediate: { bg: "from-green-500/20 to-emerald-500/20", text: "text-green-400", border: "border-green-500/30" },
                  advanced: { bg: "from-orange-500/20 to-amber-500/20", text: "text-orange-400", border: "border-orange-500/30" },
                  expert: { bg: "from-[#9f1239]/20 to-[#c2410c]/20", text: "text-[#9f1239]", border: "border-[#9f1239]/30" },
                  master: { bg: "from-[#9f1239]/20 to-[#c2410c]/20", text: "text-[#9f1239]", border: "border-[#9f1239]/30" }
                };

                const colors = levelColors[level] || levelColors.intermediate;

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSkillClick(skillData.name)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative group p-4 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ring-2 ring-[#9f1239]/20`
                        : "bg-[#1a1a1a]/50 border-[#333] hover:border-[#555]"
                    }`}
                  >
                    <div className="text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium text-white truncate text-sm md:text-base ${isSelected ? colors.text : ''}`}>
                          {skillData.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${colors.text} bg-black/30`}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${levelColors[level]?.bg.replace('/20', '') || "from-green-500 to-emerald-500"}`}
                          initial={{ width: 0 }}
                          animate={{ width: 
                            level === 'beginner' ? '30%' :
                            level === 'intermediate' ? '60%' :
                            level === 'advanced' ? '85%' : '100%'
                          }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      
                      <div className="text-xs text-zinc-500 text-right">
                        {isSelected ? "✓ Selected" : "Click for details"}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Selected Skill Details */}
            <AnimatePresence mode="wait">
              {selectedSkill && (
                <motion.div
                  key={selectedSkill}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#333] pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-display text-white mb-2">
                          Projects using <span className="text-[#9f1239]">{selectedSkill}</span>
                        </h3>
                        <p className="text-zinc-500 text-sm md:text-base">
                          {relatedProjects.length} project{relatedProjects.length !== 1 ? 's' : ''} found
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedSkill(null);
                          setRelatedProjects([]);
                        }}
                        className="px-4 py-2 text-sm bg-[#111] border border-[#333] text-zinc-500 hover:text-white hover:border-[#9f1239] rounded-lg transition-all"
                      >
                        Clear Selection
                      </motion.button>
                    </div>
                    
                    {relatedProjects.length > 0 ? (
                      <div className="space-y-4">
                        {relatedProjects.map((project, index) => (
                          <Link
                            key={index}
                            to={`/project/${projects.indexOf(project)}`}
                            className="block group"
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 md:p-6 hover:border-[#9f1239] hover:bg-[#1a1a1a]/80 transition-all"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-[#9f1239]/20 to-transparent border border-[#9f1239]/30 group-hover:border-[#9f1239] flex items-center justify-center flex-shrink-0">
                                  <span className="text-[#9f1239] font-bold text-lg">
                                    #{index + 1}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-white group-hover:text-[#9f1239] mb-2 text-base md:text-lg truncate">
                                    {project.name}
                                  </h4>
                                  <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                                    {project.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {project.technologies?.slice(0, 3).map((tech, i) => (
                                      <span 
                                        key={i}
                                        className="text-xs bg-[#222] text-zinc-400 px-2 py-1 rounded border border-[#333]"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                    {project.technologies?.length > 3 && (
                                      <span className="text-xs text-zinc-600">
                                        +{project.technologies.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-zinc-600 group-hover:text-[#9f1239] transition-colors self-center text-xl">
                                  →
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-[#333] rounded-lg">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#9f1239]/20 to-transparent flex items-center justify-center mx-auto mb-4 border border-[#9f1239]/30">
                          <span className="text-xl md:text-2xl text-[#9f1239]">💡</span>
                        </div>
                        <p className="text-zinc-500 font-serif">
                          This skill is part of my toolkit, ready for new challenges.
                        </p>
                        <p className="text-zinc-600 text-sm mt-2 font-mono">
                          It will be used in upcoming projects.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-8 md:py-12 border-2 border-dashed border-[#333] rounded-lg">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#d97706]/20 to-transparent flex items-center justify-center mx-auto mb-4 border border-[#d97706]/30">
              <span className="text-2xl md:text-3xl text-[#d97706]">+</span>
            </div>
            <p className="text-zinc-500 font-serif">Your skills will appear here</p>
            <p className="text-zinc-600 text-sm mt-2 font-mono">Add your technical skills in the admin panel</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Profile Sidebar dengan Gallery ---
const ProfileSidebar = ({ profile, contact, aboutPage }) => {
  return (
    <div className="lg:col-span-4 space-y-6 relative z-10">
      {/* Profile Image Gallery */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-[#111]/80 to-[#1a1a1a]/80 backdrop-blur-sm border border-[#333] rounded-2xl p-5 md:p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#333]">
          <h3 className="text-lg font-display text-white flex items-center gap-2">
            <span className="text-[#9f1239]">🖼️</span> Profile Gallery
          </h3>
          {profile?.images?.length > 0 && (
            <span className="text-xs bg-[#9f1239]/20 text-[#9f1239] px-2 py-1 rounded-full font-mono">
              {profile.images.length} image{profile.images.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <ProfileImageGallery images={profile?.images} />
        
        {/* Status & Info */}
        <div className="mt-6 pt-5 border-t border-[#333] space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              aboutPage?.availabilityStatus === 'open' 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-yellow-500'
            }`} />
            <div>
              <p className="text-white font-medium">
                {aboutPage?.availability || "Available for work"}
              </p>
              <p className="text-sm text-zinc-500 font-mono">
                {aboutPage?.specialization || "Full-Stack Developer"} • {aboutPage?.location || "Remote"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact & Connect */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#111]/80 to-[#1a1a1a]/80 backdrop-blur-sm border border-[#333] rounded-2xl p-5 md:p-6 shadow-xl"
      >
        <h3 className="text-lg font-display text-white mb-5 pb-3 border-b border-[#333] flex items-center gap-2">
          <span className="text-[#9f1239]">📨</span> Connect with Me
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {contact?.github && (
              <a href={contact.github} target="_blank" rel="noopener noreferrer"
                 className="group flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1a1a1a] border border-[#333] text-zinc-400 hover:text-white hover:border-[#9f1239] rounded-lg transition-all hover:bg-[#9f1239]/10">
                <span className="text-lg">🐙</span>
                <span className="text-sm font-mono">GitHub</span>
              </a>
            )}
            {contact?.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                 className="group flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1a1a1a] border border-[#333] text-zinc-400 hover:text-white hover:border-[#9f1239] rounded-lg transition-all hover:bg-[#9f1239]/10">
                <span className="text-lg">💼</span>
                <span className="text-sm font-mono">LinkedIn</span>
              </a>
            )}
          </div>
          
          <Link 
            to="/contact"
            className="block w-full px-4 py-3 bg-gradient-to-r from-[#9f1239] to-[#c2410c] text-white text-center rounded-lg hover:opacity-90 transition-all font-medium shadow-lg shadow-[#9f1239]/20"
          >
            Send a Message
          </Link>
        </div>
      </motion.div>

      {/* Work Philosophy */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#111]/80 to-[#1a1a1a]/80 backdrop-blur-sm border border-[#333] rounded-2xl p-5 md:p-6 shadow-xl"
      >
        <h3 className="text-lg font-display text-white mb-5 pb-3 border-b border-[#333] flex items-center gap-2">
          <span className="text-[#9f1239]">💭</span> Work Philosophy
        </h3>
        <div className="space-y-4">
          {[
            { icon: "🎯", title: "Problem First", desc: "Understanding needs before solutions", color: "from-[#9f1239]/20 to-transparent" },
            { icon: "✨", title: "Clean Code", desc: "Maintainable and elegant solutions", color: "from-[#c2410c]/20 to-transparent" },
            { icon: "🤝", title: "Collaboration", desc: "Working together for better outcomes", color: "from-[#d97706]/20 to-transparent" },
            { icon: "🚀", title: "Continuous Growth", desc: "Always learning and improving", color: "from-[#22c55e]/20 to-transparent" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-3 group"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} border border-[#333] group-hover:border-[#9f1239] flex items-center justify-center flex-shrink-0 transition-colors`}>
                <span className="text-[#9f1239]">{item.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white group-hover:text-[#9f1239] transition-colors">{item.title}</p>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main About Component ---
export default function About() {
  const { data } = usePortfolio();
  const [activeTab, setActiveTab] = useState("story");

  const { profile, experience, skills, projects, contact, aboutPage, home } = data || {};

  return (
    <PageTransition>
      <div className="min-h-screen pb-16 md:pb-20 relative overflow-hidden">
        {/* Background Elements */}
        <InkCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0c0c]/50 to-[#0c0c0c] z-0" />

        <div className="relative z-10">
          {/* Header dengan Nama dari Admin */}
          <ProfileHeader home={home} />

          {/* Stats Overview */}
          <StatsOverview 
            projects={projects}
            skills={skills}
            experience={experience}
            aboutPage={aboutPage}
          />

          {/* Main Content Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 px-4">
            {/* Sidebar dengan Gallery */}
            <ProfileSidebar 
              profile={profile}
              contact={contact}
              aboutPage={aboutPage}
            />

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              {/* Tab Navigation */}
              <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "story" && (
                  <StoryContent profile={profile} />
                )}

                {activeTab === "journey" && (
                  <ExperienceContent experience={experience} />
                )}

                {activeTab === "skills" && (
                  <SkillsContent skills={skills} projects={projects} />
                )}
              </AnimatePresence>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-4xl mx-auto px-4"
              >
                <div className="bg-gradient-to-r from-[#9f1239]/20 to-[#c2410c]/20 border border-[#9f1239]/30 rounded-2xl p-6 md:p-8 text-center backdrop-blur-sm">
                  <h3 className="text-xl md:text-2xl font-display text-white mb-3 md:mb-4">
                    Ready to Create Something Amazing?
                  </h3>
                  <p className="text-zinc-400 mb-5 md:mb-6 max-w-md mx-auto text-sm md:text-base">
                    Let's discuss how we can work together to bring your ideas to life.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/contact"
                        className="inline-block px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-[#9f1239] to-[#c2410c] text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm md:text-base shadow-lg shadow-[#9f1239]/20"
                      >
                        Start a Conversation
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/projects"
                        className="inline-block px-5 md:px-6 py-2.5 md:py-3 bg-transparent border-2 border-[#333] text-white rounded-lg hover:border-[#9f1239] transition-all font-medium text-sm md:text-base hover:bg-[#9f1239]/10"
                      >
                        See My Work
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-[#0c0c0c] to-transparent pointer-events-none" />
      </div>
    </PageTransition>
  );
}