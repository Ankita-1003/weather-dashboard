import React from "react";
import { motion } from "framer-motion";

const Skeleton = ({ className }) => (
  <motion.div
    animate={{ opacity: [0.1, 0.2, 0.1] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`bg-white/10 rounded-2xl ${className}`}
  />
);

export const DashboardSkeleton = () => (
  <div className="space-y-12 w-full animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Skeleton className="h-64 lg:col-span-2" />
      <Skeleton className="h-64 lg:col-span-1" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>
  </div>
);

export default Skeleton;
