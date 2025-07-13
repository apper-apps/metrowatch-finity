import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import { systemService } from "@/services/api/systemService";

const SystemStatus = () => {
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemStatus();
    const interval = setInterval(loadSystemStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemStatus = async () => {
    try {
      setLoading(true);
      const data = await systemService.getStatus();
      setSystemData(data);
    } catch (err) {
      console.error("Failed to load system status:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <Loading />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">System Status</h3>
      
      <div className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 bg-background rounded-md">
          <div className="flex items-center gap-3">
            <ApperIcon name="Activity" size={20} className="text-accent" />
            <span className="font-medium">System Health</span>
          </div>
          <StatusIndicator 
            status={systemData?.overallStatus || "online"} 
            label={systemData?.overallStatus === "online" ? "Operational" : "Issues Detected"}
          />
        </div>

        {/* Camera Status */}
        <div className="flex items-center justify-between p-3 bg-background rounded-md">
          <div className="flex items-center gap-3">
            <ApperIcon name="Camera" size={20} className="text-accent" />
            <span className="font-medium">Camera Network</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              {systemData?.camerasOnline || 8}/8 Online
            </span>
            <StatusIndicator 
              status="online" 
              showLabel={false}
            />
          </div>
        </div>

        {/* AI Processing */}
        <div className="flex items-center justify-between p-3 bg-background rounded-md">
          <div className="flex items-center gap-3">
            <ApperIcon name="Brain" size={20} className="text-accent" />
            <span className="font-medium">AI Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              {systemData?.aiLoad || 45}% Load
            </span>
            <StatusIndicator 
              status="online" 
              showLabel={false}
            />
          </div>
        </div>

        {/* Network Status */}
        <div className="flex items-center justify-between p-3 bg-background rounded-md">
          <div className="flex items-center gap-3">
            <ApperIcon name="Wifi" size={20} className="text-accent" />
            <span className="font-medium">Network</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              {systemData?.networkLatency || 12}ms
            </span>
            <StatusIndicator 
              status="online" 
              showLabel={false}
            />
          </div>
        </div>

        {/* Storage */}
        <div className="flex items-center justify-between p-3 bg-background rounded-md">
          <div className="flex items-center gap-3">
            <ApperIcon name="HardDrive" size={20} className="text-accent" />
            <span className="font-medium">Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              {systemData?.storageUsed || 68}% Used
            </span>
            <StatusIndicator 
              status={systemData?.storageUsed > 80 ? "warning" : "online"} 
              showLabel={false}
            />
          </div>
        </div>

        {/* Uptime */}
        <div className="mt-4 p-3 bg-gradient-to-r from-accent/10 to-primary/10 rounded-md border border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ApperIcon name="Clock" size={20} className="text-accent" />
              <span className="font-medium">System Uptime</span>
            </div>
            <span className="text-accent font-semibold">
              {systemData?.uptime || "99.9%"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SystemStatus;