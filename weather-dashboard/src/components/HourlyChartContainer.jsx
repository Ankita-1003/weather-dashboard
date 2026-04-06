import React, { useMemo, useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  ResponsiveContainer
} from "recharts";
import dayjs from "dayjs";
import { 
  Sun, Moon, Cloud, CloudSun, CloudRain, 
  CloudDrizzle, CloudSnow, CloudLightning,
  CloudFog
} from "lucide-react";

const weatherIcons = {
  0: { icon: Sun, color: "text-accent-yellow" },
  1: { icon: CloudSun, color: "text-accent-yellow" },
  2: { icon: CloudSun, color: "text-slate-400" },
  3: { icon: Cloud, color: "text-slate-500" },
  45: { icon: CloudFog, color: "text-slate-400" },
  48: { icon: CloudFog, color: "text-slate-400" },
  51: { icon: CloudDrizzle, color: "text-accent-cyan" },
  53: { icon: CloudDrizzle, color: "text-accent-cyan" },
  55: { icon: CloudDrizzle, color: "text-accent-cyan" },
  61: { icon: CloudRain, color: "text-accent-cyan" },
  63: { icon: CloudRain, color: "text-accent-cyan" },
  65: { icon: CloudRain, color: "text-accent-cyan" },
  80: { icon: CloudRain, color: "text-accent-cyan" },
  81: { icon: CloudRain, color: "text-accent-cyan" },
  82: { icon: CloudRain, color: "text-accent-cyan" },
  95: { icon: CloudLightning, color: "text-accent-yellow" },
};

const getWeatherIcon = (code, isDay = true) => {
  const config = weatherIcons[code] || (isDay ? { icon: Sun, color: "text-accent-yellow" } : { icon: Moon, color: "text-slate-400" });
  const Icon = config.icon;
  return <Icon size={20} className={config.color} />;
};

const HourlyChartContainer = ({ activeTab, data, airData, unit }) => {
  const { selectedDate } = useContext(WeatherContext);
  const isToday = selectedDate === dayjs().format("YYYY-MM-DD");
  const isFuture = dayjs(selectedDate).isAfter(dayjs(), 'day');

  const tempUnit = unit === "celsius" ? "°C" : "°F";

  // Prepare Chart Data
  const chartData = useMemo(() => {
    if (!data?.time) return [];
    
    const formatTempLocal = (c) => unit === "celsius" ? Math.round(c) : Math.round(c * 9/5 + 32);

    return data.time.slice(0, 24).map((time, index) => {
      const pm10 = airData?.pm10?.[index] || 0;
      const pm25 = airData?.pm2_5?.[index] || 0;
      const hour = dayjs(time).hour();
      const isDay = hour > 6 && hour < 19;
      
      return {
        time: dayjs(time).format("h A"),
        displayTime: dayjs(time).format("h A"),
        temp: formatTempLocal(data.temperature_2m[index]),
        feelsLike: formatTempLocal(data.temperature_2m[index] - 2), 
        precip: data.precipitation?.[index] || 0,
        wind: data.wind_speed_10m?.[index] || 0,
        humidity: data.relative_humidity_2m?.[index] || 0,
        visibility: (data.visibility?.[index] || 0) / 1000, 
        pm10,
        pm25,
        weatherCode: data.weather_code?.[index] || 0,
        isDay
      };
    });
  }, [data, airData, unit]);

  const timelineData = useMemo(() => {
    return chartData;
  }, [chartData]);

  if (!data || !data.time) return (
    <div className="panel-glass p-8 min-h-[400px] flex items-center justify-center text-text-muted">
      Loading hourly telemetry...
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1c30]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-xs font-bold text-white">
                {p.name}: {p.value} {p.unit ?? ""}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeTab) {
      case "overview":
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffd60a" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ffd60a" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFeels" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorChartBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#232743" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#1a1c30" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} unit={tempUnit} domain={['auto', 'auto']} width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="temp" 
              name="Temperature" 
              unit={tempUnit} 
              stroke="#ffd60a" 
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              strokeWidth={4} 
            />
          </AreaChart>
        );
      case "precipitation":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} unit="mm" width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="precip" name="Precipitation" unit="mm" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "wind":
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} unit="km/h" width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="wind" name="Wind Speed" unit="km/h" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} />
          </AreaChart>
        );
      case "airQuality":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} unit="μg/m³" width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="pm10" name="PM10" unit="μg/m³" stroke="#fbbf24" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="pm25" name="PM2.5" unit="μg/m³" stroke="#f472b6" strokeWidth={3} dot={false} />
          </LineChart>
        );
      case "humidity":
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} unit="%" width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="humidity" name="Humidity" unit="%" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.1} strokeWidth={3} />
          </AreaChart>
        );
      case "visibility":
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#8e94af" fontSize={10} tickLine={false} axisLine={false} unit="km" width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="visibility" name="Visibility" unit="km" stroke="#818cf8" fill="#818cf8" fillOpacity={0.1} strokeWidth={3} />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="panel-glass p-4 md:p-8 flex flex-col gap-8 min-h-[500px]">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-text-main flex items-center gap-2">
          <div className="w-1 h-4 bg-accent-yellow rounded-full" />
          {isToday ? "Current Atmospheric Intensity" : isFuture ? "Forecasted Atmospheric Intensity" : "Archival Atmospheric Intensity"} — {dayjs(selectedDate).format("MMM D, YYYY")}
        </h3>
      </div>

      {/* MOBILE: horizontally scrollable icon timeline (viewport too narrow for 24 flex-1 items) */}
      <div className="md:hidden w-full overflow-x-auto no-scrollbar">
        <div className="flex items-end border-b border-white/5 pb-4" style={{ width: 'max-content', gap: 0 }}>
          {timelineData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1" style={{ width: '44px', flexShrink: 0 }}>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter whitespace-nowrap">
                {idx === 0 ? "Now" : item.displayTime}
              </span>
              <div className="transform hover:scale-110 transition-transform duration-300">
                {getWeatherIcon(item.weatherCode, item.isDay)}
              </div>
              <span className="text-[11px] font-black text-white">{item.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP: flex-1 items aligned with chart YAxis (55px left offset = YAxis width) */}
      <div className="hidden md:block w-full relative" style={{ paddingLeft: '55px', paddingRight: '5px' }}>
         <div className="flex justify-between items-end border-b border-white/5 pb-8">
          {timelineData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate">
                {idx === 0 ? "Now" : item.displayTime}
              </span>
              <div className="transform hover:scale-110 transition-transform duration-300">
                {getWeatherIcon(item.weatherCode, item.isDay)}
              </div>
              <span className="text-xs font-black text-white">{item.temp}°</span>
            </div>
          ))}
         </div>
      </div>
      
      <div className="w-full h-[320px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HourlyChartContainer;
