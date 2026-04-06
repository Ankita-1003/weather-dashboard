import React, { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { User, LogOut, Settings, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const UserDropdown = ({ isOpen, onClose }) => {
  const { locationName, getWeatherData } = useContext(WeatherContext);

  // "Terminate Session" = reset to default location (New Delhi)
  const handleTerminate = () => {
    localStorage.removeItem("lastCoords");
    localStorage.removeItem("lastLocation");
    getWeatherData(28.6139, 77.2090, "New Delhi, IN");
    onClose();
  };

  const menuItems = [
    { icon: Settings, label: "Settings", desc: "App Preferences", path: "/settings" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-full right-0 mt-4 w-[260px] bg-white/95 dark:bg-[#111822]/98 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden p-2"
          >
            {/* Profile Header */}
            <div className="p-8 pb-6 flex flex-col items-center text-center border-b border-black/5 dark:border-white/5 bg-accent-yellow/5 rounded-[2.2rem] mb-2 shadow-inner">
               <div className="w-16 h-16 rounded-full bg-linear-to-br from-accent-yellow to-orange-400 p-1 mb-4 shadow-lg shadow-accent-yellow/20">
                  <div className="w-full h-full rounded-full bg-bg-panel border-2 border-white/20 flex items-center justify-center text-accent-yellow">
                     <User size={32} />
                  </div>
               </div>
               <h3 className="text-sm font-black text-white tracking-tight uppercase">Climate Specialist</h3>
               <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1 flex items-center gap-1">
                  <Globe size={10} className="text-accent-yellow" />
                  {locationName || "Global Sector"}
               </span>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-0.5 px-1 pb-2">
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all group active:scale-95"
                >
                  <div className="p-2.5 bg-white/5 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 text-text-muted group-hover:text-accent-yellow transition-colors">
                    <item.icon size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-white uppercase tracking-widest leading-tight">{item.label}</span>
                    <span className="text-[9px] font-bold text-text-muted tracking-tight mt-0.5">{item.desc}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Terminate Session → reset to default location */}
            <div className="px-1 pb-1">
               <button 
                 onClick={handleTerminate}
                 className="w-full flex items-center justify-center gap-2 p-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-[1.8rem] transition-all group active:scale-95"
               >
                  <LogOut size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Reset Location</span>
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserDropdown;
