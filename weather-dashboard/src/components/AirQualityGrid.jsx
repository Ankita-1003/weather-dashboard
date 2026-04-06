import React, { useContext } from "react";
import { Activity } from "lucide-react";
import { WeatherContext } from "../context/WeatherContext";

const AirQualityGrid = ({ data }) => {
  const { theme } = useContext(WeatherContext);
  const isDark = theme === "dark";

  if (!data) return null;

  const aqiValue = data.european_aqi?.[0] ?? 0;

  const getAQILevel = (val) => {
    if (val <= 20) return { label: "Excellent", color: "bg-emerald-400 shadow-emerald-400/50", text: "text-emerald-500", bar: "from-emerald-400" };
    if (val <= 40) return { label: "Fair",      color: "bg-cyan-400 shadow-cyan-400/50",     text: "text-cyan-500",    bar: "from-cyan-400" };
    if (val <= 60) return { label: "Moderate",  color: "bg-yellow-400 shadow-yellow-400/50",  text: "text-yellow-500",  bar: "from-yellow-400" };
    if (val <= 80) return { label: "Poor",      color: "bg-orange-400 shadow-orange-400/50",  text: "text-orange-500",  bar: "from-orange-400" };
    return          { label: "Very Poor",       color: "bg-rose-400 shadow-rose-400/50",      text: "text-rose-500",    bar: "from-rose-400" };
  };

  const aqi = getAQILevel(aqiValue);
  const pct = Math.min((aqiValue / 100) * 100, 100);

  const pollutants = [
    { label: "PM10",  value: data.pm10?.[0],             unit: "μg/m³", color: "bg-emerald-400 shadow-emerald-400/50" },
    { label: "PM2.5", value: data.pm2_5?.[0],            unit: "μg/m³", color: "bg-cyan-400 shadow-cyan-400/50" },
    { label: "CO",    value: data.carbon_monoxide?.[0],  unit: "μg/m³", color: "bg-purple-400 shadow-purple-400/50" },
    { label: "CO2",   value: data.carbon_dioxide?.[0],   unit: "ppm",   color: isDark ? "bg-white shadow-white/30" : "bg-slate-600 shadow-slate-600/30" },
    { label: "NO2",   value: data.nitrogen_dioxide?.[0], unit: "μg/m³", color: "bg-yellow-400 shadow-yellow-400/50" },
    { label: "SO2",   value: data.sulphur_dioxide?.[0],  unit: "μg/m³", color: "bg-orange-400 shadow-orange-400/50" },
  ];

  // Theme-aware classes
  const cardBg     = isDark ? "bg-white/5 border-white/5"     : "bg-slate-100 border-slate-200";
  const labelColor = isDark ? "text-slate-500"                 : "text-slate-400";
  const valueColor = isDark ? "text-white"                     : "text-slate-900";
  const scoreColor = isDark ? "text-white"                     : "text-slate-900";
  const badgeBg    = isDark ? "bg-white/5 border-white/10"     : "bg-slate-100 border-slate-200";
  const scaleTxt   = isDark ? "text-slate-600"                 : "text-slate-400";
  const barBg      = isDark ? "bg-white/5"                     : "bg-slate-200";

  return (
    <div className="panel-glass p-5 md:p-6 flex flex-col gap-5 dark:bg-bg-panel border-white/5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-black tracking-widest uppercase text-text-main flex items-center gap-2">
          <Activity size={16} className="text-accent-yellow" />
          Atmospheric Quality
        </h2>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${aqi.text} ${badgeBg} border`}>
          {aqi.label}
        </div>
      </div>

      {/* AQI Score + Progress Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-3">
          <span className={`text-5xl font-black tracking-tighter ${scoreColor}`}>{aqiValue}</span>
          <div className="mb-2 flex flex-col gap-0.5">
            <div className={`w-2 h-2 rounded-full animate-pulse ${aqi.color}`} />
            <span className={`text-[9px] uppercase font-black ${labelColor} tracking-wider`}>European AQI</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${barBg}`}>
          <div
            className={`h-full rounded-full bg-gradient-to-r ${aqi.bar} to-transparent transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className={`flex justify-between text-[8px] font-black ${scaleTxt} uppercase tracking-widest`}>
          <span>Excellent</span><span>Fair</span><span>Moderate</span><span>Poor</span><span>Very Poor</span>
        </div>
      </div>

      {/* Pollutant Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {pollutants.map((p) => (
          <div key={p.label} className={`flex justify-between items-center p-3 rounded-xl border ${cardBg}`}>
            <div className="flex flex-col gap-0.5">
              <span className={`text-[9px] uppercase font-black ${labelColor} tracking-wider`}>{p.label}</span>
              <span className={`text-sm font-black ${valueColor}`}>
                {p.value != null ? Number(p.value).toFixed(1) : "N/A"}
                {" "}<span className={`text-[9px] font-normal ${labelColor}`}>{p.unit}</span>
              </span>
            </div>
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${p.color}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQualityGrid;
