import React, { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subValue, 
  status, 
  color = "blue", 
  hasChart = false, 
  chartData = [], 
  delay = 0 
}) => {
  const { theme } = useContext(WeatherContext);

  const colorMap = {
    blue:    "text-accent-cyan    bg-accent-cyan/5    border-accent-cyan/10    shadow-accent-cyan/5",
    cyan:    "text-cyan-400       bg-cyan-400/5       border-cyan-400/10       shadow-cyan-400/5",
    pink:    "text-accent-pink    bg-accent-pink/5    border-accent-pink/10    shadow-accent-pink/5",
    emerald: "text-emerald-400    bg-emerald-400/5    border-emerald-400/10    shadow-emerald-400/5",
    amber:   "text-accent-yellow  bg-accent-yellow/5  border-accent-yellow/10  shadow-accent-yellow/5",
    indigo:  "text-indigo-400     bg-indigo-400/5     border-indigo-400/10     shadow-indigo-400/5",
    violet:  "text-violet-400     bg-violet-400/5     border-violet-400/10     shadow-violet-400/5",
  };

  const textMuted = theme === 'dark' ? 'text-text-muted' : 'text-slate-400';
  const textValue = theme === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`panel-glass p-4 md:p-6 flex flex-col justify-between relative group overflow-hidden border-white/5 dark:bg-bg-panel`}
    >
      <div className="flex flex-col gap-6 z-10 w-full">
        {/* Title and Badge Row */}
        <div className="flex justify-between items-center w-full">
           <h3 className={`text-[9px] font-black tracking-[0.2em] uppercase ${textMuted} opacity-80`}>
            {title}
           </h3>
           {status && (
              <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${colorMap[color].split(' ').slice(0, 2).join(' ')}`}>
                 {status}
              </div>
           )}
        </div>

        {/* Value and Icon Group */}
        <div className="flex items-center gap-5">
           {Icon && (
             <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 dark:bg-black/20 border border-white/5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Icon size={18} className={colorMap[color]?.split(' ')[0] || 'text-slate-400'} />
             </div>
           )}
           <div className="flex flex-col gap-0.5 min-w-0">
              <span className={`text-xl md:text-2xl font-black tracking-tighter leading-tight break-words ${textValue}`}>
                {value}
              </span>
              {subValue && (
                 <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ${textMuted}`}>
                   {subValue}
                 </span>
              )}
           </div>
        </div>
      </div>

      {/* Separated Label for Sparkline to avoid overlap */}
      {hasChart && chartData.length > 0 && (
         <div className="absolute right-6 bottom-1 z-20">
            <span className={`text-[8px] font-black uppercase tracking-widest opacity-30 ${textValue}`}>
               Visual Trend
            </span>
         </div>
      )}

      {/* Sparkline - Kept at bottom-only to prevent text overlap */}
      {hasChart && chartData.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none opacity-20 dark:opacity-30">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                 <defs>
                   <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="currentColor" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Area 
                   type="monotone" 
                   dataKey="value" 
                   stroke="currentColor" 
                   fill={`url(#color-${color})`} 
                   strokeWidth={2}
                   isAnimationActive={true}
                 />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
