import { motion } from "framer-motion";

export default function RevealText({ 
  text, 
  className, 
  delay = 0, 
  type = "word",
  effect = "fade" // "fade", "slide", "blur", "scale"
}) {
  if (!text) return null;

  const items = type === "word" ? text.split(" ") : text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.08, 
        delayChildren: 0.04 * i + delay 
      },
    }),
  };

  const effectVariants = {
    fade: {
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
      hidden: {
        opacity: 0,
        y: 20,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
    },
    slide: {
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          damping: 15,
          stiffness: 120,
        },
      },
      hidden: {
        opacity: 0,
        x: -30,
      },
    },
    blur: {
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        transition: {
          duration: 0.4,
          ease: "easeOut"
        },
      },
      hidden: {
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.9,
      },
    },
    scale: {
      visible: {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        transition: {
          type: "spring",
          damping: 10,
          stiffness: 100,
        },
      },
      hidden: {
        opacity: 0,
        scale: 0.5,
        rotateX: -90,
      },
    }
  };

  const child = effectVariants[effect] || effectVariants.fade;

  return (
    <motion.span
      className={`inline-block overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {items.map((item, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block mr-[0.25em] last:mr-0"
          style={{ 
            transformOrigin: "center",
            perspective: "1000px"
          }}
        >
          {item === " " ? "\u00A0" : item}
        </motion.span>
      ))}
    </motion.span>
  );
}