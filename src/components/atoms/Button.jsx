import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  variant = "primary", 
  size = "md", 
  className, 
  children, 
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white border-primary",
    secondary: "bg-surface hover:bg-border text-text-primary border-border",
    accent: "bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white border-transparent",
    danger: "bg-error hover:bg-error/90 text-white border-error",
    ghost: "bg-transparent hover:bg-surface text-text-primary border-transparent",
    outline: "bg-transparent hover:bg-surface text-text-primary border-border hover:border-accent"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;