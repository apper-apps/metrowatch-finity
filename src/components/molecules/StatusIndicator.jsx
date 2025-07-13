import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const StatusIndicator = ({ 
  status, 
  label, 
  showLabel = true, 
  size = "md",
  className 
}) => {
  const statusConfig = {
    online: {
      color: "bg-success",
      glow: "shadow-success/40",
      label: "Online"
    },
    warning: {
      color: "bg-warning",
      glow: "shadow-warning/40",
      label: "Warning"
    },
    offline: {
      color: "bg-error",
      glow: "shadow-error/40",
      label: "Offline"
    },
    connecting: {
      color: "bg-info",
      glow: "shadow-info/40",
      label: "Connecting"
    }
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.div
        animate={{ 
          scale: status === "connecting" ? [1, 1.2, 1] : 1 
        }}
        transition={{ 
          duration: 1.5, 
          repeat: status === "connecting" ? Infinity : 0 
        }}
        className={cn(
          "rounded-full shadow-lg",
          config.color,
          config.glow,
          sizes[size]
        )}
      />
      {showLabel && (
        <span className="text-sm text-text-secondary">
          {label || config.label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;