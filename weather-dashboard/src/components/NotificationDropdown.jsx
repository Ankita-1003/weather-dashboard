import React, { useContext, useMemo } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { Bell, Zap, CloudRain, Wind, Info, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { weather } = useContext(WeatherContext);

  const alerts = useMemo(() => {
    if (!weather || !weather.current) return [];
    
    const list = [];
    const current = weather.current;
    
    // 1. UV Intensity Alert
    if (current.uv_index > 5) {
      list.push({
        id: 'uv',
        type: 'warning',
        icon: Zap,
        title: "High UV Exposure",
        desc: "UV Index is above 5. Wear sunscreen and limit sun exposure.",
        time: "Active Now"
      });
    }

    // 2. Precipitation Alert
    if (current.precipitation_probability > 40) {
      list.push({
        id: 'rain',
        type: 'info',
        icon: CloudRain,
        title: "Rain Expected",
        desc: `${current.precipitation_probability}% chance of precipitation in your area.`,
        time: "Within 2h"
      });
    }

    // 3. Wind Alert
    if (current.wind_speed_10m > 30) {
      list.push({
        id: 'wind',
        type: 'warning',
        icon: Wind,
        title: "High Wind Velocity",
        desc: "Wind speeds exceeding 30km/h. Secure outdoor loose items.",
        time: "Active Now"
      });
    }

    // 4. Default "Clear" message if no alerts
    if (list.length === 0) {
       list.push({
         id: 'clear',
         type: 'success',
         icon: CheckCircle2,
         title: "Atmosphere Clear",
         desc: "No critical weather events detected in your current sector.",
         time: "Just Now"
       });
    }

    return list;
  }, [weather]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for click-away */}
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-4 w-[320px] md:w-[380px] bg-white/90 dark:bg-[#111822]/95 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-50 p-2"
          >
            <div className="p-6 pb-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-yellow">
                  Sector Notifications
                </h3>
                <span className="px-2 py-0.5 bg-accent-yellow/10 rounded-full text-[8px] font-black uppercase text-accent-yellow border border-accent-yellow/20">
                  {alerts.length} Active
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
              {alerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all cursor-pointer group"
                >
                  <div className={`p-2.5 rounded-xl border ${
                    alert.type === 'warning' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                    alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    'bg-accent-yellow/10 border-accent-yellow/20 text-accent-yellow'
                  }`}>
                    <alert.icon size={18} />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                       <span className="text-sm font-black text-text-main tracking-tight group-hover:text-accent-yellow transition-colors">
                          {alert.title}
                       </span>
                       <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest pt-1">
                          {alert.time}
                       </span>
                    </div>
                    <p className="text-[11px] font-medium text-text-muted leading-relaxed mt-1">
                      {alert.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 mt-2 border-t border-black/5 dark:border-white/5 flex justify-center">
               <button onClick={onClose} className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-text-main transition-colors">
                  Dismiss All
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
