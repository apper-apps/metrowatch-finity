import React from "react";
import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const AlertBadge = ({ 
  type, 
  severity = "medium", 
  count, 
  animated = false,
  className 
}) => {
  const severityConfig = {
    low: { variant: "info", icon: "Info" },
    medium: { variant: "warning", icon: "AlertTriangle" },
    high: { variant: "error", icon: "AlertCircle" },
    critical: { variant: "critical", icon: "Zap" }
  };

  const config = severityConfig[severity] || severityConfig.medium;

  const badge = (
    <Badge variant={config.variant} className={className}>
      <ApperIcon name={config.icon} size={14} className="mr-1" />
      {type}
      {count && (
        <span className="ml-1 px-1.5 py-0.5 bg-background/20 rounded-full text-xs">
          {count}
        </span>
      )}
    </Badge>
  );

  if (animated && severity === "critical") {
    return (
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {badge}
      </motion.div>
    );
  }

  return badge;
};

export default AlertBadge;