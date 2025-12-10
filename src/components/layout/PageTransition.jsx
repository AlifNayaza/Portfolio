import { motion } from "framer-motion";

const blackBox = {
  initial: {
    height: "100vh",
    bottom: 0,
  },
  animate: {
    height: 0,
    transition: {
      when: "afterChildren",
      duration: 1.2,
      ease: [0.87, 0, 0.13, 1], // Bezier curve untuk efek cinematic
    },
  },
  exit: {
    height: "100vh",
    top: 0,
    transition: {
      duration: 0.8,
      ease: [0.87, 0, 0.13, 1],
    },
  },
};

const textContainer = {
  initial: { opacity: 1 },
  animate: {
    opacity: 0,
    transition: { duration: 0.3, when: "afterChildren" },
  },
};

export default function PageTransition({ children }) {
  return (
    <div className="relative">
      {/* Konten Halaman */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }} // Delay konten muncul setelah layar hitam turun
      >
        {children}
      </motion.div>

      {/* Tirai Hitam (Overlay) */}
      <motion.div
        className="fixed inset-0 z-[100] w-full bg-[#0c0c0c] flex items-center justify-center pointer-events-none border-b border-[#9f1239]"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={blackBox}
      >
        <motion.div variants={textContainer} className="font-mono text-xs text-[#9f1239] tracking-[0.5em]">
          LOADING CHAPTER...
        </motion.div>
      </motion.div>
    </div>
  );
}