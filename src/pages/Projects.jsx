import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

// === CANVAS: OPTIMIZED PARTICLE NETWORK ===
const ParticleNetwork = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const mouseActive = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class NetworkParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.6 ? '#9f1239' : '#c2410c';
        this.alpha = Math.random() * 0.5 + 0.3;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        // Mouse attraction
        if (mouseActive.current) {
          const dx = mousePos.current.x - this.x;
          const dy = mousePos.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150 * 0.5;
            this.speedX += (dx / distance) * force * 0.02;
            this.speedY += (dy / distance) * force * 0.02;
          }
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.pulsePhase += this.pulseSpeed;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Friction
        this.speedX *= 0.99;
        this.speedY *= 0.99;
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.globalAlpha = this.alpha * pulse;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        if (this.color === '#9f1239') {
          ctx.beginPath();
          ctx.globalAlpha = this.alpha * pulse * 0.2;
          ctx.fillStyle = this.color;
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Initialize particles
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    for (let i = 0; i < particleCount; i++) {
      particles.current.push(new NetworkParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connections
      ctx.globalAlpha = 0.08;
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i];
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = (150 - distance) / 150;
            ctx.globalAlpha = opacity * 0.1;
            ctx.strokeStyle = '#9f1239';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      mouseActive.current = true;
    };

    const handleMouseLeave = () => {
      mouseActive.current = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const startTimer = setTimeout(() => animate(), 600);

    return () => {
      clearTimeout(startTimer);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto z-0 opacity-30"
    />
  );
};

// === ENHANCED ANIMATION VARIANTS ===
// Header animations
const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: "circOut"
    }
  }
};

// Controls animations
const controlsContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
      staggerChildren: 0.1
    }
  }
};

const controlItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "backOut"
    }
  }
};

// Project cards animations
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.12,
      delayChildren: 0.5
    }
  }
};

const projectCardVariant = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.92,
    rotateX: -10
  },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Stats footer animation
const statsVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.8,
      staggerChildren: 0.1
    }
  }
};

const statItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
};

