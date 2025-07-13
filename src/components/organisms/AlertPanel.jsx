import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import AlertBadge from "@/components/molecules/AlertBadge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { alertService } from "@/services/api/alertService";
import { format } from "date-fns";

const AlertPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAlerts();
    // Simulate real-time updates
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await alertService.getAll();
      setAlerts(data);
      
      // Show toast for new critical alerts
      const criticalAlerts = data.filter(alert => 
        alert.priority === "critical" && !alert.acknowledged
      );
      if (criticalAlerts.length > 0) {
        toast.error(`${criticalAlerts.length} critical alerts require attention!`);
      }
    } catch (err) {
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      await alertService.update(alertId, { acknowledged: true });
      setAlerts(alerts.map(alert => 
        alert.Id === alertId ? { ...alert, acknowledged: true } : alert
      ));
      toast.success("Alert acknowledged");
    } catch (err) {
      toast.error("Failed to acknowledge alert");
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-info",
      medium: "text-warning", 
      high: "text-error",
      critical: "text-error animate-pulse"
    };
    return colors[priority] || colors.medium;
  };

  if (loading) {
    return (
      <Card className="h-full">
        <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
        <Loading />
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Active Alerts</h3>
        <AlertBadge 
          type="Total" 
          count={alerts.filter(a => !a.acknowledged).length}
          severity="medium"
        />
      </div>

      {alerts.length === 0 ? (
        <Empty 
          type="alerts" 
          action={loadAlerts}
        />
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.Id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-3 border rounded-md ${
                  alert.acknowledged 
                    ? "border-border bg-surface/50" 
                    : "border-error/20 bg-error/5"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ApperIcon 
                        name="AlertTriangle" 
                        size={16} 
                        className={getPriorityColor(alert.priority)}
                      />
                      <span className="font-medium text-sm">
                        {alert.message}
                      </span>
                      <AlertBadge 
                        type={alert.priority.toUpperCase()} 
                        severity={alert.priority}
                        animated={!alert.acknowledged}
                      />
                    </div>
                    <p className="text-xs text-text-muted">
                      {format(new Date(alert.createdAt), "HH:mm:ss - MMM dd")}
                    </p>
                  </div>
                  
                  {!alert.acknowledged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acknowledgeAlert(alert.Id)}
                      className="ml-2"
                    >
                      <ApperIcon name="Check" size={14} />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
};

export default AlertPanel;