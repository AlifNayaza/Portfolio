import { useState, useRef, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

// --- OPTIMIZED INK PARTICLES (Lighter version) ---
const InkParticles = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Lighter particle class
    class Particle {
      constructor() {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 30;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * -1.5 - 0.8;
        this.color = Math.random() > 0.7 ? '#9f1239' : '#c2410c';
        this.alpha = Math.random() * 0.4 + 0.1;
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
      }

      update() {
        const dx = mousePos.current.x - this.x;
        const dy = mousePos.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) {
          const angle = Math.atan2(dy, dx);
          const force = (80 - distance) / 80 * 0.2;
          this.speedX -= Math.cos(angle) * force * 0.08;
          this.speedY -= Math.sin(angle) * force * 0.08;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;

        if (this.life <= 0 || this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.globalAlpha = this.alpha * this.life;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Reduced particle count: 30 for mobile, 50 for desktop
    const particleCount = window.innerWidth < 768 ? 25 : 40;
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        particles.current.push(new Particle());
      }, i * 60);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(p => {
        p.update();
        p.draw();
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const startDelay = setTimeout(() => {
      animate();
      canvas.addEventListener('mousemove', handleMouseMove);
    }, 800);

    return () => {
      clearTimeout(startDelay);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-30"
    />
  );
};

// --- ANIMATION VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const titleContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const titleLetter = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } },
};

const creativeFadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "circOut" } },
};

const itemReveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "backOut" } },
};

