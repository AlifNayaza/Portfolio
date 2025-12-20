import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "../../lib/utils";

export default function Input({ 
  label, 
  className, 
  textarea, 
  error,
  icon,
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const Comp = textarea ? "textarea" : "input";

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    if (props.onChange) props.onChange(e);
  };

  return (
    <div className="space-y-2 w-full">
      {/* Label with animation */}
      {label && (
        <motion.label 
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500"
          animate={{ 
            color: isFocused ? "#9f1239" : "#71717a",
            x: isFocused ? 2 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          {icon && (
            <motion.span
              animate={{ 
                scale: isFocused ? 1.1 : 1,
                rotate: isFocused ? 10 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.span>
          )}
          {label}
        </motion.label>
      )}
      
      {/* Input container */}
      <div className="relative group">
        {/* Animated border glow */}
        <motion.div
          className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#9f1239] to-[#c2410c] opacity-0 blur transition-opacity"
          animate={{ 
            opacity: isFocused ? 0.3 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Input field */}
        <Comp
          className={cn(
            "relative w-full bg-[#0c0c0c] border rounded-lg p-3 md:p-4 outline-none transition-all duration-300 placeholder:text-zinc-700 font-serif",
            "focus:ring-2 focus:ring-[#9f1239]/50",
            isFocused || hasValue
              ? "border-[#9f1239] text-white"
              : "border-[#333] text-zinc-400",
            error && "border-red-500 focus:ring-red-500/50",
            textarea && "min-h-[120px] resize-y",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          {...props}
        />

        {/* Corner decorations on focus */}
        {isFocused && (
          <>
            <motion.div
              className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#9f1239]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#9f1239]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#9f1239]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#9f1239]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            />
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 font-mono flex items-center gap-1"
        >
          <span>⚠</span>
          {error}
        </motion.p>
      )}
    </div>
  );
}