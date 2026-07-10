/* eslint-disable */
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
  const getVariantStyles = (variant) => {
    const styles = {
      primary: {
        background: 'linear-gradient(to right, var(--color-crimson), var(--color-gold))',
        color: 'white',
        border: '1px solid rgba(159, 18, 57, 0.5)',
        boxShadow: '0 10px 15px -3px rgba(159, 18, 57, 0.3)'
      },
      outline: {
        border: '2px solid var(--color-border)',
        color: 'var(--color-muted)',
        backgroundColor: 'transparent'
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-muted)',
        border: '1px solid transparent'
      },
      glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'var(--color-paper)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }
    };
    return styles[variant] || styles.primary;
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const variantStyles = getVariantStyles(variant);

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative rounded-lg font-bold transition-all duration-300 overflow-hidden group inline-flex items-center justify-center gap-2",
        sizes[size],
        className
      )}
      style={variantStyles}
      onMouseEnter={(e) => {
        if (variant === 'outline') {
          e.currentTarget.style.borderColor = 'var(--color-crimson)';
          e.currentTarget.style.color = 'var(--color-paper)';
          e.currentTarget.style.backgroundColor = 'rgba(159, 18, 57, 0.1)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.color = 'var(--color-paper)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        } else if (variant === 'glass') {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        } else if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(159, 18, 57, 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, variantStyles);
      }}
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