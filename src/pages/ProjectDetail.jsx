import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

// === CANVAS: FLOATING CODE SNIPPETS EFFECT ===
const CodeParticles = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
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

    class CodeParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.speedY = (Math.random() - 0.5) * 0.1;
        this.color = Math.random() > 0.5 ? '#9f1239' : '#c2410c';
        this.alpha = Math.random() * 0.2 + 0.05;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.text = ['</>', '{ }', '=>', '[]', '()'][Math.floor(Math.random() * 5)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulsePhase += this.pulseSpeed;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        ctx.font = `${this.size * 4}px monospace`;
        ctx.globalAlpha = this.alpha * pulse;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
      }
    }

    const particleCount = window.innerWidth < 768 ? 15 : 25;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new CodeParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(p => {
        p.update();
        p.draw();
      });

      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = '#9f1239';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
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
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-15"
    />
  );
};

// === ANIMATION VARIANTS ===
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 }
  }
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

// === TECH STACK COMPONENT ===
const TechStackDisplay = ({ technologies }) => {
  if (!technologies || technologies.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display text-white">Technologies Used</h3>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.5
            }
          }
        }}
      >
        {technologies.map((tech, idx) => (
          <motion.div
            key={idx}
            variants={techBadgeVariant}
            whileHover={{ 
              scale: 1.05, 
              borderColor: "#9f1239",
              transition: { duration: 0.2 }
            }}
            className="bg-[#111] border border-[#333] p-4 transition-all relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#9f1239] rounded-full"></div>
                <div className="font-mono text-xs text-zinc-500">
                  TECH #{idx + 1}
                </div>
              </div>
              <div className="font-display text-base text-white group-hover:text-[#9f1239] transition-colors">
                {tech}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// === ZOOM MODAL COMPONENT ===
const ZoomModal = ({ image, alt, onClose }) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out overflow-auto"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 bg-black/50 text-white px-4 py-2 font-mono text-sm border border-white/20 hover:bg-[#9f1239] hover:border-[#9f1239] transition-all rounded z-50"
        onClick={onClose}
      >
        Close [ESC]
      </button>
      <motion.img 
        src={image} 
        alt={alt} 
        className="max-h-[90vh] w-auto max-w-full object-contain border-2 border-[#9f1239] shadow-2xl cursor-default"
        initial={{ scale: 0.9, rotate: -1 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.9, rotate: 1 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

// === PROJECT DETAIL MAIN COMPONENT ===
export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = usePortfolio();
  
  const [isZoomed, setIsZoomed] = useState(false);
  const [canvasLoaded, setCanvasLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setCanvasLoaded(true), 600);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0c0c]">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#9f1239] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-sm text-zinc-500">Loading project details...</p>
        </motion.div>
      </div>
    );
  }

  const projectIndex = parseInt(id);
  const project = data?.projects?.[projectIndex];

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#0c0c0c] text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <h1 className="text-3xl font-display font-bold mb-4 text-[#9f1239]">Project Not Found</h1>
          <p className="text-zinc-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-6 py-3 bg-[#9f1239] text-white font-medium rounded-lg hover:bg-[#7f0e2a] transition-colors"
          >
            Back to Projects
          </button>
        </motion.div>
      </div>
    );
  }

  const technologies = project.technologies || [];
  const projectNumber = projectIndex + 1;

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 pt-24 md:pt-32 px-4 md:px-8 bg-[#0c0c0c] overflow-hidden relative">
        {/* Canvas Background */}
        {canvasLoaded && <CodeParticles />}

        {/* Zoom Modal */}
        <AnimatePresence>
          {isZoomed && project.image && (
            <ZoomModal 
              image={project.image} 
              alt={project.name}
              onClose={() => setIsZoomed(false)}
            />
          )}
        </AnimatePresence>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-8 relative z-10"
        >
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-medium transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to all projects
          </Link>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header Section */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-12"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <div className="inline-flex items-center gap-2 bg-[#9f1239]/10 border border-[#9f1239]/30 px-3 py-1 rounded-full mb-4">
                <div className="w-2 h-2 bg-[#9f1239] rounded-full animate-pulse"></div>
                <span className="font-mono text-xs text-[#9f1239]">
                  PROJECT #{projectNumber}
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h1 className="text-3xl md:text-5xl font-display text-white mb-4">
                {project.name}
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-[#9f1239] to-transparent"></div>
            </motion.div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Left Column - Image & Description */}
            <motion.div 
              className="lg:col-span-8 space-y-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {/* Project Image - FIXED ZOOM */}
              <motion.div variants={scaleIn} className="group">
                <div 
                  className="border-2 border-[#333] rounded-lg overflow-hidden bg-[#111] relative cursor-zoom-in"
                  onClick={() => project.image && setIsZoomed(true)}
                >
                  {project.image ? (
                    <>
                      <img 
                        src={project.image} 
                        alt={project.name}
                        className="w-full h-auto object-contain hover:opacity-90 transition-opacity" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <span className="text-white text-sm font-mono bg-black/50 px-3 py-2 rounded border border-white/20">
                          Click to zoom
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-64 md:h-80 flex items-center justify-center text-zinc-600 font-mono border-dashed border-2 border-[#333]">
                      [ No project image available ]
                    </div>
                  )}
                </div>
                {project.image && (
                  <p className="text-center text-sm text-zinc-500 mt-2">
                    Click image to view full size
                  </p>
                )}
              </motion.div>

              {/* Project Description */}
              <motion.div variants={slideInLeft} className="space-y-6">
                <div className="border-l-4 border-[#9f1239] pl-4">
                  <h2 className="text-2xl font-display text-white mb-4">About This Project</h2>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {project.description ? (
                    <div className="text-zinc-300 leading-relaxed space-y-4">
                      {project.description.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-[#333] rounded-lg">
                      <p className="text-zinc-500">No description provided for this project</p>
                      <p className="text-zinc-600 text-sm mt-1">
                        Add a description in the admin panel
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Technologies Section */}
              {technologies.length > 0 && (
                <motion.div variants={slideInLeft} className="pt-8 border-t border-[#333]">
                  <TechStackDisplay technologies={technologies} />
                </motion.div>
              )}
            </motion.div>

            {/* Right Column - Project Info Sidebar */}
            <motion.div 
              className="lg:col-span-4 space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {/* Project Info Card */}
              <motion.div variants={slideInRight} className="bg-[#111] border border-[#333] rounded-lg p-6">
                <h3 className="text-xl font-display text-white mb-6 pb-3 border-b border-[#333]">
                  Project Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">Status</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">Completed</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">Technologies Used</div>
                    <div className="text-white font-medium">
                      {technologies.length} different technologies
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">Project Link</div>
                    {project.link ? (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#9f1239] hover:text-[#7f0e2a] font-medium break-all block"
                      >
                        Visit Live Project →
                      </a>
                    ) : (
                      <span className="text-zinc-600">No live link available</span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Tech Stats Card */}
              {technologies.length > 0 && (
                <motion.div variants={slideInRight} className="bg-[#111] border border-[#333] rounded-lg p-6">
                  <h3 className="text-xl font-display text-white mb-6 pb-3 border-b border-[#333]">
                    Technology Overview
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-zinc-500">Technologies Used</div>
                        <div className="text-2xl font-display text-[#9f1239]">{technologies.length}</div>
                      </div>
                      <div className="h-1 bg-[#333] rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#9f1239]"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.8, duration: 1 }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-display text-white">{technologies.length}</div>
                        <div className="text-xs text-zinc-500">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-display text-[#9f1239]">
                          {Math.min(technologies.length, 5)}
                        </div>
                        <div className="text-xs text-zinc-500">Featured</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Card */}
              <motion.div variants={slideInRight} className="bg-[#111] border border-[#333] rounded-lg p-6">
                <h3 className="text-xl font-display text-white mb-4">More Projects</h3>
                
                <div className="space-y-3">
                  <p className="text-zinc-400 text-sm">
                    Check out my other work to see more of what I can do.
                  </p>
                  
                  <Link
                    to="/projects"
                    className="block w-full text-center py-3 bg-[#9f1239] text-white font-medium rounded-lg hover:bg-[#7f0e2a] transition-colors"
                  >
                    View All Projects
                  </Link>
                  
                  {projectIndex > 0 && (
                    <Link
                      to={`/project/${projectIndex - 1}`}
                      className="block w-full text-center py-3 border border-[#333] text-zinc-400 rounded-lg hover:border-[#9f1239] hover:text-white transition-all"
                    >
                      Previous Project
                    </Link>
                  )}
                  
                  {data?.projects && projectIndex < data.projects.length - 1 && (
                    <Link
                      to={`/project/${projectIndex + 1}`}
                      className="block w-full text-center py-3 border border-[#333] text-zinc-400 rounded-lg hover:border-[#9f1239] hover:text-white transition-all"
                    >
                      Next Project
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Project Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-16 pt-8 border-t border-[#333]"
          >
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-display text-white mb-4">Project Summary</h3>
              <p className="text-zinc-400 mb-6">
                {project.description 
                  ? `${project.description.substring(0, 150)}...` 
                  : "This project showcases my skills in web development and problem-solving."}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#9f1239] text-white font-medium rounded-lg hover:bg-[#7f0e2a] transition-colors"
                  >
                    Visit Live Project
                  </a>
                )}
                <Link
                  to="/contact"
                  className="px-6 py-3 border-2 border-[#333] text-white font-medium rounded-lg hover:border-[#9f1239] transition-all"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}