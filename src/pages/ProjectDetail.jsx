/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

// ========== FLOATING ORBS BACKGROUND ==========
const FloatingOrbs = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
    };
    
    resize();
    window.addEventListener('resize', resize);

    const orbs = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 100 + 50,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.5 ? '#9f1239' : '#c2410c'
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius || orb.x > canvas.width + orb.radius) orb.vx *= -1;
        if (orb.y < -orb.radius || orb.y > canvas.height + orb.radius) orb.vy *= -1;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color + '08');
        gradient.addColorStop(1, orb.color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => animate(), 300);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40" style={{ zIndex: 0 }} />;
};

// ========== CHAPTER HEADER ==========
const ChapterHeader = ({ projectNumber, projectName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="h-px bg-gradient-to-r from-transparent via-[var(--color-crimson)] to-transparent mb-8"
      />
      
      <div className="inline-block relative">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="font-mono text-xs tracking-[0.5em] text-[var(--color-crimson)] uppercase block mb-4"
        >
          Chapter {projectNumber}
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-display text-4xl md:text-6xl text-[var(--color-paper)] mb-6 leading-tight px-4"
        >
          {projectName}
        </motion.h1>
        
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="h-1 bg-[var(--color-crimson)] mx-auto"
          style={{ width: '80px' }}
        />
      </div>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.2, delay: 1 }}
        className="h-px bg-gradient-to-r from-transparent via-[var(--color-crimson)] to-transparent mt-8"
      />
    </motion.div>
  );
};

// ========== STORY SECTION ==========
const StorySection = ({ title, children, icon, delay = 0 }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className="mb-20"
    >
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.6 }}
          className="text-4xl"
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <h2 className="font-display text-2xl md:text-3xl text-[var(--color-paper)] mb-2">{title}</h2>
          <div className="h-px bg-gradient-to-r from-[var(--color-crimson)] to-transparent" />
        </div>
      </div>
      
      <div className="pl-0 md:pl-16">
        {children}
      </div>
    </motion.section>
  );
};

