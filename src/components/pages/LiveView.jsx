import React, { useState, useEffect } from "react";
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
  const [permissionError, setPermissionError] = useState(null);

  const sizeOptions = [
    { value: "small", label: "Small View" },
    { value: "medium", label: "Medium View" },
    { value: "large", label: "Large View" }
  ];

  const handleCameraToggle = async () => {
if (!useRealCamera) {
      try {
        setPermissionError(null);
        
        // Check if navigator.mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported in this browser');
        }

        // Request camera permission with constraints
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 },
            facingMode: 'environment'
          } 
        });
        
        // Verify we actually got video tracks
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length === 0) {
          throw new Error('No video tracks available');
        }
        
        // Stop the test stream immediately
        stream.getTracks().forEach(track => track.stop());
        
        setCameraPermission('granted');
        setUseRealCamera(true);
        toast.success("Camera access granted. Initializing real-time detection...");
        
      } catch (error) {
        setCameraPermission('denied');
        setPermissionError(error);
        
        // Handle different types of errors
        if (error.name === 'NotAllowedError') {
          toast.error("Camera access denied. Please click the camera icon in your browser's address bar and allow camera access, then try again.");
        } else if (error.name === 'NotFoundError') {
          toast.error("No camera found. Please connect a camera and try again.");
        } else if (error.name === 'NotReadableError') {
          toast.error("Camera is being used by another application. Please close other camera applications and try again.");
        } else if (error.name === 'OverconstrainedError') {
          toast.error("Camera doesn't support the required resolution. Trying with default settings...");
          // Retry with basic constraints
          handleCameraToggleBasic();
        } else {
          toast.error(`Camera error: ${error.message || 'Please check your camera settings and try again.'}`);
        }
        
        console.error("Camera permission error:", {
          name: error.name,
          message: error.message,
          constraint: error.constraint
        });
      }
    } else {
      setUseRealCamera(false);
      setCameraPermission(null);
      setPermissionError(null);
      toast.info("Switched back to demo mode");
    }
  };

  // Fallback camera toggle with basic constraints
  const handleCameraToggleBasic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      
      setCameraPermission('granted');
      setUseRealCamera(true);
      toast.success("Camera access granted with basic settings.");
    } catch (error) {
      setCameraPermission('denied');
      setPermissionError(error);
      toast.error("Unable to access camera with any settings. Using demo mode.");
    }
  };

  // Check camera permission on component mount
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const permission = await navigator.permissions.query({ name: 'camera' });
          if (permission.state === 'granted') {
            setCameraPermission('granted');
          } else if (permission.state === 'denied') {
            setCameraPermission('denied');
          }
        }
      } catch (error) {
        // Permission API might not be supported
        console.log('Permission API not supported');
      }
    };

    checkCameraPermission();
  }, []);

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
<CameraGrid 
            cameraSize={cameraSize} 
            useRealCamera={useRealCamera}
            cameraPermission={cameraPermission}
            permissionError={permissionError}
          />
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