import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const SunChart = ({ data }) => (
  <ResponsiveContainer width="200%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line dataKey="sunrise" />
      <Line dataKey="sunset" />
    </LineChart>
  </ResponsiveContainer>
);

export default SunChart;