// ========== IMAGE SHOWCASE ==========
const ImageShowcase = ({ image, alt, onZoom }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onZoom}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-2xl">
        <motion.img
          src={image}
          alt={alt}
          className="w-full h-auto"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6 }}
        />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
          animate={{ opacity: isHovered ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-0 right-0 text-center"
            >
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[var(--color-paper)] font-mono text-sm">
                <span>Click to expand</span>
                <span className="text-lg">🔍</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative corners */}
      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[var(--color-crimson)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[var(--color-crimson)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[var(--color-crimson)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[var(--color-crimson)] opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

// ========== TECH STACK CARDS ==========
const TechStack = ({ technologies }) => {
  if (!technologies || technologies.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {technologies.map((tech, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: idx * 0.1,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 10px 40px rgba(159, 18, 57, 0.3)",
            y: -5
          }}
          className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[var(--color-border)] rounded-xl p-6 text-center group cursor-pointer overflow-hidden"
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />

          <div className="relative z-10">
            <div className="text-3xl mb-3 filter grayscale group-hover:grayscale-0 transition-all">
              💎
            </div>
            <span className="font-mono text-sm text-[var(--color-muted)] group-hover:text-[var(--color-paper)] transition-colors">
              {tech}
            </span>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--color-crimson)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}
    </div>
  );
};

// ========== NARRATIVE TEXT ==========
const NarrativeText = ({ text }) => {
  if (!text) return null;
  
  const paragraphs = text.split('\n').filter(p => p.trim());

  return (
    <div className="space-y-6 text-zinc-300 leading-relaxed">
      {paragraphs.map((paragraph, idx) => (
        <motion.p
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="text-base md:text-lg font-serif first:indent-0"
          style={{ textIndent: idx === 0 ? '0' : '2rem' }}
        >
          <span className="text-[var(--color-crimson)] text-2xl leading-none">❝</span>
          {paragraph}
          <span className="text-[var(--color-crimson)] text-2xl leading-none">❞</span>
        </motion.p>
      ))}
    </div>
  );
};

// ========== NAVIGATION CARD ==========
const NavigationCard = ({ direction, projectIndex, totalProjects, projects }) => {
  const isNext = direction === "next";
  const isDisabled = (isNext && projectIndex >= totalProjects - 1) || (!isNext && projectIndex <= 0);
  
  if (isDisabled) return null;

  const targetIndex = isNext ? projectIndex + 1 : projectIndex - 1;
  const targetProject = projects[targetIndex];

  return (
    <Link to={`/project/${targetIndex}`}>
      <motion.div
        whileHover={{ x: isNext ? 10 : -10, scale: 1.02 }}
        className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[var(--color-border)] hover:border-[var(--color-crimson)] rounded-xl p-6 overflow-hidden cursor-pointer transition-all"
      >
        <div className={`flex items-center gap-4 ${isNext ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="flex-1">
            <span className="font-mono text-xs text-[var(--color-muted)] block mb-2">
              {isNext ? "Next Chapter" : "Previous Chapter"}
            </span>
            <span className="font-display text-lg text-[var(--color-paper)] group-hover:text-[var(--color-crimson)] transition-colors line-clamp-1">
              {targetProject?.name || `Project ${targetIndex + 1}`}
            </span>
          </div>
          <motion.div
            animate={{ x: isNext ? [0, 5, 0] : [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl text-[var(--color-crimson)]"
          >
            {isNext ? "→" : "←"}
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[var(--color-crimson)]/0 via-[var(--color-crimson)]/5 to-[var(--color-crimson)]/0"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </Link>
  );
};

// ========== IMAGE ZOOM MODAL ==========
const ImageZoomModal = ({ image, alt, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 cursor-zoom-out"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-[var(--color-paper)] text-2xl transition-all z-50"
      >
        ✕
      </button>

      <motion.img
        src={image}
        alt={alt}
        initial={{ scale: 0.9, rotateY: -10 }}
        animate={{ scale: 1, rotateY: 0 }}
        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========
export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = usePortfolio();
  const [isZoomed, setIsZoomed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[var(--color-crimson)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-sm text-[var(--color-muted)]">Loading chapter...</p>
        </motion.div>
      </div>
    );
  }

  const projectIndex = parseInt(id);
  const project = data?.projects?.[projectIndex];
  const projects = data?.projects || [];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-paper)] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <span className="text-6xl mb-6 block">📖</span>
          <h1 className="font-display text-3xl mb-4">Chapter Not Found</h1>
          <p className="text-[var(--color-muted)] mb-8">This story hasn't been written yet.</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-6 py-3 bg-[var(--color-crimson)] text-[var(--color-paper)] font-medium rounded-lg hover:bg-[#7f0e2a] transition-colors"
          >
            Return to Library
          </button>
        </motion.div>
      </div>
    );
  }

  const projectNumber = projectIndex + 1;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-paper)] relative overflow-hidden">
        <FloatingOrbs />

        <AnimatePresence>
          {isZoomed && project.image && (
            <ImageZoomModal
              image={project.image}
              alt={project.name}
              onClose={() => setIsZoomed(false)}
            />
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <motion.div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[var(--color-crimson)] to-[var(--color-gold)] z-50"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="relative z-10">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-6xl mx-auto px-6 pt-8 pb-4"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-paper)] font-mono text-sm transition-colors group"
            >
              <motion.span
                animate={{ x: [-2, 0, -2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ←
              </motion.span>
              <span>Back to Library</span>
            </Link>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-6 py-12">
            <ChapterHeader
              projectNumber={projectNumber}
              projectName={project.name}
            />

            {/* Opening Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mb-20 max-w-3xl mx-auto px-4"
            >
              <p className="font-serif italic text-xl text-[var(--color-muted)] leading-relaxed">
                "Every great project begins with a vision and evolves through dedication, 
                creativity, and countless iterations."
              </p>
              <div className="mt-6 flex justify-center gap-2">
                {[1, 2, 3].map((dot) => (
                  <motion.div
                    key={dot}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      delay: dot * 0.2,
                      repeat: Infinity
                    }}
                    className="w-1 h-1 rounded-full bg-[var(--color-crimson)]"
                  />
                ))}
              </div>
            </motion.div>

            {/* Visual Showcase */}
            <StorySection title="Visual Chronicle" icon="🎨" delay={0.1}>
              {project.image ? (
                <ImageShowcase
                  image={project.image}
                  alt={project.name}
                  onZoom={() => setIsZoomed(true)}
                />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-[var(--color-border)] flex items-center justify-center">
                  <span className="font-mono text-[var(--color-muted)]">No preview available</span>
                </div>
              )}
            </StorySection>

            {/* Project Story */}
            <StorySection title="The Journey" icon="📜" delay={0.2}>
              {project.description ? (
                <NarrativeText text={project.description} />
              ) : (
                <p className="text-[var(--color-muted)] italic text-center py-12">
                  The story of this project is yet to be told...
                </p>
              )}
            </StorySection>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <StorySection title="Crafted With" icon="⚙️" delay={0.3}>
                <TechStack technologies={project.technologies} />
              </StorySection>
            )}

            {/* Project Link */}
            {project.link && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center my-20"
              >
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--color-crimson)] to-[var(--color-gold)] text-[var(--color-paper)] font-display text-lg rounded-full shadow-lg shadow-[#9f1239]/30 hover:shadow-[#9f1239]/50 transition-all"
                >
                  <span>Experience Live</span>
                  <span className="text-2xl">🚀</span>
                </motion.a>
              </motion.div>
            )}

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 pt-12 border-t border-[var(--color-border)]"
            >
              <NavigationCard
                direction="prev"
                projectIndex={projectIndex}
                totalProjects={projects.length}
                projects={projects}
              />
              <NavigationCard
                direction="next"
                projectIndex={projectIndex}
                totalProjects={projects.length}
                projects={projects}
              />
            </motion.div>

            {/* Closing */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-20 pb-12"
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="h-px bg-gradient-to-r from-transparent via-[var(--color-crimson)] to-transparent mb-12"
              />
              
              <p className="font-serif italic text-[var(--color-muted)] mb-8">
                "Thank you for reading this chapter of my journey."
              </p>
              
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-crimson)] hover:text-[var(--color-paper)] transition-colors"
              >
                <span>Let's create something together</span>
                <span>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}