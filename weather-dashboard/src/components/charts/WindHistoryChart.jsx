const WindHistoryChart = ({ data }) => (
  <div>
    {data.map((d, i) => (
      <p key={i}>
        {d.date} → {d.wind} km/h ({d.direction}°)
      </p>
    ))}
  </div>
);

export default WindHistoryChart;