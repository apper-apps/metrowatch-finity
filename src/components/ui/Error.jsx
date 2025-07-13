import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  type = "default" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "camera":
        return {
          icon: "Camera",
          title: "Camera Feed Error",
          description: "Unable to connect to camera feed. Check network connection.",
        };
      case "network":
        return {
          icon: "Wifi",
          title: "Network Error",
          description: "Lost connection to surveillance system. Attempting to reconnect...",
        };
      case "system":
        return {
          icon: "AlertTriangle",
          title: "System Error",
          description: "Surveillance system is experiencing issues. Please try again.",
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Error",
          description: message,
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center bg-surface border border-error/20 rounded-lg"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon name={icon} size={32} className="text-error" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6 max-w-md">{description}</p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Retry Connection
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;