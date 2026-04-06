import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Weather from "./pages/Weather";
import WeatherHistory from "./pages/WeatherHistory";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/history" element={<WeatherHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

export default App;