import React from "react";

const CurrentStats = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

      <div className="card">
        <h3>Temperature</h3>
        <p>Current: {data.current.temperature_2m}°C</p>
        <p>Min: {data.daily.temperature_2m_min[0]}°C</p>
        <p>Max: {data.daily.temperature_2m_max[0]}°C</p>
      </div>

      <div className="card">
        <h3>Atmosphere</h3>
        <p>Humidity: {data.current.relative_humidity_2m}%</p>
        <p>UV Index: {data.current.uv_index}</p>
        <p>Precipitation: {data.hourly.precipitation[0]}</p>
      </div>

      <div className="card">
        <h3>Sun Cycle</h3>
        <p>Sunrise: {data.daily.sunrise[0].slice(11,16)}</p>
        <p>Sunset: {data.daily.sunset[0].slice(11,16)}</p>
      </div>

      <div className="card">
        <h3>Wind & Rain</h3>
        <p>Max Wind: {data.daily.windspeed_10m_max[0]}</p>
        <p>Rain Prob: {data.daily.precipitation_probability_max[0]}%</p>
      </div>

    </div>
  );
};

export default CurrentStats;