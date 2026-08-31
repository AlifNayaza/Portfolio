/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { memo } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15, ease: "easeOut" } 
  },
};

const PageTransition = memo(({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative w-full"
    >
      {children}
    </motion.div>
  );
});

PageTransition.displayName = 'PageTransition';

export default PageTransition;