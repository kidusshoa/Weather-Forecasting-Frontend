import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  CloudRain,
  Sunrise,
} from "lucide-react";

interface WeatherData {
  predicted_precipitation?: number;
  error?: string;
}

interface WeatherParam {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
}

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isClient, setIsClient] = useState(false);

  const weatherParams: WeatherParam[] = [
    {
      icon: <Thermometer className="h-6 w-6" />,
      label: "Temperature",
      value: 25,
      unit: "°C",
      color: "from-orange-400 to-red-400",
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      label: "Humidity",
      value: 60,
      unit: "%",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: <Wind className="h-6 w-6" />,
      label: "Wind Speed",
      value: 12,
      unit: "km/h",
      color: "from-teal-400 to-emerald-400",
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      label: "Pressure",
      value: 1013,
      unit: "mb",
      color: "from-purple-400 to-indigo-400",
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      label: "Cloud Cover",
      value: 75,
      unit: "%",
      color: "from-gray-400 to-slate-400",
    },
    {
      icon: <Sunrise className="h-6 w-6" />,
      label: "Air Quality",
      value: 8.4,
      unit: "PM2.5",
      color: "from-green-400 to-lime-400",
    },
  ];

  useEffect(() => {
    setIsClient(true);

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

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <CloudRain className="h-8 w-8" />
              Weather Dashboard
            </h1>

            <div className="mt-6 bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              {weather?.error ? (
                <p className="text-red-200">Error: {weather.error}</p>
              ) : weather?.predicted_precipitation !== undefined ? (
                <div>
                  <p className="text-white/70">Predicted Precipitation</p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {weather.predicted_precipitation.toFixed(2)} mm
                  </p>
                </div>
              ) : (
                <div className="animate-pulse bg-white/20 h-16 rounded-xl" />
              )}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weatherParams.map((param, index) => (
              <motion.div
                key={param.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gradient-to-br ${param.color} p-6 rounded-2xl text-white shadow-lg`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">{param.icon}</div>
                  <div>
                    <p className="text-sm text-white/70">{param.label}</p>
                    <p className="text-2xl font-bold mt-1">
                      {param.value} {param.unit}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
