import React, { useState } from "react";
import { motion } from "framer-motion";
import CameraGrid from "@/components/organisms/CameraGrid";
import AlertPanel from "@/components/organisms/AlertPanel";
import SystemStatus from "@/components/organisms/SystemStatus";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const LiveView = () => {
  const [cameraSize, setCameraSize] = useState("medium");
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);

  const sizeOptions = [
    { value: "small", label: "Small View" },
    { value: "medium", label: "Medium View" },
    { value: "large", label: "Large View" }
  ];

  const handleCameraToggle = async () => {
    if (!useRealCamera) {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 } 
        });
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream
        
        setCameraPermission('granted');
        setUseRealCamera(true);
        toast.success("Camera access granted. Initializing real-time detection...");
      } catch (error) {
        setCameraPermission('denied');
        toast.error("Camera access denied. Please enable camera permissions.");
        console.error("Camera permission error:", error);
      }
    } else {
      setUseRealCamera(false);
      toast.info("Switched back to demo mode");
    }
  };

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
            {useRealCamera ? "Real-time monitoring with YOLO3 object detection" : "Real-time monitoring of metro station security feeds"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleCameraToggle}
            variant={useRealCamera ? "secondary" : "primary"}
            className="flex items-center gap-2"
          >
            <ApperIcon name={useRealCamera ? "MonitorOff" : "Camera"} size={16} />
            {useRealCamera ? "Demo Mode" : "Use My Camera"}
          </Button>
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
          <CameraGrid cameraSize={cameraSize} useRealCamera={useRealCamera} />
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