export default function Projects() {
  const { data, loading } = usePortfolio();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filterTech, setFilterTech] = useState("all");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-display text-xl tracking-[0.5em] text-white"
        >
          LOADING ARCHIVES...
        </motion.div>
      </div>
    );
  }

  const projects = data?.projects || [];
  const allTechs = [...new Set(projects.flatMap(p => p.technologies || []))];

  const filteredProjects =
    filterTech === "all"
      ? projects
      : projects.filter(p => p.technologies?.includes(filterTech));

  return (
    <PageTransition>
      <ParticleNetwork />

      <section className="min-h-screen py-8 md:py-16 relative">
        
        {/* === HEADER WITH STAGGERED ANIMATION === */}
        <div className="mb-12 md:mb-16 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="relative"
          >
            {/* Decorative corner elements */}
            <motion.div 
              className="absolute -left-4 -top-4 w-8 h-8 border-l-2 border-t-2 border-[#9f1239]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
            <motion.div 
              className="absolute -right-4 -top-4 w-8 h-8 border-r-2 border-t-2 border-[#c2410c]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            />

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display mb-4 text-center">
              Battle Archives
              <motion.span 
                className="text-[#9f1239]"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                .
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={subtitleVariants}
            className="font-mono text-xs md:text-sm text-center text-zinc-600 tracking-[0.3em]"
          >
            /// EXPLORATION & CONQUEST RECORDS
          </motion.p>

          {/* Animated divider line */}
          <motion.div
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#9f1239] to-transparent mt-6"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.2, ease: "circOut" }}
          />
        </div>

        {/* === CONTROLS WITH STAGGERED ANIMATION === */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={controlsContainerVariants}
          className="mb-12 flex flex-col md:flex-row gap-4 md:gap-6 relative z-10"
        >
          
          {/* View Mode Toggle */}
          <motion.div 
            variants={controlItemVariants}
            className="flex-1"
          >
            <div className="font-mono text-[10px] text-zinc-600 uppercase mb-2 tracking-wider flex items-center gap-2">
              <motion.span 
                className="w-2 h-2 bg-[#9f1239] rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Display Mode
            </div>
            <div className="flex gap-2 bg-[#0c0c0c] border border-[#333] p-1">
              {["grid", "list"].map((mode) => (
                <motion.button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 py-2 px-4 font-mono text-xs uppercase transition-all ${
                    viewMode === mode
                      ? "bg-[#9f1239] text-white"
                      : "bg-transparent text-zinc-600 hover:text-white"
                  }`}
                  whileHover={{ scale: viewMode === mode ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    animate={viewMode === mode ? { opacity: [1, 0.7, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {mode === "grid" ? "█ GRID" : "≡ LIST"}
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Technology Filter */}
          <motion.div 
            variants={controlItemVariants}
            className="flex-1"
          >
            <div className="font-mono text-[10px] text-zinc-600 uppercase mb-2 tracking-wider flex items-center gap-2">
              <motion.span 
                className="w-2 h-2 bg-[#c2410c] rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              Technology Filter
            </div>
            <select
              value={filterTech}
              onChange={(e) => setFilterTech(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-[#333] text-white font-mono text-xs py-2 px-4 focus:outline-none focus:border-[#9f1239] transition-colors cursor-pointer"
            >
              <option value="all">ALL TECHNOLOGIES</option>
              {allTechs.sort().map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Project Counter */}
          <motion.div 
            variants={controlItemVariants}
            className="md:w-auto"
          >
            <div className="font-mono text-[10px] text-zinc-600 uppercase mb-2 tracking-wider flex items-center gap-2">
              <motion.span 
                className="w-2 h-2 bg-[#d97706] rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
              Results
            </div>
            <motion.div 
              className="bg-[#0c0c0c] border border-[#333] py-2 px-6 text-center"
              whileHover={{ borderColor: "#9f1239" }}
            >
              <motion.div 
                className="text-2xl font-display text-[#9f1239]"
                key={filteredProjects.length}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {filteredProjects.length}
              </motion.div>
              <div className="font-mono text-[9px] text-zinc-600">PROJECTS</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* === PROJECT CARDS WITH ENHANCED ANIMATIONS === */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            // GRID VIEW
            <motion.div
              key="grid"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10"
            >
              {filteredProjects.map((proj, idx) => (
                <motion.div
                  key={idx}
                  variants={projectCardVariant}
                  onHoverStart={() => setHoveredIndex(idx)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="group"
                >
                  <Link
                    to={`/project/${projects.indexOf(proj)}`}
                    className="block h-full"
                  >
                    <div className="border border-[#333] bg-[#0c0c0c] overflow-hidden transition-all duration-500 hover:border-[#9f1239] hover:shadow-2xl hover:shadow-[#9f1239]/10 relative flex flex-col h-full group-hover:-translate-y-1">
                      
                      {/* Corner Badge with Index */}
                      <motion.div 
                        className="absolute top-4 left-4 z-20"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + idx * 0.12, duration: 0.6, type: "spring" }}
                      >
                        <div className="w-12 h-12 border-2 border-[#333] group-hover:border-[#9f1239] bg-[#0c0c0c]/90 backdrop-blur-sm flex items-center justify-center transition-all">
                          <span className="font-mono text-sm text-[#9f1239] font-bold">
                            {String(projects.indexOf(proj) + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </motion.div>

                      {/* Project Image */}
                      <div className="aspect-[16/10] bg-[#111] overflow-hidden relative">
                        {proj.image ? (
                          <>
                            <motion.img
                              src={proj.image}
                              alt={proj.name}
                              className="w-full h-full object-cover"
                              animate={{
                                scale: hoveredIndex === idx ? 1.1 : 1,
                                filter: hoveredIndex === idx ? "grayscale(0%)" : "grayscale(70%)"
                              }}
                              transition={{ duration: 0.6, ease: "circOut" }}
                            />
                            {/* Overlay gradient */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent"
                              animate={{
                                opacity: hoveredIndex === idx ? 0.8 : 0.5
                              }}
                            />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700 font-mono text-sm">
                            [ NO VISUAL DATA ]
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <motion.h3
                          className="text-2xl md:text-3xl font-display mb-3 text-white group-hover:text-[#9f1239] transition-colors leading-tight"
                          animate={{
                            x: hoveredIndex === idx ? 5 : 0
                          }}
                        >
                          {proj.name}
                        </motion.h3>

                        <p className="text-sm text-zinc-500 font-serif leading-relaxed mb-4 line-clamp-2 flex-1">
                          {proj.description}
                        </p>

                        {/* Tech Stack */}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {proj.technologies.slice(0, 3).map((tech, techIdx) => (
                              <motion.span
                                key={techIdx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + idx * 0.12 + techIdx * 0.05 }}
                                className="inline-flex items-center px-2 py-0.5 bg-[#111] border border-[#333] text-zinc-500 font-mono text-[8px] md:text-[9px] group-hover:border-[#9f1239]/30 transition-colors"
                              >
                                {tech}
                              </motion.span>
                            ))}
                            {proj.technologies.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 text-zinc-600 font-mono text-[8px] md:text-[9px]">
                                +{proj.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Accent Line */}
                      <motion.div
                        className="h-[2px] bg-gradient-to-r from-transparent via-[#9f1239] to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: hoveredIndex === idx ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // LIST VIEW
            <motion.div
              key="list"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="space-y-3 md:space-y-0 relative z-10"
            >
              {filteredProjects.map((proj, idx) => (
                <motion.div
                  key={idx}
                  variants={projectCardVariant}
                  onHoverStart={() => setHoveredIndex(idx)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <Link
                    to={`/project/${projects.indexOf(proj)}`}
                    className="group block border border-[#333] md:border-b md:border-x-0 md:border-t-0 hover:bg-[#111] transition-all p-4 md:py-6 md:px-0 relative overflow-hidden bg-[#0c0c0c] md:bg-transparent"
                  >
                    {/* Background Glow on Hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-radial from-[#9f1239]/5 via-transparent to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredIndex === idx ? 1 : 0 }}
                    />

                    <div className="flex gap-3 md:gap-8 items-start relative z-10">
                      
                      {/* Mobile: Number Badge */}
                      <div className="flex md:hidden flex-col items-center flex-shrink-0 pt-1">
                        <motion.div 
                          className="w-10 h-10 border-2 border-[#333] group-hover:border-[#9f1239] transition-colors flex items-center justify-center"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.5 + idx * 0.12, duration: 0.6, type: "spring" }}
                        >
                          <span className="font-mono text-xs text-[#9f1239] font-bold">
                            {String(projects.indexOf(proj) + 1).padStart(2, '0')}
                          </span>
                        </motion.div>
                        <motion.div
                          className="w-[2px] h-full bg-[#333] group-hover:bg-[#9f1239] transition-colors mt-2"
                          animate={{
                            height: hoveredIndex === idx ? "100%" : "60%"
                          }}
                        />
                      </div>

                      {/* Desktop: Thumbnail */}
                      <motion.div 
                        className="hidden md:block w-48 lg:w-64 aspect-video bg-[#111] border border-[#333] overflow-hidden flex-shrink-0 group-hover:border-[#9f1239] transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.12 }}
                      >
                        {proj.image ? (
                          <motion.img
                            src={proj.image}
                            alt={proj.name}
                            className="w-full h-full object-cover"
                            animate={{
                              scale: hoveredIndex === idx ? 1.05 : 1,
                              filter: hoveredIndex === idx ? "grayscale(0%)" : "grayscale(80%)"
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700 font-mono text-xs">
                            NO IMAGE
                          </div>
                        )}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between min-h-full">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <motion.div 
                                className="hidden md:block font-mono text-[10px] text-zinc-600 mb-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + idx * 0.12 + 0.1 }}
                              >
                                FILE #{String(projects.indexOf(proj) + 1).padStart(2, '0')}
                              </motion.div>
                              <motion.h3
                                className="text-base md:text-xl lg:text-3xl font-display text-white group-hover:text-[#9f1239] transition-colors mb-1 md:mb-2 leading-tight break-words"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + idx * 0.12 + 0.2 }}
                              >
                                {proj.name}
                              </motion.h3>
                            </div>
                            <motion.div
                              className="font-mono text-xs md:text-sm text-zinc-600 group-hover:text-[#9f1239] transition-colors flex-shrink-0"
                              animate={{
                                x: hoveredIndex === idx ? 5 : 0
                              }}
                            >
                              →
                            </motion.div>
                          </div>

                          <motion.p 
                            className="text-xs md:text-sm lg:text-base text-zinc-500 font-serif leading-relaxed mb-3 line-clamp-1 md:line-clamp-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + idx * 0.12 + 0.3 }}
                          >
                            {proj.description}
                          </motion.p>
                        </div>

                        {/* Tech Tags */}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <motion.div 
                            className="flex flex-wrap gap-1.5 md:gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + idx * 0.12 + 0.4 }}
                          >
                            {proj.technologies.slice(0, 3).map((tech, techIdx) => (
                              <span
                                key={techIdx}
                                className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 bg-[#111] md:bg-[#0c0c0c] border border-[#333] text-zinc-500 font-mono text-[8px] md:text-[9px] lg:text-[10px] group-hover:border-[#9f1239]/30 transition-colors"
                              >
                                <span className="w-1 h-1 bg-[#9f1239] rounded-full mr-1 md:mr-1.5"></span>
                                {tech}
                              </span>
                            ))}
                            {proj.technologies.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 text-zinc-600 font-mono text-[8px] md:text-[9px]">
                                +{proj.technologies.length - 3}
                              </span>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar Animation */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-[#9f1239]"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredIndex === idx ? "100%" : 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* === STATS FOOTER WITH STAGGERED ANIMATION === */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={statsVariants}
          className="mt-16 pt-8 border-t border-[#333] relative z-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Projects", value: projects.length, color: "#9f1239" },
              { label: "Technologies", value: allTechs.length, color: "#c2410c" },
              { label: "Currently Showing", value: filteredProjects.length, color: "#d97706" },
              { label: "View Mode", value: viewMode.toUpperCase(), color: "#e5e5e5" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={statItemVariants}
                className="text-center group"
              >
                <motion.div
                  className="font-mono text-[9px] md:text-[10px] text-zinc-600 uppercase tracking-widest mb-2"
                  whileHover={{ color: stat.color }}
                >
                  {stat.label}
                </motion.div>
                <motion.div
                  className="text-2xl md:text-3xl font-display"
                  style={{ color: stat.color }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stat.value}
                </motion.div>
                <motion.div
                  className="h-[2px] bg-gradient-to-r from-transparent via-current to-transparent mt-2 mx-auto"
                  style={{ color: stat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ delay: 0.8 + idx * 0.1, duration: 0.8 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}