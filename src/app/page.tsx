"use client";
import dynamic from "next/dynamic";
import Dashboard from "../components/dashboard";
import CityWeather from "@/components/cityWeather";
import CityWeatherForm from "@/components/sample";
import WeatherForm from "@/components/sample";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const MapView = dynamic(() => import("../components/mapView"), { ssr: false });
const ForecastChart = dynamic(() => import("../components/forecastChart"), {
  ssr: false,
});

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full mx-auto p-4">
        <Dashboard />
        <MapView />
        <ForecastChart />
        {/* <CityWeather /> */}
        {/* <CityWeatherForm /> */}
        {/* <WeatherForm /> */}
      </div>
    </QueryClientProvider>
  );
}
