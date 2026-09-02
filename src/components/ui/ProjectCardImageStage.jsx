/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectCardImageStage({ images = [], fallbackImage = "", title = "Project" }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Normalize images array
  const validImages = Array.isArray(images) && images.length > 0 
    ? images.filter(img => typeof img === "string" && img.trim() !== "") 
    : (fallbackImage ? [fallbackImage] : []);

  const total = validImages.length;
  const currentImage = validImages[currentIdx] || fallbackImage || "";

  // Auto-slide on hover when there are multiple images
  useEffect(() => {
    if (!isHovered || total <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % total);
    }, 2400);
    return () => clearInterval(interval);
  }, [isHovered, total]);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + total) % total);
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % total);
  };

  const handleSelectDot = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx(index);
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--color-line)] relative mb-3 sm:mb-4 select-none group/img"
    >
      {/* Current Image */}
      {currentImage ? (
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIdx}
            src={currentImage}
            alt={`${title} preview ${currentIdx + 1}`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </AnimatePresence>
      ) : (
        <div className="w-full h-full flex items-center justify-center font-display text-2xl sm:text-4xl text-[var(--color-muted)]">
          ⚡
        </div>
      )}

      {/* Subtle Gradient Shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Multiple Image Badge / Counter */}
      {total > 1 && (
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-md">
            📷 {currentIdx + 1}/{total}
          </span>
        </div>
      )}

      {/* Interactive Left & Right Navigation Arrows */}
      {total > 1 && (
        <div className="absolute inset-y-0 inset-x-1.5 flex items-center justify-between z-20 pointer-events-none">
          <button
            type="button"
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-black/70 hover:bg-[var(--color-crimson)] text-white border border-white/20 flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-all pointer-events-auto active:scale-90 shadow-md"
            aria-label="Previous image"
            title="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-black/70 hover:bg-[var(--color-crimson)] text-white border border-white/20 flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-all pointer-events-auto active:scale-90 shadow-md"
            aria-label="Next image"
            title="Next image"
          >
            ›
          </button>
        </div>
      )}

      {/* Interactive Indicator Dots at Bottom Center */}
      {total > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 opacity-80 group-hover/img:opacity-100 transition-opacity">
          {validImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => handleSelectDot(e, i)}
              className={`transition-all rounded-full ${
                i === currentIdx
                  ? "w-3.5 h-1.5 bg-[var(--color-crimson)]"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Quick Case Study Pill (Hidden on Mobile) */}
      {total === 1 && (
        <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
            VIEW CASE STUDY
          </span>
        </div>
      )}
    </div>
  );
}
