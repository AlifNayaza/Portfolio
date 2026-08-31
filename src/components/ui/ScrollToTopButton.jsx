/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY > 280);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent(Math.round((currentScrollY / totalHeight) * 100));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (navigator.vibrate) navigator.vibrate(25);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-40 select-none group"
        >
          <button
            onClick={scrollToTop}
            className="relative w-11 h-11 rounded-full bg-[var(--card-bg)] border border-[var(--color-border)] shadow-xl flex items-center justify-center text-[var(--color-paper)] hover:text-[var(--color-crimson)] hover:border-[var(--color-crimson)] transition-all active:scale-90"
            aria-label="Scroll back to top"
            title="Scroll to top"
          >
            {/* Circular SVG Scroll Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36">
              <path
                className="text-[var(--color-line)] stroke-current"
                strokeWidth="2.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[var(--color-crimson)] stroke-current transition-all duration-150"
                strokeDasharray={`${scrollPercent}, 100`}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            {/* Icon / Percentage on hover */}
            <span className="font-mono text-xs font-bold transition-transform group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>

          {/* Quick Tooltip on Desktop */}
          <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--color-border)] text-[10px] font-mono font-medium text-[var(--color-muted)] whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
            {scrollPercent}% • Top
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
