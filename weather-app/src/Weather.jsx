import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

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

      const dailyForecast = forecastData.data.list.filter(
        (item, index) => index % 8 === 0
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
    <div className="container mt-5">
      <div className="card shadow-lg p-4 bg-light">
        <h1 className="text-center text-primary">Weather Dashboard</h1>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            className="btn btn-primary w-100 mt-2"
            onClick={fetchWeather}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        {weather && (
          <div className="card mt-3 p-3 shadow-sm text-center">
            <h2 className="text-primary">{weather.name}</h2>
            <p className="text-capitalize">{weather.weather[0].description}</p>
            <p className="fw-bold">🌡️ Temperature: {weather.main.temp}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
          </div>
        )}

        {forecast.length > 0 && (
          <div>
            <h3 className="mt-4 text-center text-success">5-Day Forecast</h3>
            <div className="row">
              {forecast.map((day, index) => {
                const date = new Date(day.dt_txt).toLocaleDateString();
                const description = day.weather[0].description;
                const temperature = day.main.temp;

                return (
                  <div key={index} className="col-md-6">
                    <div className="weather-card card mt-3 p-3 shadow-sm text-center">
                      <p className="date text-muted fw-semibold">
                        📅 Date: <span>{date}</span>
                      </p>
                      <p className="description text-capitalize">
                        ☁️ Weather: <span>{description}</span>
                      </p>
                      <p className="temperature fw-bold">
                        🌡️ Temperature: <span>{temperature}°C</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;
