/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// === LIGHTBOX MULTI-IMAGE MODAL ===
const ImageModal = ({ isOpen, onClose, images = [], activeIndex = 0, onNavigate, alt }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onNavigate && images.length > 1) {
        onNavigate((activeIndex - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight" && onNavigate && images.length > 1) {
        onNavigate((activeIndex + 1) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[activeIndex] || images[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-md cursor-zoom-out select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-auto">
          <span className="font-mono text-xs font-bold text-[var(--color-crimson)]">
            📷 {activeIndex + 1} / {images.length}
          </span>
          {images.length > 1 && (
            <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
              (Use ← → keys to navigate)
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-black/60 hover:bg-[var(--color-crimson)] border border-white/10 text-white flex items-center justify-center font-mono text-base transition-colors pointer-events-auto shadow-lg"
          aria-label="Close image modal"
        >
          ✕
        </button>
      </div>

      {/* Prev Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((activeIndex - 1 + images.length) % images.length);
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[var(--color-crimson)] text-white border border-white/15 flex items-center justify-center text-lg transition-all shadow-xl active:scale-90"
          aria-label="Previous screenshot"
        >
          ←
        </button>
      )}

      {/* Main Zoomed Image */}
      <motion.img
        key={activeIndex}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        src={currentImage}
        alt={alt || "Project showcase"}
        className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((activeIndex + 1) % images.length);
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[var(--color-crimson)] text-white border border-white/15 flex items-center justify-center text-lg transition-all shadow-xl active:scale-90"
          aria-label="Next screenshot"
        >
          →
        </button>
      )}
    </motion.div>
  );
};

// === EXTRACTOR: SHORT PUNCHY HIGHLIGHTS ===
const extractHighlights = (text) => {
  if (!text) return [];
  const rawParagraphs = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  
  const highlights = [];
  rawParagraphs.forEach((p, idx) => {
    const lower = p.toLowerCase();
    let title = "Feature";
    let icon = "✦";

    if (lower.includes("admin") || lower.includes("dashboard") || lower.includes("role")) {
      icon = "🔒";
      title = "Role-Protected Management";
    } else if (lower.includes("chat") || lower.includes("socket") || lower.includes("real-time") || lower.includes("realtime")) {
      icon = "💬";
      title = "Real-Time Communication";
    } else if (lower.includes("frontend") || lower.includes("interface") || lower.includes("ui") || lower.includes("react")) {
      icon = "🎨";
      title = "Modern Responsive UI";
    } else if (lower.includes("performance") || lower.includes("lazy") || lower.includes("optimized") || lower.includes("fast")) {
      icon = "⚡";
      title = "Optimized Performance";
    } else if (lower.includes("database") || lower.includes("api") || lower.includes("backend")) {
      icon = "⚙️";
      title = "Structured Backend & APIs";
    } else if (lower.includes("queue") || lower.includes("appointment") || lower.includes("schedule")) {
      icon = "📊";
      title = "Smart Workflow & Queues";
    } else if (lower.includes("library") || lower.includes("read") || lower.includes("comic") || lower.includes("book")) {
      icon = "📚";
      title = "Interactive Library System";
    } else {
      icon = "🚀";
      title = `Key Capability #${idx + 1}`;
    }

    const firstSentence = p.split(/(?<=[.?!])\s+/)[0] || p;
    highlights.push({
      icon,
      title,
      summary: firstSentence.length > 150 ? firstSentence.slice(0, 147) + "..." : firstSentence,
      fullText: p,
    });
  });

  return highlights;
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = usePortfolio();
  
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showFullStory, setShowFullStory] = useState(false);
  const [galleryMode, setGalleryMode] = useState("slider"); // "slider" | "grid"
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const projectIndex = parseInt(id);
  const projects = data?.projects || [];
  const project = projects[projectIndex];

  // Normalize project images
  const projectImages = useMemo(() => {
    if (!project) return [];
    if (Array.isArray(project.images) && project.images.length > 0) {
      return project.images.filter(img => typeof img === "string" && img.trim() !== "");
    }
    if (project.image && typeof project.image === "string" && project.image.trim() !== "") {
      return [project.image];
    }
    return [];
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-[var(--color-crimson)] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-mono text-xs text-[var(--color-muted)] tracking-widest uppercase">
          Loading Project...
        </span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-24 p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] my-12 max-w-2xl mx-auto">
        <span className="text-5xl mb-4 block">🔍</span>
        <h1 className="font-display text-3xl font-bold text-[var(--color-paper)] mb-3">
          Project Not Found
        </h1>
        <p className="text-sm text-[var(--color-muted)] mb-8">
          The requested project does not exist in the catalog.
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="px-6 py-3 rounded-full bg-[var(--color-crimson)] text-white font-mono text-xs font-bold"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  const prevIndex = projectIndex > 0 ? projectIndex - 1 : null;
  const nextIndex = projectIndex < projects.length - 1 ? projectIndex + 1 : null;
  
  const rawParagraphs = (project.description || "").split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const leadSummary = rawParagraphs[0] || "A modern web application built with clean architecture and responsive user experience.";
  const highlights = extractHighlights(project.description);

  const handlePrevImage = () => {
    if (projectImages.length <= 1) return;
    setDirection(-1);
    setActiveImageIdx((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const handleNextImage = () => {
    if (projectImages.length <= 1) return;
    setDirection(1);
    setActiveImageIdx((prev) => (prev + 1) % projectImages.length);
  };

  const handleShare = async () => {
    if (navigator.vibrate) navigator.vibrate(25);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${project.name} | Project Case Study`,
          text: `Check out ${project.name} by Alif Haikal Nayaza`,
          url: window.location.href,
        });
      } catch {
        // User dismissed share dialog
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Project link copied to clipboard!", { id: "share-proj" });
    }
  };

  return (
    <PageTransition>
      <div className="relative pb-4 sm:pb-8 w-full">
        
        {/* Lightbox Multi-Image Modal */}
        <AnimatePresence>
          {isZoomed && (
            <ImageModal
              isOpen={isZoomed}
              images={projectImages}
              activeIndex={activeImageIdx}
              onNavigate={(newIdx) => setActiveImageIdx(newIdx)}
              alt={project.name}
              onClose={() => setIsZoomed(false)}
            />
          )}
        </AnimatePresence>

        {/* === BACK BREADCRUMB & SHARE === */}
        <div className="pt-2 pb-5 flex items-center justify-between">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-crimson)] transition-colors"
          >
            <span>←</span>
            <span>All Projects</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-crimson)] transition-colors"
            title="Share project"
          >
            <span>🔗</span>
            <span>Share</span>
          </button>
        </div>

        {/* === HERO PROJECT INFO === */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full font-mono text-[10px] font-bold bg-[var(--color-line)] text-[var(--color-crimson)] border border-[var(--color-border)]">
              PROJECT #{projectIndex + 1}
            </span>
            <span className="px-3 py-1 rounded-full font-mono text-[10px] text-[var(--color-muted)] border border-[var(--color-border)] bg-[var(--card-bg)]">
              Web Application
            </span>
            <span className="px-3 py-1 rounded-full font-mono text-[10px] text-[var(--color-muted)] border border-[var(--color-border)] bg-[var(--card-bg)]">
              ⏱️ ~2 min case study
            </span>
            {projectImages.length > 1 && (
              <span className="px-3 py-1 rounded-full font-mono text-[10px] text-[var(--color-crimson)] border border-[var(--color-border)] bg-[var(--card-bg)] font-bold">
                📷 {projectImages.length} Screenshots
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--color-paper)] tracking-tight leading-[1.05] mb-4">
            {project.name}
          </h1>

          {/* Punchy 1-sentence Lead Summary */}
          <p className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed max-w-4xl font-normal">
            {leadSummary}
          </p>

          {/* Action Link Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[var(--color-crimson)] text-white font-mono text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-md flex items-center gap-2"
              >
                <span>Visit Live Application</span>
                <span>↗</span>
              </a>
            )}

            <button
              onClick={handleShare}
              className="px-5 py-3 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-paper)] font-mono text-xs font-semibold tracking-wider hover:border-[var(--color-crimson)] hover:bg-[var(--color-line)] transition-all flex items-center gap-2"
            >
              <span>🔗</span>
              <span>Share Project</span>
            </button>
          </div>
        </section>

        {/* === MULTI-IMAGE PROJECT GALLERY SHOWCASE === */}
        {projectImages.length > 0 && (
          <section className="my-10 space-y-4">
            
            {/* Gallery Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-wider">
                  PROJECT SCREENSHOTS & DEMO
                </span>
                <span className="font-mono text-xs text-[var(--color-muted)]">
                  ({projectImages.length} images)
                </span>
              </div>

              {/* View Switcher: Slider vs Grid */}
              {projectImages.length > 1 && (
                <div className="flex items-center p-1 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm">
                  <button
                    onClick={() => setGalleryMode("slider")}
                    className={`px-3 py-1 rounded-full font-mono text-xs transition-all ${
                      galleryMode === "slider"
                        ? "bg-[var(--color-crimson)] text-white font-bold"
                        : "text-[var(--color-muted)] hover:text-[var(--color-paper)]"
                    }`}
                  >
                    🖼️ Slider
                  </button>
                  <button
                    onClick={() => setGalleryMode("grid")}
                    className={`px-3 py-1 rounded-full font-mono text-xs transition-all ${
                      galleryMode === "grid"
                        ? "bg-[var(--color-crimson)] text-white font-bold"
                        : "text-[var(--color-muted)] hover:text-[var(--color-paper)]"
                    }`}
                  >
                    ⊞ All ({projectImages.length})
                  </button>
                </div>
              )}
            </div>

            {/* Mode 1: Slider View */}
            {galleryMode === "slider" ? (
              <div className="space-y-3">
                {/* Main Showcase Stage */}
                <div
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--card-bg)] shadow-xl cursor-zoom-in select-none"
                  onClick={() => setIsZoomed(true)}
                >
                  <div className="aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[var(--color-line)] relative">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                      <motion.img
                        key={activeImageIdx}
                        src={projectImages[activeImageIdx]}
                        alt={`${project.name} screenshot ${activeImageIdx + 1}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    </AnimatePresence>

                    {/* Left / Right Nav Arrows Overlay */}
                    {projectImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevImage();
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[var(--color-crimson)] text-white border border-white/20 flex items-center justify-center text-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"
                          aria-label="Previous screenshot"
                        >
                          ←
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextImage();
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[var(--color-crimson)] text-white border border-white/20 flex items-center justify-center text-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"
                          aria-label="Next screenshot"
                        >
                          →
                        </button>
                      </>
                    )}

                    {/* Screenshot Counter Pill on Stage */}
                    <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-mono text-[11px] font-bold">
                      {activeImageIdx + 1} / {projectImages.length}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="p-3.5 sm:p-4 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs text-[var(--color-muted)] bg-[var(--card-bg)]">
                    <span className="text-[11px] sm:text-xs">
                      Tap image to expand full resolution lightbox
                    </span>
                    <span className="text-[var(--color-crimson)] font-bold flex items-center gap-1">
                      <span>🔍</span>
                      <span>ZOOM FULLSCREEN</span>
                    </span>
                  </div>
                </div>

                {/* Horizontal Thumbnail Strip */}
                {projectImages.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto py-2 px-1 scrollbar-none">
                    {projectImages.map((imgUrl, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDirection(i > activeImageIdx ? 1 : -1);
                          setActiveImageIdx(i);
                        }}
                        className={`relative flex-shrink-0 w-20 sm:w-28 aspect-[16/10] rounded-xl overflow-hidden border transition-all ${
                          i === activeImageIdx
                            ? "border-[var(--color-crimson)] ring-2 ring-[var(--color-crimson)]/40 scale-105 shadow-md"
                            : "border-[var(--color-border)] opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 font-mono text-[9px] px-1 py-0.2 rounded bg-black/70 text-white">
                          #{i + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Mode 2: Multi-Image Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {projectImages.map((imgUrl, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setActiveImageIdx(idx);
                      setIsZoomed(true);
                    }}
                    className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--card-bg)] shadow-md hover:border-[var(--color-crimson)] cursor-zoom-in transition-all"
                  >
                    <img
                      src={imgUrl}
                      alt={`${project.name} screenshot ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                        🔍 View #{idx + 1}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </section>
        )}

        {/* === PUNCHY SCANNABLE HIGHLIGHTS BENTO === */}
        {highlights.length > 0 && (
          <section className="my-10 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-wider">
                KEY HIGHLIGHTS & ARCHITECTURE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm hover:border-[var(--color-crimson)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{item.icon}</span>
                      <h3 className="font-display font-bold text-sm sm:text-base text-[var(--color-paper)]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed font-normal">
                      {item.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* === EXPANDABLE IN-DEPTH STORY (OPTIONAL TOGGLE) === */}
        {rawParagraphs.length > 1 && (
          <section className="my-8">
            <button
              onClick={() => setShowFullStory(!showFullStory)}
              className="w-full p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-line)]/50 hover:bg-[var(--color-line)] font-mono text-xs font-semibold text-[var(--color-paper)] flex items-center justify-between transition-all"
            >
              <span>{showFullStory ? "Hide Full Narrative Details" : "Read Full In-Depth Breakdown"}</span>
              <span className="text-[var(--color-crimson)]">{showFullStory ? "▲" : "▼"}</span>
            </button>

            <AnimatePresence>
              {showFullStory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4 p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--card-bg)] space-y-4"
                >
                  {rawParagraphs.map((para, i) => (
                    <p key={i} className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed font-normal">
                      {para}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* === TECH STACK CHIPS === */}
        {project.technologies && project.technologies.length > 0 && (
          <section className="my-10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm">
            <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-wider block mb-4">
              TECHNOLOGIES USED
            </span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-line)] text-xs font-mono font-medium text-[var(--color-paper)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* === NEXT / PREV NAVIGATION RIBBON === */}
        <section className="mt-14 pt-6 border-t border-[var(--color-border)] grid grid-cols-2 gap-3 sm:gap-4">
          {prevIndex !== null ? (
            <Link
              to={`/project/${prevIndex}`}
              className="p-3.5 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--card-bg)] hover:border-[var(--color-crimson)] transition-all group"
            >
              <span className="font-mono text-[9px] sm:text-[10px] text-[var(--color-muted)] uppercase tracking-wider block mb-1">
                ← PREVIOUS
              </span>
              <h4 className="font-display font-bold text-xs sm:text-sm text-[var(--color-paper)] group-hover:text-[var(--color-crimson)] transition-colors truncate">
                {projects[prevIndex].name}
              </h4>
            </Link>
          ) : <div />}

          {nextIndex !== null ? (
            <Link
              to={`/project/${nextIndex}`}
              className="p-3.5 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--card-bg)] hover:border-[var(--color-crimson)] transition-all text-right group col-start-2"
            >
              <span className="font-mono text-[9px] sm:text-[10px] text-[var(--color-muted)] uppercase tracking-wider block mb-1">
                NEXT →
              </span>
              <h4 className="font-display font-bold text-xs sm:text-sm text-[var(--color-paper)] group-hover:text-[var(--color-crimson)] transition-colors truncate">
                {projects[nextIndex].name}
              </h4>
            </Link>
          ) : <div />}
        </section>

      </div>
    </PageTransition>
  );
}