import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const PrecipitationChart = ({ data, selectedDate }) => {
  const filtered = data.time
    .map((t, i) => ({
      time: t,
      value: data.precipitation[i],
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
      <h3>Precipitation</h3>
      <ResponsiveContainer width="200%" height={300}>
        <BarChart data={filtered}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PrecipitationChart;