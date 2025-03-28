import React, { useState } from "react";
import axios from "axios";

const API_KEY = "d214edb4bc54094b900a83b018756d06";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);

    try {
      const currentWeather = await axios.get(
        `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(currentWeather.data);

      const forecastData = await axios.get(
        `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      const dailyForecast = forecastData.data.list.filter((item, index) =>
        index % 8 === 0
      );
      setForecast(dailyForecast);
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-100 shadow-xl rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Weather Dashboard</h1>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full rounded shadow-sm"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 mt-2 w-full rounded hover:bg-blue-600 transition"
          onClick={fetchWeather}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {weather && (
        <div className="mb-4 p-4 border rounded bg-white shadow">
          <h2 className="text-xl font-bold">{weather.name}</h2>
          <p className="capitalize">{weather.weather[0].description}</p>
          <p>🌡️ Temperature: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
        </div>
      )}
      {forecast.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-2 text-center">5-Day Forecast</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="p-4 bg-white shadow-md rounded-lg text-center">
                <p className="text-gray-600 font-semibold">
                  {new Date(day.dt_txt).toLocaleDateString()}
                </p>
                <p className="capitalize">{day.weather[0].description}</p>
                <p className="text-lg font-bold">🌡️ {day.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
