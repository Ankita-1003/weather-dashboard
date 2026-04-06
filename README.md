# Weather Dashboard

A responsive, React + Vite weather dashboard with live forecasts, air quality monitoring, and historical weather trends.

## Features

- Current weather summary with temperature, humidity, wind, UV, and conditions
- Hourly weather charts for temperature, precipitation, wind, humidity, visibility, and air quality
- Air quality insights with pollutant averages and AQI context
- Historical weather analysis through archive data
- City search via geocoding
- Light/dark theme support
- Responsive design

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Axios
- Recharts
- dayjs
- Open-Meteo APIs

## Project Structure

```
src/
├── components/
│   ├── AirQualityGrid.jsx
│   ├── CurrentWeatherHero.jsx
│   ├── HistoryChart.jsx
│   ├── HistoryPanel.jsx
│   ├── HourlyChartContainer.jsx
│   ├── HourlyTabs.jsx
│   ├── Layout.jsx
│   ├── LocationSearch.jsx
│   ├── MetricCard.jsx
│   ├── Skeleton.jsx
│   ├── UserDropdown.jsx
│   └── WeatherChart.jsx
├── context/
│   └── WeatherContext.jsx
├── pages/
│   ├── Settings.jsx
│   ├── Weather.jsx
│   └── WeatherHistory.jsx
├── services/
│   └── weatherApi.js
├── App.jsx
├── index.css
└── main.jsx
```

## Installation

```bash
git clone https://github.com/Ankita-1003/weather-dashboard
cd weather-dashboard
npm install
npm run dev
```

Open the local URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build

```

## Usage

1. Search for a location.
2. View current weather and air quality.
3. Use hourly tabs to inspect different metrics.
4. Open the history panel to analyze past weather.
5. Toggle theme in the header.

## API Integration

- Open-Meteo Forecast API
- Open-Meteo Archive API
- Open-Meteo Air Quality API
- Open-Meteo Geocoding API

No API key required for standard usage.
