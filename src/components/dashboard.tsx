"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WiRain } from "react-icons/wi";

interface WeatherData {
  predicted_precipitation: number;
}

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeather = async () => {
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
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

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
      {weather ? (
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
