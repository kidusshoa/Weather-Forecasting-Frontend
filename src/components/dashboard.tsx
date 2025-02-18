"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CloudRain,
  Cloud,
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  Sunrise,
} from "lucide-react";

type CityName =
  | "Addis Ababa"
  | "Hawassa"
  | "Dire Dawa"
  | "Adama"
  | "Bahir Dar"
  | "Gondar"
  | "Mekelle"
  | "Jimma";

const cityWeatherData: Record<
  CityName,
  {
    temperature: number;
    humidity: number;
    wind_speed: number;
    pressure_mb: number;
    cloud: number;
    air_quality_PM2_5: number;
  }
> = {
  "Addis Ababa": {
    temperature: 22,
    humidity: 65,
    wind_speed: 9,
    pressure_mb: 1016,
    cloud: 70,
    air_quality_PM2_5: 7.8,
  },
  Hawassa: {
    temperature: 26,
    humidity: 55,
    wind_speed: 10,
    pressure_mb: 1015,
    cloud: 65,
    air_quality_PM2_5: 7.2,
  },
  "Dire Dawa": {
    temperature: 30,
    humidity: 40,
    wind_speed: 15,
    pressure_mb: 1008,
    cloud: 30,
    air_quality_PM2_5: 6.8,
  },
  Adama: {
    temperature: 27,
    humidity: 50,
    wind_speed: 12,
    pressure_mb: 1012,
    cloud: 55,
    air_quality_PM2_5: 8.1,
  },
  "Bahir Dar": {
    temperature: 24,
    humidity: 60,
    wind_speed: 8,
    pressure_mb: 1014,
    cloud: 75,
    air_quality_PM2_5: 7.5,
  },
  Gondar: {
    temperature: 20,
    humidity: 70,
    wind_speed: 7,
    pressure_mb: 1017,
    cloud: 80,
    air_quality_PM2_5: 6.9,
  },
  Mekelle: {
    temperature: 28,
    humidity: 45,
    wind_speed: 13,
    pressure_mb: 1010,
    cloud: 40,
    air_quality_PM2_5: 7.0,
  },
  Jimma: {
    temperature: 25,
    humidity: 68,
    wind_speed: 9,
    pressure_mb: 1013,
    cloud: 72,
    air_quality_PM2_5: 8.3,
  },
};

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState<CityName>("Addis Ababa");
  const [weather, setWeather] = useState<number | null>(null);
  const cityData = cityWeatherData[selectedCity];

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value as CityName);
    setWeather(null);
  };

  const fetchWeatherPrediction = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: selectedCity, ...cityData }),
      });

      const data = await response.json();
      setWeather(data.predicted_precipitation);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <CloudRain className="h-8 w-8" />
              Weather Dashboard
            </h1>
          </div>

          <div className="p-6">
            <label className="block text-gray-700 text-lg font-semibold">
              Select a City
            </label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full p-2 border rounded-md text-gray-900"
            >
              {Object.keys(cityWeatherData).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(cityData).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-gray-200 rounded-lg flex items-center gap-4"
              >
                <div className="text-3xl text-gray-700">
                  {key === "temperature" && <Thermometer />}
                  {key === "humidity" && <Droplets />}
                  {key === "wind_speed" && <Wind />}
                  {key === "pressure_mb" && <Gauge />}
                  {key === "cloud" && <Cloud />}
                  {key === "air_quality_PM2_5" && <Sunrise />}
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 flex justify-center">
            <button
              onClick={fetchWeatherPrediction}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Predict Weather
            </button>
          </div>

          <div className="p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl text-center">
            {weather !== null ? (
              <p className="text-2xl font-bold">
                Predicted Precipitation: {weather.toFixed(2)} mm
              </p>
            ) : (
              <p className="text-lg">Select a city and click Predict.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
