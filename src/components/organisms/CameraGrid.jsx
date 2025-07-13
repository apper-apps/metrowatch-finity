import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CameraFeed from "@/components/molecules/CameraFeed";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { cameraService } from "@/services/api/cameraService";
import { toast } from "react-toastify";

const CameraGrid = ({ cameraSize = "medium", useRealCamera = false }) => {
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
      const devices = await cameraService.getRealCameras();
      setRealCameras(devices);
      setCameras(devices);
      toast.success("Real cameras initialized successfully");
    } catch (err) {
      setError("Failed to access camera devices");
      toast.error("Failed to access camera devices. Using mock data.");
      // Fallback to mock data
      await loadCameras();
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
            enableDetection={useRealCamera}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CameraGrid;