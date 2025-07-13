import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { analyticsService } from "@/services/api/analyticsService";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await analyticsService.getAll();
      setAnalytics(data);
    } catch (err) {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="analytics" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAnalytics} type="system" />;
  }

  // Calculate metrics
  const totalIncidents = analytics.reduce((sum, day) => sum + day.incidentCount, 0);
  const avgCrowdDensity = analytics.reduce((sum, day) => sum + day.crowdDensity, 0) / analytics.length;
  const totalAlerts = analytics.reduce((sum, day) => sum + day.alertCount, 0);
  const avgUptime = analytics.reduce((sum, day) => sum + day.cameraUptime, 0) / analytics.length;

  // Chart data
  const incidentChartOptions = {
    chart: {
      type: "line",
      background: "transparent",
      toolbar: { show: false }
    },
    theme: { mode: "dark" },
    colors: ["#00D4FF", "#FF3547"],
    stroke: { curve: "smooth", width: 3 },
    grid: {
      borderColor: "#2A2A2A",
      strokeDashArray: 5
    },
    xaxis: {
      categories: analytics.map(d => d.date),
      labels: { style: { colors: "#B0B0B0" } }
    },
    yaxis: {
      labels: { style: { colors: "#B0B0B0" } }
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" }
    },
    legend: {
      labels: { colors: "#B0B0B0" }
    }
  };

  const incidentChartSeries = [
    {
      name: "Incidents",
      data: analytics.map(d => d.incidentCount)
    },
    {
      name: "Alerts",
      data: analytics.map(d => d.alertCount)
    }
  ];

  const crowdChartOptions = {
    chart: {
      type: "area",
      background: "transparent",
      toolbar: { show: false }
    },
    theme: { mode: "dark" },
    colors: ["#00C851"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    stroke: { curve: "smooth", width: 2 },
    grid: {
      borderColor: "#2A2A2A",
      strokeDashArray: 5
    },
    xaxis: {
      categories: analytics.map(d => d.date),
      labels: { style: { colors: "#B0B0B0" } }
    },
    yaxis: {
      labels: { style: { colors: "#B0B0B0" } }
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" }
    }
  };

  const crowdChartSeries = [
    {
      name: "Crowd Density",
      data: analytics.map(d => d.crowdDensity)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-gradient-to-br from-error/10 to-error/5 border-error/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Total Incidents</p>
                <p className="text-3xl font-bold text-error">{totalIncidents}</p>
              </div>
              <div className="w-12 h-12 bg-error/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={24} className="text-error" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Total Alerts</p>
                <p className="text-3xl font-bold text-warning">{totalAlerts}</p>
              </div>
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Bell" size={24} className="text-warning" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Avg Crowd Density</p>
                <p className="text-3xl font-bold text-success">{avgCrowdDensity.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-success" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">System Uptime</p>
                <p className="text-3xl font-bold text-accent">{avgUptime.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" size={24} className="text-accent" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="text-lg font-semibold mb-4">Incidents & Alerts Trend</h3>
            <Chart
              options={incidentChartOptions}
              series={incidentChartSeries}
              type="line"
              height={300}
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h3 className="text-lg font-semibold mb-4">Crowd Density Pattern</h3>
            <Chart
              options={crowdChartOptions}
              series={crowdChartSeries}
              type="area"
              height={300}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;