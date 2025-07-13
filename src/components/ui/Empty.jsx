import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available", 
  description = "There's nothing to show here yet.", 
  action,
  type = "default" 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "incidents":
        return {
          icon: "Shield",
          title: "No Incidents Recorded",
          description: "All systems are secure. No suspicious activities detected.",
          actionText: "Refresh Data",
        };
      case "alerts":
        return {
          icon: "Bell",
          title: "No Active Alerts",
          description: "All monitoring systems are operating normally.",
          actionText: "Check System Status",
        };
      case "cameras":
        return {
          icon: "Camera",
          title: "No Cameras Connected",
          description: "Connect surveillance cameras to begin monitoring.",
          actionText: "Add Camera",
        };
      case "analytics":
        return {
          icon: "BarChart3",
          title: "No Analytics Data",
          description: "Collect more data to generate meaningful insights.",
          actionText: "Generate Report",
        };
      default:
        return {
          icon: "Search",
          title,
          description,
          actionText: "Take Action",
        };
    }
  };

  const { icon, title: emptyTitle, description: emptyDescription, actionText } = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={icon} size={40} className="text-accent" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-3 gradient-text">
        {emptyTitle}
      </h3>
      
      <p className="text-text-secondary mb-8 max-w-md leading-relaxed">
        {emptyDescription}
      </p>
      
      {action && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={action}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white rounded-md transition-all shadow-lg hover:shadow-accent/25"
        >
          <ApperIcon name="Plus" size={18} />
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;