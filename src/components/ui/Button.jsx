import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export default function Button({ children, className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-primary text-white hover:bg-red-700 shadow-lg shadow-red-900/20",
    outline: "border border-zinc-700 text-zinc-300 hover:border-primary hover:text-primary bg-transparent",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={cn("px-6 py-2.5 rounded-full font-bold text-sm transition-colors", variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}