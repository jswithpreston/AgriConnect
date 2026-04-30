import axios from "axios";
import { WeatherData, GeoLocation } from "../types";
import {
  getWeatherInfo,
  getWindDirection,
  generateAlerts,
} from "./weatherCodes";

const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";

// Default: Kampala, Uganda
const DEFAULT_LAT = 0.3476;
const DEFAULT_LNG = 32.5825;

const formatHour = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  // Check if it's the current hour
  if (
    date.toDateString() === now.toDateString() &&
    date.getHours() === now.getHours()
  ) {
    return "Now";
  }
  return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
};

const formatDayName = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return "Today";
  if (date.toDateString() === new Date(now.getTime() + 86400000).toDateString())
    return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

export const weatherApi = {
  getCurrent: async (
    lat: number = DEFAULT_LAT,
    lng: number = DEFAULT_LNG,
    locationName?: string,
  ): Promise<WeatherData> => {
    const params = {
      latitude: lat,
      longitude: lng,
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m",
      hourly: "temperature_2m,weather_code,precipitation_probability",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "auto",
      forecast_days: 7,
    };

    const response = await axios.get(WEATHER_API, { params });
    const data = response.data;

    const currentInfo = getWeatherInfo(data.current.weather_code);

    // Find the closest hour index to right now
    const now = new Date();
    let currentHourIndex = data.hourly.time.findIndex(
      (t: string) => new Date(t) >= now,
    );
    if (currentHourIndex === -1) currentHourIndex = 0; // Fallback if API acts weird

    // Slice the next 24 hours starting from 'now'
    const startIdx = currentHourIndex;
    const hourlySlice = data.hourly.time.slice(startIdx, startIdx + 24);

    const hourly = hourlySlice.map((time: string, i: number) => {
      const idx = startIdx + i;
      const info = getWeatherInfo(data.hourly.weather_code[idx]);
      return {
        time,
        temp: Math.round(data.hourly.temperature_2m[idx]),
        condition: info.condition,
        icon: info.icon,
        precipitation: data.hourly.precipitation_probability[idx] || 0,
        weatherCode: data.hourly.weather_code[idx],
      };
    });

    const daily = data.daily.time.map((date: string, i: number) => {
      const info = getWeatherInfo(data.daily.weather_code[i]);
      return {
        date,
        dayName: formatDayName(date),
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
        condition: info.condition,
        icon: info.icon,
        precipitation: data.daily.precipitation_probability_max[i] || 0,
        weatherCode: data.daily.weather_code[i],
      };
    });

    // Generate agricultural alerts based on the upcoming hourly data
    const alerts = generateAlerts(hourly);

    return {
      location: locationName || `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
      latitude: lat,
      longitude: lng,
      current: {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDir: getWindDirection(data.current.wind_direction_10m),
        condition: currentInfo.condition,
        icon: currentInfo.icon,
        weatherCode: data.current.weather_code,
      },
      hourly,
      daily,
      alerts,
    };
  },

  searchLocation: async (query: string): Promise<GeoLocation[]> => {
    if (!query || query.length < 2) return [];

    const response = await axios.get(GEO_API, {
      params: {
        name: query,
        count: 6,
        language: "en",
        format: "json",
      },
    });

    if (!response.data.results) return [];

    return response.data.results.map((r: any) => ({
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      state: r.admin1,
      country: r.country,
    }));
  },
};
