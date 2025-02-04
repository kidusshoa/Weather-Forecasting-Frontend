"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WiRain } from "react-icons/wi";

interface WeatherData {
  predicted_precipitation?: number;
  error?: string;
}

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isClient, setIsClient] = useState(false); // ✅ Track client-side rendering

  useEffect(() => {
    setIsClient(true); // ✅ Mark that we're on the client

    const fetchWeather = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/predict/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            temperature: 25,
            humidity: 60,
            wind_speed: 12,
            pressure_mb: 1013,
            cloud: 75,
            air_quality_PM2_5: 8.4,
          }),
        });

        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("API Error:", error);
        setWeather({ error: "Failed to fetch weather data." });
      }
    };

    fetchWeather();
  }, []);

  if (!isClient) return null; // ✅ Prevent SSR mismatches

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg"
    >
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <WiRain size={30} /> Real-Time Weather Dashboard
      </h1>

      {weather?.error ? (
        <p className="text-red-500 mt-4">Error: {weather.error}</p>
      ) : weather?.predicted_precipitation !== undefined ? (
        <p className="mt-4 text-xl">
          Predicted Precipitation:{" "}
          <span className="font-semibold">
            {weather.predicted_precipitation.toFixed(2)} mm
          </span>
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </motion.div>
  );
}
