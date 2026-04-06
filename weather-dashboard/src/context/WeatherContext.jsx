import { createContext, useState, useCallback, useEffect } from "react";
import { fetchWeather, fetchAir, fetchHistorical, fetchAirHistorical } from "../services/weatherApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export const WeatherContext = createContext();

const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [air, setAir] = useState(null);
  const [history, setHistory] = useState(null);
  const [airHistory, setAirHistory] = useState(null);

  const [unit, setUnit] = useState("celsius");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(JSON.parse(localStorage.getItem("lastCoords")) || null);
  const [locationName, setLocationName] = useState(localStorage.getItem("lastLocation") || "Local Weather");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const getWeatherData = useCallback(async (lat, lon, name = null, date = dayjs().format("YYYY-MM-DD")) => {
    setIsLoading(true);
    setError(null);
    try {
      const isToday = dayjs(date).isSame(dayjs(), 'day');
      const isArchive = dayjs(date).isBefore(dayjs().subtract(1, 'day'), 'day');
      
      let w, a;
      
      if (isArchive) {
        // Fetch from Archive API
        const [archW, archA] = await Promise.all([
          fetchHistorical(lat, lon, date, date),
          fetchAirHistorical(lat, lon, date, date)
        ]);
        // Format archive data to match forecast structure for compatibility
        const hourly = archW.data.hourly || {};
        const firstHourIndex = 12; // Use noon for representative "current" archival data
        w = { 
          data: { 
            ...archW.data, 
            hourly, 
            current: { 
              temperature_2m:      hourly.temperature_2m?.[firstHourIndex]      ?? archW.data.daily.temperature_2m_max?.[0] ?? 0,
              relative_humidity_2m: hourly.relative_humidity_2m?.[firstHourIndex] ?? 50,
              wind_speed_10m:      hourly.wind_speed_10m?.[firstHourIndex]       ?? archW.data.daily.wind_speed_10m_max?.[0] ?? 0,
              // archive hourly has no uv_index — use daily max
              uv_index:            archW.data.daily.uv_index_max?.[0]            ?? hourly.uv_index?.[firstHourIndex] ?? 0,
              precipitation:       hourly.precipitation?.[firstHourIndex]         ?? 0,
              precipitation_probability: archW.data.daily.precipitation_probability_max?.[0] ?? 0,
              weather_code:        hourly.weather_code?.[firstHourIndex]          ?? 0,
              wind_direction_10m:  archW.data.daily.wind_direction_10m_dominant?.[0] ?? 0,
            } 
          } 
        };
        a = archA;
      } else {
        // Fetch from Forecast API (Today or near Future)
        const [forW, forA] = await Promise.all([
          fetchWeather(lat, lon), 
          fetchAir(lat, lon)
        ]);
        w = forW;
        a = forA;
      }
      
      setWeather(w.data);
      setAir(a.data);
      setCoords({ lat, lon });
      setSelectedDate(date);
      
      if (name) {
        setLocationName(name);
        localStorage.setItem("lastLocation", name);
      }
      localStorage.setItem("lastCoords", JSON.stringify({ lat, lon }));
    } catch (err) {
      setError("Sync failed");
      toast.error("Atmosphere sync failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Load: GPS or Last Saved or Default
  useEffect(() => {
    if (coords) {
       getWeatherData(coords.lat, coords.lon, locationName);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => getWeatherData(pos.coords.latitude, pos.coords.longitude, "Your Location"),
        () => getWeatherData(28.6139, 77.2090, "New Delhi, IN")
      );
    } else {
      getWeatherData(28.6139, 77.2090, "New Delhi, IN");
    }
  }, []); // Run once on mount

  // Handle Theme Side Effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const getHistoryData = useCallback(async (lat, lon, start, end) => {
    setIsLoading(true);
    try {
      const [h, ah] = await Promise.all([
        fetchHistorical(lat, lon, start, end),
        fetchAirHistorical(lat, lon, start, end)
      ]);
      setHistory(h.data);
      setAirHistory(ah.data);
      toast.success(`Archive Loaded: ${start} to ${end}`);
    } catch (err) {
      toast.error("Archive fetch failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit(u => u === "celsius" ? "fahrenheit" : "celsius");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === "dark" ? "light" : "dark");
  }, []);

  return (
    <WeatherContext.Provider value={{
      weather, air, history, airHistory, unit, theme, isLoading, error, coords, locationName, selectedDate,
      getWeatherData, getHistoryData, toggleUnit, toggleTheme
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherProvider;