import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface GeoName {
  geonameId: number;
  name: string;
  countryName: string;
  lat: string;
  lng: string;
}

interface WeatherData {
  predicted_precipitation: number;
}

export default function CityWeather() {
  const [city, setCity] = useState<string>("");
  const [suggestions, setSuggestions] = useState<GeoName[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [position, setPosition] = useState<LatLngExpression>([
    9.02497, 38.74689,
  ]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    if (e.target.value.length > 2) {
      const response = await fetch(
        `http://api.geonames.org/searchJSON?q=${e.target.value}&maxRows=5&username=kidusshoa`
      );
      const data = await response.json();
      setSuggestions(data.geonames || []);
    }
  };

  const handleCitySelect = async (selectedCity: GeoName) => {
    setCity(selectedCity.name);
    setSuggestions([]);
    setPosition([parseFloat(selectedCity.lat), parseFloat(selectedCity.lng)]);

    const weatherResponse = await fetch("http://localhost:8000/api/predict/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: selectedCity.name,
        temperature: 25,
        humidity: 60,
        wind_speed: 12,
        pressure_mb: 1013,
        cloud: 75,
        air_quality_PM2_5: 8.4,
      }),
    });

    const weatherData: WeatherData = await weatherResponse.json();
    setWeather(weatherData);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <input
        type="text"
        value={city}
        onChange={handleInputChange}
        placeholder="Enter city name"
        className="border p-2 w-full rounded-md text-gray-900 shadow-sm"
      />

      {suggestions.length > 0 && (
        <ul className="border bg-white rounded-md shadow-md max-h-40 overflow-y-auto mt-1">
          {suggestions.map((item) => (
            <li
              key={item.geonameId}
              onClick={() => handleCitySelect(item)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {item.name}, {item.countryName}
            </li>
          ))}
        </ul>
      )}

      <MapContainer
        center={position}
        zoom={6}
        style={{ height: "400px", width: "100%" }}
        className="mt-4 rounded-md shadow-md"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Marker position={position}>
          <Popup>
            <div>
              <strong>{city}</strong>
              <br />
              {weather
                ? `Precipitation: ${weather.predicted_precipitation.toFixed(
                    2
                  )} mm`
                : "Select a city to see the weather."}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
