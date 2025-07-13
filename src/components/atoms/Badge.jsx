import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  variant = "default", 
  size = "md",
  className, 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface text-text-primary border-border",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
    info: "bg-info/10 text-info border-info/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    critical: "bg-error text-white border-error animate-pulse-alert"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;