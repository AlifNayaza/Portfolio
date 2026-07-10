/* eslint-disable */
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
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider"
          animate={{ 
            color: isFocused ? "var(--color-crimson)" : "var(--color-muted)",
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
          className="absolute -inset-0.5 rounded-lg blur transition-opacity"
          style={{
            background: 'linear-gradient(to right, var(--color-crimson), var(--color-gold))'
          }}
          animate={{ 
            opacity: isFocused ? 0.3 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Input field */}
        <Comp
          className={cn(
            "relative w-full border rounded-lg p-3 md:p-4 outline-none transition-all duration-300 font-serif",
            textarea && "min-h-[120px] resize-y",
            className
          )}
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: error 
              ? '#ef4444' 
              : (isFocused || hasValue) 
                ? 'var(--color-crimson)' 
                : 'var(--color-border)',
            color: (isFocused || hasValue) ? 'var(--color-paper)' : 'var(--color-muted)',
            boxShadow: isFocused ? '0 0 0 2px rgba(159, 18, 57, 0.5)' : 'none'
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          {...props}
        />

        {/* Corner decorations on focus */}
        {isFocused && (
          <>
            <motion.div
              className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
              style={{ borderColor: 'var(--color-crimson)' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
              style={{ borderColor: 'var(--color-crimson)' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
              style={{ borderColor: 'var(--color-crimson)' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
              style={{ borderColor: 'var(--color-crimson)' }}
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
          className="text-xs font-mono flex items-center gap-1"
          style={{ color: '#ef4444' }}
        >
          <span>⚠</span>
          {error}
        </motion.p>
      )}
    </div>
  );
}