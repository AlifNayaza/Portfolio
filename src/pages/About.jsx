/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";

// === IMAGE LIGHTBOX MODAL ===
const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-[var(--color-crimson)] text-3xl font-mono transition-colors"
      >
        ✕
      </button>
      <motion.img
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        src={imageUrl}
        alt="Profile photo enlarged"
        className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

export default function About() {
  const { data } = usePortfolio();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [photoDirection, setPhotoDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const profile = data?.profile || {};
  const aboutPage = data?.aboutPage || {};

  const images = useMemo(() => {
    if (data?.profile?.images && data.profile.images.length > 0) return data.profile.images;
    if (data?.profile?.image) return [data.profile.image];
    return ["/img/default-profile.jpg"];
  }, [data]);

  // Auto-slide every 4.5s
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setPhotoDirection(1);
      setActivePhotoIdx((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [images.length, isPaused]);

  const handleNextPhoto = () => {
    setPhotoDirection(1);
    setActivePhotoIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevPhoto = () => {
    setPhotoDirection(-1);
    setActivePhotoIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const photoSlideVariants = {
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

  const coreValues = useMemo(() => {
    if (data?.aboutPage?.coreValues && data.aboutPage.coreValues.length > 0) {
      return data.aboutPage.coreValues;
    }
    return [
      {
        icon: "⚡",
        title: "Fast & Responsive",
        desc: "Building apps that load quickly and feel snappy across mobile and desktop.",
      },
      {
        icon: "📐",
        title: "Clean Structure",
        desc: "Writing organized, readable code that is easy to maintain and scale over time.",
      },
      {
        icon: "🎨",
        title: "Thoughtful UI",
        desc: "Paying attention to spacing, clear typography, and natural user interactions.",
      },
      {
        icon: "🤝",
        title: "Practical Solutions",
        desc: "Solving actual user problems with simple, robust, and reliable engineering.",
      },
    ];
  }, [data]);

  const allSkills = useMemo(() => {
    const map = {};
    if (data?.projects) {
      data.projects.forEach((p) => {
        p.technologies?.forEach((t) => {
          if (!map[t]) map[t] = { name: t, count: 0, projects: [] };
          map[t].count += 1;
          map[t].projects.push(p);
        });
      });
    }
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <PageTransition>
      <div className="relative pb-4 sm:pb-8 w-full">
        
        {/* Modal */}
        <AnimatePresence>
          {selectedImage && (
            <ImageModal
              isOpen={Boolean(selectedImage)}
              imageUrl={selectedImage}
              onClose={() => setSelectedImage(null)}
            />
          )}
        </AnimatePresence>

        {/* === HEADER SECTION === */}
        <section className="pt-6 pb-10">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--color-crimson)] tracking-widest uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-crimson)]" />
            <span>ABOUT & BACKGROUND</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[var(--color-paper)] leading-[1.05] max-w-5xl">
            A little bit about who I am and what I do.
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--color-muted)]">
            <span className="px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)]">
              📍 {aboutPage.location || "Indonesia • Remote"}
            </span>
            <span className="px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-crimson)] font-semibold">
              ✦ {aboutPage.specialization || "Software Developer"}
            </span>
            <span className="px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)] text-emerald-500 font-semibold">
              ● {aboutPage.availability || "Open to opportunities"}
            </span>
          </div>
        </section>

        {/* === EDITORIAL BIO & PHOTO GRID === */}
        <section className="my-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Profile Photo & Interactive Carousel (5 cols) */}
            <div className="md:col-span-5 md:sticky md:top-28 space-y-4 select-none">
              <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="group relative rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--card-bg)] shadow-xl"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[var(--color-line)] relative">
                  <AnimatePresence initial={false} custom={photoDirection} mode="popLayout">
                    <motion.img
                      key={activePhotoIdx}
                      src={images[activePhotoIdx]}
                      alt="Profile"
                      custom={photoDirection}
                      variants={photoSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, { offset, velocity }) => {
                        if (offset.x < -40 || velocity.x < -300) {
                          handleNextPhoto();
                        } else if (offset.x > 40 || velocity.x > 300) {
                          handlePrevPhoto();
                        }
                      }}
                      className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                    />
                  </AnimatePresence>

                  {/* Side Navigation Arrows (Hover / Touch) */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevPhoto();
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-[var(--color-crimson)] text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-xs opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all shadow-md active:scale-90"
                        aria-label="Previous photo"
                      >
                        ←
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextPhoto();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-[var(--color-crimson)] text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-xs opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all shadow-md active:scale-90"
                        aria-label="Next photo"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {/* Bottom Bar: Action & Photo Dots */}
                <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs text-[var(--color-muted)] bg-[var(--card-bg)]">
                  <button
                    onClick={() => setSelectedImage(images[activePhotoIdx])}
                    className="hover:text-[var(--color-crimson)] transition-colors flex items-center gap-1.5"
                  >
                    <span>🔍 Fullscreen</span>
                  </button>

                  {images.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setPhotoDirection(i > activePhotoIdx ? 1 : -1);
                            setActivePhotoIdx(i);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === activePhotoIdx ? "bg-[var(--color-crimson)] w-4" : "bg-[var(--color-border)] w-1.5"
                          }`}
                          aria-label={`Photo ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Thumbnails Strip (Scrollable / Clickable) */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPhotoDirection(i > activePhotoIdx ? 1 : -1);
                        setActivePhotoIdx(i);
                      }}
                      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border transition-all ${
                        i === activePhotoIdx
                          ? "border-[var(--color-crimson)] ring-2 ring-[var(--color-crimson)]/30 scale-105"
                          : "border-[var(--color-border)] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Gallery thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Narrative Story (7 cols) */}
            <div className="md:col-span-7 space-y-10">
              
              {/* Bio Narrative */}
              <div className="p-7 sm:p-9 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm space-y-5">
                <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-wider block">
                  BACKGROUND & CRAFT
                </span>

                <div className="text-sm sm:text-base text-[var(--color-paper)] leading-relaxed space-y-4 font-normal">
                  {profile.about ? (
                    profile.about.split("\n\n").map((para, i) => (
                      <p key={i} className="text-[var(--color-paper)]/90">
                        {para}
                      </p>
                    ))
                  ) : (
                    <p className="text-[var(--color-muted)]">
                      Software developer with a strong focus on building practical web applications, responsive user interfaces, and clean backend APIs.
                    </p>
                  )}
                </div>

                <div className="pt-5 border-t border-[var(--color-border)] flex flex-wrap gap-3.5">
                  <Link
                    to="/contact"
                    className="px-6 py-3 rounded-full bg-[var(--color-crimson)] text-white font-mono text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-md"
                  >
                    Contact Me →
                  </Link>
                  <Link
                    to="/projects"
                    className="px-6 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-paper)] font-mono text-xs font-semibold tracking-wider hover:border-[var(--color-crimson)] transition-all"
                  >
                    View Projects
                  </Link>
                </div>
              </div>

              {/* Core Approach Bento */}
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-paper)] mb-5">
                  How I Approach Building Software
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coreValues.map((val, idx) => (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--card-bg)] hover:border-[var(--color-crimson)] transition-all shadow-sm"
                    >
                      <span className="text-2xl mb-2.5 block">{val.icon || "✦"}</span>
                      <h4 className="font-display text-base sm:text-lg font-bold text-[var(--color-paper)] mb-1.5">
                        {val.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed font-normal">
                        {val.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* === SKILLS / TECH STACKS === */}
        {allSkills.length > 0 && (
          <section className="my-16 p-7 sm:p-10 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm">
            <div className="mb-6">
              <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-wider block mb-1">
                TECH TOOLS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-paper)]">
                Languages & Frameworks
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {allSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-line)] flex items-center justify-between"
                >
                  <span className="font-mono text-xs font-semibold text-[var(--color-paper)]">
                    {skill.name}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-crimson)] border border-[var(--color-border)] font-bold">
                    {skill.count}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </PageTransition>
  );
}