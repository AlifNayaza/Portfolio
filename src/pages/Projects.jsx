import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

// === CANVAS: SUBTLE BACKGROUND PARTICLE EFFECT ===
const ProjectCanvas = () => {
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

    class ProjectParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
        this.color = Math.random() > 0.7 ? '#9f1239' : '#c2410c';
        this.alpha = Math.random() * 0.15 + 0.05;
        this.wobble = Math.random() * 0.01;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.phase += this.wobble;
        
        // Gentle floating motion
        this.x += Math.sin(this.phase) * 0.2;
        this.y += Math.cos(this.phase * 1.5) * 0.2;

        if (this.x < -50 || this.x > canvas.width + 50) this.speedX *= -1;
        if (this.y < -50 || this.y > canvas.height + 50) this.speedY *= -1;
      }

      draw() {
        const pulse = Math.sin(this.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.globalAlpha = this.alpha * pulse;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    const particleCount = window.innerWidth < 768 ? 20 : 30;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new ProjectParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(p => {
        p.update();
        p.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const startDelay = setTimeout(() => animate(), 1000);

    return () => {
      clearTimeout(startDelay);
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-10"
    />
  );
};

// === ANIMATION VARIANTS ===
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 }
  }
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  }
};

// === MAIN PROJECTS COMPONENT ===
export default function Projects() {
  const { data, loading } = usePortfolio();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filterTech, setFilterTech] = useState("all");
  const [canvasLoaded, setCanvasLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanvasLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#9f1239] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-sm text-zinc-500">Loading projects...</p>
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

  // Get technology usage count
  const getTechUsageCount = (tech) => {
    return projects.filter(p => p.technologies?.includes(tech)).length;
  };

  return (
    <PageTransition>
      <div className="min-h-screen py-8 md:py-16 px-4 md:px-8 relative overflow-hidden">
        {canvasLoaded && <ProjectCanvas />}

        {/* Header Section */}
        <motion.div 
          className="max-w-7xl mx-auto mb-8 md:mb-16 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-display text-white mb-4">
            My Projects
            <span className="text-[#9f1239] ml-2">.</span>
          </h1>
          
          <div className="h-1 w-24 bg-gradient-to-r from-[#9f1239] to-transparent mb-6"></div>
          
          <p className="text-lg text-zinc-400 max-w-3xl">
            A collection of my recent work. Each project represents a unique challenge I've worked on.
            {projects.length === 0 && " Add your first project in the admin panel."}
          </p>
        </motion.div>

        {/* Project Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-12 max-w-7xl mx-auto relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[
            { 
              label: "Total Projects", 
              value: projects.length, 
              desc: "Completed works",
              color: "#9f1239"
            },
            { 
              label: "Technologies", 
              value: allTechs.length, 
              desc: "Different tech used",
              color: "#c2410c"
            },
            { 
              label: "Filtered", 
              value: filteredProjects.length, 
              desc: "Currently showing",
              color: "#d97706"
            },
            { 
              label: "View Mode", 
              value: viewMode === "grid" ? "Grid" : "List", 
              desc: "Display style",
              color: "#e5e5e5"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-[#111]/80 backdrop-blur-sm border border-[#333] p-4 group hover:border-[#9f1239]/50 transition-all duration-300"
            >
              <div 
                className="text-2xl md:text-3xl font-display mb-2 transition-transform group-hover:scale-105"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="font-mono text-[10px] md:text-xs text-zinc-600 uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-zinc-500">{stat.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="max-w-7xl mx-auto mb-8 md:mb-12 relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between">
            {/* View Mode Toggle */}
            <motion.div variants={scaleIn} className="flex-1 min-w-0">
              <div className="font-mono text-xs text-zinc-500 mb-2">Display as:</div>
              <div className="flex gap-2 bg-[#0c0c0c] border border-[#333] p-1 rounded">
                {["grid", "list"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex-1 py-2 px-4 font-mono text-xs uppercase transition-all ${
                      viewMode === mode
                        ? "bg-[#9f1239] text-white"
                        : "bg-transparent text-zinc-600 hover:text-white"
                    }`}
                  >
                    {mode === "grid" ? "Grid View" : "List View"}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Technology Filter */}
            <motion.div variants={scaleIn} className="flex-1 min-w-0">
              <div className="font-mono text-xs text-zinc-500 mb-2">Filter by technology:</div>
              <select
                value={filterTech}
                onChange={(e) => setFilterTech(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-[#333] text-white font-mono text-sm py-2 px-4 focus:outline-none focus:border-[#9f1239] transition-colors cursor-pointer rounded"
              >
                <option value="all">All Technologies</option>
                {allTechs.sort().map((tech) => (
                  <option key={tech} value={tech}>
                    {tech} ({getTechUsageCount(tech)})
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Sort Options */}
            <motion.div variants={scaleIn} className="md:w-auto">
              <div className="font-mono text-xs text-zinc-500 mb-2">Sort by:</div>
              <select
                className="bg-[#0c0c0c] border border-[#333] text-white font-mono text-sm py-2 px-4 focus:outline-none focus:border-[#9f1239] transition-colors cursor-pointer rounded"
                defaultValue="default"
              >
                <option value="default">Default Order</option>
                <option value="name">Project Name</option>
                <option value="recent">Most Recent</option>
              </select>
            </motion.div>
          </div>
        </motion.div>

        {/* Projects Display */}
        <div className="max-w-7xl mx-auto relative z-10">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 border-2 border-dashed border-[#333] rounded-lg"
            >
              <p className="text-zinc-500 text-lg mb-2">
                {filterTech === "all" 
                  ? "No projects added yet" 
                  : "No projects use this technology"}
              </p>
              <p className="text-zinc-600 text-sm">
                {filterTech === "all"
                  ? "Add your first project in the admin panel"
                  : "Try selecting a different technology or view all projects"}
              </p>
              {filterTech !== "all" && (
                <button
                  onClick={() => setFilterTech("all")}
                  className="mt-4 px-4 py-2 bg-[#9f1239] text-white text-sm rounded hover:bg-[#7f0e2a] transition-colors"
                >
                  View All Projects
                </button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                // GRID VIEW - MOBILE: 1 kolom, DESKTOP: 2-3 kolom
                <motion.div
                  key="grid"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProjects.map((project, idx) => (
                    <motion.div
                      key={idx}
                      variants={fadeInUp}
                      onHoverStart={() => setHoveredIndex(idx)}
                      onHoverEnd={() => setHoveredIndex(null)}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <Link
                        to={`/project/${projects.indexOf(project)}`}
                        className="block h-full"
                      >
                        <div className="border border-[#333] bg-[#0c0c0c] overflow-hidden rounded-lg hover:border-[#9f1239] transition-all duration-300 h-full flex flex-col">
                          {/* Project Image */}
                          <div className="aspect-video bg-[#111] overflow-hidden relative">
                            {project.image ? (
                              <motion.img
                                src={project.image}
                                alt={project.name}
                                className="w-full h-full object-cover"
                                animate={{
                                  scale: hoveredIndex === idx ? 1.05 : 1,
                                  filter: hoveredIndex === idx ? "grayscale(0%)" : "grayscale(30%)"
                                }}
                                transition={{ duration: 0.4 }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-sm">
                                [ Project Image ]
                              </div>
                            )}
                            <div className="absolute top-3 right-3 bg-[#0c0c0c]/90 backdrop-blur-sm border border-[#333] px-2 py-1 rounded">
                              <span className="font-mono text-[10px] text-[#9f1239]">
                                #{projects.indexOf(project) + 1}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-xl font-display text-white mb-2 group-hover:text-[#9f1239] transition-colors">
                              {project.name}
                            </h3>

                            <p className="text-zinc-400 text-sm mb-4 flex-1 line-clamp-2">
                              {project.description || "No description provided"}
                            </p>

                            {/* Tech Tags */}
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {project.technologies.slice(0, 3).map((tech, techIdx) => (
                                  <span
                                    key={techIdx}
                                    className="text-xs text-zinc-500 border border-[#333] px-2 py-1 rounded hover:border-[#9f1239] hover:text-[#9f1239] transition-colors"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {project.technologies.length > 3 && (
                                  <span className="text-xs text-zinc-600">
                                    +{project.technologies.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* View Button */}
                            <div className="mt-4 pt-3 border-t border-[#333] flex justify-between items-center">
                              <span className="font-mono text-xs text-zinc-600">
                                View details
                              </span>
                              <span className="text-zinc-500 group-hover:text-[#9f1239] transition-colors">
                                →
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                // LIST VIEW - MOBILE: Compact horizontal layout, DESKTOP: Full details
                <motion.div
                  key="list"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="space-y-3 md:space-y-4"
                >
                  {filteredProjects.map((project, idx) => (
                    <motion.div
                      key={idx}
                      variants={slideIn}
                      onHoverStart={() => setHoveredIndex(idx)}
                      onHoverEnd={() => setHoveredIndex(null)}
                      whileHover={{ x: 5 }}
                      className="group"
                    >
                      <Link
                        to={`/project/${projects.indexOf(project)}`}
                        className="block border border-[#333] bg-[#0c0c0c] hover:border-[#9f1239] transition-all duration-300 p-3 md:p-6"
                      >
                        <div className="flex flex-row md:flex-row gap-3 md:gap-6 items-center">
                          {/* Thumbnail - Mobile: small square, Desktop: normal */}
                          <div className="w-16 h-16 md:w-48 lg:w-56 md:aspect-video bg-[#111] border border-[#333] overflow-hidden flex-shrink-0">
                            {project.image ? (
                              <img
                                src={project.image}
                                alt={project.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
                                [ No image ]
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1 md:mb-2">
                              <div className="overflow-hidden">
                                {/* Project number - only on mobile */}
                                <div className="font-mono text-[10px] text-[#9f1239] mb-1 md:hidden">
                                  #{projects.indexOf(project) + 1}
                                </div>
                                <h3 className="text-base md:text-2xl font-display text-white group-hover:text-[#9f1239] transition-colors truncate">
                                  {project.name}
                                </h3>
                              </div>
                              <span className="text-zinc-500 group-hover:text-[#9f1239] transition-colors flex-shrink-0 ml-2">
                                →
                              </span>
                            </div>

                            {/* Description - hidden on mobile, shown on desktop */}
                            <p className="text-zinc-400 mb-2 line-clamp-1 md:line-clamp-2 hidden md:block">
                              {project.description || "No description provided"}
                            </p>

                            {/* Tech Tags - Mobile: limited & compact, Desktop: full */}
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {project.technologies.slice(0, window.innerWidth < 768 ? 2 : 5).map((tech, techIdx) => (
                                  <span
                                    key={techIdx}
                                    className="text-[10px] md:text-xs text-zinc-500 border border-[#333] px-1.5 py-0.5 md:px-2 md:py-1 rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {project.technologies.length > (window.innerWidth < 768 ? 2 : 5) && (
                                  <span className="text-[10px] md:text-xs text-zinc-600">
                                    +{project.technologies.length - (window.innerWidth < 768 ? 2 : 5)}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Project number and date - only on desktop */}
                            <div className="hidden md:flex justify-between items-center mt-2">
                              <div className="font-mono text-xs text-[#9f1239]">
                                Project #{projects.indexOf(project) + 1}
                              </div>
                              {project.date && (
                                <div className="text-xs text-zinc-600">
                                  {project.date}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Technology Summary */}
        {allTechs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#333] relative z-10"
          >
            <h3 className="text-xl font-display text-white mb-6">
              Technologies Used
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {allTechs.sort().map((tech, idx) => {
                const usageCount = getTechUsageCount(tech);
                return (
                  <button
                    key={idx}
                    onClick={() => setFilterTech(tech)}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      filterTech === tech
                        ? "bg-[#9f1239] border-[#9f1239] text-white"
                        : "bg-[#111] border-[#333] text-zinc-400 hover:border-[#9f1239] hover:text-white"
                    }`}
                  >
                    <span className="font-medium">{tech}</span>
                    <span className={`text-xs ${
                      filterTech === tech ? "text-white/70" : "text-zinc-600"
                    }`}>
                      {usageCount}
                    </span>
                  </button>
                );
              })}
              
              {filterTech !== "all" && (
                <button
                  onClick={() => setFilterTech("all")}
                  className="px-4 py-2 bg-[#111] border border-[#333] text-zinc-400 hover:border-[#9f1239] hover:text-white rounded-lg transition-all"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Empty State Guidance */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="max-w-7xl mx-auto mt-8 p-6 border border-[#333] rounded-lg bg-[#0c0c0c] relative z-10"
          >
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-[#9f1239] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs">i</span>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">No projects yet</h4>
                <p className="text-zinc-400 text-sm">
                  To add projects, go to the admin panel and click on the "Archives" tab.
                  You can add project details, images, and technologies there.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}