import React, { useMemo, useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import dayjs from "dayjs";

const CustomTooltip = ({ active, payload, label, unit, theme }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`!backdrop-blur-3xl border border-black/5 dark:border-white/10 !rounded-2xl !p-4 !shadow-2xl !font-sans flex flex-col gap-2 ${theme === 'dark' ? '!bg-[#111827]/80 !text-white' : '!bg-white/90 !text-slate-900'}`}>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
          {dayjs(label).format("HH:mm - D MMM YYYY")}
        </p>
        <div className="flex items-center gap-3">
           <div 
             className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" 
             style={{ color: payload[0].color }} 
           />
           <span className="text-lg font-black tracking-tighter">
             {payload[0].value.toFixed(1)}{unit}
           </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomizedLabel = (props) => {
  const { x, y, value, unit, theme, index, total } = props;
  
  // Show labels only for strategic points to prevent overlapping
  // Always show first, last and middle
  const middle = Math.floor(total / 2);
  const showLabel = index === 0 || index === total - 1 || index === middle || (total > 8 && index % Math.floor(total/4) === 0);
  
  if (!showLabel) return null;

  return (
    <text 
      x={x} 
      y={y - 12} 
      fill={theme === 'dark' ? "#94a3b8" : "#475569"} 
      textAnchor="middle" 
      fontSize={10} 
      fontWeight="900"
      className="drop-shadow-sm font-sans"
    >
      {value.toFixed(0)}{unit}
    </text>
  );
};

const WeatherChart = ({ 
  data, 
  dataKey, 
  color = "#38bdf8", 
  unit = "", 
  title = "", 
  isDouble = false,
  dataKey2 = "",
  color2 = "#818cf8"
}) => {
  const { theme } = useContext(WeatherContext);
  
  const chartData = useMemo(() => {
    if (!data || !data.time) return [];
    
    // Adaptive Downsampling: Ensure we don't crowd the chart with too many points
    const rawData = data.time.map((t, idx) => ({
      time: t,
      [dataKey]: data[dataKey][idx],
      ...(isDouble ? { [dataKey2]: data[dataKey2][idx] } : {})
    }));

    if (rawData.length > 24) {
      const step = Math.ceil(rawData.length / 12);
      return rawData.filter((_, idx) => idx % step === 0);
    }
    return rawData;
  }, [data, dataKey, dataKey2, isDouble]);

  const isMultiDay = useMemo(() => {
     if (chartData.length < 2) return false;
     const start = dayjs(chartData[0].time);
     const end = dayjs(chartData[chartData.length - 1].time);
     return end.diff(start, 'day') >= 1;
  }, [chartData]);

  if (chartData.length === 0) return null;

  return (
    <div className="panel-glass p-6 md:p-10 h-[420px] flex flex-col group relative overflow-hidden">
      <div className="flex justify-between items-start mb-10">
        <h3 className="text-sm font-black tracking-[0.2em] uppercase text-slate-500 group-hover:text-text-main transition-colors duration-500 leading-tight pr-8">
          {title}
        </h3>
        <div className="flex shrink-0 items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase text-slate-500">
           <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme === 'dark' ? 'bg-accent-cyan' : 'bg-indigo-600'}`} />
           Trends
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 chart-area-glow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)"} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(t) => dayjs(t).format(isMultiDay ? "D MMM" : "h A")}
              stroke={theme === 'dark' ? "#475569" : "#94a3b8"} 
              fontSize={10}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              dy={15}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              stroke={theme === 'dark' ? "#475569" : "#94a3b8"} 
              fontSize={10} 
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}${unit}`}
            />
            <Tooltip content={<CustomTooltip unit={unit} theme={theme} />} cursor={{ stroke: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={4}
              fillOpacity={1}
              fill={`url(#grad-${dataKey})`}
              animationDuration={2000}
              isAnimationActive={true}
            >
              <LabelList content={(props) => <CustomizedLabel {...props} unit={unit} theme={theme} total={chartData.length} />} />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;
