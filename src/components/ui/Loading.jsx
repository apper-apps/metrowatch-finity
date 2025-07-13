import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "camera-grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="aspect-video bg-surface border border-border rounded-md relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-border to-surface animate-pulse" />
            <div className="absolute top-3 left-3 w-16 h-4 bg-border rounded animate-pulse" />
            <div className="absolute top-3 right-3 w-3 h-3 bg-border rounded-full animate-pulse" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-surface border border-border rounded-md"
          >
            <div className="w-12 h-12 bg-border rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-border rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-border rounded w-1/2 animate-pulse" />
            </div>
            <div className="w-20 h-6 bg-border rounded animate-pulse" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "analytics") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-border rounded animate-pulse" />
              <div className="w-16 h-4 bg-border rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-border rounded w-2/3 animate-pulse" />
              <div className="h-4 bg-border rounded w-1/2 animate-pulse" />
            </div>
          </motion.div>
        ))}
        <div className="col-span-full">
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="h-6 bg-border rounded w-1/4 mb-4 animate-pulse" />
            <div className="h-64 bg-border rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;