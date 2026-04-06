import React, { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { motion } from "framer-motion";
import {
  CloudSun, Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, Sunrise, Sunset
} from "lucide-react";
import dayjs from "dayjs";

// Dynamic weather icon based on WMO weather_code
const getWeatherIcon = (code, isDay) => {
  const c = Number(code) || 0;
  const size = 80;
  if (c === 0) return isDay ? <Sun size={size} className="text-accent-yellow drop-shadow-[0_0_20px_rgba(255,214,10,0.6)]" /> : <Moon size={size} className="text-slate-300 drop-shadow-[0_0_15px_rgba(200,200,255,0.4)]" />;
  if (c <= 3) return <CloudSun size={size} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />;
  if (c <= 49) return <Cloud size={size} className="text-slate-300" />;
  if (c <= 67) return <CloudRain size={size} className="text-accent-cyan drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />;
  if (c <= 77) return <CloudSnow size={size} className="text-sky-200" />;
  if (c <= 82) return <CloudRain size={size} className="text-accent-cyan" />;
  if (c <= 99) return <CloudLightning size={size} className="text-accent-yellow drop-shadow-[0_0_15px_rgba(255,214,10,0.5)]" />;
  return <CloudSun size={size} className="text-white" />;
};

const CurrentWeatherHero = ({ data, unit, toggleUnit }) => {
  const { theme, locationName, selectedDate } = useContext(WeatherContext);
  const isToday = selectedDate === dayjs().format("YYYY-MM-DD");
  if (!data || !data.current || !data.daily) return null;

  const current = data.current;
  const daily = data.daily;

  const formatTemp = (c) => unit === "celsius" ? c : (c * 9/5 + 32).toFixed(1);
  const tempUnit = unit === "celsius" ? "°C" : "°F";

  const textValue = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textMuted = theme === 'dark' ? 'text-text-muted' : 'text-slate-400';

  // Determine day/night for icon (use sunrise/sunset if available, else hour-based)
  const nowHour = dayjs().hour();
  const isDay = nowHour >= 6 && nowHour < 19;

  // Format sunrise/sunset safely
  const sunriseStr = daily.sunrise?.[0] ? dayjs(daily.sunrise[0]).format("h:mm A") : "--";
  const sunsetStr  = daily.sunset?.[0]  ? dayjs(daily.sunset[0]).format("h:mm A")  : "--";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel-glass p-5 md:p-8 flex flex-col items-center text-center relative w-full overflow-hidden border-white/5 dark:bg-bg-panel"
    >
      {/* 1. Header and Toggle */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-6 md:mb-8">
         <div className="flex flex-col items-center md:items-start gap-1">
            <h2 className={`text-[10px] font-black tracking-[0.3em] uppercase ${textValue} opacity-80 pl-1`}>
              {locationName || "Atmosphere Overlook"}
            </h2>
            <p className={`text-[9px] font-bold uppercase tracking-widest ${textMuted} flex items-center gap-2`}>
              {dayjs(selectedDate).format("ddd, D MMM YYYY")}
              {!isToday && <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[8px] opacity-70">Saved Epoch</span>}
            </p>
         </div>
         <div className="flex bg-black/5 dark:bg-black/40 p-1 rounded-xl border border-black/5 dark:border-white/5 backdrop-blur-xl scale-90 sm:scale-100">
            <button 
              onClick={() => unit !== "celsius" && toggleUnit()}
              className={`px-5 py-1.5 rounded-xl text-[9px] font-black tracking-widest transition-all duration-300 ${unit === "celsius" ? "bg-accent-yellow text-[#1a1c30] shadow-[0_0_20px_rgba(255,214,10,0.3)]" : "text-text-muted hover:text-white"}`}
            >
              °C
            </button>
            <button 
              onClick={() => unit !== "fahrenheit" && toggleUnit()}
              className={`px-5 py-1.5 rounded-xl text-[9px] font-black tracking-widest transition-all duration-300 ${unit === "fahrenheit" ? "bg-accent-yellow text-[#1a1c30] shadow-[0_0_20px_rgba(255,214,10,0.3)]" : "text-text-muted hover:text-white"}`}
            >
              °F
            </button>
         </div>
      </div>

      {/* 2. Main Data Grid */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
         <div className="flex flex-col items-center">
            <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${textMuted} mb-3`}>
               {isToday ? "Current Thermal Range" : "Atmospheric Median"}
            </span>
            <div className="flex items-center gap-2">
               <span className={`text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter ${textValue} drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]`}>
                  {formatTemp(current.temperature_2m)}
               </span>
               <span className="text-xl sm:text-2xl md:text-3xl font-bold text-accent-cyan/40 rotate-[-15deg] translate-y-[-10px]">{tempUnit}</span>
            </div>
            <div className="mt-6 px-4 py-1.5 bg-accent-cyan/10 rounded-full border border-accent-cyan/20 flex items-center gap-2">
               {isToday && <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />}
               <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.2em]">
                 {isToday ? "Live Signal" : "Archival Insight"}
               </span>
            </div>
         </div>

         <div className="hidden md:block w-px h-24 bg-black/5 dark:bg-white/5" />

         {/* Dynamic weather icon */}
         <div className="p-8 md:p-10 bg-white/5 dark:bg-black/20 rounded-[3rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative animate-pulse-slow">
            {getWeatherIcon(current.weather_code, isDay)}
         </div>

         <div className="hidden md:block w-px h-24 bg-black/5 dark:bg-white/5" />

         <div className="flex flex-col gap-6 text-center md:text-left">
            <div className="flex flex-col">
               <span className={`text-[9px] font-black uppercase tracking-widest ${textMuted} mb-1`}>High Extreme</span>
               <span className={`text-2xl font-black ${textValue}`}>{formatTemp(daily.temperature_2m_max[0])}{tempUnit}</span>
            </div>
            <div className="flex flex-col">
               <span className={`text-[9px] font-black uppercase tracking-widest ${textMuted} mb-1`}>Low Extreme</span>
               <span className={`text-2xl font-black ${textValue}`}>{formatTemp(daily.temperature_2m_min[0])}{tempUnit}</span>
            </div>
         </div>
      </div>

      {/* 3. Bottom Stats Row: Humidity · Wind · Feels Like · Sunrise · Sunset */}
      <div className="w-full flex flex-wrap justify-center items-center gap-8 md:gap-12 border-t border-black/5 dark:border-white/5 mt-10 md:mt-16 pt-8 md:pt-10">
         <div className="flex flex-col items-center gap-1">
            <span className={`text-[9px] font-black uppercase tracking-widest ${textMuted}`}>Saturation</span>
            <span className={`text-xl font-black ${textValue}`}>{current.relative_humidity_2m}%</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <span className={`text-[9px] font-black uppercase tracking-widest ${textMuted}`}>Propagation</span>
            <span className={`text-xl font-black ${textValue}`}>{current.wind_speed_10m} <span className="text-[10px] font-bold opacity-30 tracking-tight">KM/H</span></span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <span className={`text-[9px] font-black uppercase tracking-widest ${textMuted}`}>Apparent Index</span>
            <span className={`text-xl font-black ${textValue}`}>
               {formatTemp(current.temperature_2m - 1.5)}{tempUnit}
            </span>
         </div>
         {/* Sunrise */}
         <div className="flex flex-col items-center gap-1">
            <span className={`text-[9px] font-black uppercase tracking-widest ${textMuted} flex items-center gap-1`}>
               <Sunrise size={11} className="text-amber-400" /> Sunrise
            </span>
            <span className={`text-xl font-black ${textValue}`}>{sunriseStr}</span>
         </div>
         {/* Sunset */}
         <div className="flex flex-col items-center gap-1">
            <span className={`text-[9px] font-black uppercase tracking-widest ${textMuted} flex items-center gap-1`}>
               <Sunset size={11} className="text-orange-400" /> Sunset
            </span>
            <span className={`text-xl font-black ${textValue}`}>{sunsetStr}</span>
         </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeatherHero;
