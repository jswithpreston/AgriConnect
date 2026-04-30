import { WeatherAlert } from '../types';

interface WeatherMapping {
  condition: string;
  icon: string;
}

const WMO_CODES: Record<number, WeatherMapping> = {
  0:  { condition: 'Clear Sky',              icon: '☀️' },
  1:  { condition: 'Mainly Clear',           icon: '🌤️' },
  2:  { condition: 'Partly Cloudy',          icon: '⛅' },
  3:  { condition: 'Overcast',               icon: '☁️' },
  45: { condition: 'Foggy',                  icon: '🌫️' },
  48: { condition: 'Rime Fog',               icon: '🌫️' },
  51: { condition: 'Light Drizzle',          icon: '🌦️' },
  53: { condition: 'Moderate Drizzle',       icon: '🌦️' },
  55: { condition: 'Dense Drizzle',          icon: '🌧️' },
  56: { condition: 'Freezing Drizzle',       icon: '🌧️' },
  57: { condition: 'Heavy Freezing Drizzle', icon: '🌧️' },
  61: { condition: 'Slight Rain',            icon: '🌧️' },
  63: { condition: 'Moderate Rain',          icon: '🌧️' },
  65: { condition: 'Heavy Rain',             icon: '🌧️' },
  66: { condition: 'Freezing Rain',          icon: '🌧️' },
  67: { condition: 'Heavy Freezing Rain',    icon: '🌧️' },
  71: { condition: 'Slight Snow',            icon: '🌨️' },
  73: { condition: 'Moderate Snow',          icon: '🌨️' },
  75: { condition: 'Heavy Snow',             icon: '❄️' },
  77: { condition: 'Snow Grains',            icon: '❄️' },
  80: { condition: 'Slight Showers',         icon: '🌦️' },
  81: { condition: 'Moderate Showers',       icon: '🌧️' },
  82: { condition: 'Violent Showers',        icon: '⛈️' },
  85: { condition: 'Slight Snow Showers',    icon: '🌨️' },
  86: { condition: 'Heavy Snow Showers',     icon: '❄️' },
  95: { condition: 'Thunderstorm',           icon: '🌩️' },
  96: { condition: 'Thunderstorm + Hail',    icon: '⛈️' },
  99: { condition: 'Severe Thunderstorm',    icon: '⛈️' },
};

export const getWeatherInfo = (code: number): WeatherMapping => {
  return WMO_CODES[code] || { condition: 'Unknown', icon: '🌤️' };
};

export const getWindDirection = (degrees: number): string => {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return dirs[index];
};

export const isHarvestFriendly = (code: number): boolean => {
  // Good conditions: clear, mainly clear, partly cloudy
  return [0, 1, 2].includes(code);
};

export const generateAlerts = (
  hourlyData: { weatherCode: number; time: string; precipitation: number }[]
): WeatherAlert[] => {
  const alerts: WeatherAlert[] = [];
  const now = new Date();
  
  // Filter to only look at the next 24 hours
  const next24h = hourlyData.filter(
    (h) => new Date(h.time) <= new Date(now.getTime() + 24 * 60 * 60 * 1000)
  );

  // Check for heavy rain
  const hasHeavyRain = next24h.some((h) => [63, 65, 82].includes(h.weatherCode));
  if (hasHeavyRain) {
    alerts.push({
      id: 'rain-alert',
      type: 'warning',
      title: 'Heavy Rain Expected',
      message:
        'Heavy rainfall expected in the next 24 hours. Avoid harvesting operations and secure stored crops.',
    });
  }

  // Check for thunderstorm
  const hasThunderstorm = next24h.some((h) => [95, 96, 99].includes(h.weatherCode));
  if (hasThunderstorm) {
    alerts.push({
      id: 'storm-alert',
      type: 'danger',
      title: 'Thunderstorm Warning',
      message:
        'Thunderstorms expected. Do not work in open fields. Protect equipment and livestock.',
    });
  }

  // Check for fog (transport advisory)
  const hasFog = next24h.some((h) => [45, 48].includes(h.weatherCode));
  if (hasFog) {
    alerts.push({
      id: 'fog-alert',
      type: 'info',
      title: 'Fog Advisory',
      message:
        'Dense fog expected. Plan crop transport for later in the day when visibility improves.',
    });
  }

  return alerts;
};