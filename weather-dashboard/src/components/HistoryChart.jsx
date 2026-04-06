import React, { useMemo, useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Brush,
} from "recharts";
import dayjs from "dayjs";

/**
 * HistoryChart — flexible chart for multi-day historical data.
 * Props:
 *   data        { time:[], key:[],... }
 *   series      [{ key, label, color, type?:'area'|'line'|'bar', hidden?:bool, format?:(v)=>str }]
 *   title       string
 *   chartType   'area' | 'bar' | 'multiline'
 *   unit        string (appended to Y axis ticks)
 *   yAxisFormatter  (v) => string
 *   tooltipExtra    (dataPoint) => string | null
 */
const HistoryChart = ({
  data, series = [], title = "",
  chartType = "area", unit = "",
  yAxisFormatter, tooltipExtra,
}) => {
  const { theme } = useContext(WeatherContext);
  const isDark = theme === "dark";

  const chartData = useMemo(() => {
    if (!data?.time) return [];
    return data.time.map((t, i) => {
      const pt = { time: t };
      series.forEach(({ key }) => { pt[key] = data[key]?.[i] ?? null; });
      return pt;
    });
  }, [data, series]);

  const n = chartData.length;
  const pxPerPt = n > 180 ? 5 : n > 60 ? 8 : 12;
  const chartPxW = Math.max(n * pxPerPt, 680);

  if (n === 0) return null;

  const gridStroke = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
  const axisStroke = isDark ? "#64748b" : "#94a3b8";
  const yFmt = yAxisFormatter || ((v) => typeof v === "number" ? `${v.toFixed(0)}${unit}` : String(v ?? ""));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const dataPoint = payload[0]?.payload;
    const extra = tooltipExtra ? tooltipExtra(dataPoint) : null;
    return (
      <div className={`rounded-2xl p-3 shadow-2xl border text-[11px] z-50 pointer-events-none ${isDark ? "bg-[#0f172a]/95 border-slate-700 text-white" : "bg-white/98 border-slate-200 text-slate-900"}`}>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">{dayjs(label).format("D MMM YYYY")}</p>
        {payload.map((p, i) => {
          const s = series.find(s => s.key === p.dataKey);
          const fv = s?.format ? s.format(p.value) : `${typeof p.value === "number" ? p.value.toFixed(1) : (p.value ?? "N/A")}${unit}`;
          return (
            <div key={i} className="flex items-center gap-2 leading-6">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
              <span className="text-slate-500">{p.name}:</span>
              <span className="font-black">{fv}</span>
            </div>
          );
        })}
        {extra && <p className="text-[10px] font-black text-slate-400 mt-1">{extra}</p>}
      </div>
    );
  };

  const xFmt = (t) => dayjs(t).format("D MMM");
  const brushProps = {
    dataKey: "time", height: 22,
    stroke: isDark ? "#334155" : "#cbd5e1",
    fill: isDark ? "#1e293b" : "#f1f5f9",
    tickFormatter: xFmt, travellerWidth: 10,
  };
  const xAxis = <XAxis dataKey="time" tickFormatter={xFmt} stroke={axisStroke} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={6} minTickGap={40} />;
  const yAxis = <YAxis stroke={axisStroke} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} width={58} tickFormatter={yFmt} />;
  const cp = { data: chartData, margin: { top: 10, right: 8, left: 0, bottom: 4 } };
  const vis = series.filter(s => !s.hidden);

  const renderChart = () => {
    if (chartType === "bar") return (
      <BarChart {...cp}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
        {xAxis}{yAxis}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        {vis.map(s => <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[3,3,0,0]} maxBarSize={18} />)}
        <Brush {...brushProps} />
      </BarChart>
    );

    if (chartType === "multiline") return (
      <ComposedChart {...cp}>
        <defs>{vis.map(s => <linearGradient key={s.key} id={`hg-${s.key}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={s.color} stopOpacity={0.25}/><stop offset="100%" stopColor={s.color} stopOpacity={0}/></linearGradient>)}</defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
        {xAxis}{yAxis}
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold", paddingTop: 4 }} />
        {vis.map(s => s.type === "area"
          ? <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} fillOpacity={1} fill={`url(#hg-${s.key})`} dot={false} />
          : <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} />
        )}
        <Brush {...brushProps} />
      </ComposedChart>
    );

    // default: area
    return (
      <AreaChart {...cp}>
        <defs>{vis.map(s => <linearGradient key={s.key} id={`ha-${s.key}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={s.color} stopOpacity={0.5}/><stop offset="100%" stopColor={s.color} stopOpacity={0}/></linearGradient>)}</defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
        {xAxis}{yAxis}
        <Tooltip content={<CustomTooltip />} />
        {vis.length > 1 && <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold", paddingTop: 4 }} />}
        {vis.map(s => <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2.5} fillOpacity={1} fill={`url(#ha-${s.key})`} dot={false} />)}
        <Brush {...brushProps} />
      </AreaChart>
    );
  };

  return (
    <div className="panel-glass flex flex-col overflow-hidden dark:bg-bg-panel border-white/5">
      <div className="px-5 pt-5 pb-1 flex items-center justify-between gap-4">
        <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-text-muted flex items-center gap-2 min-w-0">
          <div className="w-1 h-3.5 bg-accent-yellow rounded-full flex-shrink-0" />
          <span className="truncate">{title}</span>
        </h3>
        <span className="text-[9px] font-black text-slate-500 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5 whitespace-nowrap flex-shrink-0">
          {n} days · drag brush to zoom
        </span>
      </div>
      <div className="overflow-x-auto no-scrollbar pb-2">
        <div style={{ width: `${chartPxW}px`, height: "310px" }}>
          <ResponsiveContainer width="100%" height="100%">{renderChart()}</ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HistoryChart;