export default function About() {
  const { data } = usePortfolio();
  const { profile, experience, skills } = data;
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState("story");
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  
  const headerText = "Background Story.";

  const totalExperience = experience?.length || 0;
  const totalSkills = skills?.length || 0;
  const masterSkills = skills?.filter(s => (typeof s === 'string' ? false : s.level === "Master")).length || 0;

  useEffect(() => {
    const timer = setTimeout(() => setCanvasLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <section className="py-8 md:py-20 pl-4 md:pl-16 pr-4 md:pr-0 relative overflow-hidden">
        {canvasLoaded && <InkParticles />}

        <div className="absolute top-20 -left-6 md:-left-12 font-mono text-xs text-[#333] rotate-180 select-none" style={{ writingMode: 'vertical-rl' }}>
          CHAPTER I /// THE CHARACTER
        </div>

        {/* Hero Section */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mb-12 md:mb-20 relative z-10">
          <motion.h1 className="text-3xl md:text-6xl font-display mb-4 md:mb-6 relative break-words leading-tight" variants={titleContainer}>
            <span className="inline-block">Background</span>
            {' '}
            <span className="inline-block">Story<span className="text-[#9f1239]">.</span></span>
            <motion.div 
              className="h-[2px] bg-gradient-to-r from-[#9f1239] via-[#c2410c] to-transparent mt-2"
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            />
          </motion.h1>

          {/* Stats Cards - Grid responsive untuk mobile */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 relative z-10 mt-8">
            {[
              { label: "Total XP", value: totalExperience, color: "#9f1239", desc: "Years" },
              { label: "Arsenal", value: totalSkills, color: "#c2410c", desc: "Skills" },
              { label: "Mastery", value: masterSkills, color: "#d97706", desc: "Master" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemReveal}
                className="bg-[#111]/80 backdrop-blur-sm border border-[#333] p-2.5 md:p-6 group hover:border-[#9f1239] transition-all"
              >
                <div className="font-mono text-[8px] md:text-xs text-zinc-600 uppercase tracking-wider mb-1 md:mb-2 truncate">{stat.label}</div>
                <div className="text-xl md:text-5xl font-display leading-none" style={{ color: stat.color }}>{stat.value}</div>
                <div className="font-serif text-[9px] md:text-xs text-zinc-500 italic mt-0.5 md:mt-1">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content - Responsive Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 relative z-10" variants={staggerContainer} initial="hidden" animate="show">
          
          {/* LEFT: Portrait */}
          <motion.div className="md:col-span-5 space-y-4 md:space-y-6" variants={itemReveal}>
            <div className="relative group">
              <div className="aspect-[3/4] border border-[#333] p-2 relative cursor-zoom-in overflow-hidden" onClick={() => setIsZoomed(true)}>
                {/* Corners */}
                {[
                  'top-0 left-0 border-t-2 border-l-2',
                  'top-0 right-0 border-t-2 border-r-2',
                  'bottom-0 left-0 border-b-2 border-l-2',
                  'bottom-0 right-0 border-b-2 border-r-2'
                ].map((pos, i) => (
                  <motion.div 
                    key={i}
                    className={`absolute ${pos} border-[#9f1239] w-0 h-0`}
                    whileHover={{ width: 40, height: 40 }}
                    transition={{ duration: 0.4 }}
                  />
                ))}
                
                <motion.div 
                  className="absolute inset-2 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-0 z-10 flex items-end justify-center pb-4 md:pb-6"
                  whileHover={{ opacity: 1 }}
                >
                  <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-white tracking-widest border border-white px-3 py-1.5 bg-black/50 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    INSPECT
                  </div>
                </motion.div>

                {profile?.avatarUrl ? (
                  <motion.img 
                    src={profile.avatarUrl} 
                    alt="Portrait" 
                    className="w-full h-full object-cover grayscale contrast-125"
                    whileHover={{ grayscale: 0, scale: 1.03 }} 
                  />
                ) : (
                  <div className="w-full h-full bg-[#111] flex items-center justify-center font-mono text-[10px] text-zinc-600">
                    NO IMAGE
                  </div>
                )}
              </div>

              <motion.div className="mt-2 flex justify-between items-center font-mono text-[8px] md:text-[10px] text-zinc-500 uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                <span>/// CHARACTER_FILE.JPG</span>
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-[#9f1239] rounded-full animate-pulse"></span>
                  ARCHIVED
                </span>
              </motion.div>
            </div>

            {/* Info Card */}
            <motion.div className="bg-[#111] border border-[#333] p-3 md:p-6 space-y-3 md:space-y-4" variants={itemReveal}>
              <div className="flex items-center justify-between pb-2 md:pb-3 border-b border-[#333]">
                <h3 className="font-mono text-[10px] md:text-xs text-[#9f1239] uppercase tracking-widest">Character Data</h3>
              </div>

              <div className="space-y-2 md:space-y-3 font-mono text-[10px] md:text-xs">
                {[
                  { label: "STATUS:", value: "ACTIVE", color: "text-white" },
                  { label: "CLASS:", value: "FULL-STACK", color: "text-white" },
                  { label: "LEVEL:", value: "ADVANCED", color: "text-yellow-600" },
                  { label: "SPECIALTY:", value: "WEB DEV", color: "text-orange-500" }
                ].map((item, idx) => (
                  <motion.div key={idx} className="flex justify-between" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 + idx * 0.1 }}>
                    <span className="text-zinc-600">{item.label}</span>
                    <span className={item.color}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Tabbed Content */}
          <motion.div className="md:col-span-7" variants={itemReveal}>
            {/* Tabs */}
            <div className="relative mb-6 md:mb-8">
              <div className="flex gap-2 border-b border-[#333] overflow-x-auto scrollbar-hide">
                {[
                  { id: "story", label: "Story", icon: "📖" },
                  { id: "journey", label: "Journey", icon: "⏳" },
                  { id: "arsenal", label: "Arsenal", icon: "⚔️" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 font-mono text-[10px] md:text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                      activeTab === tab.id ? 'text-white' : 'text-zinc-600 hover:text-white'
                    }`}
                  >
                    <span className="text-sm md:text-base">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "story" && (
                <motion.div key="story" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
                  <motion.p className="text-sm md:text-lg text-zinc-400 font-serif leading-relaxed first-letter:text-4xl md:first-letter:text-7xl first-letter:font-display first-letter:float-left first-letter:pr-2 md:first-letter:pr-4 first-letter:pt-1 md:first-letter:pt-2 first-letter:text-white first-letter:leading-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    {profile?.about || "The story begins in shadows, where code meets creativity."}
                  </motion.p>
                </motion.div>
              )}

              {activeTab === "journey" && (
                <motion.div key="journey" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
                  {experience && experience.length > 0 ? (
                    <div className="space-y-0 border-l-2 border-[#333] pl-6 md:pl-8 relative">
                      {experience.map((exp, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.12 }} className="pb-8 md:pb-12 relative group">
                          <motion.span className="absolute -left-[29px] md:-left-[37px] top-2 w-3 h-3 md:w-4 md:h-4 bg-[#0c0c0c] border-2 border-[#333] rounded-full" whileHover={{ scale: 1.3, borderColor: "#9f1239" }} />
                          <motion.div className="bg-[#111] border border-[#333] p-3 md:p-6" whileHover={{ borderColor: "#9f1239", y: -3 }}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <span className="font-mono text-[9px] md:text-[10px] text-[#9f1239] tracking-widest">{exp.year}</span>
                              <span className="font-mono text-[8px] md:text-[9px] text-zinc-600 border border-[#333] px-2 py-0.5">#{String(idx + 1).padStart(2, '0')}</span>
                            </div>
                            <h3 className="text-lg md:text-2xl font-display text-white mb-1">{exp.role}</h3>
                            <p className="text-zinc-500 italic font-serif text-xs md:text-base">{exp.company}</p>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border border-dashed border-[#333]">
                      <p className="text-zinc-600 font-mono text-xs">No journey data</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "arsenal" && (
                <motion.div key="arsenal" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                  {skills?.map((skill, idx) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    const skillLevel = typeof skill === 'string' ? "Intermediate" : skill.level;
                    let levelColor = "text-zinc-500";
                    
                    if (skillLevel === "Intermediate") levelColor = "text-yellow-600";
                    if (skillLevel === "Advanced") levelColor = "text-orange-500";
                    if (skillLevel === "Master") levelColor = "text-[#9f1239]";

                    return (
                      <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.04 }} whileHover={{ scale: 1.03 }} className="bg-[#111] border border-[#333] p-2 md:p-4 hover:border-[#9f1239]/50 transition-all">
                        <div className="font-mono text-[8px] md:text-[9px] text-zinc-600 mb-1">#{String(idx + 1).padStart(2, '0')}</div>
                        <h4 className={`font-display text-xs md:text-base font-bold mb-1 ${levelColor}`}>{skillName}</h4>
                        <div className="font-mono text-[7px] md:text-[8px] text-zinc-600 uppercase">{skillLevel}</div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Zoomed Modal */}
        <AnimatePresence>
          {isZoomed && profile?.avatarUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0c0c0c]/98 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setIsZoomed(false)}>
              <motion.button className="absolute top-4 right-4 font-mono text-[10px] md:text-xs text-[#9f1239] hover:text-white border border-[#9f1239] hover:bg-[#9f1239] px-3 py-2 transition-all" whileTap={{ scale: 0.95 }}>
                [ ESC ]
              </motion.button>
              <motion.img src={profile.avatarUrl} alt="Full" className="max-h-[85vh] w-auto border-2 border-[#9f1239]" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
}