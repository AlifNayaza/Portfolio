/* eslint-disable */
import { motion } from "framer-motion";
import { memo } from "react";

const blackBox = {
  initial: { height: "100vh", bottom: 0 },
  animate: {
    height: 0,
    transition: { when: "afterChildren", duration: 0.8, ease: [0.87, 0, 0.13, 1] },
  },
  exit: {
    height: "100vh",
    top: 0,
    transition: { duration: 0.6, ease: [0.87, 0, 0.13, 1] },
  },
};

const textContainer = {
  initial: { opacity: 1 },
  animate: { opacity: 0, transition: { duration: 0.3, when: "afterChildren" } },
};

const PageTransition = memo(({ children }) => {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {children}
      </motion.div>

      <motion.div
        className="fixed inset-0 z-[100] w-full flex items-center justify-center pointer-events-none"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-crimson)'
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={blackBox}
      >
        <motion.div 
          variants={textContainer} 
          className="font-mono text-xs tracking-[0.5em]"
          style={{ color: 'var(--color-crimson)' }}
        >
          LOADING...
        </motion.div>
      </motion.div>
    </div>
  );
});

PageTransition.displayName = 'PageTransition';

export default PageTransition;