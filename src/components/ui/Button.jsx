import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export default function Button({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  icon,
  iconPosition = "right",
  ...props 
}) {
  const variants = {
    primary: "bg-gradient-to-r from-[#9f1239] to-[#c2410c] text-white shadow-lg shadow-[#9f1239]/30 hover:shadow-[#9f1239]/50 border border-[#9f1239]/50 hover:border-[#9f1239]",
    outline: "border-2 border-[#333] text-zinc-300 hover:border-[#9f1239] hover:text-white bg-transparent hover:bg-[#9f1239]/10",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10",
    glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-xl",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative rounded-lg font-bold transition-all duration-300 overflow-hidden group inline-flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Icon Left */}
      {icon && iconPosition === "left" && (
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          className="relative z-10"
        >
          {icon}
        </motion.span>
      )}

      {/* Content */}
      <span className="relative z-10 tracking-wide">
        {children}
      </span>

      {/* Icon Right */}
      {icon && iconPosition === "right" && (
        <motion.span
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          className="relative z-10"
        >
          {icon}
        </motion.span>
      )}

      {/* Corner decorations for primary variant */}
      {variant === "primary" && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/30"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/30"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          />
        </>
      )}
    </motion.button>
  );
}