import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CameraFeed from "@/components/molecules/CameraFeed";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { cameraService } from "@/services/api/cameraService";

const CameraGrid = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await cameraService.getAll();
      setCameras(data);
    } catch (err) {
      setError("Failed to load camera feeds");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="camera-grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCameras} type="camera" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="camera-grid"
    >
      {cameras.map((camera, index) => (
        <motion.div
          key={camera.Id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <CameraFeed camera={camera} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CameraGrid;