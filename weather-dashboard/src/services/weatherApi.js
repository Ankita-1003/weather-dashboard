import axios from "axios";

// 1. Forecast API (Weather, Hourly, Daily)
export const fetchWeather = (lat, lon) =>
  axios.get("https://api.open-meteo.com/v1/forecast", {
    params: {
      latitude: lat,
      longitude: lon,
      // Current Weather Variables
      current: "temperature_2m,relative_humidity_2m,precipitation,uv_index,wind_speed_10m,precipitation_probability,weather_code,wind_direction_10m",
      // Hourly Forecast (for individual graphs)
      hourly: "temperature_2m,relative_humidity_2m,precipitation,weather_code,visibility,wind_speed_10m,pm10,pm2_5,uv_index",
      // Daily (for Min, Max, Sunrise, Sunset)
      daily: "temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant",
      timezone: "auto",
    },
  });

// 2. Air Quality API (Current & Detailed Gases)
export const fetchAir = (lat, lon) =>
  axios.get("https://air-quality-api.open-meteo.com/v1/air-quality", {
    params: {
      latitude: lat,
      longitude: lon,
      hourly: "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,carbon_dioxide,european_aqi,us_aqi",
      timezone: "auto",
    },
  });

// 3. Historical API (Archive) - Max 2 years range
export const fetchHistorical = (lat, lon, start, end) =>
  axios.get("https://archive-api.open-meteo.com/v1/archive", {
    params: {
      latitude: lat,
      longitude: lon,
      start_date: start,
      end_date: end,
      daily: "temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant",
      hourly: "temperature_2m,relative_humidity_2m,precipitation,weather_code,visibility,wind_speed_10m,uv_index,pm10,pm2_5",
      timezone: "auto",
    },
  });

// 4. Air Quality Historical (Trends)
export const fetchAirHistorical = (lat, lon, start, end) =>
  axios.get("https://air-quality-api.open-meteo.com/v1/air-quality", {
    params: {
      latitude: lat,
      longitude: lon,
      start_date: start,
      end_date: end,
      hourly: "pm10,pm2_5",
      timezone: "auto",
    },
  });

// 5. Geocoding API (Search city name -> Coords)
export const fetchGeocoding = (query) =>
  axios.get("https://geocoding-api.open-meteo.com/v1/search", {
    params: {
      name: query,
      count: 10,
      language: "en",
      format: "json",
    },
  });