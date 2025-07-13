import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CameraFeed from "@/components/molecules/CameraFeed";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { cameraService } from "@/services/api/cameraService";
import { toast } from "react-toastify";

const CameraGrid = ({ 
  cameraSize = "medium", 
  useRealCamera = false, 
  cameraPermission = null,
  permissionError = null 
}) => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [realCameras, setRealCameras] = useState([]);

  useEffect(() => {
    if (useRealCamera) {
      loadRealCameras();
    } else {
      loadCameras();
    }
  }, [useRealCamera]);

  const loadCameras = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await cameraService.getAll();
      setCameras(data);
    } catch (err) {
      setError("Failed to load camera feeds");
      toast.error("Failed to load camera feeds");
    } finally {
      setLoading(false);
    }
  };

const loadRealCameras = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Enhanced permission checking
      if (cameraPermission === 'denied') {
        throw new Error('Camera permission denied - user declined access');
      }
      
      if (cameraPermission === null) {
        throw new Error('Camera permission not yet requested');
      }
      
      // Verify camera availability before attempting to access
      const isAvailable = await cameraService.checkCameraAvailability();
      if (!isAvailable) {
        throw new Error('No cameras available on this device');
      }
      
      const devices = await cameraService.getRealCameras();
      
      if (!devices || devices.length === 0) {
        throw new Error('No camera devices found or accessible');
      }
      
      setRealCameras(devices);
      setCameras(devices);
      toast.success(`${devices.length} camera(s) initialized successfully`);
      
    } catch (err) {
      console.error('Real camera loading error:', err);
      
      // Enhanced error classification and messaging
      let errorMessage = "Failed to access camera devices";
      let shouldShowRetry = true;
      
      if (permissionError?.name === 'NotAllowedError') {
        errorMessage = "Camera access blocked by browser settings";
        shouldShowRetry = false;
      } else if (permissionError?.name === 'NotFoundError') {
        errorMessage = "No camera hardware detected on this device";
        shouldShowRetry = false;
      } else if (permissionError?.name === 'NotReadableError') {
        errorMessage = "Camera is currently being used by another application";
        shouldShowRetry = true;
      } else if (permissionError?.name === 'OverconstrainedError') {
        errorMessage = "Camera doesn't support required video quality settings";
        shouldShowRetry = true;
      } else if (err.message.includes('permission denied')) {
        errorMessage = "Camera permission denied - please allow camera access";
        shouldShowRetry = false;
      } else if (err.message.includes('not yet requested')) {
        errorMessage = "Please enable camera access first";
        shouldShowRetry = false;
      }
      
      setError(errorMessage);
      
      // Provide specific guidance based on error type
      if (permissionError?.name === 'NotAllowedError') {
        toast.error(
          "Camera blocked: Click the camera icon in your browser's address bar to allow access",
          { autoClose: 8000 }
        );
      } else if (permissionError?.name === 'NotReadableError') {
        toast.warning(
          "Camera busy: Close other camera apps and try again",
          { autoClose: 5000 }
        );
      } else {
        toast.error(`${errorMessage}. Switching to demo mode.`);
      }
      
      // Graceful fallback to mock data with better error handling
      try {
        toast.info("Loading demo cameras for preview...");
        await loadCameras();
      } catch (fallbackErr) {
        console.error('Demo camera fallback failed:', fallbackErr);
        setError("Failed to load camera feeds - please refresh the page");
        toast.error("Critical error: Unable to load demo cameras");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="camera-grid" />;
  }

  if (error && cameras.length === 0) {
    return <Error message={error} onRetry={useRealCamera ? loadRealCameras : loadCameras} type="camera" />;
  }

  const getGridClass = () => {
    const baseClass = "camera-grid";
    switch (cameraSize) {
      case "small":
        return `${baseClass} camera-grid-small`;
      case "large":
        return `${baseClass} camera-grid-large`;
      default:
        return baseClass;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={getGridClass()}
    >
      {cameras.map((camera, index) => (
        <motion.div
          key={camera.Id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <CameraFeed 
camera={camera} 
            size={cameraSize} 
            useRealCamera={useRealCamera}
            cameraPermission={cameraPermission}
            permissionError={permissionError}
            enableDetection={useRealCamera}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CameraGrid;