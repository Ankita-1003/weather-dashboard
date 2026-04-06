import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const AirHistoryChart = ({ data }) => (
  <ResponsiveContainer width="200%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line dataKey="pm10" />
      <Line dataKey="pm25" />
    </LineChart>
  </ResponsiveContainer>
);

export default AirHistoryChart;