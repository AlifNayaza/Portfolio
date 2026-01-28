import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";

// === ELEGANT AMBIENT PARTICLES ===
const AmbientParticles = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse for particle interaction
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.hue = Math.random() > 0.5 ? 0 : 20; // Red or orange tint
      }

      update() {
        // Gentle floating
        this.baseX += this.speedX;
        this.baseY += this.speedY;

        // Mouse interaction - subtle attraction
        const dx = mouseRef.current.x - this.baseX;
        const dy = mouseRef.current.y - this.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.x = this.baseX + (dx * force * 0.03);
          this.y = this.baseY + (dy * force * 0.03);
        } else {
          this.x = this.baseX;
          this.y = this.baseY;
        }

        // Wrap around edges
        if (this.baseX < -50) this.baseX = canvas.width + 50;
        if (this.baseX > canvas.width + 50) this.baseX = -50;
        if (this.baseY < -50) this.baseY = canvas.height + 50;
        if (this.baseY > canvas.height + 50) this.baseY = -50;
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 80%, 50%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = window.innerWidth < 768 ? 25 : 40;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(p => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};

// === INTERACTIVE PROJECT CARD WITH 3D TILT ===
const ProjectCard = ({ project, index, totalProjects }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / (rect.width / 2));
    y.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <Link to={`/project/${index}`} className="block h-full group">
        <motion.div
          style={{ 
            rotateX: window.innerWidth > 768 ? rotateX : 0, 
            rotateY: window.innerWidth > 768 ? rotateY : 0,
            transformStyle: "preserve-3d"
          }}
          className="relative h-full bg-[var(--color-bg)] border border-[var(--color-border)] overflow-hidden transition-all duration-500 hover:border-[var(--color-crimson)]/50 hover:shadow-2xl hover:shadow-[#9f1239]/10"
        >
          {/* Chapter number badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-crimson)]/10 border border-[var(--color-crimson)]/30 flex items-center justify-center backdrop-blur-sm">
                <span className="font-display text-xs text-[var(--color-crimson)]">{index + 1}</span>
              </div>
              <span className="font-mono text-[9px] text-[var(--color-muted)] tracking-widest hidden md:block">
                CHAPTER
              </span>
            </div>
          </div>

          {/* Image with overlay */}
          <div className="relative h-56 md:h-64 overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[var(--color-line)]">
            {project.image ? (
              <>
                <motion.img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                  style={{ 
                    filter: 'contrast(1.05) brightness(0.95)',
                    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                />
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent"
                  style={{
                    opacity: isHovered ? 0.6 : 0.8,
                    transition: 'opacity 0.4s'
                  }}
                ></div>
                {/* Page curl effect on hover */}
                <motion.div
                  className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[var(--color-crimson)]/20 to-transparent"
                  style={{
                    clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s'
                  }}
                ></motion.div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl text-[#333] mb-2">📖</div>
                  <span className="font-mono text-xs text-[#555]">Untitled Chapter</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 md:p-6">
            {/* Title */}
            <h3 className="font-display text-xl md:text-2xl text-[var(--color-paper)] mb-3 line-clamp-2 group-hover:text-[var(--color-crimson)] transition-colors duration-300">
              {project.name}
            </h3>
            
            {/* Description */}
            <p className="font-serif text-sm text-[var(--color-muted)] leading-relaxed mb-4 line-clamp-3">
              {project.description || "A story waiting to be told..."}
            </p>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 4).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[10px] font-mono border border-[var(--color-border)] text-[var(--color-gold)] bg-[var(--color-bg)]/50 tracking-wide hover:border-[var(--color-crimson)] transition-colors"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2.5 py-1 text-[10px] font-mono text-[var(--color-muted)]">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Read more */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
              <span className="font-mono text-[10px] text-[var(--color-muted)] tracking-wider">
                Read the story
              </span>
              <motion.div
                animate={{ x: isHovered ? 3 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-[var(--color-crimson)] text-sm"
              >
                →
              </motion.div>
            </div>
          </div>

          {/* Subtle page edge effect */}
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[var(--color-crimson)]/20 to-transparent"></div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// === FILTER TABS ===
const FilterTabs = ({ allTechs, filterTech, setFilterTech, projects }) => {
  const getTechCount = (tech) => {
    return projects.filter(p => p.technologies?.includes(tech)).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="font-mono text-xs text-[var(--color-muted)] tracking-wider">FILTER BY</span>
        <div className="flex-1 h-px bg-[var(--color-line)]"></div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <motion.button
          onClick={() => setFilterTech("all")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-4 py-2.5 font-mono text-xs border transition-all ${
            filterTech === "all"
              ? "bg-[var(--color-crimson)] border-[var(--color-crimson)] text-[var(--color-paper)] shadow-lg shadow-[#9f1239]/20"
              : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-crimson)]/50 hover:text-[var(--color-paper)]"
          }`}
        >
          All Projects
        </motion.button>
        
        {allTechs.sort().map((tech, idx) => (
          <motion.button
            key={idx}
            onClick={() => setFilterTech(tech)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2.5 font-mono text-xs border transition-all ${
              filterTech === tech
                ? "bg-[var(--color-crimson)] border-[var(--color-crimson)] text-[var(--color-paper)] shadow-lg shadow-[#9f1239]/20"
                : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-crimson)]/50 hover:text-[var(--color-paper)]"
            }`}
          >
            {tech}
            <span className="ml-1.5 text-[9px] opacity-60">
              ({getTechCount(tech)})
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// === COMPACT LIST VIEW FOR MOBILE ===
const ProjectListItem = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
    >
      <Link to={`/project/${index}`} className="block group">
        <div className="flex gap-3 p-3 border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-crimson)]/50 transition-all duration-300">
          {/* Thumbnail */}
          <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-[#0a0a0a] to-[var(--color-line)] overflow-hidden">
            {project.image ? (
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                📖
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[9px] text-[var(--color-crimson)]">
                  #{index + 1}
                </span>
                <h3 className="font-display text-base text-[var(--color-paper)] group-hover:text-[var(--color-crimson)] transition-colors truncate">
                  {project.name}
                </h3>
              </div>
              <span className="text-[var(--color-crimson)] text-xs flex-shrink-0 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>

            <p className="text-xs text-[var(--color-muted)] line-clamp-2 mb-2 leading-relaxed">
              {project.description || "A story waiting to be told..."}
            </p>

            {/* Technologies - compact */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 text-[9px] font-mono border border-[var(--color-border)] text-[var(--color-gold)] bg-[var(--color-bg)]/50"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono text-[var(--color-muted)]">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// === VIEW MODE TOGGLE ===
const ViewModeToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex items-center gap-2 mb-6 md:hidden">
      <span className="font-mono text-[10px] text-[var(--color-muted)] tracking-wider">VIEW</span>
      <div className="flex border border-[var(--color-border)] bg-[var(--color-bg)]">
        <button
          onClick={() => setViewMode("grid")}
          className={`px-3 py-1.5 font-mono text-[10px] transition-all ${
            viewMode === "grid"
              ? "bg-[var(--color-crimson)] text-[var(--color-paper)]"
              : "text-[var(--color-muted)] hover:text-[var(--color-paper)]"
          }`}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-3 py-1.5 font-mono text-[10px] transition-all border-l border-[var(--color-border)] ${
            viewMode === "list"
              ? "bg-[var(--color-crimson)] text-[var(--color-paper)]"
              : "text-[var(--color-muted)] hover:text-[var(--color-paper)]"
          }`}
        >
          List
        </button>
      </div>
    </div>
  );
};

// === MAIN PROJECTS COMPONENT ===
export default function Projects() {
  const { data, loading } = usePortfolio();
  const [filterTech, setFilterTech] = useState("all");
  // Load saved view mode from localStorage, default to 'grid'
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('projectViewMode') || 'grid';
    }
    return 'grid';
  });

  // Save view mode to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectViewMode', viewMode);
    }
  }, [viewMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-center"
        >
          <div className="w-16 h-16 mb-6 mx-auto relative">
            <motion.div
              className="absolute inset-0 border-2 border-[var(--color-crimson)] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ borderTopColor: 'transparent' }}
            ></motion.div>
          </div>
          <div className="font-display text-xl tracking-[0.2em] text-[var(--color-crimson)]">
            Loading stories...
          </div>
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
      <div className="min-h-screen py-8 md:py-16 relative">
        <AmbientParticles />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 relative z-10"
        >
          {/* Decorative element */}
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-1 h-1 bg-[var(--color-crimson)] rounded-full"></div>
            <div className="w-12 h-px bg-gradient-to-r from-[var(--color-crimson)] to-transparent"></div>
          </motion.div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--color-paper)] mb-5 tracking-tight leading-tight">
            My Projects
          </h1>
          
          <p className="font-serif text-base md:text-lg text-[var(--color-muted)] max-w-2xl leading-relaxed">
            Each project is a chapter in my journey as a developer. 
            From ideas to execution, here's what I've been building.
          </p>

          {/* Bottom decorative line */}
          <motion.div 
            className="mt-6 h-px bg-gradient-to-r from-[var(--color-crimson)]/50 via-[#333] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ transformOrigin: 'left' }}
          ></motion.div>
        </motion.div>

        {/* Filter */}
        {allTechs.length > 0 && (
          <FilterTabs 
            allTechs={allTechs}
            filterTech={filterTech}
            setFilterTech={setFilterTech}
            projects={projects}
          />
        )}

        {/* View Mode Toggle - Mobile Only */}
        {filteredProjects.length > 0 && (
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        )}

        {/* Projects Grid/List */}
        {filteredProjects.length > 0 ? (
          <>
            {/* Desktop - Always Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={idx}
                  project={project}
                  index={projects.indexOf(project)}
                  totalProjects={projects.length}
                />
              ))}
            </div>

            {/* Mobile - Grid or List based on toggle */}
            <div className="md:hidden relative z-10">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-4">
                  {filteredProjects.map((project, idx) => (
                    <ProjectCard
                      key={idx}
                      project={project}
                      index={projects.indexOf(project)}
                      totalProjects={projects.length}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProjects.map((project, idx) => (
                    <ProjectListItem
                      key={idx}
                      project={project}
                      index={projects.indexOf(project)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20 relative z-10"
          >
            <motion.div 
              className="text-6xl mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              📖
            </motion.div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--color-muted)] mb-4">
              {filterTech === "all" ? "No projects yet" : "Nothing found"}
            </h3>
            <p className="font-serif text-[var(--color-muted)] max-w-md mx-auto mb-8 leading-relaxed">
              {filterTech === "all" 
                ? "Your project showcase is waiting. Head to the admin panel to add your first project."
                : `No projects found using ${filterTech}. Try viewing all projects or choose a different filter.`}
            </p>
            {filterTech !== "all" && (
              <motion.button
                onClick={() => setFilterTech("all")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-muted)] font-mono text-xs hover:border-[var(--color-crimson)] hover:text-[var(--color-paper)] transition-all"
              >
                View all projects
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Stats Section */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-20 pt-12 border-t border-[var(--color-border)] relative z-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center md:text-left">
                <motion.div 
                  className="font-display text-4xl md:text-5xl text-[var(--color-crimson)] mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  {projects.length}
                </motion.div>
                <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-wider">
                  Total Projects
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <motion.div 
                  className="font-display text-4xl md:text-5xl text-[var(--color-crimson)] mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  {allTechs.length}
                </motion.div>
                <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-wider">
                  Technologies
                </div>
              </div>
              
              <div className="text-center md:text-left col-span-2 md:col-span-1">
                <motion.div 
                  className="font-display text-4xl md:text-5xl text-[var(--color-crimson)] mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  {filteredProjects.length}
                </motion.div>
                <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-wider">
                  Showing Now
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}