/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  // Direct GPU Motion Values (ZERO React re-renders on mousemove)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Fast, lightweight spring physics for trailing ring
  const ringX = useSpring(cursorX, { stiffness: 600, damping: 35, mass: 0.1 });
  const ringY = useSpring(cursorY, { stiffness: 600, damping: 35, mass: 0.1 });

  useEffect(() => {
    if (isTouch) return;

    let rafId = null;

    const mouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const mouseLeave = () => setIsVisible(false);
    const mouseEnter = () => setIsVisible(true);

    const mouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("a") || 
        target.closest("button") ||
        target.classList.contains("hover-trigger") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", mouseMove, { passive: true });
    window.addEventListener("mouseover", mouseOver, { passive: true });
    document.addEventListener("mouseleave", mouseLeave);
    document.addEventListener("mouseenter", mouseEnter);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", mouseOver);
      document.removeEventListener("mouseleave", mouseLeave);
      document.removeEventListener("mouseenter", mouseEnter);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible, isTouch, cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <>
      {/* Small precise center dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          backgroundColor: "var(--color-crimson)",
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Smooth outer trailing ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          border: isHovering 
            ? "1.5px solid var(--color-crimson)" 
            : "1px solid var(--color-paper)",
          backgroundColor: isHovering ? "rgba(220, 38, 38, 0.08)" : "transparent",
          willChange: "transform",
        }}
        animate={{
          width: isHovering ? 48 : 28,
          height: isHovering ? 48 : 28,
          opacity: isVisible ? (isHovering ? 0.9 : 0.4) : 0,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
    </>
  );
}