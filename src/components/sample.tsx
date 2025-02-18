"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { create } from "zustand";
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Cloud,
  Sunrise,
  CloudRain,
} from "lucide-react";

interface WeatherStore {
  formData: WeatherInput;
  setFormData: (data: Partial<WeatherInput>) => void;
}
const useWeatherStore = create<WeatherStore>((set) => ({
  formData: {
    temperature: 25,
    humidity: 60,
    wind_speed: 12,
    pressure_mb: 1013,
    cloud: 75,
    air_quality_PM2_5: 8.4,
  },
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
}));

// ✅ Type Definition for Form Inputs
interface WeatherInput {
  temperature: number;
  humidity: number;
  wind_speed: number;
  pressure_mb: number;
  cloud: number;
  air_quality_PM2_5: number;
}

const predictWeather = async (input: WeatherInput) => {
  const response = await fetch("http://localhost:8000/api/predict/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Prediction failed");
  return response.json();
};

export default function WeatherForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeatherInput>();
  const { formData, setFormData } = useWeatherStore();
  const [prediction, setPrediction] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: predictWeather,
    onSuccess: (data) => setPrediction(data.predicted_precipitation),
    onError: () => setPrediction(null),
  });

  const onSubmit = (data: WeatherInput) => {
    setFormData(data);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl text-white flex items-center gap-3">
          <CloudRain className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Weather Prediction</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {Object.entries(formData).map(([key, value]) => (
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

              <div className="flex-1">
                <label className="block text-gray-700 font-semibold capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="number"
                  {...register(key as keyof WeatherInput, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  defaultValue={value}
                  className="w-full mt-1 p-2 border rounded-md text-gray-900"
                />
                {errors[key as keyof WeatherInput] && (
                  <p className="text-red-500 text-sm mt-1">Required field</p>
                )}
              </div>
            </motion.div>
          ))}

          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Predicting..." : "Predict Weather"}
            </button>
          </div>
        </form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-6 mt-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl text-center"
        >
          {prediction !== null ? (
            <p className="text-2xl font-bold">
              Predicted Precipitation: {prediction.toFixed(2)} mm
            </p>
          ) : (
            <p className="text-lg">Enter values and click Predict.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
