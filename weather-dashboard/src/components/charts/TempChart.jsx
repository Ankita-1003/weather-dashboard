import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const TempChart = ({ data, selectedDate }) => {
  const [unit, setUnit] = useState("C");

  const filtered = data.time
    .map((t, i) => ({
      time: t,
      temp: data.temperature_2m[i],
    }))
    .filter((d) =>
      d.time.startsWith(selectedDate.toISOString().split("T")[0])
    )
    .map((d) => ({
      time: d.time.slice(11, 16),
      temp: unit === "C" ? d.temp : (d.temp * 9) / 5 + 32,
    }));

  return (
    <div className="overflow-x-auto">
      <button onClick={() => setUnit(unit === "C" ? "F" : "C")}>
        Toggle °C/°F
      </button>

      <ResponsiveContainer width="200%" height={300}>
        <LineChart data={filtered}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line dataKey="temp" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TempChart;