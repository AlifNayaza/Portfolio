
import { useState, useRef, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

// --- COMPONENT: INK PARTICLE ANIMATION (Canvas-based) ---
const InkParticles = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * -2 - 1;
        this.color = Math.random() > 0.7 ? '#9f1239' : '#c2410c';
        this.alpha = Math.random() * 0.6 + 0.2;
        this.life = 1;
        this.decay = Math.random() * 0.008 + 0.005;
        this.wander = Math.random() * 0.05;
      }

      update() {
        // Mouse interaction
        const dx = mousePos.current.x - this.x;
        const dy = mousePos.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 100 * 0.3;
          this.speedX -= Math.cos(angle) * force * 0.1;
          this.speedY -= Math.sin(angle) * force * 0.1;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX += (Math.random() - 0.5) * this.wander;
        this.speedY += (Math.random() - 0.5) * this.wander;
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
        
        // Glow effect for some particles
        if (this.color === '#9f1239' && this.life > 0.5) {
          ctx.beginPath();
          ctx.globalAlpha = this.alpha * this.life * 0.3;
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Initialize particles
    particles.current = [];
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        particles.current.push(new Particle());
      }, i * 50); // Staggered appearance
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw subtle connection lines between close particles
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#9f1239';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i];
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80 && p1.life > 0.3 && p2.life > 0.3) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Mouse move event
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // Start animation after delay
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
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40"
    />
  );
};

// --- VARIAN ANIMASI KREATIF ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const titleContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const titleLetter = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const creativeFadeInUp = {
  hidden: { opacity: 0, y: 60, skewY: 3 },
  show: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.8, ease: "circOut" },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// --- STAGGERED REVEAL ANIMATION FOR CONTENT ---
const sectionReveal = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

const itemReveal = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "backOut" 
    } 
  },
};

