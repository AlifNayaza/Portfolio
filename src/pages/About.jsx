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
      const particleCount = window.innerWidth < 768 ? 15 : 40;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.1,
          speedY: (Math.random() - 0.5) * 0.1,
          color: `rgba(159, 18, 57, ${Math.random() * 0.03 + 0.01})`
        });
      }
    };

    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(159, 18, 57, ${0.08 * (1 - distance / 80)})`;
            ctx.lineWidth = 0.3;
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
          p.x -= dx * 0.008;
          p.y -= dy * 0.008;
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
      className="fixed inset-0 pointer-events-none opacity-[0.15] md:opacity-20 z-0"
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-3xl max-h-[85vh] md:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-[#9f1239] text-xl md:text-2xl transition-colors p-2"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="relative rounded-lg overflow-hidden bg-black shadow-2xl">
          <img
            src={imageUrl}
            alt="Full size"
            className="w-full h-auto max-h-[70vh] md:max-h-[80vh] object-contain"
          />
        </div>
        <div className="absolute -bottom-8 left-0 right-0 text-center text-xs md:text-sm text-zinc-500">
          Tap outside to close • Pinch to zoom
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Profile Image Gallery Responsive ---
const ProfileImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const minSwipeDistance = 30;

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
        className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] border border-[#333] flex items-center justify-center"
      >
        <div className="text-center p-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#9f1239]/20 to-transparent flex items-center justify-center mx-auto mb-4 border border-[#9f1239]/30">
            <span className="text-3xl md:text-4xl text-[#9f1239]/60">👤</span>
          </div>
          <p className="text-zinc-500 text-sm md:text-base">Add profile images</p>
          <p className="text-zinc-600 text-xs md:text-sm mt-1">Upload in admin panel</p>
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
      
      <div className="relative">
        {/* Main Image Display */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] border border-[#333] shadow-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Image */}
          <div 
            className="relative w-full h-full cursor-pointer active:scale-[0.99] transition-transform"
            onClick={() => setModalOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`Profile ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-60 md:opacity-0 md:hover:opacity-60 transition-opacity duration-300"></div>
            
            {/* Zoom Hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
              Tap to view full size
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-[#9f1239] transition-all opacity-90 md:opacity-0 md:group-hover:opacity-90 border border-[#333]"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-[#9f1239] transition-all opacity-90 md:opacity-0 md:group-hover:opacity-90 border border-[#333]"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs md:text-sm px-3 py-1.5 rounded-full font-mono border border-[#333]">
              <span className="text-[#9f1239]">{currentIndex + 1}</span> / {images.length}
            </div>
          )}
        </motion.div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4"
          >
            <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 relative overflow-hidden rounded-lg border transition-all ${
                    idx === currentIndex 
                      ? 'border-[#9f1239] scale-105 shadow-md' 
                      : 'border-[#333] hover:border-[#555]'
                  }`}
                  style={{ width: '60px', height: '60px' }}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {idx === currentIndex && (
                    <div className="absolute inset-0 bg-[#9f1239]/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#9f1239]"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Swipe Hint for Mobile */}
            <div className="text-center text-xs text-zinc-500 mt-2 md:hidden">
              ← Swipe thumbnails →
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

