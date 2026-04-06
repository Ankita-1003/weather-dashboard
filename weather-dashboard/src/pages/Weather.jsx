import React, { useEffect, useContext, useMemo } from "react";
import { WeatherContext } from "../context/WeatherContext";
import CurrentWeatherHero from "../components/CurrentWeatherHero";
import MetricCard from "../components/MetricCard";
import HourlyTabs from "../components/HourlyTabs";
import HourlyChartContainer from "../components/HourlyChartContainer";
import AirQualityGrid from "../components/AirQualityGrid";
import { DashboardSkeleton } from "../components/Skeleton";
import { 
  Zap, 
  Thermometer, 
  ArrowUpRight,
  Calendar as CalendarIcon,
  RotateCcw,
  CloudRain,
  Wind,
  Percent,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

const WeatherDashboard = () => {
  const { 
    weather, 
    air, 
    getWeatherData, 
    isLoading, 
    unit, 
    toggleUnit,
    coords,
    selectedDate
  } = useContext(WeatherContext);

  const [activeTab, setActiveTab] = React.useState("overview");

  useEffect(() => {
    if (!coords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => getWeatherData(pos.coords.latitude, pos.coords.longitude),
        () => getWeatherData(28.6139, 77.2090)
      );
    }
  }, [getWeatherData, coords]);

  const handleDateChange = (date) => {
    if (!coords) return;
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    getWeatherData(coords.lat, coords.lon, null, formattedDate);
  };

  const handleResetDate = () => {
    if (!coords) return;
    getWeatherData(coords.lat, coords.lon, null, dayjs().format("YYYY-MM-DD"));
  };

  const humiditySparkline = useMemo(() => {
    if (!weather?.hourly?.relative_humidity_2m) return [];
    return weather.hourly.relative_humidity_2m.slice(0, 10).map(v => ({ value: v }));
  }, [weather]);

  if (isLoading || !weather || !air) return <DashboardSkeleton />;

  const isToday = selectedDate === dayjs().format("YYYY-MM-DD");
  const tempUnit = unit === "celsius" ? "°C" : "°F";
  const formatTemp = (c) => unit === "celsius" ? c : (c * 9/5 + 32).toFixed(1);

  // UV level label
  const uvLabel = (uv) => {
    const n = Number(uv) || 0;
    if (n <= 2) return `Low (${n})`;
    if (n <= 5) return `Moderate (${n})`;
    if (n <= 7) return `High (${n})`;
    if (n <= 10) return `Very High (${n})`;
    return `Extreme (${n})`;
  };

  // Wind direction degrees → compass
  const degreesToCompass = (deg) => {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.round((Number(deg) || 0) / 22.5) % 16];
  };

  // Build a current-hour air quality snapshot for AirQualityGrid
  // For today: use current hour; for archive dates: use noon (index 12)
  const currentHourIdx = isToday ? dayjs().hour() : 12;
  const currentAir = air?.hourly ? {
    european_aqi:     [air.hourly.european_aqi?.[currentHourIdx]    ?? 0],
    us_aqi:           [air.hourly.us_aqi?.[currentHourIdx]          ?? 0],
    pm10:             [air.hourly.pm10?.[currentHourIdx]],
    pm2_5:            [air.hourly.pm2_5?.[currentHourIdx]],
    carbon_monoxide:  [air.hourly.carbon_monoxide?.[currentHourIdx]],
    carbon_dioxide:   [air.hourly.carbon_dioxide?.[currentHourIdx]],
    nitrogen_dioxide: [air.hourly.nitrogen_dioxide?.[currentHourIdx]],
    sulphur_dioxide:  [air.hourly.sulphur_dioxide?.[currentHourIdx]],
  } : null;

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[1280px] mx-auto px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-10 duration-[1200ms]">
      
      {/* 1. HERO: Current temperature, conditions, sunrise/sunset */}
      <section className="w-full">
        <CurrentWeatherHero data={weather} unit={unit} toggleUnit={toggleUnit} />
      </section>

      {/* 2. STATS GRID: 7 metric cards — 2 cols mobile, 4 lg, 7 xl */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
        <MetricCard 
          icon={Thermometer} 
          title="Daily Extremes" 
          value={`${formatTemp(weather.daily.temperature_2m_max[0])}° / ${formatTemp(weather.daily.temperature_2m_min[0])}${tempUnit}`} 
          color="pink"
          delay={0.1}
        />
        <MetricCard 
          icon={Zap} 
          title="UV Intensity" 
          value={uvLabel(weather.current.uv_index)}
          status="Safe"
          color="amber"
          delay={0.2}
        />
        <MetricCard 
          hasChart 
          chartData={humiditySparkline}
          title="Rel. Humidity" 
          value={`${weather.current.relative_humidity_2m}%`} 
          subValue="Station Signal"
          color="blue"
          delay={0.3}
        />
        <MetricCard 
          icon={ArrowUpRight}
          title="Vector Wind" 
          value={`${weather.current.wind_speed_10m} km/h`} 
          subValue={`Direction: ${degreesToCompass(weather.current.wind_direction_10m ?? weather.daily?.wind_direction_10m_dominant?.[0])}`}
          color="emerald"
          delay={0.4}
        />
        <MetricCard 
          icon={Wind}
          title="Max Wind Speed" 
          value={`${weather.daily?.wind_speed_10m_max?.[0] ?? '--'} km/h`} 
          subValue="Daily Maximum"
          color="cyan"
          delay={0.5}
        />
        <MetricCard 
          icon={CloudRain}
          title="Precipitation" 
          value={`${weather.daily?.precipitation_sum?.[0] ?? '--'} mm`} 
          subValue="Daily Total"
          color="indigo"
          delay={0.6}
        />
        <MetricCard 
          icon={Percent}
          title="Rain Probability" 
          value={`${weather.daily?.precipitation_probability_max?.[0] ?? '--'}${weather.daily?.precipitation_probability_max?.[0] != null ? '%' : ''}`} 
          subValue="Max Today"
          color="violet"
          delay={0.7}
        />
      </section>

      {/* 3. AIR QUALITY SECTION */}
      {currentAir && (
        <section className="w-full">
          <AirQualityGrid data={currentAir} />
        </section>
      )}

      {/* 4. HOURLY TRENDS: Tab-switched visualizations */}
      <section className="w-full flex flex-col gap-4">
        {/* Row 1: title + date picker */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
           <div className="flex flex-col">
              <h2 className="text-2xl font-black text-text-main tracking-tighter">Hourly Overview</h2>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Chronological Forecast Sync</p>
           </div>
           <div className="flex items-center gap-2">
              <div className="relative group">
                 <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent-yellow transition-colors z-10" size={16} />
                 <DatePicker 
                   selected={dayjs(selectedDate).toDate()}
                   onChange={handleDateChange}
                   maxDate={dayjs().add(15, 'day').toDate()}
                   className="bg-white/5 border border-white/5 rounded-full pl-11 pr-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-text-main focus:outline-none cursor-pointer hover:bg-white/10 transition-all"
                 />
              </div>
              {selectedDate !== dayjs().format("YYYY-MM-DD") && (
                <button 
                  onClick={handleResetDate}
                  className="p-2.5 bg-accent-yellow text-[#1a1c30] rounded-full shadow-[0_0_15px_rgba(255,214,10,0.3)] hover:scale-110 active:scale-95 transition-all"
                  title="Return to Today"
                >
                  <RotateCcw size={16} />
                </button>
              )}
           </div>
        </div>

        {/* Row 2: tabs — full width, scrollable */}
        <div className="w-full overflow-x-auto no-scrollbar">
           <HourlyTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        <HourlyChartContainer 
          activeTab={activeTab} 
          data={weather.hourly} 
          airData={air.hourly}
          unit={unit} 
        />
      </section>

    </div>
  );
};

export default WeatherDashboard;