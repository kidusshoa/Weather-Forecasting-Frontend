import Dashboard from "@/components/dashboard";
import ForecastChart from "@/components/forecastChart";
import MapView from "@/components/mapView";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Dashboard />
      <MapView />
      <ForecastChart />
    </div>
  );
}
