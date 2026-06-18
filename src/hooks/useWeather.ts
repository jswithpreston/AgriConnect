import { useQuery } from "@tanstack/react-query";
import { weatherApi } from "../api/weather";

export const useWeather = () => {
  return useQuery({
    queryKey: ["weather"],
    queryFn: () => weatherApi.getWeather(),
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 30,
  });
};
