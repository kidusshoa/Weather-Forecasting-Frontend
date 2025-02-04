"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const position: [number, number] = [9.03, 38.74]; // Addis Ababa

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Interactive Weather Map</h2>
      <MapContainer
        center={position}
        zoom={6}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={position}>
          <Popup>Addis Ababa - Click for weather data!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
