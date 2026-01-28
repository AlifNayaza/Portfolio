import { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition"; 
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";

// --- ATMOSPHERIC ELEMENTS ---
const AtmosphericBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {/* PERBAIKAN: Hapus gradient abu-abu, gunakan pure bg */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'var(--color-bg)' }}
      />
      {[...Array(3)].map((_, i) => (  /* OPTIMASI: Kurangi dari 5 ke 3 */
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            backgroundColor: 'var(--color-crimson)',
            opacity: 0.02,  /* PERBAIKAN: Lebih subtle */
            width: `${Math.random() * 300 + 150}px`,
            height: `${Math.random() * 300 + 150}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// --- CHAPTER MARKER ---
const ChapterMarker = ({ number, title, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="flex flex-col items-center justify-center py-24 md:py-32 text-center px-4"
  >
    <span className="font-mono text-[var(--color-crimson)] text-xs tracking-[0.5em] mb-4 uppercase">
      Part {number}
    </span>
    <h2 className="font-display text-4xl md:text-6xl text-[var(--color-paper)] mb-4 relative inline-block">
      {title}
      <motion.span 
        className="absolute -bottom-4 left-1/2 w-12 h-[1px] bg-[var(--color-crimson)]"
        initial={{ width: 0, x: "-50%" }}
        whileInView={{ width: 60 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
    </h2>
    {subtitle && (
      <p className="font-serif italic text-[var(--color-muted)] mt-6 max-w-md text-sm md:text-base leading-relaxed">
        "{subtitle}"
      </p>
    )}
  </motion.div>
);

// --- HERO SECTION ---
const NarrativeHero = ({ data }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      <motion.div 
        style={{ y: y1, opacity }} 
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <motion.div 
          initial={{ height: 0 }} 
          animate={{ height: 60 }} 
          transition={{ duration: 1, delay: 0.2 }}
          className="w-[1px] mx-auto mb-8"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--color-crimson), transparent)'
          }}
        />

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase mb-6"
          style={{ color: 'var(--color-crimson)' }}
        >
          Portfolio & Resume
        </motion.p>

        <h1 
          className="font-display text-5xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-8"
          style={{ color: 'var(--color-paper)' }}
        >
          <motion.span
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="block"
          >
            {data?.home?.headline?.split(" ")[0] || "CREATIVE"}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="block italic font-serif text-4xl md:text-7xl mt-2"
            style={{ color: 'var(--color-muted)' }}
          >
            {data?.home?.headline?.split(" ").slice(1).join(" ") || "Developer"}
          </motion.span>
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-serif text-lg md:text-xl leading-loose max-w-2xl mx-auto italic"
          style={{ color: 'var(--color-muted)' }}
        >
          {data?.home?.subtitle || "Crafting robust digital solutions with a focus on code quality, performance, and intuitive user experiences."}
        </motion.p>
      </motion.div>
    </section>
  );
};

// --- INTERACTIVE PORTRAIT (3D TILT & CONTROLS) ---
const AuthorPortrait = ({ images, name }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Mouse Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (!images || images.length <= 1 || !isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images, isAutoPlay]);

  const profileImages = images?.length > 0 ? images : ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop'];

  const nextImage = () => {
    setIsAutoPlay(false);
    setCurrentImage((prev) => (prev + 1) % profileImages.length);
  };

  const prevImage = () => {
    setIsAutoPlay(false);
    setCurrentImage((prev) => (prev - 1 + profileImages.length) % profileImages.length);
  };

  return (
    <section className="py-20 px-6 perspective-1000">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
        
        {/* Interactive Frame */}
        <motion.div 
          className="w-full md:w-1/2 flex justify-center md:justify-end"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className="relative group">
             {/* Controls overlay */}
             <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-4 z-20">
               <button onClick={prevImage} className="w-8 h-8 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-paper)] hover:border-[var(--color-crimson)] transition-all rounded-full flex items-center justify-center">←</button>
               <div className="flex gap-1 items-center">
                 {profileImages.map((_, i) => (
                   <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === currentImage ? 'bg-[var(--color-crimson)] w-4' : 'bg-[#333]'}`} />
                 ))}
               </div>
               <button onClick={nextImage} className="w-8 h-8 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-paper)] hover:border-[var(--color-crimson)] transition-all rounded-full flex items-center justify-center">→</button>
             </div>

            <motion.div 
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-64 h-80 md:w-80 md:h-[30rem] p-4 border border-[var(--color-border)] bg-[#0f0f0f] shadow-2xl cursor-grab active:cursor-grabbing"
            >
              {/* Decorative Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--color-crimson)]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--color-crimson)]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--color-crimson)]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--color-crimson)]" />

              <div className="w-full h-full overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={profileImages[currentImage]}
                    alt="The Developer"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </AnimatePresence>
                
                {/* Scanner Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-crimson)]/10 to-transparent translate-y-[-100%] group-hover:animate-scan pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-40 pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div 
          className="w-full md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span className="font-mono text-[var(--color-crimson)] text-xs tracking-[0.3em] uppercase mb-4 block">
            Introduction
          </span>
          <h2 className="font-display text-4xl text-[var(--color-paper)] mb-6">
            {name || "About Me"}
          </h2>
          <p className="font-serif text-[var(--color-muted)] text-lg leading-relaxed mb-8 italic">
            "I believe that great software is about more than just code—it's about solving real problems. I bridge the gap between technical complexity and intuitive design to build systems that simply work."
          </p>
          <div className="flex gap-4 justify-center md:justify-start font-mono text-xs text-[var(--color-muted)] tracking-widest uppercase">
            <span className="border-b border-[var(--color-border)] pb-1">Development</span>
            <span className="border-b border-[var(--color-border)] pb-1">Design</span>
            <span className="border-b border-[var(--color-border)] pb-1">Strategy</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- CHRONICLE CARDS ---
const ChronicleCard = ({ project, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-32 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      <motion.div 
        className="w-full md:w-1/2 relative group"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-[var(--color-border)] transition-colors duration-500 group-hover:border-[var(--color-crimson)]/50">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
            />
          ) : (
            <div className="w-full h-full bg-[var(--color-line)] flex items-center justify-center">
              <span className="font-display text-4xl text-[#222]">PREVIEW N/A</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
        </div>
        
        <div className={`absolute -top-6 ${isEven ? '-left-6' : '-right-6'} font-display text-8xl text-[var(--color-crimson)] opacity-10 select-none`}>
          {String(index + 1).padStart(2, '0')}
        </div>
      </motion.div>

      <motion.div 
        className="w-full md:w-1/2 text-center md:text-left"
        initial={{ opacity: 0, x: isEven ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="font-mono text-xs text-[var(--color-crimson)] mb-4 uppercase tracking-widest">
          {project.technologies?.[0] || "Selected Project"}
        </div>
        
        <h3 className="font-display text-3xl md:text-4xl text-[var(--color-paper)] mb-6 leading-tight group-hover:text-[var(--color-gold)] transition-colors duration-300">
          <Link to={`/project/${index}`}>{project.name}</Link>
        </h3>
        
        <p className="font-serif text-[var(--color-muted)] leading-relaxed mb-8 line-clamp-3">
          {project.description || "A detailed overview of the project, highlighting the core features, challenges solved, and the technical stack used in development."}
        </p>

        <Link 
          to={`/project/${index}`}
          className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[var(--color-paper)] hover:text-[var(--color-crimson)] transition-colors group/link"
        >
          <span className="border-b border-transparent group-hover/link:border-[var(--color-crimson)] transition-all pb-1">
            View Project Details
          </span>
          <span className="group-hover/link:translate-x-1 transition-transform">→</span>
        </Link>
      </motion.div>
    </div>
  );
};

// --- SKILL LEVEL VISUALIZER COMPONENT ---
const ProficiencyBar = ({ level }) => {
  // Convert string level to numeric rank (1-4)
  const getRank = (lvl) => {
    if (!lvl) return 2; // Default to intermediate
    const lower = lvl.toLowerCase();
    if (lower.includes('master') || lower.includes('expert')) return 4;
    if (lower.includes('advanced')) return 3;
    if (lower.includes('intermediate')) return 2;
    if (lower.includes('beginner')) return 1;
    return 2;
  };

  const rank = getRank(level);
  const totalNodes = 4;

  return (
    <div className="flex gap-1 mt-3 items-center" title={`Proficiency: ${level}`}>
      {[...Array(totalNodes)].map((_, i) => (
        <div 
          key={i}
          className={`h-1 rounded-sm transition-all duration-500 ${
            i < rank 
              ? "bg-[var(--color-crimson)] w-4 shadow-[0_0_5px_rgba(159,18,57,0.5)]" 
              : "bg-[var(--color-line)] w-2"
          }`}
        />
      ))}
    </div>
  );
};

// --- INTERACTIVE SKILLS MANUSCRIPT ---
const InteractiveSkillManuscript = ({ skills, projects }) => {
  const [activeSkill, setActiveSkill] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);

  const handleSkillClick = (skillName) => {
    if (activeSkill === skillName) {
      setActiveSkill(null);
      setRelatedProjects([]);
      return;
    }

    const found = projects.filter(p => 
      p.technologies?.some(tech => 
        tech.toLowerCase().includes(skillName.toLowerCase()) || 
        skillName.toLowerCase().includes(tech.toLowerCase())
      )
    );
    
    setActiveSkill(skillName);
    setRelatedProjects(found);
  };

  if (!skills || skills.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap justify-center gap-8 leading-relaxed mb-12 px-4">
        {skills.map((skill, idx) => {
          const name = typeof skill === 'string' ? skill : skill.name;
          const level = typeof skill === 'object' && skill.level ? skill.level : "Intermediate";
          const isActive = activeSkill === name;

          return (
            <motion.button
              key={idx}
              onClick={() => handleSkillClick(name)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className={`relative group cursor-pointer flex flex-col items-center p-4 border rounded-lg transition-all duration-300 min-w-[140px] ${
                isActive 
                  ? "bg-[#1a1a1a] border-[var(--color-crimson)] shadow-lg shadow-[#9f1239]/10" 
                  : "bg-transparent border-transparent hover:bg-[var(--color-line)] hover:border-[var(--color-border)]"
              }`}
            >
              {/* Skill Name */}
              <span className={`font-serif text-lg md:text-xl transition-colors duration-300 ${
                isActive ? "text-[var(--color-paper)]" : "text-[var(--color-muted)] group-hover:text-zinc-300"
              }`}>
                {name}
              </span>

              {/* Proficiency Visualizer */}
              <ProficiencyBar level={level} />

              {/* Text Label for Level (Only visible on hover or active) */}
              <span className={`mt-2 font-mono text-[9px] uppercase tracking-widest transition-opacity duration-300 ${
                isActive || "group-hover:opacity-100 opacity-0"
              } ${isActive ? "text-[var(--color-gold)]" : "text-[var(--color-muted)]"}`}>
                {level}
              </span>

              {/* Selection Indicator */}
              {activeSkill !== name && (
                 <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-crimson)] text-xs">
                   +
                 </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeSkill && (
          <motion.div
            key={activeSkill}
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="border-t border-b border-[var(--color-border)] py-8 bg-[var(--color-line)]/30 overflow-hidden rounded-lg"
          >
            <div className="text-center mb-6">
              <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">
                Manifestation of
              </span>
              <h3 className="font-display text-2xl text-[var(--color-paper)] mt-2">
                {activeSkill}
              </h3>
            </div>

            {relatedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto px-4">
                {relatedProjects.map((project, idx) => (
                  <Link 
                    key={idx} 
                    to={`/project/${projects.indexOf(project)}`}
                    className="flex items-center gap-4 p-4 border border-[var(--color-border)] hover:border-[var(--color-crimson)] hover:bg-[#1a1a1a] transition-all group rounded-md"
                  >
                    <div className="w-12 h-12 bg-[var(--color-line)] flex items-center justify-center border border-[var(--color-border)] group-hover:border-[var(--color-crimson)] transition-colors rounded">
                      <span className="font-display text-lg text-[var(--color-paper)] group-hover:text-[var(--color-crimson)]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-[var(--color-paper)] truncate group-hover:text-[var(--color-gold)] transition-colors">
                        {project.name}
                      </h4>
                      <div className="text-xs text-[var(--color-muted)] truncate">Click to view details</div>
                    </div>
                    <span className="text-[var(--color-muted)] group-hover:text-[var(--color-paper)] transition-colors">→</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center font-serif text-[var(--color-muted)] italic px-6">
                "This skill is part of my technical arsenal, though not explicitly linked to the highlighted projects above."
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- EPILOGUE (CTA) ---
const Epilogue = () => {
  return (
    <section className="py-32 px-6 border-t border-[var(--color-border)] relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="font-mono text-[var(--color-crimson)] text-xs tracking-[0.5em] uppercase mb-6 block">
            Contact
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-[var(--color-paper)] mb-8">
            Let's Work Together
          </h2>
          <p className="font-serif text-xl text-[var(--color-muted)] italic mb-12 max-w-2xl mx-auto">
            "I am currently available for freelance projects and open to new opportunities. Let's discuss how we can build something great together."
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
              to="/contact"
              className="px-8 py-4 bg-[var(--color-crimson)] text-[var(--color-paper)] font-display tracking-wider hover:bg-[#881337] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#9f1239]/20"
            >
              Get in Touch
            </Link>
            <Link 
              to="/about"
              className="px-8 py-4 border border-[var(--color-border)] text-[var(--color-muted)] font-display tracking-wider hover:border-white hover:text-[var(--color-paper)] transition-all"
            >
              Full Biography
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-crimson)] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const { data, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-display text-xl text-[var(--color-crimson)] tracking-[0.3em]"
        >
          LOADING EXPERIENCE...
        </motion.div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-paper)] selection:bg-[var(--color-crimson)] selection:text-[var(--color-paper)]">
        <AtmosphericBackground />
        
        <div className="relative z-10">
          
          {/* Prologue: Headline */}
          <NarrativeHero data={data} />

          {/* Character Introduction (Improved) */}
          <AuthorPortrait 
            images={data?.profile?.images} 
            name={data?.home?.logoName} 
          />
          
          {/* Chapter I: Chosen Chronicles (Projects) */}
          <div className="max-w-6xl mx-auto px-6 mt-20">
            <ChapterMarker 
              number="I" 
              title="Featured Projects" 
              subtitle="A selection of recent work demonstrating my technical capabilities and problem-solving skills."
            />
            
            <div className="space-y-12">
              {data?.projects?.slice(0, 4).map((project, index) => (
                <ChronicleCard key={index} project={project} index={index} />
              ))}
            </div>

            <div className="text-center py-12">
              <Link to="/projects" className="group inline-flex flex-col items-center gap-2">
                <span className="font-mono text-xs text-[var(--color-muted)] tracking-widest group-hover:text-[var(--color-crimson)] transition-colors">
                  VIEW FULL ARCHIVE
                </span>
                <span className="h-[1px] w-12 bg-[#333] group-hover:w-24 group-hover:bg-[var(--color-crimson)] transition-all duration-300" />
              </Link>
            </div>
          </div>

          {/* Chapter II: Mantras of Knowledge (Skills - Improved) */}
          <div className="max-w-6xl mx-auto px-6 pb-20 border-t border-[var(--color-border)]/50 mt-20">
            <ChapterMarker 
              number="II" 
              title="Technical Expertise" 
              subtitle="Hover over a skill to see proficiency level details."
            />
            <InteractiveSkillManuscript 
              skills={data?.skills} 
              projects={data?.projects} 
            />
          </div>

          {/* Epilogue */}
          <Epilogue />

        </div>
      </div>
    </PageTransition>
  );
}