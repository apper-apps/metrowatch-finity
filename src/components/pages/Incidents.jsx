import React from "react";
import { motion } from "framer-motion";
import IncidentTable from "@/components/organisms/IncidentTable";

const Incidents = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Incident Management</h1>
          <p className="text-text-secondary mt-1">
            Track and manage security incidents across all metro stations
          </p>
        </div>
      </div>

      {/* Incident Table */}
      <IncidentTable />
    </motion.div>
  );
};

export default Incidents;