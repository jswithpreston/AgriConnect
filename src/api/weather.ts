import { WeatherData } from "../types";
import { MOCK_WEATHER } from "../constants/mockData";

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

export const weatherApi = {
  getWeather: async (lat?: number, lon?: number): Promise<WeatherData> => {
    await delay();
    return MOCK_WEATHER;
  },
};
