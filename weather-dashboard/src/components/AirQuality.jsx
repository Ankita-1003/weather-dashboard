import React from "react";

const AirQuality = ({ air }) => {
  if (!air) return null;

  const pm25 = air.hourly.pm2_5[0];

  // Simple AQI estimation (basic logic)
  let aqi = "Good";
  if (pm25 > 100) aqi = "Poor";
  else if (pm25 > 50) aqi = "Moderate";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

      <div className="card">
        <h3>AQI</h3>
        <p>{aqi}</p>
      </div>

      <div className="card">
        <h3>PM</h3>
        <p>PM10: {air.hourly.pm10[0]}</p>
        <p>PM2.5: {air.hourly.pm2_5[0]}</p>
      </div>

      <div className="card">
        <h3>Gases</h3>
        <p>CO: {air.hourly.carbon_monoxide[0]}</p>
        <p>NO2: {air.hourly.nitrogen_dioxide[0]}</p>
        <p>SO2: {air.hourly.sulphur_dioxide[0]}</p>
      </div>

      <div className="card">
        <h3>CO2</h3>
        <p>Not Available</p>
      </div>

    </div>
  );
};

export default AirQuality;