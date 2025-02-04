"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { day: "Mon", temp: 24, precipitation: 0.1 },
  { day: "Tue", temp: 26, precipitation: 0.3 },
  { day: "Wed", temp: 23, precipitation: 0.2 },
  { day: "Thu", temp: 22, precipitation: 0.5 },
  { day: "Fri", temp: 27, precipitation: 0 },
  { day: "Sat", temp: 29, precipitation: 0.1 },
  { day: "Sun", temp: 28, precipitation: 0.4 },
];

export default function ForecastChart() {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">7-Day Weather Forecast</h2>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="#8884d8"
          name="Temperature (°C)"
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="precipitation"
          stroke="#82ca9d"
          name="Precipitation (mm)"
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
}
