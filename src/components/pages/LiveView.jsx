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

        // Request camera permission with advanced constraints first
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
        
        // Save permission status to localStorage for persistence
        localStorage.setItem('cameraPermission', 'granted');
        
        setCameraPermission('granted');
        setUseRealCamera(true);
        toast.success("Camera access granted. Initializing real-time detection...");
        
      } catch (error) {
        setCameraPermission('denied');
        setPermissionError(error);
        localStorage.setItem('cameraPermission', 'denied');
        
        // Handle different types of errors with specific guidance
        if (error.name === 'NotAllowedError') {
          toast.error(
            "Camera access denied. Please:\n" +
            "1. Click the camera icon in your browser's address bar\n" +
            "2. Allow camera access\n" +
            "3. Refresh the page and try again",
            { autoClose: 8000 }
          );
        } else if (error.name === 'NotFoundError') {
          toast.error(
            "No camera detected. Please:\n" +
            "1. Connect a camera device\n" +
            "2. Check camera drivers are installed\n" +
            "3. Try again after connecting camera",
            { autoClose: 6000 }
          );
        } else if (error.name === 'NotReadableError') {
          toast.error(
            "Camera is busy. Please:\n" +
            "1. Close other camera applications\n" +
            "2. Close other browser tabs using camera\n" +
            "3. Try again in a few seconds",
            { autoClose: 6000 }
          );
        } else if (error.name === 'OverconstrainedError') {
          toast.warning("Advanced camera settings not supported. Trying basic settings...");
          // Retry with basic constraints
          setTimeout(() => handleCameraToggleBasic(), 1000);
          return;
        } else {
          toast.error(`Camera error: ${error.message || 'Please check your camera settings and try again.'}`);
        }
        
console.error("Camera permission error:", {
          name: error.name,
          message: error.message,
          timestamp: new Date().toISOString()
        });
        
        // Offer demo mode as fallback
        setTimeout(() => {
          toast.info("Using demo mode. Click 'Enable Camera' again when ready to use real camera.");
        }, 2000);
      }
    } else {
      setUseRealCamera(false);
      setCameraPermission(null);
      setPermissionError(null);
      localStorage.removeItem('cameraPermission');
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