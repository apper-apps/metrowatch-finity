import React, { useState } from "react";
import { motion } from "framer-motion";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CameraFeed = ({ camera, size = "medium" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasAlert, setHasAlert] = useState(camera.status === "alert" || camera.alertLevel > 0);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getAlertLevel = () => {
    if (camera.alertLevel >= 3) return "critical";
    if (camera.alertLevel >= 2) return "high";
    if (camera.alertLevel >= 1) return "medium";
    return "none";
  };

const alertLevel = getAlertLevel();
  
  return (
    <motion.div
      className={`video-feed relative group ${hasAlert ? `alert-active alert-${alertLevel}` : ""} camera-${size}`}
      whileHover={{ scale: hasAlert ? 1.05 : 1.02 }}
      transition={{ duration: 0.2 }}
      animate={hasAlert ? { 
        boxShadow: [
          "0 0 0 rgba(255, 53, 71, 0)",
          "0 0 20px rgba(255, 53, 71, 0.3)",
          "0 0 0 rgba(255, 53, 71, 0)"
        ]
      } : {}}
    >
      {/* Video placeholder */}
      <div className="w-full h-full bg-gradient-to-br from-surface to-background flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Camera" size={48} className="text-text-muted mx-auto mb-2" />
          <p className="text-text-muted text-sm">Live Feed</p>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <ApperIcon name="Maximize2" size={16} />
          </Button>
        </div>
      </div>

      {/* Camera info */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 px-3 py-1 rounded-md">
        <StatusIndicator 
          status={camera.status === "online" ? "online" : "offline"} 
          showLabel={false} 
          size="sm" 
        />
        <span className="text-white text-sm font-medium">{camera.name}</span>
      </div>

{/* Alert indicator */}
      {hasAlert && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: 1
          }}
          transition={{
            scale: { repeat: Infinity, duration: 1.5 },
            opacity: { duration: 0.3 }
          }}
          className={`absolute bottom-3 left-3 text-white px-3 py-1 rounded-md text-xs font-medium shadow-lg ${
            alertLevel === "critical" ? "bg-red-600" :
            alertLevel === "high" ? "bg-orange-500" :
            alertLevel === "medium" ? "bg-yellow-500" : "bg-error"
          }`}
        >
          <ApperIcon name="AlertTriangle" size={12} className="inline mr-1" />
          {alertLevel.toUpperCase()} ALERT
        </motion.div>
      )}

      {/* Location */}
      <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded-md">
        <span className="text-white text-xs">{camera.location}</span>
      </div>
    </motion.div>
  );
};

export default CameraFeed;