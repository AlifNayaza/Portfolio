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
        this.oscillation = Math.random() * 0.03;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.phase += this.oscillation;
        this.x += this.speedX + Math.sin(this.phase) * 0.2;
        this.y += this.speedY + Math.cos(this.phase * 0.5) * 0.2;

        if (this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
          this.reset();
        }
      }

      draw() {
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

    const startDelay = setTimeout(() => animate(), 300);

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

// === MOBILE-FRIENDLY PROFILE IMAGE ===
const ProfileImage = ({ images, profileName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50 && images.length > 1) {
      if (diff > 0) {
        // Swipe left - next
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        // Swipe right - previous
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
  };

  if (images.length === 0) {
    return (
      <div className="relative w-full">
        <div className="aspect-square rounded-2xl border-2 border-[#333] bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-[#9f1239]/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-[#9f1239]">+</span>
            </div>
            <p className="text-sm text-zinc-500">Add profile images</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="aspect-square rounded-2xl overflow-hidden border-2 border-[#333] bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${profileName || 'Profile'} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Swipe indicator for mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-[#9f1239]' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1}/{images.length}
          </div>
        )}
      </div>
    </div>
  );
};

// === MOBILE-FRIENDLY HERO SECTION ===
const MobileHero = ({ data }) => {
  const { home, profile, contact } = data || {};

  return (
    <div className="py-8 px-4">
      {/* Profile Image */}
      <div className="mb-6">
        <ProfileImage 
          images={profile?.images || []} 
          profileName={home?.logoName || "Profile"} 
        />
      </div>

      {/* Greeting */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#9f1239]/10 border border-[#9f1239]/20 rounded-full mb-4">
          <div className="w-2 h-2 bg-[#9f1239] rounded-full animate-pulse"></div>
          <span className="font-mono text-xs text-[#9f1239]">
            Hello, I'm
          </span>
        </div>

        <h1 className="text-4xl font-display text-white mb-2">
          {home?.logoName || "Developer"}
        </h1>
        
        <p className="text-lg text-[#9f1239] mb-4">
          {home?.headline?.replace("I'm", "").trim() || "Mobile-First Developer"}
        </p>

        {home?.subtitle && (
          <p className="text-zinc-400 text-base leading-relaxed">
            {home.subtitle}
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#111]/50 backdrop-blur-sm border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-display text-[#9f1239] mb-1">
            {data?.projects?.length || 0}
          </div>
          <div className="text-xs text-zinc-400">Projects</div>
        </div>
        <div className="bg-[#111]/50 backdrop-blur-sm border border-[#333] rounded-lg p-4">
          <div className="text-2xl font-display text-[#c2410c] mb-1">
            {data?.skills?.length || 0}
          </div>
          <div className="text-xs text-zinc-400">Skills</div>
        </div>
      </div>

      {/* Contact Links */}
      {contact && (
        <div className="flex flex-wrap gap-2 mb-6">
          {contact.email && (
            <a 
              href={`mailto:${contact.email}`}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-[#111] border border-[#333] rounded-lg active:scale-95 transition-all"
            >
              <span className="text-[#9f1239]">✉️</span>
              <span className="text-sm text-white">Email</span>
            </a>
          )}
          {contact.linkedin && (
            <a 
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-[#111] border border-[#333] rounded-lg active:scale-95 transition-all"
            >
              <span className="text-[#9f1239]">💼</span>
              <span className="text-sm text-white">LinkedIn</span>
            </a>
          )}
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3">
        <Link
          to="/projects"
          className="w-full bg-[#9f1239] text-white font-medium py-4 rounded-lg text-center active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>View My Work</span>
          <span>→</span>
        </Link>
        
        <Link
          to="/about"
          className="w-full bg-transparent border-2 border-[#333] text-white font-medium py-4 rounded-lg text-center active:scale-95 transition-all"
        >
          Learn About Me
        </Link>
      </div>
    </div>
  );
};

// === MOBILE-FRIENDLY SKILLS GRID ===
const MobileSkillsGrid = ({ skills, projects }) => {
  const [expandedSkill, setExpandedSkill] = useState(null);

  if (!skills || skills.length === 0) {
    return (
      <div className="py-8 px-4">
        <div className="text-center p-8 border-2 border-dashed border-[#333] rounded-lg">
          <p className="text-zinc-500">No skills added yet</p>
        </div>
      </div>
    );
  }

  const getSkillName = (skill) => {
    if (typeof skill === 'string') return skill;
    return skill.name || skill.title || "Skill";
  };

  const getSkillLevel = (skill) => {
    if (typeof skill === 'string') return "Intermediate";
    return skill.level || "Intermediate";
  };

  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return 'bg-blue-500';
      case 'intermediate': return 'bg-green-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': 
      case 'master': return 'bg-[#9f1239]';
      default: return 'bg-[#9f1239]';
    }
  };

  const getProjectsUsingSkill = (skillName) => {
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

  return (
    <div className="py-8 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-display text-white mb-2">Skills & Expertise</h2>
        <p className="text-zinc-400 text-sm">
          Tap on any skill to see projects where it was used
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {skills.slice(0, 8).map((skill, index) => {
          const skillName = getSkillName(skill);
          const skillLevel = getSkillLevel(skill);
          const levelColor = getLevelColor(skillLevel);
          const projectsUsingSkill = getProjectsUsingSkill(skillName);
          const isExpanded = expandedSkill === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-[#111] border rounded-lg overflow-hidden ${
                isExpanded ? 'border-[#9f1239]' : 'border-[#333]'
              }`}
              onClick={() => setExpandedSkill(isExpanded ? null : index)}
            >
              {/* Skill Header */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {skillName}
                    </h3>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${levelColor}`}></div>
                </div>

                {/* Level indicator */}
                <div className="h-1 bg-[#222] rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full ${levelColor}`}
                    style={{
                      width: skillLevel === 'Beginner' ? '25%' :
                             skillLevel === 'Intermediate' ? '50%' :
                             skillLevel === 'Advanced' ? '75%' : '100%'
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">{skillLevel}</span>
                  {projectsUsingSkill.length > 0 && (
                    <span className="text-xs text-zinc-600">
                      {projectsUsingSkill.length} project{projectsUsingSkill.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Projects */}
              <AnimatePresence>
                {isExpanded && projectsUsingSkill.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[#333]"
                  >
                    <div className="p-3">
                      <div className="text-xs text-zinc-400 mb-2">Used in:</div>
                      <div className="space-y-2">
                        {projectsUsingSkill.slice(0, 3).map((project, idx) => (
                          <Link
                            key={idx}
                            to={`/project/${projects.indexOf(project)}`}
                            className="flex items-center gap-2 p-2 rounded hover:bg-[#222] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="w-6 h-6 bg-[#222] border border-[#333] rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-[#9f1239]">
                                {idx + 1}
                              </span>
                            </div>
                            <span className="text-sm text-white truncate">
                              {project.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* View All Skills Button */}
      {skills.length > 8 && (
        <div className="mt-6 text-center">
          <Link
            to="/about#skills"
            className="inline-block px-6 py-3 border border-[#333] text-zinc-400 rounded-lg hover:border-[#9f1239] transition-colors"
          >
            View All {skills.length} Skills
          </Link>
        </div>
      )}
    </div>
  );
};

// === MOBILE-FRIENDLY PROJECTS PREVIEW ===
const MobileProjectsPreview = ({ projects }) => {
  const featuredProjects = projects?.slice(0, 3) || [];

  if (featuredProjects.length === 0) {
    return (
      <div className="py-8 px-4">
        <div className="text-center p-8 border-2 border-dashed border-[#333] rounded-lg">
          <p className="text-zinc-500">No projects added yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-display text-white mb-2">Recent Projects</h2>
        <p className="text-zinc-400 text-sm">
          A selection of my recent work
        </p>
      </div>

      <div className="space-y-4">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={`/project/${projects.indexOf(project)}`} className="block">
              <div className="bg-[#111] border border-[#333] rounded-lg overflow-hidden">
                {/* Project Image */}
                <div className="aspect-video bg-[#222] overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      Project Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {project.name}
                  </h3>
                  
                  <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                    {project.description || "No description available"}
                  </p>

                  {/* Tech Tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs text-zinc-500 border border-[#333] px-2 py-1 rounded"
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
        <div className="mt-6 text-center">
          <Link
            to="/projects"
            className="inline-block px-6 py-3 border-2 border-[#333] text-white rounded-lg hover:border-[#9f1239] transition-colors"
          >
            View All {projects.length} Projects
          </Link>
        </div>
      )}
    </div>
  );
};

// === MOBILE-FRIENDLY CALL TO ACTION ===
const MobileCallToAction = () => {
  return (
    <div className="py-8 px-4">
      <div className="bg-gradient-to-r from-[#9f1239]/10 to-[#c2410c]/10 border border-[#9f1239]/20 rounded-xl p-6 text-center">
        <h3 className="text-xl font-display text-white mb-4">
          Let's Work Together
        </h3>
        <p className="text-zinc-300 mb-6">
          Have a project in mind? Let's create something amazing!
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/contact"
            className="w-full bg-[#9f1239] text-white font-medium py-4 rounded-lg text-center active:scale-95 transition-all"
          >
            Get in Touch
          </Link>
          <a
            href="tel:+1234567890"
            className="w-full bg-transparent border-2 border-[#333] text-white font-medium py-4 rounded-lg text-center active:scale-95 transition-all"
          >
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
};

// === MAIN HOME COMPONENT ===
export default function Home() {
  const { data, loading } = usePortfolio();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-14 h-14 border-3 border-[#9f1239] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-sm text-zinc-500">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen">
        {/* Canvas Background */}
        <HomeCanvas />

        {/* Main Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="pt-4">
            <MobileHero data={data} />
          </section>

          {/* Skills Section */}
          <section className="border-t border-[#333]">
            <MobileSkillsGrid 
              skills={data?.skills} 
              projects={data?.projects} 
            />
          </section>

          {/* Projects Section */}
          <section className="border-t border-[#333]">
            <MobileProjectsPreview projects={data?.projects} />
          </section>

          {/* Call to Action */}
          <section className="border-t border-[#333]">
            <MobileCallToAction />
          </section>

          {/* Mobile Navigation Helper */}
          <div className="fixed bottom-6 right-6 z-50">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-full bg-[#9f1239] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
              aria-label="Scroll to top"
            >
              ↑
            </motion.button>
          </div>

          {/* Mobile Footer */}
          <footer className="py-6 px-4 border-t border-[#333]">
            <div className="text-center">
              <p className="text-sm text-zinc-500 mb-2">
                Optimized for mobile experience
              </p>
              <div className="text-xs text-zinc-600">
                © {new Date().getFullYear()} Portfolio
              </div>
            </div>
          </footer>
        </div>
      </div>
    </PageTransition>
  );
}