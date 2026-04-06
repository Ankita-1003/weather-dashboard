import React from "react";
import { motion } from "framer-motion";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "precipitation", label: "Precipitation" },
  { id: "wind", label: "Wind" },
  { id: "airQuality", label: "Air Quality" },
  { id: "humidity", label: "Humidity" },
  { id: "visibility", label: "Visibility" },
];

const HourlyTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
          className={`relative overflow-hidden px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap border ${
              isActive 
                ? "bg-accent-yellow text-[#1a1c30] border-accent-yellow shadow-[0_0_20px_rgba(255,214,10,0.3)]" 
                : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="active-hourly-tab"
                className="absolute inset-0 rounded-full bg-accent-yellow -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default HourlyTabs;
