import { useState, useEffect, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// === CANVAS: FLOATING PARTICLE WISPS ===
const HomeCanvas = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const mouseActive = useRef(false);

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

    class WispParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.speedY = (Math.random() - 0.5) * 0.1;
        this.color = Math.random() > 0.7 ? '#9f1239' : '#c2410c';
        this.alpha = Math.random() * 0.15 + 0.05;
        this.trail = [];
        this.maxTrail = 5;
        this.oscillation = Math.random() * 0.03;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        if (mouseActive.current) {
          const dx = mousePos.current.x - this.x;
          const dy = mousePos.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100 * 0.08;
            this.speedX += (dx / distance) * force * 0.05;
            this.speedY += (dy / distance) * force * 0.05;
          }
        }

        this.phase += this.oscillation;
        this.x += this.speedX + Math.sin(this.phase) * 0.2;
        this.y += this.speedY + Math.cos(this.phase * 0.5) * 0.2;

        this.trail.unshift({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) {
          this.trail.pop();
        }

        if (this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
          this.reset();
        }
      }

      draw() {
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i];
          const trailAlpha = this.alpha * (1 - i / this.trail.length) * 0.3;
          
          ctx.beginPath();
          ctx.globalAlpha = trailAlpha;
          ctx.fillStyle = this.color;
          ctx.arc(point.x, point.y, this.size * (1 - i / this.trail.length), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particleCount = window.innerWidth < 768 ? 15 : 25;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new WispParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

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

    const startDelay = setTimeout(() => animate(), 300);

    return () => {
      clearTimeout(startDelay);
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
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-10"
    />
  );
};

// === ANIMATION VARIANTS ===
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
};

// === DYNAMIC GREETING TEXT ===
const DynamicGreeting = ({ home }) => {
  const parseGreeting = () => {
    const headline = home?.headline || "";
    
    if (headline.includes("I'm") || headline.includes("I am")) {
      const parts = headline.split(/(I'm|I am)/);
      if (parts.length >= 2) {
        return {
          greeting: parts[0].trim(),
          name: parts.slice(2).join(" ").trim() || home?.logoName || "Developer"
        };
      }
    }
    
    return {
      greeting: "Hello, I'm",
      name: home?.logoName || "Developer"
    };
  };

  const { greeting, name } = parseGreeting();

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-4xl md:text-5xl text-white block mb-2">
          {greeting}
        </span>
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-display text-[#9f1239] relative inline-block"
          animate={{
            textShadow: [
              "0 0 0px rgba(159, 18, 57, 0)",
              "0 0 20px rgba(159, 18, 57, 0.3)",
              "0 0 0px rgba(159, 18, 57, 0)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {name}
          <motion.span
            className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-[#9f1239] via-[#c2410c] to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.h1>
      </motion.div>
    </div>
  );
};

// === SKILL CARD COMPONENT ===
const SkillCard = ({ skill, projects, index, totalSkills }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const skillName = typeof skill === 'string' ? skill : skill.name;
  const skillLevel = typeof skill === 'string' ? "Intermediate" : (skill.level || "Intermediate");
  
  const getProjectsUsingSkill = () => {
    if (!projects || !Array.isArray(projects)) return [];
    
    const skillNameLower = skillName.toLowerCase().trim();
    return projects.filter(project => {
      if (!project.technologies || !Array.isArray(project.technologies)) return false;
      
      return project.technologies.some(tech => {
        const techLower = tech.toLowerCase().trim();
        return techLower === skillNameLower || 
               skillNameLower.includes(techLower) ||
               techLower.includes(skillNameLower);
      });
    });
  };
  
  const projectsUsingSkill = getProjectsUsingSkill();
  const projectCount = projectsUsingSkill.length;
  
  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return { bg: 'bg-blue-500', text: 'text-blue-400' };
      case 'intermediate': return { bg: 'bg-green-500', text: 'text-green-400' };
      case 'advanced': return { bg: 'bg-orange-500', text: 'text-orange-400' };
      case 'expert': 
      case 'master': return { bg: 'bg-[#9f1239]', text: 'text-[#9f1239]' };
      default: return { bg: 'bg-[#9f1239]', text: 'text-[#9f1239]' };
    }
  };
  
  const getLevelWidth = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return '25%';
      case 'intermediate': return '50%';
      case 'advanced': return '75%';
      case 'expert': 
      case 'master': return '100%';
      default: return '50%';
    }
  };
  
  const levelColors = getLevelColor(skillLevel);
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
      className="group relative cursor-pointer"
    >
      {/* Card */}
      <div className={`bg-[#0c0c0c] border rounded-lg p-4 transition-all duration-300 ${
        isHovered || isExpanded ? 'border-[#9f1239]' : 'border-[#333]'
      }`}>
        
        {/* Skill Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-display text-white truncate">
                {skillName}
              </h3>
              {projectCount > 0 && (
                <span className={`text-xs ${levelColors.text} bg-opacity-20 px-2 py-0.5 rounded-full`}>
                  {projectCount}
                </span>
              )}
            </div>
            
            {/* Level Badge */}
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${levelColors.bg} bg-opacity-20 ${levelColors.text}`}>
                {skillLevel}
              </span>
              {projectCount > 0 && (
                <span className="text-xs text-zinc-500">
                  • {projectCount} project{projectCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          
          {/* Skill Number */}
          <div className="font-mono text-xs text-zinc-600 bg-[#111] w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
            {index + 1}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-[#222] rounded-full overflow-hidden mb-4">
          <motion.div
            className={`h-full ${levelColors.bg}`}
            initial={{ width: 0 }}
            animate={{ width: getLevelWidth(skillLevel) }}
            transition={{ delay: 0.5 + index * 0.05, duration: 0.8 }}
          />
        </div>
        
        {/* Level Indicator Dots */}
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4].map((dot) => (
            <div
              key={dot}
              className={`w-1.5 h-1.5 rounded-full ${
                (skillLevel === 'Beginner' && dot <= 1) ||
                (skillLevel === 'Intermediate' && dot <= 2) ||
                (skillLevel === 'Advanced' && dot <= 3) ||
                (skillLevel === 'Expert' && dot <= 4) ||
                (skillLevel === 'Master' && dot <= 4)
                  ? levelColors.bg
                  : 'bg-[#333]'
              }`}
            />
          ))}
        </div>
        
        {/* Project Preview (Hover) */}
        {isHovered && projectCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-10 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full"
          >
            <div className="bg-[#0c0c0c] border border-[#9f1239] rounded-lg p-3 w-56 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#9f1239] rounded-full animate-pulse"></div>
                <span className="text-xs text-zinc-400">
                  Used in {projectCount} project{projectCount !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-2">
                {projectsUsingSkill.slice(0, 2).map((project, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded hover:bg-[#111] transition-colors">
                    <div className="w-5 h-5 bg-[#111] border border-[#333] rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-[#9f1239]">
                        {idx + 1}
                      </span>
                    </div>
                    <span className="text-sm text-white truncate">
                      {project.name}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#0c0c0c] border-b border-r border-[#9f1239] rotate-45"></div>
            </div>
          </motion.div>
        )}
        
        {/* Expanded Projects View */}
        <AnimatePresence>
          {isExpanded && projectCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-4"
            >
              <div className="pt-4 border-t border-[#333]">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <span className="text-[#9f1239]">↳</span>
                  Projects using {skillName}:
                </h4>
                <div className="space-y-2">
                  {projectsUsingSkill.map((project, idx) => (
                    <Link
                      key={idx}
                      to={`/project/${projects.indexOf(project)}`}
                      className="block group/project"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 p-2 rounded hover:bg-[#111] transition-colors">
                        <div className="w-8 h-8 bg-[#111] border border-[#333] rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-[#9f1239]">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate group-hover/project:text-[#9f1239] transition-colors">
                            {project.name}
                          </div>
                          {project.technologies && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.technologies
                                .filter(tech => 
                                  tech.toLowerCase().includes(skillName.toLowerCase()) ||
                                  skillName.toLowerCase().includes(tech.toLowerCase())
                                )
                                .slice(0, 2)
                                .map((tech, techIdx) => (
                                  <span
                                    key={techIdx}
                                    className="text-[10px] text-zinc-500 border border-[#333] px-1.5 py-0.5 rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                        <span className="text-zinc-600 group-hover/project:text-[#9f1239] transition-colors">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Expand Button */}
        {projectCount > 0 && (
          <div className="text-center mt-3 pt-3 border-t border-[#333]">
            <span className="text-xs text-zinc-600">
              {isExpanded ? 'Click to collapse' : 'Click to see projects'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// === SKILLS GRID COMPONENT ===
const SkillsGrid = ({ skills, projects }) => {
  const [filterLevel, setFilterLevel] = useState("all");
  
  if (!skills || skills.length === 0) return null;
  
  const filteredSkills = filterLevel === "all" 
    ? skills
    : skills.filter(skill => {
        const level = typeof skill === 'string' ? 'intermediate' : (skill.level || 'intermediate').toLowerCase();
        return level === filterLevel.toLowerCase();
      });
  
  const getLevelStats = () => {
    const stats = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
      expert: 0,
      master: 0
    };
    
    skills.forEach(skill => {
      const level = typeof skill === 'string' ? 'intermediate' : (skill.level || 'intermediate').toLowerCase();
      if (stats[level] !== undefined) {
        stats[level]++;
      } else {
        stats.intermediate++;
      }
    });
    
    return stats;
  };
  
  const levelStats = getLevelStats();
  
  return (
    <motion.div 
      className="py-16 border-t border-[#333]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <div className="mb-12">
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            Skills & Expertise
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#9f1239] to-transparent mb-6"></div>
          <p className="text-zinc-400 max-w-2xl">
            My technical toolkit and how I've applied each skill in real projects.
            Skill levels represent proficiency, not just project count.
          </p>
        </motion.div>
        
        {/* Level Filters */}
        <motion.div 
          className="flex flex-wrap gap-2 mt-6"
          variants={scaleIn}
        >
          <button
            onClick={() => setFilterLevel("all")}
            className={`px-4 py-2 rounded-lg border font-mono text-xs transition-all ${
              filterLevel === "all"
                ? "bg-[#9f1239] border-[#9f1239] text-white"
                : "bg-[#111] border-[#333] text-zinc-400 hover:border-[#9f1239]"
            }`}
          >
            All Skills ({skills.length})
          </button>
          
          {Object.entries(levelStats).map(([level, count]) => {
            if (count === 0) return null;
            
            const getLevelColor = (lvl) => {
              switch(lvl) {
                case 'beginner': return 'bg-blue-500';
                case 'intermediate': return 'bg-green-500';
                case 'advanced': return 'bg-orange-500';
                case 'expert': 
                case 'master': return 'bg-[#9f1239]';
                default: return 'bg-[#9f1239]';
              }
            };
            
            return (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-4 py-2 rounded-lg border font-mono text-xs transition-all flex items-center gap-2 ${
                  filterLevel === level
                    ? `bg-opacity-20 border-opacity-50 text-white`
                    : "bg-[#111] border-[#333] text-zinc-400 hover:border-opacity-50"
                }`}
                style={{
                  backgroundColor: filterLevel === level ? `${getLevelColor(level)}20` : undefined,
                  borderColor: filterLevel === level ? getLevelColor(level) : undefined
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getLevelColor(level) }}
                />
                {level.charAt(0).toUpperCase() + level.slice(1)} ({count})
              </button>
            );
          })}
        </motion.div>
      </div>
      
      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill, index) => (
          <SkillCard
            key={index}
            skill={skill}
            projects={projects}
            index={index}
            totalSkills={skills.length}
          />
        ))}
      </div>
      
      {/* Skills Insights */}
      <motion.div 
        className="mt-12 p-6 border border-[#333] rounded-xl bg-[#0c0c0c]"
        variants={fadeInUp}
      >
        <h3 className="text-xl font-display text-white mb-6">Skill Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-white font-medium">Understanding Levels</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-white">Beginner</span>
                </div>
                <span className="text-xs text-zinc-500">Learning & basics</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-white">Intermediate</span>
                </div>
                <span className="text-xs text-zinc-500">Comfortable & productive</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-white">Advanced</span>
                </div>
                <span className="text-xs text-zinc-500">Deep expertise</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#9f1239] rounded-full"></div>
                  <span className="text-sm text-white">Expert/Master</span>
                </div>
                <span className="text-xs text-zinc-500">Can teach others</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-medium">Skill Distribution</h4>
            <div className="space-y-4">
              {Object.entries(levelStats).map(([level, count]) => {
                if (count === 0) return null;
                
                const percentage = Math.round((count / skills.length) * 100);
                const getLevelColor = (lvl) => {
                  switch(lvl) {
                    case 'beginner': return 'bg-blue-500';
                    case 'intermediate': return 'bg-green-500';
                    case 'advanced': return 'bg-orange-500';
                    default: return 'bg-[#9f1239]';
                  }
                };
                
                return (
                  <div key={level} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-300 capitalize">
                        {level} ({count})
                      </span>
                      <span className="text-xs text-zinc-500">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${getLevelColor(level)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.3, duration: 1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-medium">Project Coverage</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#111] border border-[#333] rounded-lg">
                <div className="text-2xl font-display text-[#9f1239]">
                  {skills.length}
                </div>
                <div className="text-xs text-zinc-500">Total Skills</div>
              </div>
              <div className="text-center p-4 bg-[#111] border border-[#333] rounded-lg">
                <div className="text-2xl font-display text-[#c2410c]">
                  {projects?.length || 0}
                </div>
                <div className="text-xs text-zinc-500">Projects</div>
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              Each skill is backed by real project experience. Click any skill to see specific projects where it was applied.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// === PROFILE HERO SECTION ===
const ProfileHero = ({ profile, home }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left: Profile Image */}
      <motion.div 
        className="lg:col-span-5 relative"
        variants={itemVariants}
      >
        <div className="relative group">
          {/* Decorative Frame */}
          <div className="absolute -inset-4 border-2 border-[#333] rounded-3xl transform rotate-3 group-hover:rotate-0 transition-transform duration-700"></div>
          <div className="absolute -inset-2 border border-[#9f1239]/30 rounded-2xl"></div>
          
          {/* Main Image Container */}
          <div className="relative overflow-hidden rounded-xl border-2 border-[#333] bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] p-2">
            {profile?.avatarUrl ? (
              <>
                <motion.img
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="w-full h-auto object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all duration-700"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ 
                    scale: imageLoaded ? 1 : 1.1, 
                    opacity: imageLoaded ? 1 : 0 
                  }}
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Image Overlay Effects */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
              </>
            ) : (
              <div className="aspect-square flex items-center justify-center text-zinc-600 font-mono text-sm">
                [ Profile Image ]
              </div>
            )}
          </div>

          {/* Floating Info Badges */}
          <motion.div 
            className="absolute -bottom-4 -right-4 bg-[#0c0c0c] border border-[#9f1239] px-4 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#9f1239] rounded-full animate-pulse"></div>
              <span className="font-mono text-xs text-white">AVAILABLE</span>
            </div>
          </motion.div>

          <motion.div 
            className="absolute -top-4 -left-4 bg-[#0c0c0c] border border-[#c2410c] px-3 py-1 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="font-mono text-[10px] text-zinc-400">DEVELOPER</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Right: Text Content */}
      <motion.div 
        className="lg:col-span-7 space-y-6"
        variants={itemVariants}
      >
        {/* Welcome Tag */}
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#9f1239]/10 border border-[#9f1239]/30 rounded-full">
          <div className="w-2 h-2 bg-[#9f1239] rounded-full animate-pulse"></div>
          <span className="font-mono text-xs text-[#9f1239] tracking-widest">
            {home?.headline?.includes("Welcome") ? "WELCOME" : "PORTFOLIO"}
          </span>
        </div>

        {/* Dynamic Greeting */}
        <DynamicGreeting home={home} />

        {/* Subtitle from database */}
        <motion.p 
          className="text-xl md:text-2xl text-zinc-400 font-serif italic leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          "{home?.subtitle || "Creating digital experiences that matter."}"
        </motion.p>

        {/* About text from profile */}
        {profile?.about && (
          <div className="border-l-4 border-[#9f1239] pl-6 py-2">
            <p className="text-base text-zinc-300 leading-relaxed line-clamp-3">
              {profile.about}
            </p>
          </div>
        )}

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-wrap gap-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/projects"
            className="group relative px-8 py-4 bg-[#9f1239] text-white font-mono text-sm tracking-widest overflow-hidden rounded-lg"
          >
            <span className="relative z-10">VIEW MY WORK →</span>
            <motion.div 
              className="absolute inset-0 bg-white"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
          
          <Link
            to="/about"
            className="group px-8 py-4 border-2 border-[#333] text-white font-mono text-sm tracking-widest hover:border-[#9f1239] transition-all duration-300 rounded-lg"
          >
            LEARN ABOUT ME
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// === FEATURED PROJECTS PREVIEW ===
const FeaturedProjects = ({ projects }) => {
  const featuredProjects = projects?.slice(0, 3) || [];

  if (featuredProjects.length === 0) return null;

  return (
    <motion.div 
      className="py-16 border-t border-[#333]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="mb-12">
        <motion.h2 
          className="text-3xl md:text-4xl font-display text-white mb-4"
          variants={fadeInUp}
        >
          Recent Projects
        </motion.h2>
        <motion.p 
          className="text-zinc-400 max-w-2xl"
          variants={fadeInUp}
        >
          A selection of my recent work. Each project represents unique challenges and solutions.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredProjects.map((project, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Link to={`/project/${projects?.indexOf(project)}`} className="block">
              <div className="bg-[#0c0c0c] border border-[#333] rounded-xl overflow-hidden hover:border-[#9f1239] transition-all duration-300 h-full">
                {/* Project Image */}
                <div className="aspect-video bg-[#111] overflow-hidden relative">
                  {project.image ? (
                    <>
                      <motion.img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono">
                      Project Preview
                    </div>
                  )}
                  {/* Project Badge */}
                  <div className="absolute top-3 left-3 bg-[#0c0c0c]/90 backdrop-blur-sm border border-[#333] px-3 py-1 rounded-full">
                    <span className="font-mono text-[10px] text-[#9f1239]">PROJECT #{idx + 1}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-display text-white mb-3 line-clamp-1 group-hover:text-[#9f1239] transition-colors">
                    {project.name}
                  </h3>
                  
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                    {project.description}
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
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* View All Button */}
      {projects && projects.length > 3 && (
        <motion.div 
          className="text-center mt-8"
          variants={scaleIn}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#333] text-white font-mono text-sm tracking-widest rounded-lg hover:border-[#9f1239] transition-all group"
          >
            View All Projects ({projects.length})
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="group-hover:text-[#9f1239]"
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

// === CALL TO ACTION SECTION ===
const CallToAction = ({ home }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-[#9f1239]/10 to-[#c2410c]/10"
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ 
          backgroundSize: "200% 200%"
        }}
      />
      
      <div className="relative border border-[#9f1239]/20 rounded-2xl p-8 md:p-12 text-center backdrop-blur-sm">
        <h3 className="text-2xl md:text-3xl font-display text-white mb-6">
          Let's Create Something Together
        </h3>
        <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/contact"
            className="px-8 py-3 bg-[#9f1239] text-white font-medium rounded-lg hover:bg-[#7f0e2a] transition-colors"
          >
            Get in Touch
          </Link>
          <Link
            to="/projects"
            className="px-8 py-3 border-2 border-[#333] text-white font-medium rounded-lg hover:border-[#9f1239] transition-all"
          >
            See More Work
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// === MAIN HOME COMPONENT ===
export default function Home() {
  const { data, loading } = usePortfolio();
  const { home, profile, skills, projects } = data || {};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#9f1239] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-sm text-zinc-500">Loading portfolio...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden">
        {/* Canvas Background */}
        <HomeCanvas />

        {/* Main Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="py-12 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
            <ProfileHero profile={profile} home={home} />
          </section>

          {/* Skills Section */}
          <section className="px-4 md:px-8 max-w-7xl mx-auto">
            <SkillsGrid skills={skills} projects={projects} />
          </section>

          {/* Featured Projects */}
          <section className="px-4 md:px-8 max-w-7xl mx-auto">
            <FeaturedProjects projects={projects} />
          </section>

          {/* Call to Action */}
          <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
            <CallToAction home={home} />
          </section>

          {/* Stats Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="py-8 border-t border-[#333] mt-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8 max-w-7xl mx-auto">
              {[
                { 
                  label: "Projects", 
                  value: projects?.length || 0, 
                  color: "#9f1239",
                  desc: "Completed works"
                },
                { 
                  label: "Skills", 
                  value: skills?.length || 0, 
                  color: "#c2410c",
                  desc: "Technologies mastered"
                },
                { 
                  label: "Availability", 
                  value: "Open", 
                  color: "#e5e5e5",
                  desc: "For new opportunities"
                }
              ].map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <motion.div 
                    className="text-3xl md:text-4xl font-display mb-2"
                    style={{ color: stat.color }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-zinc-400 mb-1">{stat.label}</div>
                  <div className="text-xs text-zinc-600">{stat.desc}</div>
                  <motion.div
                    className="h-0.5 mx-auto mt-2"
                    style={{ backgroundColor: stat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: "40%" }}
                    transition={{ delay: 1 + idx * 0.1, duration: 0.8 }}
                  />
                </div>
              ))}
            </div>
          </motion.footer>
        </div>
      </div>
    </PageTransition>
  );
}