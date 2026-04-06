import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const TempHistoryChart = ({ data }) => (
  <ResponsiveContainer width="200%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line dataKey="max" />
      <Line dataKey="min" />
      <Line dataKey="mean" />
    </LineChart>
  </ResponsiveContainer>
);

export default TempHistoryChart;