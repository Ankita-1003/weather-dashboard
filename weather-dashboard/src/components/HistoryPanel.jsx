import { useContext, useState, useMemo } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { Calendar, Activity, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "react-toastify";
import HistoryChart from "./HistoryChart";
import React from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

// Convert degrees to 16‑point compass string
const toCompass = (deg) => {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round((Number(deg) || 0) / 22.5) % 16];
};

// Convert ISO sunrise/sunset string → decimal hours (no tz conversion – API returns local tz with timezone:auto)
const toHours = (iso) => {
  if (!iso) return null;
  const d = dayjs(iso);
  return d.hour() + d.minute() / 60;
};

// Format decimal hours back to "HH:mm"
const fmtHours = (h) => {
  if (h == null || isNaN(h)) return "";
  const totalMin = Math.round(h * 60);
  const hh = String(Math.floor(totalMin / 60)).padStart(2, "0");
  const mm = String(totalMin % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

// Aggregate hourly air quality data to daily averages
const hourlyToDaily = (hourly, keys) => {
  if (!hourly?.time) return null;
  const map = {};
  hourly.time.forEach((t, i) => {
    const day = t.split("T")[0];
    if (!map[day]) { map[day] = { time: day }; keys.forEach(k => { map[day][k] = []; }); }
    keys.forEach(k => { if (hourly[k]?.[i] != null) map[day][k].push(hourly[k][i]); });
  });
  const days = Object.keys(map).sort();
  const result = { time: days };
  keys.forEach(k => {
    result[k] = days.map(d => {
      const vals = map[d][k];
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    });
  });
  return result;
};

const HistoryPanel = () => {
  const { history, airHistory, getHistoryData, coords, isLoading, unit, theme } = useContext(WeatherContext);

  const maxArchiveDate = dayjs().subtract(2, "day").format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
  const [endDate, setEndDate]     = useState(dayjs().subtract(2,  "day").format("YYYY-MM-DD"));

  const handleFetch = () => {
    if (!coords) return alert("Location signal pending…");
    let start = startDate, end = endDate;
    if (dayjs(start).isAfter(dayjs(end))) { [start, end] = [end, start]; setStartDate(start); setEndDate(end); }
    if (dayjs(end).isAfter(dayjs(maxArchiveDate))) { end = maxArchiveDate; setEndDate(end); }
    const diff = dayjs(end).diff(dayjs(start), "day");
    if (diff > 730) return toast.error("Maximum range is 2 years (730 days).");
    getHistoryData(coords.lat, coords.lon, start, end);
  };

  const tempUnit = unit === "celsius" ? "°C" : "°F";
  const fmtTemp  = (c) => (unit === "celsius" ? c : (c * 9/5 + 32));
  const textValue = theme === "dark" ? "text-white" : "text-slate-900";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-slate-400";

  // -- Derived data (only when history exists) --
  const tempData = useMemo(() => {
    if (!history?.daily) return null;
    const d = history.daily;
    const cvt = (c) => (unit === "celsius" ? c : (c * 9/5 + 32));
    return {
      time: d.time,
      temp_max:  d.temperature_2m_max?.map(cvt),
      temp_mean: d.temperature_2m_mean?.map(cvt),
      temp_min:  d.temperature_2m_min?.map(cvt),
    };
  }, [history, unit]);

  const sunData = useMemo(() => {
    if (!history?.daily) return null;
    const d = history.daily;
    return {
      time:    d.time,
      sunrise: d.sunrise?.map(toHours),
      sunset:  d.sunset?.map(toHours),
    };
  }, [history]);

  const precipData = useMemo(() => {
    if (!history?.daily) return null;
    return { time: history.daily.time, precipitation_sum: history.daily.precipitation_sum };
  }, [history]);

  const windData = useMemo(() => {
    if (!history?.daily) return null;
    return {
      time: history.daily.time,
      wind_speed_10m_max: history.daily.wind_speed_10m_max,
      wind_dir: history.daily.wind_direction_10m_dominant, // used in tooltip only
    };
  }, [history]);

  const airDailyData = useMemo(() => {
    if (!airHistory?.hourly) return null;
    return hourlyToDaily(airHistory.hourly, ["pm10", "pm2_5"]);
  }, [airHistory]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-full overflow-hidden">

      {/* ── Date Range Panel ── */}
      <section className="panel-glass p-8 md:p-10 flex flex-col items-center text-center gap-8 w-full">
        <div className="flex flex-col items-center gap-2">
          <h2 className={`text-2xl font-black tracking-[0.2em] uppercase ${textValue}`}>Historical Trends</h2>
          <div className="w-12 h-1 bg-accent-yellow rounded-full shadow-[0_0_15px_rgba(255,214,10,0.5)]" />
          <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted} mt-1`}>Max range: 2 years</p>
        </div>

        <div className="flex flex-col gap-5 w-full max-w-md">
          {[
            { label: "Start Date", val: startDate, set: setStartDate },
            { label: "End Date",   val: endDate,   set: setEndDate   },
          ].map(({ label, val, set }) => (
            <div key={label} className="flex flex-col gap-2 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted pl-1">{label}</span>
              <div className="relative group">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent-yellow transition-colors z-10" size={16} />
                <input
                  type="date" value={val} max={maxArchiveDate}
                  onChange={(e) => set(e.target.value)}
                  className="bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-[1.5rem] w-full pl-14 pr-6 py-4 text-xs font-black text-text-main focus:ring-4 ring-accent-yellow/10 focus:outline-none transition-all cursor-pointer"
                />
              </div>
            </div>
          ))}

          <button onClick={handleFetch} disabled={isLoading}
            className="flex items-center justify-center gap-3 bg-accent-yellow text-bg-charcoal font-black py-5 rounded-[1.5rem] hover:bg-[#fff000] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(255,214,10,0.2)] disabled:opacity-50 text-[10px] tracking-[0.2em] uppercase">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><Activity size={18} />Analyze History</>}
          </button>
        </div>
      </section>

      {/* ── Charts ── */}
      {history && (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">

          {/* 1. Temperature (multiline) */}
          {tempData && (
            <HistoryChart
              data={tempData}
              chartType="multiline"
              title="Temperature — Max, Mean & Min"
              unit={tempUnit}
              series={[
                { key: "temp_max",  label: "Max",  color: "#f97316", type: "line", format: (v) => `${v?.toFixed(1)}${tempUnit}` },
                { key: "temp_mean", label: "Mean", color: "#38bdf8", type: "area", format: (v) => `${v?.toFixed(1)}${tempUnit}` },
                { key: "temp_min",  label: "Min",  color: "#818cf8", type: "line", format: (v) => `${v?.toFixed(1)}${tempUnit}` },
              ]}
              yAxisFormatter={(v) => `${v?.toFixed(0)}${tempUnit}`}
            />
          )}

          {/* 2. Sunrise & Sunset (multiline area, Y-axis = HH:mm IST) */}
          {sunData && (
            <HistoryChart
              data={sunData}
              chartType="multiline"
              title="Sunrise & Sunset (IST)"
              series={[
                { key: "sunrise", label: "Sunrise", color: "#fbbf24", type: "area", format: (v) => fmtHours(v) },
                { key: "sunset",  label: "Sunset",  color: "#818cf8", type: "area", format: (v) => fmtHours(v) },
              ]}
              yAxisFormatter={fmtHours}
            />
          )}

          {/* 3. Precipitation (bar) */}
          {precipData && (
            <HistoryChart
              data={precipData}
              chartType="bar"
              title="Daily Precipitation"
              unit=" mm"
              series={[{ key: "precipitation_sum", label: "Precipitation", color: "#22d3ee" }]}
            />
          )}

          {/* 4. Wind Speed + Direction (bar, direction in tooltip) */}
          {windData && (
            <HistoryChart
              data={windData}
              chartType="bar"
              title="Max Wind Speed & Dominant Direction"
              unit=" km/h"
              series={[{ key: "wind_speed_10m_max", label: "Max Wind Speed", color: "#10b981" }]}
              tooltipExtra={(pt) => pt?.wind_dir != null ? `↗ Direction: ${toCompass(pt.wind_dir)} (${pt.wind_dir}°)` : null}
            />
          )}

          {/* 5. PM10 (area) */}
          {airDailyData && (
            <HistoryChart
              data={airDailyData}
              chartType="area"
              title="Air Quality — PM10 (Daily Mean)"
              unit=" μg/m³"
              series={[{ key: "pm10", label: "PM10", color: "#34d399" }]}
            />
          )}

          {/* 6. PM2.5 (area) */}
          {airDailyData && (
            <HistoryChart
              data={airDailyData}
              chartType="area"
              title="Air Quality — PM2.5 (Daily Mean)"
              unit=" μg/m³"
              series={[{ key: "pm2_5", label: "PM2.5", color: "#f472b6" }]}
            />
          )}

        </div>
      )}

      {!history && !isLoading && (
        <div className="panel-glass p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
          <Activity size={32} className="text-accent-yellow animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Select a date range and click Analyze History</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
