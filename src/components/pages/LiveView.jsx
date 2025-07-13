import React, { useState } from "react";
import { motion } from "framer-motion";
import CameraGrid from "@/components/organisms/CameraGrid";
import AlertPanel from "@/components/organisms/AlertPanel";
import SystemStatus from "@/components/organisms/SystemStatus";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
const LiveView = () => {
  const [cameraSize, setCameraSize] = useState("medium");

  const sizeOptions = [
    { value: "small", label: "Small View" },
    { value: "medium", label: "Medium View" },
    { value: "large", label: "Large View" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Live Surveillance</h1>
          <p className="text-text-secondary mt-1">
            Real-time monitoring of metro station security feeds
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Monitor" size={16} className="text-text-secondary" />
            <span className="text-text-secondary text-sm">Camera Size:</span>
            <Select
              value={cameraSize}
              onValueChange={setCameraSize}
              options={sizeOptions}
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Camera Grid - Takes up 3 columns */}
<div className="lg:col-span-3">
          <CameraGrid cameraSize={cameraSize} />
        </div>

        {/* Side Panel - Takes up 1 column */}
        <div className="space-y-6">
          <AlertPanel />
          <SystemStatus />
        </div>
      </div>
    </motion.div>
  );
};

export default LiveView;