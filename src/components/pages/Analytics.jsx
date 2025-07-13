import React from "react";
import { motion } from "framer-motion";
import AnalyticsDashboard from "@/components/organisms/AnalyticsDashboard";

const Analytics = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Security Analytics</h1>
          <p className="text-text-secondary mt-1">
            Comprehensive analysis of security patterns and system performance
          </p>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />
    </motion.div>
  );
};

export default Analytics;