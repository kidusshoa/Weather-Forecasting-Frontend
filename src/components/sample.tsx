import { useState } from "react";

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  pressure_mb: number;
  cloud: number;
  air_quality_PM2_5: number;
  predicted_precipitation?: number;
}

const sampleData: Record<string, Omit<WeatherData, "city">> = {
  Hawassa: {
    temperature: 22,
    humidity: 70,
    wind_speed: 10,
    pressure_mb: 1012,
    cloud: 60,
    air_quality_PM2_5: 5.2,
  },
  "Dire Dawa": {
    temperature: 30,
    humidity: 50,
    wind_speed: 15,
    pressure_mb: 1008,
    cloud: 20,
    air_quality_PM2_5: 8.9,
  },
  Adama: {
    temperature: 27,
    humidity: 55,
    wind_speed: 12,
    pressure_mb: 1010,
    cloud: 35,
    air_quality_PM2_5: 6.4,
  },
  "Bahir Dar": {
    temperature: 24,
    humidity: 65,
    wind_speed: 8,
    pressure_mb: 1013,
    cloud: 50,
    air_quality_PM2_5: 4.8,
  },
};

export default function CityWeatherForm() {
  const [city, setCity] = useState("Hawassa");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedWeather = sampleData[city];

    const response = await fetch("http://localhost:8000/api/predict/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city, ...selectedWeather }),
    });

    const result = await response.json();
    setWeather({
      city,
      ...selectedWeather,
      predicted_precipitation: result.predicted_precipitation,
    });
  };

  return (
    <div className="p-4 max-w-lg mx-auto border rounded-md shadow-md bg-white text-gray-900">
      <h2 className="text-xl font-semibold mb-4">City Weather Prediction</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Select City:</label>
        <select
          value={city}
          onChange={handleCityChange}
          className="border p-2 w-full rounded-md"
        >
          {Object.keys(sampleData).map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Predict Weather
        </button>
      </form>

      {weather && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold">
            Prediction for {weather.city}
          </h3>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.wind_speed} km/h</p>
          <p>Pressure: {weather.pressure_mb} mb</p>
          <p>Cloud Cover: {weather.cloud}%</p>
          <p>Air Quality (PM2.5): {weather.air_quality_PM2_5} μg/m³</p>
          <p className="font-semibold text-blue-600">
            Predicted Precipitation:{" "}
            {weather.predicted_precipitation?.toFixed(2)} mm
          </p>
        </div>
      )}
    </div>
  );
}
