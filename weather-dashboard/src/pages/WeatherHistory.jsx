import React from "react";
import HistoryPanel from "../components/HistoryPanel";

const WeatherHistory = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-16 duration-1000">
      <HistoryPanel />
    </div>
  );
};

export default WeatherHistory;