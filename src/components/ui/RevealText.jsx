import { motion } from "framer-motion";

export default function RevealText({ text, className, delay = 0, type = "word" }) {
  // Jika teks kosong/undefined
  if (!text) return null;

  // Split berdasarkan kata atau huruf
  const items = type === "word" ? text.split(" ") : text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i + delay },
    }),
  };

  const child = {
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
  };

  return (
    <motion.span
      className={`inline-block overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {items.map((item, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block mr-[0.2em] last:mr-0"
        >
          {item === " " ? "\u00A0" : item}
        </motion.span>
      ))}
    </motion.span>
  );
}