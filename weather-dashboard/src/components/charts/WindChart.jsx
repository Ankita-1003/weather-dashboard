import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const WindChart = ({ data, selectedDate }) => {
  const filtered = data.time
    .map((t, i) => ({
      time: t,
      value: data.windspeed_10m[i],
    }))
    .filter(d =>
      d.time.startsWith(selectedDate.toISOString().split("T")[0])
    )
    .map(d => ({
      time: d.time.slice(11, 16),
      value: d.value,
    }));

  return (
    <div className="overflow-x-auto mt-6">
      <h3>Wind Speed</h3>
      <ResponsiveContainer width="200%" height={300}>
        <LineChart data={filtered}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line dataKey="value" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WindChart;