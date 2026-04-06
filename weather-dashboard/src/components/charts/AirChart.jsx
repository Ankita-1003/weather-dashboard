import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const AirChart = ({ data, selectedDate }) => {
  const filtered = data.time
    .map((t, i) => ({
      time: t,
      pm10: data.pm10[i],
      pm25: data.pm2_5[i],
    }))
    .filter(d =>
      d.time.startsWith(selectedDate.toISOString().split("T")[0])
    )
    .map(d => ({
      time: d.time.slice(11, 16),
      pm10: d.pm10,
      pm25: d.pm25,
    }));

  return (
    <div className="overflow-x-auto mt-6">
      <h3>Air Quality</h3>
      <ResponsiveContainer width="200%" height={300}>
        <LineChart data={filtered}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line dataKey="pm10" />
          <Line dataKey="pm25" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AirChart;