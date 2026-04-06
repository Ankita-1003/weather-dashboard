import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const RainChart = ({ data }) => (
  <ResponsiveContainer width="200%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="rain" />
    </BarChart>
  </ResponsiveContainer>
);

export default RainChart;