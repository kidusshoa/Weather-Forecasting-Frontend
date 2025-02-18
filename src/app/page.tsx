"use client";
import dynamic from "next/dynamic";
import Dashboard from "../components/dashboard";
import CityWeather from "@/components/cityWeather";
import CityWeatherForm from "@/components/sample";

const MapView = dynamic(() => import("../components/mapView"), { ssr: false });
const ForecastChart = dynamic(() => import("../components/forecastChart"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="w-full mx-auto p-4">
      <Dashboard />
      {/* <MapView />
      <ForecastChart /> */}
      {/* <CityWeather /> */}
      {/* <CityWeatherForm /> */}
    </div>
  );
}