// --- Profile Header Responsive ---
const ProfileHeader = ({ home }) => {
  const displayName = home?.logoName || "About Me";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Title */}
        <div className="mb-4 md:mb-6">
          <div className="text-center md:text-left">
            <h1 className="font-display text-2xl md:text-4xl lg:text-5xl text-white mb-2 px-2 md:px-0">
              {displayName}
            </h1>
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-[#9f1239] to-transparent mx-auto md:mx-0"></div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="relative py-4 border-y border-[#333] mb-6 md:mb-8">
          <div className="absolute top-0 left-0 w-2 h-2 md:w-3 md:h-3 border-t border-l border-[#9f1239]" />
          <div className="absolute top-0 right-0 w-2 h-2 md:w-3 md:h-3 border-t border-r border-[#9f1239]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 md:w-3 md:h-3 border-b border-l border-[#9f1239]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 border-b border-r border-[#9f1239]" />
          
          <p className="font-serif text-sm md:text-base text-zinc-400 text-center max-w-2xl mx-auto px-2 italic">
            "Crafting digital experiences with purpose and precision."
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Stats Cards Responsive ---
const StatsOverview = ({ projects, skills, experience, aboutPage }) => {
  const stats = [
    { 
      label: "Projects", 
      value: projects?.length || 0, 
      description: "Completed",
      icon: "📦",
      gradient: "from-[#9f1239] to-[#c2410c]"
    },
    { 
      label: "Skills", 
      value: skills?.length || 0, 
      description: "Expertise",
      icon: "🎯",
      gradient: "from-[#c2410c] to-[#d97706]"
    },
    { 
      label: "Experience", 
      value: experience?.length || 0, 
      description: "Journey",
      icon: "📅",
      gradient: "from-[#d97706] to-[#22c55e]"
    },
    { 
      label: "Status", 
      value: aboutPage?.availabilityStatus === 'open' ? "Available" : "Engaged", 
      description: "Availability",
      icon: "🔔",
      gradient: "from-[#22c55e] to-[#0ea5e9]"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-6xl mx-auto px-4 mb-8 md:mb-10 relative z-10">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative"
        >
          <div className="relative bg-[#111]/90 backdrop-blur-sm border border-[#333] rounded-lg md:rounded-xl p-3 md:p-4 hover:border-[#555] transition-all duration-300 overflow-hidden">
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <span className="text-lg md:text-xl">{stat.icon}</span>
                <div className={`text-xl md:text-2xl font-display bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
              <h3 className="text-xs md:text-sm font-medium text-white mb-1 truncate">{stat.label}</h3>
              <p className="text-[10px] md:text-xs text-zinc-500 truncate">{stat.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Content Tabs Responsive ---
const ContentTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "story", label: "My Story", icon: "📖", short: "Story" },
    { id: "journey", label: "Experience", icon: "🛣️", short: "Exp" },
    { id: "skills", label: "Skills", icon: "🔧", short: "Skills" }
  ];

  return (
    <div className="relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center mb-4 md:mb-6 overflow-x-auto -mx-4 px-4">
          <div className="inline-flex bg-[#111] border border-[#333] rounded-lg p-1 space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-md transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-[#9f1239] to-[#c2410c] text-white shadow-md' 
                    : 'text-zinc-500 hover:text-white hover:bg-[#222]'
                }`}
              >
                <span className="text-base md:text-lg">{tab.icon}</span>
                <span className="text-xs md:text-sm font-medium">
                  <span className="md:hidden">{tab.short}</span>
                  <span className="hidden md:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Tab Content: My Story (Responsive) ---
const StoryContent = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="bg-[#111]/90 backdrop-blur-sm border border-[#333] rounded-xl md:rounded-2xl p-5 md:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-3 border-b border-[#333]">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#9f1239] to-[#c2410c] flex items-center justify-center flex-shrink-0">
            <span className="text-lg md:text-xl">👤</span>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-display text-white">Personal Journey</h2>
            <p className="text-zinc-500 text-xs md:text-sm">The path that shaped my approach</p>
          </div>
        </div>

        {profile?.about ? (
          <div className="space-y-3 md:space-y-4">
            {profile.about.split('\n').map((paragraph, index) => (
              <motion.p 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-zinc-300 leading-relaxed text-sm md:text-base font-serif"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8 border-2 border-dashed border-[#333] rounded-lg">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#9f1239]/20 to-transparent flex items-center justify-center mx-auto mb-3 border border-[#9f1239]/30">
              <span className="text-xl md:text-2xl text-[#9f1239]">+</span>
            </div>
            <p className="text-zinc-500 text-sm">Your story awaits to be written</p>
            <p className="text-zinc-600 text-xs mt-1">Add your biography in admin panel</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Tab Content: Experience (Responsive) ---
const ExperienceContent = ({ experience }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="bg-[#111]/90 backdrop-blur-sm border border-[#333] rounded-xl md:rounded-2xl p-5 md:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-3 border-b border-[#333]">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#c2410c] to-[#d97706] flex items-center justify-center flex-shrink-0">
            <span className="text-lg md:text-xl">💼</span>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-display text-white">Professional Experience</h2>
            <p className="text-zinc-500 text-xs md:text-sm">Where I've learned and grown</p>
          </div>
        </div>

        {experience && experience.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-6 md:pl-8 pb-3 md:pb-4 border-l border-[#333] last:pb-0"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-1.5 top-0 w-3 h-3 bg-[#0c0c0c] border-2 border-[#9f1239] rounded-full" />
                
                {/* Content Card */}
                <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 md:p-4 hover:border-[#555] transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-medium text-white mb-1 truncate">{exp.role || "Position"}</h3>
                      <p className="text-xs md:text-sm text-zinc-400 truncate">{exp.company || "Company"}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-[#9f1239] to-[#c2410c] text-white px-2 py-1 rounded-full font-mono border border-[#9f1239]/30">
                      <span className="text-xs">📅</span>
                      <span className="truncate max-w-[80px] md:max-w-none">{exp.year || "Year"}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8 border-2 border-dashed border-[#333] rounded-lg">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#c2410c]/20 to-transparent flex items-center justify-center mx-auto mb-3 border border-[#c2410c]/30">
              <span className="text-xl md:text-2xl text-[#c2410c]">+</span>
            </div>
            <p className="text-zinc-500 text-sm">Add your work experiences</p>
            <p className="text-zinc-600 text-xs mt-1">Showcase your professional journey</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Tab Content: Skills (Responsive) ---
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="bg-[#111]/90 backdrop-blur-sm border border-[#333] rounded-xl md:rounded-2xl p-5 md:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-3 border-b border-[#333]">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#d97706] to-[#22c55e] flex items-center justify-center flex-shrink-0">
            <span className="text-lg md:text-xl">⚡</span>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-display text-white">Technical Skills</h2>
            <p className="text-zinc-500 text-xs md:text-sm">Tools and technologies I work with</p>
          </div>
        </div>

        {skills && skills.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {/* Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {skills.map((skill, index) => {
                const skillData = typeof skill === 'string' ? { name: skill, level: "Intermediate" } : skill;
                const level = skillData.level?.toLowerCase() || "intermediate";
                const isSelected = selectedSkill === skillData.name;
                
                const levelColors = {
                  beginner: { bg: "from-blue-500/20 to-cyan-500/20", text: "text-blue-400" },
                  intermediate: { bg: "from-green-500/20 to-emerald-500/20", text: "text-green-400" },
                  advanced: { bg: "from-orange-500/20 to-amber-500/20", text: "text-orange-400" },
                  expert: { bg: "from-[#9f1239]/20 to-[#c2410c]/20", text: "text-[#9f1239]" },
                  master: { bg: "from-[#9f1239]/20 to-[#c2410c]/20", text: "text-[#9f1239]" }
                };

                const colors = levelColors[level] || levelColors.intermediate;

                return (
                  <button
                    key={index}
                    onClick={() => handleSkillClick(skillData.name)}
                    className={`relative p-3 rounded-lg border transition-all duration-300 text-left ${
                      isSelected
                        ? `bg-gradient-to-br ${colors.bg} border-[#9f1239] shadow-sm`
                        : "bg-[#1a1a1a]/50 border-[#333] hover:border-[#555]"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium text-white text-xs md:text-sm truncate ${isSelected ? colors.text : ''}`}>
                          {skillData.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${colors.text} bg-black/30`}>
                          {level.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-1 bg-[#333] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${levelColors[level]?.bg.replace('/20', '') || "from-green-500 to-emerald-500"}`}
                          style={{ 
                            width: level === 'beginner' ? '30%' :
                                   level === 'intermediate' ? '60%' :
                                   level === 'advanced' ? '85%' : '100%'
                          }}
                        />
                      </div>
                    </div>
                  </button>
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
                  <div className="border-t border-[#333] pt-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-display text-white mb-1 truncate">
                          <span className="text-[#9f1239]">{selectedSkill}</span> Projects
                        </h3>
                        <p className="text-xs md:text-sm text-zinc-500">
                          {relatedProjects.length} project{relatedProjects.length !== 1 ? 's' : ''} found
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSkill(null);
                          setRelatedProjects([]);
                        }}
                        className="px-3 py-1.5 text-xs bg-[#111] border border-[#333] text-zinc-500 hover:text-white hover:border-[#9f1239] rounded-lg transition-all"
                      >
                        Clear
                      </button>
                    </div>
                    
                    {relatedProjects.length > 0 ? (
                      <div className="space-y-3">
                        {relatedProjects.map((project, index) => (
                          <Link
                            key={index}
                            to={`/project/${projects.indexOf(project)}`}
                            className="block group"
                          >
                            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 hover:border-[#9f1239] hover:bg-[#1a1a1a]/80 transition-all">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#9f1239]/20 to-transparent border border-[#9f1239]/30 group-hover:border-[#9f1239] flex items-center justify-center flex-shrink-0">
                                  <span className="text-[#9f1239] font-bold text-sm">
                                    #{index + 1}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-white group-hover:text-[#9f1239] mb-1 text-sm md:text-base truncate">
                                    {project.name}
                                  </h4>
                                  <p className="text-xs text-zinc-400 line-clamp-2 mb-2">
                                    {project.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {project.technologies?.slice(0, 2).map((tech, i) => (
                                      <span 
                                        key={i}
                                        className="text-[10px] bg-[#222] text-zinc-400 px-1.5 py-0.5 rounded border border-[#333]"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                    {project.technologies?.length > 2 && (
                                      <span className="text-[10px] text-zinc-600">
                                        +{project.technologies.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 border-2 border-dashed border-[#333] rounded-lg">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#9f1239]/20 to-transparent flex items-center justify-center mx-auto mb-2 border border-[#9f1239]/30">
                          <span className="text-lg text-[#9f1239]">💡</span>
                        </div>
                        <p className="text-zinc-500 text-sm">
                          Skill ready for new challenges
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-6 md:py-8 border-2 border-dashed border-[#333] rounded-lg">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#d97706]/20 to-transparent flex items-center justify-center mx-auto mb-3 border border-[#d97706]/30">
              <span className="text-xl md:text-2xl text-[#d97706]">+</span>
            </div>
            <p className="text-zinc-500 text-sm">Your skills will appear here</p>
            <p className="text-zinc-600 text-xs mt-1">Add your technical skills in admin</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Profile Sidebar Responsive ---
const ProfileSidebar = ({ profile, contact, aboutPage }) => {
  return (
    <div className="lg:col-span-4 space-y-4 md:space-y-6 relative z-10">
      {/* Profile Image Gallery */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-[#111]/90 to-[#1a1a1a]/90 backdrop-blur-sm border border-[#333] rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#333]">
          <h3 className="text-base md:text-lg font-display text-white flex items-center gap-1.5">
            <span className="text-[#9f1239] text-lg">🖼️</span> 
            <span>Gallery</span>
          </h3>
          {profile?.images?.length > 0 && (
            <span className="text-[10px] md:text-xs bg-[#9f1239]/20 text-[#9f1239] px-2 py-0.5 rounded-full font-mono">
              {profile.images.length}
            </span>
          )}
        </div>
        <ProfileImageGallery images={profile?.images} />
        
        {/* Status & Info */}
        <div className="mt-4 pt-3 border-t border-[#333]">
          <div className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full ${
              aboutPage?.availabilityStatus === 'open' 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-yellow-500'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {aboutPage?.availability || "Available for work"}
              </p>
              <p className="text-zinc-500 text-xs truncate">
                {aboutPage?.specialization || "Full-Stack Developer"} • {aboutPage?.location || "Remote"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact & Connect */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#111]/90 to-[#1a1a1a]/90 backdrop-blur-sm border border-[#333] rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg"
      >
        <h3 className="text-base md:text-lg font-display text-white mb-3 pb-2 border-b border-[#333] flex items-center gap-1.5">
          <span className="text-[#9f1239] text-lg">📨</span> 
          <span>Connect</span>
        </h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {contact?.github && (
              <a href={contact.github} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[#1a1a1a] border border-[#333] text-zinc-400 hover:text-white hover:border-[#9f1239] rounded-lg transition-all text-xs md:text-sm">
                <span>🐙</span>
                <span>GitHub</span>
              </a>
            )}
            {contact?.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[#1a1a1a] border border-[#333] text-zinc-400 hover:text-white hover:border-[#9f1239] rounded-lg transition-all text-xs md:text-sm">
                <span>💼</span>
                <span>LinkedIn</span>
              </a>
            )}
          </div>
          
          <Link 
            to="/contact"
            className="block w-full px-3 py-2.5 bg-gradient-to-r from-[#9f1239] to-[#c2410c] text-white text-center rounded-lg hover:opacity-90 transition-all font-medium text-sm shadow-md"
          >
            Send Message
          </Link>
        </div>
      </motion.div>

      {/* Work Philosophy */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#111]/90 to-[#1a1a1a]/90 backdrop-blur-sm border border-[#333] rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg"
      >
        <h3 className="text-base md:text-lg font-display text-white mb-3 pb-2 border-b border-[#333] flex items-center gap-1.5">
          <span className="text-[#9f1239] text-lg">💭</span> 
          <span>Philosophy</span>
        </h3>
        <div className="space-y-3">
          {[
            { icon: "🎯", title: "Problem First", desc: "Needs before solutions" },
            { icon: "✨", title: "Clean Code", desc: "Elegant solutions" },
            { icon: "🤝", title: "Collaboration", desc: "Teamwork for results" },
            { icon: "🚀", title: "Growth", desc: "Always learning" }
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#9f1239]/20 to-transparent border border-[#333] flex items-center justify-center flex-shrink-0">
                <span className="text-[#9f1239] text-sm">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                <p className="text-xs text-zinc-500 truncate">{item.desc}</p>
              </div>
            </div>
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
      <div className="min-h-screen pb-12 md:pb-16 relative overflow-x-hidden">
        {/* Background Elements */}
        <InkCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0c0c]/50 to-[#0c0c0c] z-0" />

        <div className="relative z-10 pt-2 md:pt-0">
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
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 px-4">
            {/* Sidebar dengan Gallery */}
            <ProfileSidebar 
              profile={profile}
              contact={contact}
              aboutPage={aboutPage}
            />

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-4 md:space-y-6">
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl mx-auto px-4"
              >
                <div className="bg-gradient-to-r from-[#9f1239]/20 to-[#c2410c]/20 border border-[#9f1239]/30 rounded-xl md:rounded-2xl p-4 md:p-5 text-center backdrop-blur-sm">
                  <h3 className="text-lg md:text-xl font-display text-white mb-2 md:mb-3">
                    Ready to Create?
                  </h3>
                  <p className="text-zinc-400 mb-3 md:mb-4 max-w-md mx-auto text-sm">
                    Let's work together to bring ideas to life.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
                    <Link
                      to="/contact"
                      className="inline-block px-4 py-2.5 bg-gradient-to-r from-[#9f1239] to-[#c2410c] text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm shadow-md"
                    >
                      Start Conversation
                    </Link>
                    <Link
                      to="/projects"
                      className="inline-block px-4 py-2.5 bg-transparent border border-[#333] text-white rounded-lg hover:border-[#9f1239] transition-all font-medium text-sm hover:bg-[#9f1239]/10"
                    >
                      View Projects
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-[#0c0c0c] to-transparent pointer-events-none" />
      </div>
    </PageTransition>
  );
}