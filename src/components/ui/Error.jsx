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
        // Enhanced camera error messaging with permission-specific guidance
        if (message?.includes('permission') || message?.includes('denied') || message?.includes('blocked')) {
          return {
            icon: "CameraOff",
            title: "Camera Permission Required",
            description: "Camera access is needed for live monitoring. Please enable camera permissions in your browser settings and refresh the page.",
            actionText: "How to Enable Camera"
          };
        } else if (message?.includes('not found') || message?.includes('detected')) {
          return {
            icon: "Camera",
            title: "No Camera Detected",
            description: "No camera devices found. Please connect a camera and ensure drivers are installed properly.",
            actionText: "Check Hardware"
          };
        } else if (message?.includes('busy') || message?.includes('use')) {
          return {
            icon: "CameraOff",
            title: "Camera In Use",
            description: "Camera is being used by another application. Please close other camera apps and try again.",
            actionText: "Retry Connection"
          };
        } else {
          return {
            icon: "AlertTriangle",
            title: "Camera Connection Error",
            description: message || "Unable to connect to camera feed. Check camera settings and network connection.",
            actionText: "Retry Connection"
          };
        }
      case "network":
        return {
          icon: "Wifi",
          title: "Network Error",
          description: "Lost connection to surveillance system. Attempting to reconnect...",
          actionText: "Retry Connection"
        };
      case "system":
        return {
          icon: "AlertTriangle",
          title: "System Error",
          description: "Surveillance system is experiencing issues. Please try again.",
          actionText: "Retry System"
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Error",
          description: message || "An unexpected error occurred. Please try again.",
          actionText: "Retry"
        };
    }
  };

const { icon, title, description, actionText } = getErrorContent();

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
          {actionText || "Retry Connection"}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;