import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import Button from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

// --- CANVAS BACKGROUND EFFECT ---
const TechParticles = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationRef = useRef(null);

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

    class TechParticle {
      constructor() {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.3;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.color = Math.random() > 0.5 ? '#9f1239' : '#c2410c';
        this.alpha = Math.random() * 0.3 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.pulsePhase += this.pulseSpeed;
        
        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.globalAlpha = this.alpha * pulse;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = window.innerWidth < 768 ? 20 : 35;
    for (let i = 0; i < particleCount; i++) {
      particles.current.push(new TechParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connection lines
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = '#9f1239';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i];
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const startTimer = setTimeout(() => animate(), 500);

    return () => {
      clearTimeout(startTimer);
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-25"
    />
  );
};

// --- ANIMATION VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "circOut" },
  },
};

const lineWipe = {
  hidden: { scaleX: 0, originX: 0 },
  show: { scaleX: 1, originX: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
};

const techBadgeVariant = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 15 }
  }
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = usePortfolio();
  
  const [isZoomed, setIsZoomed] = useState(false);
  const [canvasLoaded, setCanvasLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setCanvasLoaded(true), 800);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0c0c0c]"></div>;

  const projectIndex = parseInt(id);
  const project = data?.projects?.[projectIndex];

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#0c0c0c] text-[#e5e5e5]">
        <h1 className="text-3xl font-display font-bold mb-4 text-[#9f1239]">ARCHIVE NOT FOUND</h1>
        <Button onClick={() => navigate("/projects")}>RETURN TO LIST</Button>
      </div>
    );
  }

  const technologies = project.technologies || [];

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 pt-24 md:pt-32 px-4 md:px-12 bg-[#0c0c0c] overflow-hidden relative">
        
        {/* Canvas Background */}
        {canvasLoaded && <TechParticles />}

        {/* Header Section */}
        <motion.div 
          className="max-w-6xl mx-auto mb-8 md:mb-12 pb-6 md:pb-8 relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-[1px] bg-[#333]"
            variants={lineWipe}
          />

          <motion.div variants={fadeInUp}>
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 mb-4 md:mb-6 font-mono text-[10px] md:text-xs text-zinc-500 hover:text-[#9f1239] transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              BACK TO ARCHIVES
            </Link>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
            <div className="flex-1">
              <div className="font-mono text-[10px] md:text-xs text-[#9f1239] tracking-[0.2em] mb-2 uppercase">
                Project File #{String(projectIndex + 1).padStart(2, '0')}
              </div>
              <h1 className="text-3xl md:text-6xl font-display font-bold text-[#e5e5e5] leading-tight break-words">
                {project.name}
              </h1>
            </div>
            
            {/* Desktop CTA */}
            <div className="hidden md:block flex-shrink-0">
              {project.link ? (
                <a href={project.link} target="_blank" rel="noreferrer">
                  <Button className="shadow-[0_0_20px_rgba(159,18,57,0.3)] whitespace-nowrap">
                    LAUNCH SYSTEM ↗
                  </Button>
                </a>
              ) : (
                <span className="font-mono text-xs text-zinc-600 border border-[#333] px-4 py-2 inline-block">
                  [ OFFLINE ]
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          {/* Image Section */}
          <motion.div variants={fadeInUp} className="max-w-6xl mx-auto mb-12 md:mb-16 relative group">
            {/* Decorative Corners */}
            {[
              '-top-1 -left-1 border-t border-l',
              '-top-1 -right-1 border-t border-r',
              '-bottom-1 -left-1 border-b border-l',
              '-bottom-1 -right-1 border-b border-r'
            ].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-4 h-4 border-[#9f1239]`}></div>
            ))}
            
            <div className="bg-[#111] border border-[#333] p-2 md:p-4 rounded-sm overflow-hidden relative">
              <div className="absolute top-4 md:top-6 right-4 md:right-6 z-10 font-mono text-[9px] md:text-[10px] bg-black/70 backdrop-blur px-2 py-1 text-white border border-white/20">
                VISUAL_OUTPUT.JPG
              </div>
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.name} 
                  onClick={() => setIsZoomed(true)} 
                  className="w-full h-auto object-contain cursor-zoom-in hover:opacity-95 transition-opacity shadow-2xl" 
                />
              ) : (
                <div className="w-full h-48 md:h-64 flex items-center justify-center bg-[#0c0c0c] text-zinc-600 font-mono text-xs border border-dashed border-[#333]">
                  [ NO VISUAL DATA AVAILABLE ]
                </div>
              )}
            </div>
            <p className="mt-2 text-center font-mono text-[9px] md:text-[10px] text-zinc-600 uppercase tracking-widest">
              /// CLICK IMAGE TO INSPECT
            </p>
          </motion.div>

          {/* Content Grid */}
          <motion.div variants={fadeInUp} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            
            {/* LEFT: Description */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-xl md:text-2xl text-white mb-4 md:mb-6 border-l-4 border-[#9f1239] pl-4">
                  Report Analysis
                </h2>
                <div className="prose prose-invert prose-sm md:prose-lg text-zinc-400 font-serif leading-relaxed whitespace-pre-line">
                  {project.description || "Data deskripsi tidak tersedia dalam arsip ini."}
                </div>
              </div>

              {/* Technologies Section */}
              {technologies.length > 0 && (
                <div>
                  <h2 className="font-display text-xl md:text-2xl text-white mb-4 md:mb-6 border-l-4 border-[#c2410c] pl-4">
                    Tech Arsenal
                  </h2>
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.6
                        }
                      }
                    }}
                  >
                    {technologies.map((tech, techIdx) => (
                      <motion.div
                        key={techIdx}
                        variants={techBadgeVariant}
                        whileHover={{ 
                          scale: 1.05, 
                          borderColor: "#9f1239",
                          transition: { duration: 0.2 }
                        }}
                        className="group bg-[#111] border border-[#333] p-3 md:p-4 transition-all relative overflow-hidden"
                      >
                        {/* Background glow on hover */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-radial from-[#9f1239]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        
                        <div className="relative z-10">
                          <div className="font-mono text-[8px] md:text-[9px] text-zinc-600 mb-1">
                            TECH #{String(techIdx + 1).padStart(2, '0')}
                          </div>
                          <div className="font-display text-sm md:text-base font-bold text-[#e5e5e5] group-hover:text-[#9f1239] transition-colors">
                            {tech}
                          </div>
                          
                          {/* Animated indicator line */}
                          <motion.div 
                            className="h-[2px] bg-[#9f1239] mt-2"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 + techIdx * 0.05, duration: 0.4 }}
                          />
                        </div>
                        
                        {/* Corner accent */}
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#333] group-hover:border-[#9f1239] transition-colors" />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </div>

            {/* RIGHT: Status Card */}
            <div className="md:col-span-1 space-y-6 md:space-y-8">
              <div className="border border-[#333] p-4 md:p-6 bg-[#0c0c0c]">
                <h3 className="font-mono text-[10px] md:text-xs text-[#9f1239] uppercase tracking-widest mb-4 border-b border-[#333] pb-2">
                  Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="block font-serif text-zinc-500 text-xs md:text-sm italic mb-1">Deployed at:</span>
                    {project.link ? (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-white hover:text-[#9f1239] hover:underline break-all font-mono text-[10px] md:text-xs block"
                      >
                        {new URL(project.link).hostname}
                      </a>
                    ) : (
                      <span className="text-zinc-600 font-mono text-[10px] md:text-xs">Localhost / Offline</span>
                    )}
                  </div>
                  
                  {/* Mobile CTA */}
                  <div className="md:hidden pt-4">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer">
                        <Button className="w-full text-xs">OPEN LINK ↗</Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Tech Count Info */}
              {technologies.length > 0 && (
                <div className="border border-[#333] p-4 md:p-6 bg-[#0c0c0c]">
                  <h3 className="font-mono text-[10px] md:text-xs text-[#c2410c] uppercase tracking-widest mb-3">
                    Tech Summary
                  </h3>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl md:text-5xl font-display text-[#9f1239] leading-none">
                      {technologies.length}
                    </div>
                    <div className="font-serif text-xs md:text-sm text-zinc-500 italic pb-1">
                      technologies<br/>deployed
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Zoomed Image Modal */}
        <AnimatePresence>
          {isZoomed && project.image && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out overflow-auto" 
              onClick={() => setIsZoomed(false)}
            >
              <motion.button 
                className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 font-mono text-[10px] md:text-xs border border-white/20 hover:bg-[#9f1239] hover:border-[#9f1239] transition-all"
                whileTap={{ scale: 0.95 }}
              >
                [ CLOSE ]
              </motion.button>
              <motion.img 
                src={project.image} 
                alt="Zoomed" 
                className="max-h-[90vh] w-auto max-w-full object-contain border-2 border-[#9f1239] shadow-[0_0_80px_rgba(159,18,57,0.4)]" 
                initial={{ scale: 0.9, rotate: -2 }} 
                animate={{ scale: 1, rotate: 0 }} 
                exit={{ scale: 0.9, rotate: 2 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}