/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition"; 
import { motion, AnimatePresence } from "framer-motion";
import { Link, useOutletContext } from "react-router-dom";
import ProjectCardImageStage from "../components/ui/ProjectCardImageStage";

// === LIVE LOCAL TIME WIDGET ===
const LocalTimeBadge = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-xs text-[var(--color-muted)] flex items-center gap-1.5">
      <span>🇮🇩 Jakarta</span>
      <span className="text-[var(--color-border)]">•</span>
      <span className="text-[var(--color-paper)] font-semibold">{time || "12:00:00"} WIB</span>
    </span>
  );
};

// === INTERACTIVE KINETIC TICKER ===
const TechTicker = () => {
  const items = [
    "REACT",
    "NODE.JS",
    "JAVASCRIPT",
    "TYPESCRIPT",
    "TAILWIND CSS",
    "NEXT.JS",
    "MONGODB",
    "EXPRESS",
    "UI/UX DESIGN",
    "REST APIS",
  ];

  return (
    <div className="w-full overflow-hidden py-3.5 border-y border-[var(--color-border)] bg-[var(--color-line)]/30 my-16 select-none">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-mono text-xs tracking-widest text-[var(--color-muted)]">
        {[...items, ...items, ...items].map((tech, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="hover:text-[var(--color-paper)] transition-colors font-medium">
              {tech}
            </span>
            <span className="text-[var(--color-crimson)] text-[10px]">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// === INTERACTIVE AUTO-SWIPE PROFILE PHOTO CAROUSEL ===
const ProfileCard = ({ images, name }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const validImages = images && images.length > 0 ? images : ["/img/default-profile.jpg"];

  // Auto-slide every 4.5 seconds if multiple images exist
  useEffect(() => {
    if (validImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActiveIdx((prev) => (prev + 1) % validImages.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [validImages.length, isPaused]);

  const handleNext = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % validImages.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <motion.div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--card-bg)] shadow-2xl group flex flex-col justify-between select-none hover:border-[var(--color-crimson)]/50 transition-all"
    >
      {/* Holographic Border Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-crimson)]/20 via-transparent to-[var(--color-gold)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

      {/* Floating Creative Sticker */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[var(--color-crimson)] animate-pulse" />
        <span className="font-mono text-[10px] font-bold tracking-wider">CREATIVE DEV</span>
      </div>

      {/* Image container with 4:5 ratio and swipe/drag gesture */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-line)]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={activeIdx}
            src={validImages[activeIdx]}
            alt={name || "Profile photo"}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x < -40 || velocity.x < -300) {
                handleNext();
              } else if (offset.x > 40 || velocity.x > 300) {
                handlePrev();
              }
            }}
            className="w-full h-full object-cover object-center cursor-grab active:cursor-grabbing"
          />
        </AnimatePresence>

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

        {/* Side Horizontal Navigation Buttons (Appear on Hover / Touch) */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-[var(--color-crimson)] text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-xs opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all shadow-md active:scale-90"
              aria-label="Previous photo"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-[var(--color-crimson)] text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-xs opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all shadow-md active:scale-90"
              aria-label="Next photo"
            >
              →
            </button>
          </>
        )}

        {/* Bottom Tag */}
        <div className="absolute bottom-5 left-5 right-5 z-20 text-white flex items-end justify-between pointer-events-none">
          <div>
            <span className="text-[11px] font-mono text-white/70 block tracking-wide">
              Alif Haikal Nayaza
            </span>
            <span className="font-display text-xl font-bold text-white tracking-tight">
              Software & Web Developer
            </span>
          </div>

          {/* Mini Soundwave Indicator */}
          <div className="flex items-center gap-0.5 h-4">
            <span className="w-1 h-3 bg-[var(--color-crimson)] rounded-full animate-pulse" />
            <span className="w-1 h-4 bg-white rounded-full animate-pulse delay-75" />
            <span className="w-1 h-2 bg-[var(--color-gold)] rounded-full animate-pulse delay-150" />
          </div>
        </div>

        {/* Photo Switcher Dots / Progress Bar */}
        {validImages.length > 1 && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
            {validImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(i > activeIdx ? 1 : -1);
                  setActiveIdx(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIdx ? "bg-[var(--color-crimson)] w-5" : "bg-white/40 hover:bg-white/80 w-1.5"
                }`}
                aria-label={`Show photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// === INTERACTIVE PROJECT CARD ===
const InteractiveProjectCard = ({ project, index }) => {
  const projectImages = Array.isArray(project.images) && project.images.length > 0 
    ? project.images 
    : (project.image ? [project.image] : []);
  const coverImage = projectImages[0] || project.image || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link
        to={`/project/${index}`}
        className="group relative block rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--card-bg)] hover:border-[var(--color-crimson)]/80 transition-all duration-300 shadow-sm hover:shadow-2xl flex flex-col justify-between h-full p-3 sm:p-5 md:p-6"
      >
        {/* Subtle Number Watermark in Background */}
        <span className="absolute -bottom-4 -right-2 font-display text-6xl sm:text-8xl md:text-9xl font-black text-[var(--color-border)]/20 pointer-events-none select-none z-0 group-hover:text-[var(--color-crimson)]/15 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
          0{index + 1}
        </span>

        <div className="relative z-10">
          {/* Top Floating Glass Badge Bar */}
          <div className="flex items-center justify-between mb-2.5 sm:mb-4">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-mono text-[9px] sm:text-[11px] font-bold bg-[var(--color-line)] text-[var(--color-crimson)] border border-[var(--color-border)] shadow-sm">
              PROJ // 0{index + 1}
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-line)] flex items-center justify-center text-[10px] sm:text-xs text-[var(--color-paper)] group-hover:bg-[var(--color-crimson)] group-hover:text-white group-hover:border-[var(--color-crimson)] group-hover:rotate-45 transition-all duration-300 shadow-sm">
              ↗
            </div>
          </div>

          {/* Image Stage with Interactive Multi-Image Browsing */}
          <ProjectCardImageStage
            images={projectImages}
            fallbackImage={project.image}
            title={project.name}
          />

          {/* Title & Description */}
          <div>
            <h3 className="font-display text-sm sm:text-xl md:text-2xl font-bold text-[var(--color-paper)] group-hover:text-[var(--color-crimson)] transition-colors line-clamp-1 mb-1 sm:mb-2">
              {project.name}
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed font-normal mb-3 hidden sm:block">
              {project.description || "Web application with clean interface and modern stack."}
            </p>
          </div>
        </div>

        {/* Tech Chips Footer */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="relative z-10 flex flex-wrap gap-1 sm:gap-1.5 pt-2 sm:pt-3 border-t border-[var(--color-border)]/60">
            {project.technologies.slice(0, 2).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono bg-[var(--color-line)] text-[var(--color-muted)] border border-[var(--color-border)] font-medium group-hover:border-[var(--color-crimson)]/30 transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 2 && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono text-[var(--color-muted)]">
                +{project.technologies.length - 2}
              </span>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
};

// === SECTION LABEL ===
const SectionHeader = ({ index, title, description, linkTo, linkText }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3 border-b border-[var(--color-border)] pb-5">
    <div>
      <span className="font-mono text-xs font-bold text-[var(--color-crimson)] tracking-widest uppercase block mb-1">
        {index}
      </span>
      <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--color-paper)] tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1 max-w-xl">
          {description}
        </p>
      )}
    </div>
    {linkTo && (
      <Link
        to={linkTo}
        className="group inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--color-paper)] hover:text-[var(--color-crimson)] transition-colors self-start sm:self-end"
      >
        <span>{linkText || "View All"}</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    )}
  </div>
);

// === MAIN HOME COMPONENT ===
export default function Home() {
  const { data } = usePortfolio();
  const { onOpenPitch, onOpenCmd } = useOutletContext() || {};

  const homeData = data?.home || {};
  const aboutPageData = data?.aboutPage || {};
  const projects = data?.projects || [];
  const featuredProjects = projects.slice(0, 4);

  const images = useMemo(() => {
    if (data?.profile?.images && data.profile.images.length > 0) {
      return data.profile.images;
    }
    if (data?.profile?.image) {
      return [data.profile.image];
    }
    return ["/img/default-profile.jpg"];
  }, [data]);

  const allSkills = useMemo(() => {
    const skillSet = new Set();
    if (data?.projects) {
      data.projects.forEach((p) => {
        p.technologies?.forEach((t) => skillSet.add(t));
      });
    }
    return Array.from(skillSet).slice(0, 16);
  }, [data]);

  return (
    <PageTransition>
      <div className="relative pb-2">
        
        {/* Ambient Top Glow with Breathing Animation */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] ambient-glow pointer-events-none -z-10 blur-3xl opacity-60 animate-aura" />

        {/* === HERO SECTION === */}
        <section className="pt-6 pb-12 sm:pb-16 md:pt-10 md:pb-20">
          
          {/* Top Status Bar Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)] backdrop-blur-md shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-radar" />
              <span className="font-mono text-xs text-[var(--color-paper)] font-medium">
                {aboutPageData.availability || "Available for projects"}
              </span>
            </div>

            {onOpenPitch && (
              <button
                onClick={onOpenPitch}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--color-crimson)]/50 bg-[var(--color-crimson)]/10 hover:bg-[var(--color-crimson)] hover:text-white text-[var(--color-crimson)] font-mono text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <span>⚡</span>
                <span>60s Fast Pitch</span>
              </button>
            )}

            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)] backdrop-blur-md shadow-sm">
              <LocalTimeBadge />
            </div>
          </motion.div>

          {/* Hero Name / Statement */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-[var(--color-crimson)] uppercase mb-3 flex items-center gap-2"
            >
              <span>👋</span>
              <span>Hello, I'm</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl font-extrabold tracking-tight text-[var(--color-paper)] leading-[1.05]"
            >
              {homeData.headline || "Alif Haikal Nayaza"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg md:text-xl 2xl:text-2xl text-[var(--color-muted)] max-w-4xl leading-relaxed font-normal"
            >
              {homeData.subtitle ||
                "I build web applications, interactive interfaces, and digital products. Focused on clean code, fast performance, and practical user experience."}
            </motion.p>

            {/* Quick Action Buttons with Spring Dynamics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/projects"
                  className="px-6 py-3 rounded-full bg-[var(--color-crimson)] text-white font-mono text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[var(--color-crimson-shadow)] flex items-center gap-2"
                >
                  <span>Check Projects</span>
                  <span>↓</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-paper)] font-mono text-xs font-semibold tracking-wider hover:border-[var(--color-crimson)] hover:bg-[var(--color-line)] transition-all"
                >
                  Get In Touch →
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* === KINETIC TICKER === */}
        <TechTicker />

        {/* === CREATIVE BENTO GRID === */}
        <section className="my-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: 3D Tilt Profile Photo Card (5 cols) */}
            <div className="md:col-span-5">
              <ProfileCard images={images} name={homeData.logoName || "Alraf"} />
            </div>

            {/* Right: Quick Bento Info (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between gap-6">
              
              {/* Bio Card */}
              <div className="p-7 sm:p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm flex-1 flex flex-col justify-between hover:border-[var(--color-crimson)]/50 transition-all duration-300">
                <div>
                  <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-wider block mb-2">
                    ABOUT ME
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-paper)] mb-3">
                    Developer who enjoys building practical tools and smooth interfaces.
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-4 font-normal">
                    {data?.profile?.about ||
                      "I work across the full stack, from responsive frontend layouts with React and Tailwind to backend APIs and databases with Node.js and MongoDB. Always curious to explore new frameworks and improve my craft."}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[var(--color-border)] flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--color-muted)]">
                    📍 {aboutPageData.location || "Indonesia • Remote"}
                  </span>
                  <Link
                    to="/about"
                    className="font-mono text-xs font-semibold text-[var(--color-crimson)] hover:underline flex items-center gap-1"
                  >
                    <span>Read Story</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Quick Metrics & Highlights */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                <div className="p-3 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--card-bg)] text-center hover:border-[var(--color-crimson)]/50 transition-all duration-300">
                  <div className="font-display text-xl sm:text-3xl font-extrabold text-[var(--color-paper)]">
                    {projects.length}+
                  </div>
                  <div className="font-mono text-[9px] sm:text-[10px] text-[var(--color-muted)] uppercase tracking-wider mt-0.5">
                    Projects
                  </div>
                </div>

                <div className="p-3 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--card-bg)] text-center hover:border-[var(--color-crimson)]/50 transition-all duration-300">
                  <div className="font-display text-xl sm:text-3xl font-extrabold text-[var(--color-crimson)]">
                    100%
                  </div>
                  <div className="font-mono text-[9px] sm:text-[10px] text-[var(--color-muted)] uppercase tracking-wider mt-0.5">
                    Full-Stack
                  </div>
                </div>

                <div className="p-3 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--card-bg)] text-center hover:border-[var(--color-crimson)]/50 transition-all duration-300">
                  <div className="font-display text-xl sm:text-3xl font-extrabold text-[var(--color-paper)]">
                    {allSkills.length}+
                  </div>
                  <div className="font-mono text-[9px] sm:text-[10px] text-[var(--color-muted)] uppercase tracking-wider mt-0.5">
                    Tools
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* === FEATURED PROJECTS === */}
        <section className="my-20">
          <SectionHeader
            index="01 / WORK"
            title="Selected Projects"
            description="A few web applications and tools I've built recently."
            linkTo="/projects"
            linkText="All Projects"
          />

          {/* Responsive Grid: 2-col on mobile, 4-col on desktop */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {featuredProjects.map((project, index) => (
              <InteractiveProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* === SKILLS / TOOLBOX === */}
        {allSkills.length > 0 && (
          <section className="my-20">
            <SectionHeader
              index="02 / TOOLBOX"
              title="Technologies & Stacks"
              description="Tools and languages I frequently work with."
            />

            <div className="p-7 sm:p-10 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm">
              <div className="flex flex-wrap gap-2.5">
                {allSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-line)] text-xs font-mono font-medium text-[var(--color-paper)] hover:border-[var(--color-crimson)] hover:text-[var(--color-crimson)] transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* === CASUAL CONTACT BANNER === */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 sm:mt-16 mb-2"
        >
          <div className="p-7 sm:p-12 md:p-14 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-xl relative overflow-hidden text-center group hover:border-[var(--color-crimson)]/50 transition-all duration-500">
            {/* Ambient Background Aura */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--color-crimson)]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-widest block mb-2 relative z-10">
              03 / CONTACT
            </span>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-[var(--color-paper)] tracking-tight max-w-xl mx-auto relative z-10">
              Got an idea or want to work together?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[var(--color-muted)] mt-2.5 max-w-md mx-auto leading-relaxed relative z-10 font-normal">
              My inbox is always open. Let's talk about projects, opportunities, or tech.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 relative z-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="px-7 py-3 rounded-full bg-[var(--color-crimson)] text-white font-mono text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[var(--color-crimson-shadow)] flex items-center gap-2"
                >
                  <span>Send a Message</span>
                  <span>→</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

      </div>
    </PageTransition>
  );
}