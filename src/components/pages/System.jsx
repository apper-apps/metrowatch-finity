import React from "react";
import { motion } from "framer-motion";
import SystemStatus from "@/components/organisms/SystemStatus";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const System = () => {
  const handleAction = (action) => {
    toast.info(`${action} initiated`);
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
          <h1 className="text-3xl font-bold gradient-text">System Management</h1>
          <p className="text-text-secondary mt-1">
            Monitor and control surveillance system operations
          </p>
        </div>
      </div>

      {/* System Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <SystemStatus />

        {/* System Controls */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">System Controls</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-md">
              <h4 className="font-medium mb-2">Camera Management</h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction("Camera restart")}
                >
                  <ApperIcon name="RotateCcw" size={14} className="mr-1" />
                  Restart All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction("Camera calibration")}
                >
                  <ApperIcon name="Settings" size={14} className="mr-1" />
                  Calibrate
                </Button>
              </div>
            </div>

            <div className="p-4 bg-background rounded-md">
              <h4 className="font-medium mb-2">AI Processing</h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction("AI model update")}
                >
                  <ApperIcon name="Download" size={14} className="mr-1" />
                  Update Model
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction("AI performance test")}
                >
                  <ApperIcon name="Zap" size={14} className="mr-1" />
                  Test Performance
                </Button>
              </div>
            </div>

            <div className="p-4 bg-background rounded-md">
              <h4 className="font-medium mb-2">Data Management</h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction("Database backup")}
                >
                  <ApperIcon name="Database" size={14} className="mr-1" />
                  Backup Data
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction("Data cleanup")}
                >
                  <ApperIcon name="Trash2" size={14} className="mr-1" />
                  Cleanup
                </Button>
              </div>
            </div>

            <div className="p-4 bg-error/10 border border-error/20 rounded-md">
              <h4 className="font-medium mb-2 text-error">Emergency Actions</h4>
              <div className="flex gap-2">
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleAction("Emergency shutdown")}
                >
                  <ApperIcon name="Power" size={14} className="mr-1" />
                  Emergency Stop
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction("System restart")}
                >
                  <ApperIcon name="RefreshCw" size={14} className="mr-1" />
                  Full Restart
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* System Logs */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent System Logs</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-2 bg-background rounded text-sm">
              <span className="text-text-muted">
                {new Date(Date.now() - index * 60000).toLocaleTimeString()}
              </span>
              <span className="text-text-primary">
                System check completed - All cameras operational
              </span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default System;