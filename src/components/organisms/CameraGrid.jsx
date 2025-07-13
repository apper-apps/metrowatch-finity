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
      
      // Check if we have camera permission first
      if (cameraPermission === 'denied') {
        throw new Error('Camera permission denied');
      }
      
      // Verify camera availability before attempting to access
      const isAvailable = await cameraService.checkCameraAvailability();
      if (!isAvailable) {
        throw new Error('No cameras available');
      }
      
      const devices = await cameraService.getRealCameras();
      
      if (!devices || devices.length === 0) {
        throw new Error('No camera devices found');
      }
      
      setRealCameras(devices);
      setCameras(devices);
      toast.success(`${devices.length} camera(s) initialized successfully`);
      
    } catch (err) {
      console.error('Real camera loading error:', err);
      
      // Set appropriate error message based on error type
      let errorMessage = "Failed to access camera devices";
      if (permissionError?.name === 'NotAllowedError') {
        errorMessage = "Camera permission denied. Please enable camera access and try again.";
      } else if (permissionError?.name === 'NotFoundError') {
        errorMessage = "No camera devices found. Please connect a camera.";
      } else if (permissionError?.name === 'NotReadableError') {
        errorMessage = "Camera is in use by another application.";
      } else if (err.message.includes('permission')) {
        errorMessage = "Camera permission required. Please enable camera access.";
      }
      
      setError(errorMessage);
      toast.error(`${errorMessage} Using demo mode.`);
      
      // Fallback to mock data
      try {
        await loadCameras();
      } catch (fallbackErr) {
        setError("Failed to load camera feeds");
        toast.error("Failed to load demo cameras");
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