export default function About() {
  const { data } = usePortfolio();
  const { profile, experience, skills } = data;
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState("story"); // story, journey, arsenal
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  
  const headerText = "Background Story.";

  // Hitung stats
  const totalExperience = experience?.length || 0;
  const totalSkills = skills?.length || 0;
  const masterSkills = skills?.filter(s => (typeof s === 'string' ? false : s.level === "Master")).length || 0;

  // Trigger canvas after transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanvasLoaded(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <section className="py-12 md:py-20 pl-4 md:pl-16 relative overflow-hidden">
        {/* Ink Particle Canvas Animation */}
        {canvasLoaded && <InkParticles />}

        <div className="absolute top-20 -left-6 md:-left-12 font-mono text-xs text-[#333] rotate-180 select-none" style={{ writingMode: 'vertical-rl' }}>
            CHAPTER I /// THE CHARACTER
        </div>

        {/* Hero Section dengan Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mb-16 md:mb-20 relative z-10"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-display mb-6 relative"
            variants={titleContainer}
          >
            {headerText.split('').map((char, index) => (
              <motion.span 
                key={index} 
                variants={titleLetter} 
                className={`inline-block ${char === '.' ? 'text-[#9f1239]' : ''}`}
              >
                {char}
              </motion.span>
            ))}
            {/* Animated underline */}
            <motion.div 
              className="h-[2px] bg-gradient-to-r from-[#9f1239] via-[#c2410c] to-transparent mt-2"
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
            />
          </motion.h1>

          {/* Stats Cards - Horizontal Scroll di Mobile */}
          <motion.div 
            variants={sectionReveal}
            initial="hidden"
            animate="show"
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide relative z-10"
          >
            {[
              { 
                label: "Total XP", 
                value: totalExperience, 
                color: "#9f1239", 
                desc: "Years Journey",
                delay: 0.1
              },
              { 
                label: "Arsenal", 
                value: totalSkills, 
                color: "#c2410c", 
                desc: "Tech Mastered",
                delay: 0.2
              },
              { 
                label: "Mastery", 
                value: masterSkills, 
                color: "#d97706", 
                desc: "Master Level",
                delay: 0.3
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemReveal}
                custom={stat.delay}
                className="flex-shrink-0 bg-[#111]/80 backdrop-blur-sm border border-[#333] p-4 md:p-6 min-w-[140px] md:min-w-[200px] group hover:border-[#9f1239] transition-all relative overflow-hidden"
              >
                {/* Animated background effect */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20"
                  style={{ background: `radial-gradient(circle at center, ${stat.color}20, transparent 70%)` }}
                  initial={false}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                />
                
                <div className="relative z-10">
                  <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-2">{stat.label}</div>
                  <div 
                    className="text-3xl md:text-5xl font-display group-hover:scale-110 transition-transform origin-left duration-500"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="font-serif text-xs text-zinc-500 italic mt-1">{stat.desc}</div>
                </div>
                
                {/* Animated corner */}
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#333] group-hover:border-[#9f1239] transition-colors duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid md:grid-cols-12 gap-8 md:gap-12 relative z-10"
          variants={sectionReveal}
          initial="hidden"
          animate="show"
        >
          {/* LEFT: Portrait with Interactive Elements */}
          <motion.div className="md:col-span-5 space-y-6" variants={itemReveal}>
            {/* Portrait */}
            <div className="relative group">
              <div 
                className="aspect-[3/4] border border-[#333] p-2 relative cursor-zoom-in overflow-hidden"
                onClick={() => setIsZoomed(true)}
              >
                {/* Animated Corners */}
                <motion.div 
                  className="absolute top-0 left-0 w-0 h-0 border-t-2 border-l-2 border-[#9f1239]"
                  whileHover={{ width: 64, height: 64 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div 
                  className="absolute top-0 right-0 w-0 h-0 border-t-2 border-r-2 border-[#9f1239]"
                  whileHover={{ width: 64, height: 64 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div 
                  className="absolute bottom-0 left-0 w-0 h-0 border-b-2 border-l-2 border-[#9f1239]"
                  whileHover={{ width: 64, height: 64 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div 
                  className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-[#9f1239]"
                  whileHover={{ width: 64, height: 64 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Interactive Overlay */}
                <motion.div 
                  className="absolute inset-2 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-0 z-10 flex items-end justify-center pb-6"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 font-mono text-xs text-white tracking-widest border border-white px-4 py-2 bg-black/50 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    INSPECT CHARACTER
                  </div>
                </motion.div>

                {/* Image */}
                {profile?.avatarUrl ? (
                  <motion.img 
                    src={profile.avatarUrl} 
                    alt="Portrait" 
                    className="w-full h-full object-cover grayscale contrast-125"
                    whileHover={{ 
                      grayscale: 0,
                      scale: 1.05,
                      transition: { duration: 0.7 }
                    }} 
                    initial={{ scale: 1 }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#111] flex items-center justify-center font-mono text-xs text-zinc-600">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      PORTRAIT LOST TO TIME
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Caption with typing animation */}
              <motion.div 
                className="mt-3 flex justify-between items-center font-mono text-[9px] md:text-[10px] text-zinc-500 tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <span>/// CHARACTER_FILE_01.JPG</span>
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-[#9f1239] rounded-full animate-pulse"></span>
                  ARCHIVED
                </span>
              </motion.div>
            </div>

            {/* Character Info Card */}
            <motion.div 
              className="bg-[#111] border border-[#333] p-4 md:p-6 space-y-4"
              variants={itemReveal}
              whileHover={{ borderColor: "#333", y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#333]">
                <h3 className="font-mono text-xs text-[#9f1239] uppercase tracking-widest">Character Data</h3>
                <div className="flex gap-1">
                  {[0, 0.2, 0.4].map(delay => (
                    <motion.span 
                      key={delay}
                      className="w-1 h-1 bg-[#9f1239] rounded-full"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { label: "STATUS:", value: "ACTIVE", color: "text-white" },
                  { label: "CLASS:", value: "FULL-STACK", color: "text-white" },
                  { label: "LEVEL:", value: "ADVANCED", color: "text-yellow-600" },
                  { label: "SPECIALTY:", value: "WEB DEV", color: "text-orange-500" },
                  { label: "LOCATION:", value: "DIGITAL REALM", color: "text-zinc-400" }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    className="flex justify-between"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 + idx * 0.1 }}
                  >
                    <span className="text-zinc-600">{item.label}</span>
                    <span className={item.color}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Animated scan line */}
              <motion.div 
                className="h-[1px] bg-gradient-to-r from-transparent via-[#9f1239] to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 2, delay: 2 }}
              />
            </motion.div>
          </motion.div>

          {/* RIGHT: Tabbed Content */}
          <motion.div className="md:col-span-7" variants={itemReveal}>
            {/* Tab Navigation with animated indicator */}
            <div className="relative mb-8">
              <div className="flex gap-2 border-b border-[#333] overflow-x-auto scrollbar-hide">
                {[
                  { id: "story", label: "Chronicle", icon: "📖" },
                  { id: "journey", label: "Journey", icon: "⏳" },
                  { id: "arsenal", label: "Arsenal", icon: "⚔️" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 md:px-6 py-3 font-mono text-xs md:text-sm uppercase tracking-wider transition-all whitespace-nowrap relative z-10 ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-zinc-600 hover:text-white hover:bg-[#111]'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Animated underline */}
              <motion.div 
                className="absolute bottom-0 h-[2px] bg-[#9f1239]"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "story" && (
                <motion.div
                  key="story"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  <motion.div 
                    className="prose prose-invert prose-lg max-w-none text-zinc-400 font-serif leading-loose"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="first-letter:text-7xl first-letter:font-display first-letter:float-left first-letter:pr-4 first-letter:pt-2 first-letter:text-white first-letter:leading-none">
                      {profile?.about || "The story begins in shadows, where code meets creativity. A developer's journey through the digital realm, crafting experiences one line at a time."}
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "journey" && (
                <motion.div
                  key="journey"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {experience && experience.length > 0 ? (
                    <div className="space-y-0 border-l-2 border-[#333] pl-8 relative">
                      {experience.map((exp, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.15 }}
                          className="pb-12 relative group"
                        >
                          {/* Animated Timeline Dot */}
                          <motion.span 
                            className="absolute -left-[37px] top-2 w-4 h-4 bg-[#0c0c0c] border-2 border-[#333] rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.5, borderColor: "#9f1239" }}
                            transition={{ type: "spring" }}
                          >
                            <span className="w-1.5 h-1.5 bg-[#9f1239] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.span>

                          {/* Pulsing effect */}
                          <motion.div 
                            className="absolute -left-[37px] top-2 w-4 h-4 rounded-full border border-[#9f1239]"
                            animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: idx * 0.5 }}
                          />

                          {/* Content Card */}
                          <motion.div 
                            className="bg-[#111] border border-[#333] p-4 md:p-6"
                            whileHover={{ borderColor: "#9f1239", y: -5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <span className="font-mono text-[10px] text-[#9f1239] tracking-widest uppercase">
                                {exp.year}
                              </span>
                              <span className="font-mono text-[9px] text-zinc-600 border border-[#333] px-2 py-1">
                                ENTRY #{String(idx + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <motion.h3 
                              className="text-xl md:text-2xl font-display text-white mb-2"
                              whileHover={{ color: "#9f1239" }}
                              transition={{ duration: 0.2 }}
                            >
                              {exp.role}
                            </motion.h3>
                            <p className="text-zinc-500 italic font-serif text-sm md:text-base">
                              {exp.company}
                            </p>
                            
                            {/* Animated underline on hover */}
                            <motion.div 
                              className="h-[1px] bg-gradient-to-r from-[#9f1239] to-transparent"
                              initial={{ width: 0 }}
                              whileHover={{ width: "100%" }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-[#333] rounded">
                      <p className="text-zinc-600 font-mono text-xs">No journey data recorded yet.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "arsenal" && (
                <motion.div
                  key="arsenal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
                >
                  {skills?.map((skill, idx) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    const skillLevel = typeof skill === 'string' ? "Intermediate" : skill.level;

                    let levelColor = "text-zinc-500";
                    let borderColor = "border-[#333]";
                    
                    if (skillLevel === "Beginner") { levelColor = "text-zinc-500"; }
                    if (skillLevel === "Intermediate") { levelColor = "text-yellow-600"; borderColor = "hover:border-yellow-600/50"; }
                    if (skillLevel === "Advanced") { levelColor = "text-orange-500"; borderColor = "hover:border-orange-500/50"; }
                    if (skillLevel === "Master") { levelColor = "text-[#9f1239]"; borderColor = "hover:border-[#9f1239]"; }

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, type: "spring" }}
                        whileHover={{ scale: 1.05, borderColor: borderColor.replace('hover:', '') }}
                        className={`bg-[#111] border ${borderColor} p-4 group transition-all relative overflow-hidden`}
                      >
                        {/* Subtle background glow on hover */}
                        <motion.div 
                          className="absolute inset-0 opacity-0"
                          style={{ 
                            background: `radial-gradient(circle at center, ${levelColor.replace('text-', '').replace(/-\d+/, '')}20, transparent 70%)` 
                          }}
                          whileHover={{ opacity: 0.1 }}
                        />
                        
                        <div className="font-mono text-[9px] text-zinc-600 mb-2">SKILL #{String(idx + 1).padStart(2, '0')}</div>
                        <h4 className={`font-display text-sm md:text-base font-bold mb-1 ${levelColor} relative z-10`}>
                          {skillName}
                        </h4>
                        <div className="font-mono text-[8px] text-zinc-600 uppercase">
                          {skillLevel}
                        </div>
                        
                        {/* Animated level indicator */}
                        <motion.div 
                          className="h-[2px] mt-2"
                          style={{ 
                            background: levelColor.replace('text-', '').includes('zinc') ? '#333' : 
                                      levelColor.replace('text-', '').includes('yellow') ? '#d97706' :
                                      levelColor.replace('text-', '').includes('orange') ? '#c2410c' : '#9f1239'
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: skillLevel === "Beginner" ? "30%" : 
                                           skillLevel === "Intermediate" ? "60%" : 
                                           skillLevel === "Advanced" ? "85%" : "100%" }}
                          transition={{ delay: 0.8 + idx * 0.05, duration: 0.5 }}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Zoomed Image Modal */}
        <AnimatePresence>
          {isZoomed && profile?.avatarUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-[#0c0c0c]/98 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
              onClick={() => setIsZoomed(false)}
            >
              <motion.button 
                className="absolute top-4 md:top-8 right-4 md:right-8 font-mono text-[10px] md:text-xs text-[#9f1239] hover:text-white border border-[#9f1239] hover:bg-[#9f1239] px-3 md:px-4 py-2 transition-all z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                [ ESC ]
              </motion.button>
              <motion.div
                initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.9, opacity: 0, rotate: 2 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={profile.avatarUrl} 
                  alt="Full Portrait" 
                  className="max-h-[85vh] w-auto border-2 border-[#9f1239] shadow-[0_0_80px_rgba(159,18,57,0.5)]" 
                />
                
                {/* Animated border glow */}
                <motion.div 
                  className="absolute inset-0 border-2 border-transparent"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(159, 18, 57, 0.3)",
                      "0 0 40px rgba(159, 18, 57, 0.5)",
                      "0 0 20px rgba(159, 18, 57, 0.3)"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
}