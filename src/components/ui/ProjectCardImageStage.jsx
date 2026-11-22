/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff } from "lucide-react";
import { optimizeImage } from "../../lib/utils";

/**
 * Image stage used inside project cards. Cards are links, so the in-card
 * controls are pointer/touch conveniences rendered as non-focusable spans
 * (no interactive content nested inside <a>). Keyboard and screen-reader
 * users get the full gallery on the case-study page.
 */
export default function ProjectCardImageStage({ images = [], fallbackImage = "", title = "Project", priority = false }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [failed, setFailed] = useState({});

  // Normalize images array
  const validImages = Array.isArray(images) && images.length > 0
    ? images.filter(img => typeof img === "string" && img.trim() !== "")
    : (fallbackImage ? [fallbackImage] : []);

  const total = validImages.length;
  const currentImage = validImages[currentIdx] || fallbackImage || "";
  const showImage = currentImage && !failed[currentIdx];

  // Auto-slide on hover when there are multiple images
  useEffect(() => {
    if (!isHovered || total <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % total);
    }, 2400);
    return () => clearInterval(interval);
  }, [isHovered, total]);

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePrev = (e) => {
    stop(e);
    setCurrentIdx((prev) => (prev - 1 + total) % total);
  };

  const handleNext = (e) => {
    stop(e);
    setCurrentIdx((prev) => (prev + 1) % total);
  };

  const handleSelectDot = (e, index) => {
    stop(e);
    setCurrentIdx(index);
  };

  const arrowClass =
    "pointer-events-auto cursor-pointer w-8 h-8 rounded-full bg-black/70 hover:bg-[var(--color-accent-fill)] text-white border border-white/20 flex items-center justify-center text-sm opacity-0 group-hover/img:opacity-100 [@media(hover:none)]:opacity-90 transition-all active:scale-90 shadow-md";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--color-line)] relative mb-3 sm:mb-4 select-none group/img"
    >
      {showImage ? (
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIdx}
            src={optimizeImage(currentImage, 800)}
            alt={`${title} preview ${currentIdx + 1}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            width={800}
            height={500}
            onError={() => setFailed((f) => ({ ...f, [currentIdx]: true }))}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </AnimatePresence>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-dot-pattern text-[var(--color-muted)]">
          <ImageOff size={22} aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-wider">No preview</span>
        </div>
      )}

      {/* Subtle Gradient Shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Multiple Image Counter */}
      {total > 1 && (
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-md">
            {currentIdx + 1}/{total}
          </span>
        </div>
      )}

      {/* Pointer-only navigation (hidden from assistive tech, see note above) */}
      {total > 1 && (
        <div aria-hidden="true" className="absolute inset-y-0 inset-x-1.5 flex items-center justify-between z-20 pointer-events-none">
          <span role="presentation" onClick={handlePrev} className={arrowClass}>‹</span>
          <span role="presentation" onClick={handleNext} className={arrowClass}>›</span>
        </div>
      )}

      {total > 1 && (
        <div
          aria-hidden="true"
          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-1"
        >
          {validImages.map((_, i) => (
            <span
              key={i}
              role="presentation"
              onClick={(e) => handleSelectDot(e, i)}
              className="cursor-pointer p-1.5 flex items-center"
            >
              <span
                className={`block rounded-full transition-all ${
                  i === currentIdx ? "w-3.5 h-1.5 bg-[var(--color-crimson)]" : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                }`}
              />
            </span>
          ))}
        </div>
      )}

      {/* Case-study hint (desktop hover only) */}
      {total === 1 && (
        <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
            View case study
          </span>
        </div>
      )}
    </div>
  );
}
