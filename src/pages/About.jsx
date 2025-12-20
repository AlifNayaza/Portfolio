import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";

// === ARTISTIC BACKGROUND ===
const ArtisticBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Flowing lines
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(159, 18, 57, ${0.03 + i * 0.01})`;
        ctx.lineWidth = 2;
        
        for (let x = 0; x < canvas.width; x += 10) {
          const y = canvas.height / 2 + Math.sin((x + time + i * 100) * 0.01) * 50;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }
      
      time += 0.5;
      animationId = requestAnimationFrame(draw);
    };
    
    resize();
    draw();
    
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-20" />;
};

// === IMAGE MODAL ===
const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e) => e.key === 'Escape' && onClose();
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
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
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-[#9f1239] text-3xl transition-colors"
      >
        ×
      </button>
      <motion.img
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        src={imageUrl}
        alt="Full size"
        className="max-w-full max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

// === PROFILE GALLERY ===
const ProfileGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const displayImages = images && images.length > 0 ? images : [];

  return (
    <>
      <ImageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        imageUrl={displayImages[currentIndex]} 
      />
      
      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#333] bg-[#111] cursor-pointer group"
          onClick={() => displayImages.length > 0 && setIsModalOpen(true)}
        >
          {displayImages.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={displayImages[currentIndex]}
                alt="Profile"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-20">👤</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {displayImages.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-full font-mono text-xs text-white">
              {currentIndex + 1}/{displayImages.length}
            </div>
          )}
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Click to expand
          </div>
        </motion.div>

        {displayImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  idx === currentIndex ? 'border-[#9f1239] scale-105' : 'border-[#333] opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// === HERO SECTION ===
const HeroSection = ({ home, profile, aboutPage }) => {
  // Get full name from home.headline (like "I'm Alif Haikal Nayaza")
  const fullName = home?.headline?.replace(/^(Hi,?\s*)?I'?m\s*/i, '').trim() || home?.logoName || "Developer";
  
  return (
    <section className="py-12 md:py-20 px-4 min-h-[60vh] md:min-h-[70vh] flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-4 md:space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-[#9f1239]/10 border border-[#9f1239]/30 px-3 md:px-4 py-1.5 md:py-2 rounded-full">
              <span className="w-2 h-2 bg-[#9f1239] rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-mono text-[#9f1239]">Professional Profile</span>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-display text-white mb-3 md:mb-4 leading-tight">
                About
              </h1>
              <h2 className="text-2xl md:text-4xl lg:text-6xl font-serif italic text-[#9f1239] mb-4 md:mb-6">
                {fullName}
              </h2>
            </div>
            
            <div className="space-y-3 md:space-y-4 text-zinc-300">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 md:h-12 bg-gradient-to-b from-[#9f1239] to-transparent" />
                <div>
                  <p className="text-lg md:text-xl font-display text-white">{aboutPage?.specialization || "Full-Stack Developer"}</p>
                  <p className="text-xs md:text-sm text-zinc-500">{aboutPage?.location || "Remote • Worldwide"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-2 md:pt-4">
                <div className={`w-3 h-3 rounded-full ${
                  aboutPage?.availabilityStatus === 'open' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                }`} />
                <span className="text-sm md:text-base">{aboutPage?.availability || "Available for work"}</span>
              </div>
            </div>
            
            <div className="flex gap-3 md:gap-4 pt-4 md:pt-6">
              <button 
                onClick={() => window.location.href = '/contact'}
                className="px-4 md:px-6 py-2 md:py-3 bg-[#9f1239] text-white text-sm md:text-base font-medium rounded-lg hover:bg-[#7f0e2a] transition-all shadow-lg shadow-[#9f1239]/20"
              >
                Get In Touch
              </button>
              <button 
                onClick={() => window.location.href = '/projects'}
                className="px-4 md:px-6 py-2 md:py-3 border-2 border-[#333] text-white text-sm md:text-base font-medium rounded-lg hover:border-[#9f1239] transition-all"
              >
                View Work
              </button>
            </div>
          </motion.div>
          
          {/* Right: Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <ProfileGallery images={profile?.images} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// === BIOGRAPHY SECTION ===
const BiographySection = ({ profile }) => {
  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9f1239] to-[#c2410c] flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
              📖
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display text-white">My Story</h2>
              <p className="text-xs md:text-sm text-zinc-500">The journey that shaped who I am</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#111]/80 to-[#0a0a0a]/80 backdrop-blur-sm border border-[#333] rounded-xl md:rounded-2xl p-6 md:p-12">
            {profile?.about ? (
              <div className="space-y-4 md:space-y-6">
                {profile.about.split('\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-zinc-300 leading-relaxed text-base md:text-lg"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12 border-2 border-dashed border-[#333] rounded-xl">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#9f1239]/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-2xl md:text-3xl">✍️</span>
                </div>
                <p className="text-sm md:text-base text-zinc-500">Biography not added yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// === SKILLS WITH PROJECTS ===
const SkillsSection = ({ skills, projects }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  const handleSkillClick = (skillName) => {
    setSelectedSkill(selectedSkill === skillName ? null : skillName);
  };
  
  const relatedProjects = selectedSkill 
    ? projects?.filter(p => 
        p.technologies?.some(tech => 
          tech.toLowerCase().includes(selectedSkill.toLowerCase()) || 
          selectedSkill.toLowerCase().includes(tech.toLowerCase())
        )
      ) || []
    : [];
  
  const getLevelData = (level) => {
    const l = (level || 'intermediate').toLowerCase();
    if (l.includes('expert') || l.includes('master')) 
      return { width: '100%', gradient: 'from-[#9f1239] via-red-600 to-red-700', text: 'text-[#9f1239]', bg: 'bg-[#9f1239]/10', border: 'border-[#9f1239]/30' };
    if (l.includes('advanced')) 
      return { width: '75%', gradient: 'from-orange-500 via-yellow-500 to-yellow-600', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
    if (l.includes('intermediate')) 
      return { width: '50%', gradient: 'from-green-500 via-emerald-500 to-emerald-600', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
    return { width: '25%', gradient: 'from-blue-500 via-cyan-500 to-cyan-600', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
  };
  
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9f1239] to-[#c2410c] flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
              ⚡
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display text-white">Technical Arsenal</h2>
              <p className="text-xs md:text-sm text-zinc-500">Click any skill to see projects where I've used it</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            {skills?.map((skill, index) => {
              const skillData = typeof skill === 'string' ? { name: skill, level: "Intermediate" } : skill;
              const isActive = selectedSkill === skillData.name;
              const levelData = getLevelData(skillData.level);
              const projectCount = projects?.filter(p => 
                p.technologies?.some(tech => 
                  tech.toLowerCase().includes(skillData.name.toLowerCase()) || 
                  skillData.name.toLowerCase().includes(tech.toLowerCase())
                )
              ).length || 0;
              
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSkillClick(skillData.name)}
                  className={`relative p-4 md:p-6 rounded-lg md:rounded-xl border-2 transition-all text-left overflow-hidden ${
                    isActive 
                      ? `border-[#9f1239] ${levelData.bg}` 
                      : 'border-[#333] bg-[#111]/50 hover:border-[#555]'
                  }`}
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-12 md:w-16 h-12 md:h-16 opacity-5">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white to-transparent" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <h3 className={`text-lg md:text-xl font-display ${isActive ? levelData.text : 'text-white'}`}>
                        {skillData.name}
                      </h3>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full ${levelData.bg} ${levelData.text} border ${levelData.border} font-mono`}>
                          {skillData.level}
                        </span>
                        {projectCount > 0 && (
                          <span className="text-[10px] md:text-xs text-zinc-500">
                            {projectCount} project{projectCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="h-1.5 md:h-2 bg-[#222] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: levelData.width }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.03 }}
                        className={`h-full rounded-full bg-gradient-to-r ${levelData.gradient}`}
                      />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          <AnimatePresence>
            {selectedSkill && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-br from-[#111]/90 to-[#0a0a0a]/90 backdrop-blur-sm border-2 border-[#9f1239]/30 rounded-xl md:rounded-2xl p-6 md:p-8">
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-display text-white mb-1">
                        Projects with <span className="text-[#9f1239]">{selectedSkill}</span>
                      </h3>
                      <p className="text-xs md:text-sm text-zinc-500">
                        {relatedProjects.length} project{relatedProjects.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedSkill(null)} 
                      className="text-zinc-500 hover:text-white transition-colors text-xl md:text-2xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg hover:bg-[#222] flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {relatedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {relatedProjects.map((project, idx) => {
                        const projectIndex = projects.indexOf(project);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => window.location.href = `/project/${projectIndex}`}
                            className="group bg-[#0a0a0a] border border-[#333] rounded-lg md:rounded-xl p-4 md:p-5 hover:border-[#9f1239] transition-all cursor-pointer"
                          >
                            <div className="flex items-start gap-2 md:gap-3 mb-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#9f1239]/20 to-transparent border border-[#9f1239]/30 flex items-center justify-center flex-shrink-0 text-[#9f1239] font-bold text-xs md:text-sm">
                                #{idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-display text-base md:text-lg text-white group-hover:text-[#9f1239] transition-colors mb-1 truncate">
                                  {project.name}
                                </h4>
                                {project.description && (
                                  <p className="text-xs text-zinc-500 line-clamp-2">
                                    {project.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                              {project.technologies?.slice(0, 3).map((tech, i) => (
                                <span 
                                  key={i} 
                                  className={`text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded ${
                                    tech.toLowerCase().includes(selectedSkill.toLowerCase()) || 
                                    selectedSkill.toLowerCase().includes(tech.toLowerCase())
                                      ? 'bg-[#9f1239]/20 text-[#9f1239] border border-[#9f1239]/30'
                                      : 'bg-[#222] text-zinc-400'
                                  }`}
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.technologies?.length > 3 && (
                                <span className="text-[10px] md:text-xs text-zinc-600">
                                  +{project.technologies.length - 3}
                                </span>
                              )}
                            </div>
                            
                            <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-[#333] flex justify-between items-center">
                              <span className="text-[10px] md:text-xs text-zinc-600">Click to view details</span>
                              <span className="text-zinc-500 group-hover:text-[#9f1239] transition-colors">→</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 md:py-12 border-2 border-dashed border-[#333] rounded-xl">
                      <p className="text-sm md:text-base text-zinc-500">No projects found using this skill yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

// === EXPERIENCE SECTION ===
const ExperienceSection = ({ experience }) => {
  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9f1239] to-[#c2410c] flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
              🎯
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display text-white">Career Journey</h2>
              <p className="text-xs md:text-sm text-zinc-500">Professional milestones and experiences</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#9f1239] via-[#c2410c] to-transparent" />
            
            <div className="space-y-6 md:space-y-8">
              {experience?.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12 md:pl-16"
                >
                  <div className="absolute left-2.5 md:left-3 top-2 md:top-3 w-3 h-3 md:w-6 md:h-6 rounded-full bg-[#9f1239] border-4 border-[#0c0c0c] shadow-lg shadow-[#9f1239]/50" />
                  
                  <div className="bg-gradient-to-br from-[#111]/80 to-[#0a0a0a]/80 border border-[#333] rounded-lg md:rounded-xl p-4 md:p-6 hover:border-[#9f1239] transition-all">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <h3 className="text-lg md:text-xl font-display text-white mb-1">{exp.role}</h3>
                        <p className="text-sm md:text-base text-zinc-400">{exp.company}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm bg-[#9f1239]/20 text-[#9f1239] px-2.5 md:px-3 py-1 rounded-full border border-[#9f1239]/30 font-mono">
                        📅 {exp.year}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// === INTERESTS & VALUES SECTION (Replacing Contact CTA) ===
const InterestsSection = ({ aboutPage }) => {
  const defaultValues = [
    { title: "Problem Solving", desc: "Breaking down complex challenges into elegant solutions", icon: "🔍" },
    { title: "Clean Code", desc: "Writing maintainable and scalable code", icon: "✨" },
    { title: "Continuous Learning", desc: "Always exploring new technologies", icon: "📚" },
    { title: "User Focus", desc: "Building with users in mind", icon: "🎯" }
  ];
  
  const values = aboutPage?.coreValues && aboutPage.coreValues.length > 0 
    ? aboutPage.coreValues 
    : defaultValues;
  
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9f1239] to-[#c2410c] flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
              💭
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display text-white">Core Values</h2>
              <p className="text-xs md:text-sm text-zinc-500">Principles that guide my work</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#111]/80 to-[#0a0a0a]/80 border border-[#333] rounded-xl p-6 hover:border-[#9f1239] transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-[#9f1239]/20 to-transparent border border-[#9f1239]/30 flex items-center justify-center flex-shrink-0 text-2xl md:text-3xl group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-display text-white mb-2 group-hover:text-[#9f1239] transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Professional Strengths */}
          {aboutPage?.strengths && aboutPage.strengths.length > 0 && (
            <div className="bg-gradient-to-br from-[#111]/80 to-[#0a0a0a]/80 border border-[#333] rounded-xl md:rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-display text-white mb-6">Professional Strengths</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {aboutPage.strengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#0a0a0a] border border-[#333] rounded-lg p-3 md:p-4 text-center hover:border-[#9f1239] transition-all"
                  >
                    <span className="text-sm md:text-base text-zinc-300">{strength}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// === MAIN COMPONENT ===
export default function About() {
  const { data, loading } = usePortfolio();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0c0c]">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#9f1239] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-sm text-zinc-500">Loading profile...</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-[#0c0c0c] text-white">
        <ArtisticBackground />
        
        <div className="relative z-10">
          <HeroSection 
            home={data?.home}
            profile={data?.profile}
            aboutPage={data?.aboutPage}
          />
          
          <BiographySection profile={data?.profile} />
          
          <SkillsSection 
            skills={data?.skills}
            projects={data?.projects}
          />
          
          <ExperienceSection experience={data?.experience} />
          
          <InterestsSection aboutPage={data?.aboutPage} />
        </div>
      </div>
    </PageTransition>
  );
}