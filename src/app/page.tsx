"use client";
import dynamic from "next/dynamic";
import Dashboard from "../components/dashboard";

const MapView = dynamic(() => import("../components/mapView"), { ssr: false });
const ForecastChart = dynamic(() => import("../components/forecastChart"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Dashboard />
      <MapView />
      <ForecastChart />
    </div>
  );
}
